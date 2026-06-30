'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  ShieldAlert, 
  Award, 
  Bot, 
  Cpu, 
  CheckCircle2, 
  Info,
  Users
} from 'lucide-react';

// ===========================================================================
// MODULES DEFINITION
// ===========================================================================
const MODULE_LIST = [
  { id: 'a0b94091-62d9-4ac9-8f0a-86c2e3650228', num: 1, title: 'AI Learning Code', totalNodes: 4 },
  { id: '1d711232-e906-468c-9f32-ef8d0c7aa0b9', num: 2, title: 'Digital Smarts & Human Responsibility', totalNodes: 6 },
  { id: 'fe87ea18-8042-43e6-9cc3-da9117590809', num: 3, title: 'Pre-Learn System', totalNodes: 4 },
  { id: 'aeaf7949-9bc3-44a1-b481-2d1c02106708', num: 4, title: 'Lesson Rescue Mode', totalNodes: 5 },
  { id: 'ab18311b-17d7-49af-918a-4a6d7723ced6', num: 5, title: 'Compression Learning', totalNodes: 4 },
  { id: '03fd0323-1ddd-4f9e-8bb0-8b92d662921c', num: 6, title: 'Self-Testing & Mistake Bank', totalNodes: 4 },
  { id: 'cdc1916e-cc2f-42b1-b90a-2d07182408cb', num: 7, title: 'Notes & Study Pack Creation', totalNodes: 4 },
  { id: 'b097c132-f521-441c-83b7-2824b7a37622', num: 8, title: 'Writing & Answer Clarity', totalNodes: 4 },
  { id: '7ce93ee8-20ef-4531-a516-8fae1b705a09', num: 9, title: 'Build Your AI Tutor', totalNodes: 6 },
  { id: '93217a54-63f1-4ce4-b955-16eb86e2f84c', num: 10, title: 'Build Your AI Assistant', totalNodes: 7 },
];

const TOTAL_NODES = 52;

// ===========================================================================
// 1. ANIMATED RADIAL PROGRESS RING
// ===========================================================================
interface AnimatedRadialProgressProps {
  pct: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  trailColorClass?: string;
  centerText: string;
  label: string;
}

export function AnimatedRadialProgress({
  pct,
  size = 64,
  strokeWidth = 5,
  colorClass = 'text-[#00c8ff]',
  trailColorClass = 'text-slate-800/80',
  centerText,
  label,
}: AnimatedRadialProgressProps) {
  const [currentPct, setCurrentPct] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPct(pct);
    }, 100);
    return () => clearTimeout(timer);
  }, [pct]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(currentPct, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-1 group cursor-default">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className={trailColorClass}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-display font-black text-[var(--text-primary)] leading-none transition-all duration-300 group-hover:scale-110">
            {centerText}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-1.5 text-center leading-none transition-colors duration-300 group-hover:text-[var(--neon-cyan)]">
          {label}
        </span>
      )}
    </div>
  );
}

// ===========================================================================
// 2. ANIMATED MODULE TELEMETRY BAR CHART (SVG)
// ===========================================================================
export function AnimatedModuleTelemetryChart({
  studentProgress,
}: {
  studentProgress: Record<string, number>;
}) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const heights = MODULE_LIST.map((mod) => {
    const mastered = studentProgress[mod.id] || 0;
    const pct = Math.round((mastered / mod.totalNodes) * 100);
    return {
      num: mod.num,
      title: mod.title,
      mastered,
      total: mod.totalNodes,
      pct,
    };
  });

  const chartHeight = 85;
  const chartWidth = 400;
  const paddingLeft = 15;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 20;

  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <linearGradient id="cyan-grad-anim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00c8ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0066aa" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="green-grad-anim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#39ff14" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#11aa05" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={chartWidth - paddingRight}
          y2={paddingTop}
          stroke="rgba(148, 163, 184, 0.06)"
          strokeDasharray="2"
        />
        <line
          x1={paddingLeft}
          y1={paddingTop + graphHeight / 2}
          x2={chartWidth - paddingRight}
          y2={paddingTop + graphHeight / 2}
          stroke="rgba(148, 163, 184, 0.06)"
          strokeDasharray="2"
        />
        <line
          x1={paddingLeft}
          y1={chartHeight - paddingBottom}
          x2={chartWidth - paddingRight}
          y2={chartHeight - paddingBottom}
          stroke="rgba(148, 163, 184, 0.12)"
        />

        {heights.map((item, idx) => {
          const colWidth = 24;
          const totalGap = graphWidth - 10 * colWidth;
          const gap = totalGap / 9;
          const x = paddingLeft + idx * (colWidth + gap);
          
          const targetBarHeight = (item.pct / 100) * graphHeight;
          const barHeight = animate ? targetBarHeight : 0;
          const y = chartHeight - paddingBottom - barHeight;
          
          let fill = 'url(#cyan-grad-anim)';
          let stroke = 'rgba(0, 200, 255, 0.45)';
          if (item.pct === 100) {
            fill = 'url(#green-grad-anim)';
            stroke = 'rgba(57, 255, 20, 0.45)';
          } else if (item.pct === 0) {
            fill = 'rgba(30, 41, 59, 0.1)';
            stroke = 'rgba(71, 85, 105, 0.1)';
          }

          return (
            <g key={item.num} className="group cursor-pointer">
              <title>{`Module ${item.num}: ${item.pct}% Completed (${item.mastered}/${item.total} Nodes)`}</title>
              
              {/* Background slot */}
              <rect
                x={x}
                y={paddingTop}
                width={colWidth}
                height={graphHeight}
                fill="rgba(30, 41, 59, 0.12)"
                stroke="rgba(71, 85, 105, 0.06)"
                rx="1.5"
              />

              {/* Glowing active bar */}
              {item.pct > 0 && (
                <rect
                  x={x}
                  y={y}
                  width={colWidth}
                  height={barHeight}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="1"
                  rx="1.5"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    transitionProperty: 'y, height',
                  }}
                />
              )}

              {/* Number Label */}
              <text
                x={x + colWidth / 2}
                y={chartHeight - 4}
                textAnchor="middle"
                className={`font-mono text-[8px] font-black transition-all duration-300 group-hover:scale-110 ${
                  item.pct === 100
                    ? 'fill-[#39ff14]'
                    : item.pct > 0
                    ? 'fill-[#00c8ff]'
                    : 'fill-slate-500'
                }`}
              >
                M{item.num}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ===========================================================================
// 3. ANIMATED LIST PROGRESS BAR
// ===========================================================================
interface AnimatedProgressBarProps {
  pct: number;
  complete: boolean;
  started: boolean;
}

export function AnimatedProgressBar({ pct, complete, started }: AnimatedProgressBarProps) {
  const [currentPct, setCurrentPct] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPct(pct);
    }, 100);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div className="w-full bg-slate-900 h-1.5 overflow-hidden border border-slate-800/80 mb-1">
      <div
        className={`h-full transition-all duration-1000 ease-out ${
          complete 
            ? 'bg-[#39ff14] shadow-[0_0_8px_rgba(57,255,20,0.4)]' 
            : started 
            ? 'bg-[#00c8ff] shadow-[0_0_8px_rgba(0,200,255,0.3)]' 
            : 'bg-transparent'
        }`}
        style={{ width: `${currentPct}%` }}
      />
    </div>
  );
}

// ===========================================================================
// 4. ANIMATED ANALYTICS DASHBOARD WITH DETAILED TREND GRAPH
// ===========================================================================
interface ParentChildSummary {
  student_id: string;
  display_name: string;
  modules_completed: number;
  current_module_title: string | null;
  latest_activity_at: string | null;
  proof_submissions_total: number;
  proof_approved_total: number;
  discussion_activity_count: number;
  tutor_build_status: 'none' | 'started' | 'has_version';
  assistant_build_status: 'none' | 'started' | 'has_version';
  flags: string[];
}

export function AnimatedAnalyticsDashboard({
  rollups,
  progressByStudent,
}: {
  rollups: ParentChildSummary[];
  progressByStudent: Record<string, Record<string, number>>;
}) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(rollups[0]?.student_id || '');
  const [drawOffset, setDrawOffset] = useState(1000);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; modNum: number; nodes: number; name: string } | null>(null);

  useEffect(() => {
    // Reset path animation whenever student changes
    setDrawOffset(1000);
    const timer = setTimeout(() => {
      setDrawOffset(0);
    }, 150);
    return () => clearTimeout(timer);
  }, [selectedStudentId]);

  if (rollups.length === 0) return null;

  const currentRollup = rollups.find(r => r.student_id === selectedStudentId) || rollups[0];
  const currentProgress = progressByStudent[currentRollup.student_id] || {};

  // Compute cumulative node mastery curve for Y-axis plotting
  let cumulativeCount = 0;
  const cumulativeData = MODULE_LIST.map((mod) => {
    const mastered = currentProgress[mod.id] || 0;
    cumulativeCount += mastered;
    return {
      num: mod.num,
      title: mod.title,
      nodesThisModule: mastered,
      cumulativeNodes: cumulativeCount,
      pctThisModule: Math.round((mastered / mod.totalNodes) * 100),
    };
  });

  // SVG dimensions for Trend Graph
  const width = 550;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;
  const xSpacing = graphWidth / 9;

  // Generate coordinates for paths
  const points = cumulativeData.map((data, idx) => {
    const x = paddingLeft + idx * xSpacing;
    const y = (height - paddingBottom) - (data.cumulativeNodes / TOTAL_NODES) * graphHeight;
    return { x, y, ...data };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : '';

  return (
    <div className="glass-card p-6 border border-slate-800 space-y-6 !rounded-none">
      {/* Header & Student Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="font-display font-bold text-lg text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--neon-cyan)] animate-pulse" />
            Learning Velocity Analytics
          </h2>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
            Real-time interactive intelligence &amp; velocity curves
          </p>
        </div>

        {/* Child Selector Tabs */}
        {rollups.length > 1 && (
          <div className="flex border border-slate-800 bg-black/40 p-1">
            {rollups.map(child => (
              <button
                key={child.student_id}
                onClick={() => setSelectedStudentId(child.student_id)}
                className={`px-3 py-1 text-xs font-mono tracking-widest uppercase transition-all duration-300 ${
                  selectedStudentId === child.student_id
                    ? 'bg-[var(--neon-cyan)] text-black font-bold shadow-[0_0_10px_rgba(0,200,255,0.4)]'
                    : 'text-slate-400 hover:text-white bg-transparent'
                }`}
              >
                {child.display_name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid containing metrics matrix and Trend Graph */}
      <div className="grid md:grid-cols-5 gap-6 items-center">
        {/* Engagement Grid Matrix */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-display text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--neon-purple)]" />
            Engagement Summary
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Box 1 */}
            <div className="bg-black/40 border border-slate-800/80 p-3 hover:border-[var(--neon-cyan)]/30 transition-all group">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Velocity</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-display font-black text-[var(--neon-cyan)] group-hover:text-glow-cyan transition-all">
                  {cumulativeCount}
                </span>
                <span className="text-[9px] text-slate-500">/ 52 nodes</span>
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-black/40 border border-slate-800/80 p-3 hover:border-[var(--neon-green)]/30 transition-all group">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Modules</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-display font-black text-[#39ff14]">
                  {currentRollup.modules_completed}
                </span>
                <span className="text-[9px] text-slate-500">/ 10 completed</span>
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-black/40 border border-slate-800/80 p-3 hover:border-[var(--neon-purple)]/30 transition-all group">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Proofs</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-display font-black text-[#7b4fce]">
                  {currentRollup.proof_approved_total}
                </span>
                <span className="text-[9px] text-slate-500">/ {currentRollup.proof_submissions_total} approved</span>
              </div>
            </div>

            {/* Box 4 */}
            <div className="bg-black/40 border border-slate-800/80 p-3 hover:border-[var(--neon-gold)]/30 transition-all group">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Collab</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-display font-black text-[#f5c518]">
                  {currentRollup.discussion_activity_count}
                </span>
                <span className="text-[9px] text-slate-500">posts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Area Curve Graph */}
        <div className="md:col-span-3 space-y-2 relative">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
              Cumulative Mastery Curve
            </h3>
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
              Hover dots to inspect
            </span>
          </div>

          <div className="bg-black/40 border border-slate-900 p-4 relative overflow-visible">
            {/* Render chart */}
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id="area-grad-cyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00c8ff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#00c8ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Y Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((val, idx) => {
                const y = paddingTop + (1 - val) * graphHeight;
                const nodeVal = Math.round(val * TOTAL_NODES);
                return (
                  <g key={idx} className="opacity-40">
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={width - paddingRight}
                      y2={y}
                      stroke="rgba(148, 163, 184, 0.08)"
                      strokeDasharray="2"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="font-mono text-[7px] fill-slate-500"
                    >
                      {nodeVal}
                    </text>
                  </g>
                );
              })}

              {/* Bottom Y Axis Line */}
              <line
                x1={paddingLeft}
                y1={height - paddingBottom}
                x2={width - paddingRight}
                y2={height - paddingBottom}
                stroke="rgba(148, 163, 184, 0.2)"
              />

              {/* Area Gradient under curve */}
              {areaD && (
                <path
                  d={areaD}
                  fill="url(#area-grad-cyan)"
                  className="transition-all duration-1000 ease-out"
                />
              )}

              {/* Mastery Curve Path Line */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="var(--neon-cyan)"
                  strokeWidth="2"
                  strokeDasharray="1000"
                  strokeDashoffset={drawOffset}
                  className="transition-all duration-1500 ease-out"
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(0, 200, 255, 0.45))',
                  }}
                />
              )}

              {/* Data points (interactive hover circles) */}
              {points.map((p, idx) => {
                const active = hoveredPoint?.modNum === p.num;
                return (
                  <g key={p.num}>
                    {/* Larger hover target */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="12"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint({ x: p.x, y: p.y, modNum: p.num, nodes: p.cumulativeNodes, name: p.title })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    {/* Glowing colored center circle */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={active ? '5.5' : '3.5'}
                      className="transition-all duration-300 ease-out"
                      fill={p.nodesThisModule > 0 ? 'var(--neon-cyan)' : 'var(--space-deep)'}
                      stroke="var(--neon-cyan)"
                      strokeWidth="1.5"
                      style={{
                        filter: active ? 'drop-shadow(0 0 6px var(--neon-cyan))' : 'none',
                      }}
                    />
                    {/* X Axis labels */}
                    <text
                      x={p.x}
                      y={height - 8}
                      textAnchor="middle"
                      className="font-mono text-[7px] font-bold fill-slate-500 uppercase"
                    >
                      M{p.num}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Custom HTML Tooltip */}
            {hoveredPoint && (
              <div 
                className="absolute z-30 p-2 bg-slate-950/95 border border-[var(--neon-cyan)]/60 text-[9px] font-mono leading-tight space-y-1 shadow-[0_0_15px_rgba(0,200,255,0.25)] pointer-events-none w-36"
                style={{
                  left: `${(hoveredPoint.x / width) * 100}%`,
                  top: `${(hoveredPoint.y / height) * 100 - 35}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <p className="text-[var(--neon-cyan)] font-bold uppercase tracking-wider">Module {hoveredPoint.modNum}</p>
                <p className="text-[var(--text-primary)] font-bold line-clamp-1">{hoveredPoint.name}</p>
                <div className="border-t border-slate-800 my-1 pt-1 flex justify-between">
                  <span className="text-slate-500">CURVE STAGE:</span>
                  <span className="text-[#39ff14] font-bold">{hoveredPoint.nodes} / 52 NODES</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
