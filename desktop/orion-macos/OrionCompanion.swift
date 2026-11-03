import AppKit
import Foundation

// Local review host only. No network, provider, IPC commands, login items or global keys.
struct Animation: Decodable { let row: Int; let frames: Int; let fps: Double; let loop: Bool }
struct Anchor: Decodable { let hat: [Double]; let held: [Double] }
struct SpriteManifest: Decodable { let animations: [String: Animation]; let anchors: [String: Anchor] }

final class CompanionPanel: NSPanel {
    override var canBecomeKey: Bool { false }
    override var canBecomeMain: Bool { false }
}

final class OrionView: NSView {
    let manifest: SpriteManifest
    let frames: [String: NSImage]
    let masks: [String: NSBitmapImageRep]
    let stateDirectory: URL
    var animation = "idle"
    var since = ProcessInfo.processInfo.systemUptime
    var frameIndex = 0
    var dragging = false
    var passAll = false
    var reduced = NSWorkspace.shared.accessibilityDisplayShouldReduceMotion
    var hat = false
    var held = false
    var startMouse = NSPoint.zero
    var startWindow = NSPoint.zero
    var lastMouse = NSPoint.zero
    var draggedDistance: CGFloat = 0
    var timer: Timer?
    var statusItem: NSStatusItem?
    var latestHit = false
    var recentEvents = [[String: Any]]()
    override var isFlipped: Bool { true }
    override var isOpaque: Bool { false }
    override func acceptsFirstMouse(for event: NSEvent?) -> Bool { true }

    init(resources: URL, stateDirectory: URL) throws {
        self.stateDirectory = stateDirectory
        let data = try Data(contentsOf: resources.appendingPathComponent("manifest.json"))
        manifest = try JSONDecoder().decode(SpriteManifest.self, from: data)
        guard let image = NSImage(contentsOf: resources.appendingPathComponent("atlas.png")),
              let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil),
              cg.width == 1536, cg.height == 2288 else { throw NSError(domain: "OrionAtlas", code: 1) }
        var images = [String: NSImage](), bitmaps = [String: NSBitmapImageRep]()
        for row in 0..<11 { for column in 0..<8 {
            let key = "\(row):\(column)"
            guard let crop = cg.cropping(to: CGRect(x: column*192, y: row*208, width: 192, height: 208)) else { continue }
            images[key] = NSImage(cgImage: crop, size: NSSize(width: 192, height: 208))
            bitmaps[key] = NSBitmapImageRep(cgImage: crop)
        }}
        frames = images; masks = bitmaps
        super.init(frame: NSRect(x: 0, y: 0, width: 192, height: 208))
        wantsLayer = true; layer?.backgroundColor = NSColor.clear.cgColor
        setAccessibilityElement(true)
        setAccessibilityRole(.button)
        setAccessibilityLabel("Orion companion. Drag to move; right-click for actions. Menu bar O offers click-through recovery and Quit.")
        try FileManager.default.createDirectory(at: stateDirectory, withIntermediateDirectories: true)
    }
    required init?(coder: NSCoder) { fatalError("init(coder:) is not supported") }

    var currentKey: String { "\(manifest.animations[animation]?.row ?? 0):\(frameIndex)" }
    func record(_ event: String) {
        guard let window = window else { return }
        let entry: [String: Any] = ["time": Date().timeIntervalSince1970, "event": event,
            "animation": animation, "frame": frameIndex, "x": window.frame.origin.x, "y": window.frame.origin.y,
            "dragging": dragging, "ignoresMouseEvents": window.ignoresMouseEvents,
            "level": window.level.rawValue, "opaque": window.isOpaque, "backgroundAlpha": window.backgroundColor.alphaComponent]
        if let data = try? JSONSerialization.data(withJSONObject: entry, options: [.sortedKeys]) {
            try? data.write(to: stateDirectory.appendingPathComponent("latest.json"), options: .atomic)
        }
        recentEvents.append(entry)
        if recentEvents.count > 120 { recentEvents.removeFirst(recentEvents.count-120) }
        if let data = try? JSONSerialization.data(withJSONObject: recentEvents, options: [.sortedKeys]) {
            try? data.write(to: stateDirectory.appendingPathComponent("recent-events.json"), options: .atomic)
        }
    }
    func start() {
        let t = Timer(timeInterval: 1.0/30, repeats: true) { [weak self] _ in self?.tick() }
        RunLoop.main.add(t, forMode: .common); timer = t
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        statusItem?.button?.title = "O"
        statusItem?.button?.toolTip = "Orion local review — actions and Quit"
        statusItem?.menu = makeMenu()
        record("started")
    }
    func request(_ name: String) {
        guard manifest.animations[name] != nil, !dragging else { return }
        animation = name; since = ProcessInfo.processInfo.systemUptime; frameIndex = 0
        record("state_changed"); needsDisplay = true
    }
    func tick() {
        guard let definition = manifest.animations[animation], let window = window else { return }
        let elapsed = ProcessInfo.processInfo.systemUptime - since
        if !definition.loop && elapsed >= Double(definition.frames)/definition.fps {
            request("idle")
        } else {
            let next = reduced ? 0 : Int(elapsed*definition.fps) % definition.frames
            if next != frameIndex { frameIndex = next; needsDisplay = true }
        }
        let cursor = NSEvent.mouseLocation
        let p = convert(window.convertPoint(fromScreen: cursor), from: nil)
        let hit = opaque(at: p)
        // Poll cursor position only; no global keyboard/mouse monitors or accessibility permission.
        // Never drop the drag capture when a moving frame makes the grab pixel transparent.
        let ignore = passAll || (!dragging && !hit)
        if window.ignoresMouseEvents != ignore { window.ignoresMouseEvents = ignore; latestHit = hit; record(ignore ? "click_through" : "grabbable") }
    }
    func opaque(at point: NSPoint) -> Bool {
        let x = Int(point.x), y = Int(point.y)
        guard x >= 0, y >= 0, x < 192, y < 208 else { return false }
        return (masks[currentKey]?.colorAt(x: x, y: y)?.alphaComponent ?? 0) >= 0.125
    }
    override func draw(_ dirtyRect: NSRect) {
        NSColor.clear.setFill(); bounds.fill(using: .copy)
        frames[currentKey]?.draw(in: bounds, from: .zero, operation: .sourceOver, fraction: 1, respectFlipped: true, hints: nil)
        if let anchor = manifest.anchors[currentKey] {
            if hat && anchor.hat.count == 2 {
                let x = anchor.hat[0], y = anchor.hat[1]
                let crown = NSBezierPath(); crown.move(to: NSPoint(x:x-15,y:y)); crown.line(to:NSPoint(x:x-12,y:y-17));
                crown.line(to:NSPoint(x:x,y:y-9));crown.line(to:NSPoint(x:x+12,y:y-17));crown.line(to:NSPoint(x:x+15,y:y));crown.close()
                NSColor.systemYellow.setFill();crown.fill()
            }
            if held && anchor.held.count == 2 {
                NSColor.cyan.setFill();NSBezierPath(ovalIn: NSRect(x:anchor.held[0],y:anchor.held[1]-7,width:14,height:14)).fill()
            }
        }
    }
    override func mouseDown(with event: NSEvent) {
        guard !passAll, opaque(at: convert(event.locationInWindow, from: nil)), let window = window else { return }
        startMouse = NSEvent.mouseLocation; lastMouse = startMouse; startWindow = window.frame.origin
        draggedDistance = 0; dragging = true; window.ignoresMouseEvents = false
        animation = "dragging"; since = ProcessInfo.processInfo.systemUptime; record("drag_start")
    }
    override func mouseDragged(with event: NSEvent) {
        guard dragging, let window = window else { return }
        let mouse = NSEvent.mouseLocation
        let dx = mouse.x-startMouse.x, dy = mouse.y-startMouse.y
        draggedDistance = max(draggedDistance,hypot(dx,dy))
        let delta = mouse.x-lastMouse.x
        let next = delta < -0.3 ? "move_left" : delta > 0.3 ? "move_right" : "dragging"
        if animation != next { animation = next; since = ProcessInfo.processInfo.systemUptime }
        lastMouse = mouse
        window.setFrameOrigin(clamped(NSPoint(x:startWindow.x+dx,y:startWindow.y+dy)))
        needsDisplay = true; record("drag_move")
    }
    override func mouseUp(with event: NSEvent) {
        guard dragging else { return };dragging = false;request("idle");savePosition();record("drag_end")
        if draggedDistance < 4 { request("wave") }
    }
    override func rightMouseDown(with event: NSEvent) { NSMenu.popUpContextMenu(makeMenu(), with: event, for: self) }
    func clamped(_ point: NSPoint) -> NSPoint {
        let screens = NSScreen.screens
        let screen = screens.first { $0.frame.contains(NSEvent.mouseLocation) } ?? screens.first!
        let visible = screen.visibleFrame
        return NSPoint(x:max(visible.minX,min(point.x,visible.maxX-192)),y:max(visible.minY,min(point.y,visible.maxY-208)))
    }
    func savePosition() {
        guard let window = window else { return }
        let p = window.frame.origin
        let data = try? JSONSerialization.data(withJSONObject:["x":p.x,"y":p.y])
        try? data?.write(to: stateDirectory.appendingPathComponent("position.json"), options:.atomic)
    }
    func restorePosition() {
        var saved: NSPoint?
        if let data = try? Data(contentsOf:stateDirectory.appendingPathComponent("position.json")),
           let o = try? JSONSerialization.jsonObject(with:data) as? [String:Double],
           let x = o["x"],let y = o["y"],x.isFinite,y.isFinite { saved = NSPoint(x:x,y:y) }
        let visible = NSScreen.main!.visibleFrame
        window?.setFrameOrigin(clamped(saved ?? NSPoint(x:visible.maxX-270,y:visible.minY+140)))
    }
    func makeMenu() -> NSMenu {
        let menu = NSMenu(title:"Orion local review")
        for name in ["idle","wave","thinking","chatting","celebrate","boss"] {
            let item = NSMenuItem(title:name, action:#selector(menuState(_:)), keyEquivalent:"");item.target=self;item.representedObject=name;menu.addItem(item)
        }
        menu.addItem(.separator())
        for (title,action,on) in [("Pass all clicks through",#selector(togglePass),passAll),("Reduced motion",#selector(toggleMotion),reduced),("Preview hat (not a course reward)",#selector(toggleHat),hat),("Preview held item (not a course reward)",#selector(toggleHeld),held)] {
            let item=NSMenuItem(title:title,action:action,keyEquivalent:"");item.target=self;item.state=on ? .on:.off;menu.addItem(item)
        }
        let reset=NSMenuItem(title:"Reset position",action:#selector(resetPosition),keyEquivalent:"");reset.target=self;menu.addItem(reset)
        let quit=NSMenuItem(title:"Quit Orion review",action:#selector(quitReview),keyEquivalent:"q");quit.target=self;menu.addItem(quit)
        return menu
    }
    func refreshMenu(){statusItem?.menu=makeMenu()}
    @objc func menuState(_ item:NSMenuItem){if let name=item.representedObject as? String{request(name)}}
    @objc func togglePass(){passAll.toggle();refreshMenu();record("pass_mode_changed")}
    @objc func toggleMotion(){reduced.toggle();refreshMenu();needsDisplay=true}
    @objc func toggleHat(){hat.toggle();refreshMenu();needsDisplay=true}
    @objc func toggleHeld(){held.toggle();refreshMenu();needsDisplay=true}
    @objc func resetPosition(){let v=NSScreen.main!.visibleFrame;window?.setFrameOrigin(NSPoint(x:v.maxX-270,y:v.minY+140));savePosition();record("position_reset")}
    @objc func quitReview(){savePosition();timer?.invalidate();NSApplication.shared.terminate(nil)}
}

final class Application: NSObject, NSApplicationDelegate {
    var panel: CompanionPanel?
    var view: OrionView?
    func applicationDidFinishLaunching(_ notification: Notification) {
        do {
            let state = ProcessInfo.processInfo.environment["PLAYIQ_ORION_REVIEW_STATE"] ?? Bundle.main.bundleURL.deletingLastPathComponent().appendingPathComponent("state").path
            let view = try OrionView(resources:Bundle.main.resourceURL!,stateDirectory:URL(fileURLWithPath:state,isDirectory:true))
            let panel = CompanionPanel(contentRect:NSRect(x:0,y:0,width:192,height:208),styleMask:[.borderless,.nonactivatingPanel],backing:.buffered,defer:false)
            panel.title="Orion Companion Review";panel.isOpaque=false;panel.backgroundColor = .clear;panel.hasShadow=false
            panel.level = .floating;panel.hidesOnDeactivate=false;panel.isReleasedWhenClosed=false
            panel.collectionBehavior=[.canJoinAllSpaces,.fullScreenAuxiliary];panel.contentView=view
            panel.ignoresMouseEvents=true;self.panel=panel;self.view=view
            view.restorePosition();panel.orderFrontRegardless();view.start()
            NotificationCenter.default.addObserver(forName:NSApplication.didChangeScreenParametersNotification,object:nil,queue:.main){[weak view] _ in view?.restorePosition()}
        } catch { fputs("Orion review failed: \(error)\n",stderr);NSApplication.shared.terminate(nil) }
    }
}
let app=NSApplication.shared
let delegate=Application();app.delegate=delegate;app.setActivationPolicy(.accessory);app.run()
