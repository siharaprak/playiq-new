# PlayIQ Existing Media and Updated Module Map

Preserve existing media files and their brand treatment. Place clips by the material they actually teach, not their filenames or the surrounding legacy page title. These are existing source assets, not newly approved video instructions.

## Module introductions

Ten committed clips were inspected at integration base `9cbde86ab28d9922a29354419767bd183db1d45a`. Git history adds them in `be2446e7ad06bb26ccf5c9ee18e915e367718d28`. All ten contain H.264 1280 by 720 video and AAC audio. Decoded visual samples support the topic findings below; no narration transcript or full spoken-numbering check was recovered. Before treating a clip as current instruction, Iris must watch/listen to it against the updated lesson. Do not label this table as full audiovisual approval.

| Existing file under `public/videos/` | Duration | Observed visual topic | Updated placement and instruction |
|---|---:|---|---|
| `module_1_intro.mp4` | 106.00 s | AI power tool, Quiz Mode, learning and judgment | Module 1 learning-code portion, after the new character first win. Do not use it instead of the seven-step character tutorial. Verify narration. |
| `module_2_intro.mp4` | 132.35 s | Digital Toolkit, truth/source/cross-check filter, purposeful use | Module 2. Verify narration and retain the practical discovery correction separately. |
| `module_3_intro.mp4` | 125.53 s | Pre-learning blueprint, topic maps, principles, non-examples, quiz | Module 3. Verify narration. |
| `module_4_intro.mp4` | 139.90 s | Lesson Rescue, gap types, chunk/diagnose/repair/teach-back | Module 4. Verify narration. |
| `module_5_intro.mp4` | 107.09 s | Concept mastery, safe simplification, compression, learner-owned card | Module 5; the visible title differs from the current module title. Verify narration. |
| `module_6_intro.mp4` | 90.42 s | Escaping rereading, retrieval and mistake-bank imagery | Module 6. Verify narration. |
| `module_7_intro.mp4` | 98.13 s | Study tactics, organized notes, notes-to-questions, missing links | Module 7 contextual introduction. Samples do not establish the updated source-aware Study Pack/Knowledge File workflow; retain the full written tutorial. Verify narration. |
| `module_8_intro.mp4` | 113.03 s | Ghostwriter versus coach, structure and reasoning | Module 8. Verify narration; do not cut the source lesson. |
| `module_9_intro.mp4` | 119.91 s | General learning-coach recap, hints, verification, Lesson Rescue and Highest Path | **Hold as a build tutorial.** The sampled content does not substantiate the legacy Tutor-build page label. Preserve the file; possible recap reuse requires a full review and accurate labelling. |
| `module_10_intro.mp4` | 165.16 s | Six AI modes, prompting, retrieval, teach-back, verification and responsibility | **Hold as a build tutorial.** Do not assign to new Module 10 or automatically move to Module 11. The sampled content does not establish an Assistant-building tutorial. Possible general recap reuse requires review. |

No recovered clip is established as a dedicated updated Module 9 six-file build, Module 10 Tutor test/use, Module 11 Assistant build, Module 12 Assistant test, Module 13 optional story seed, or Module 14 Capstone video. Use the complete existing written/practical lessons rather than fabricating coverage or introducing a video-generation project. Any necessary later video replacement is a separately scoped content task.

Legacy page labels are not reliable evidence of media content: clip 9's page title later changed to Tutor integration without the underlying media necessarily changing. Example frame samples for clips 9 and 10 are included in `evidence/` for the discrepancy check, not as substitutes for the videos.

## Marketing and Orion clips

| Asset | Duration | Placement and boundary |
|---|---:|---|
| `public/videos/playiq-vsl.mp4` with `playiq-vsl-poster.jpg` | 99.87 s | Existing public marketing surfaces through the existing VSL player/HomeContent. Do not move the sales video into required student coursework or change the offer through this handoff. |
| `public/videos/orion-awake.mp4` | 6.01 s | Original manual chat-opening boot-overlay asset, with end/Skip Intro behaviour recovered at `8d236ab`. Keep available for the original welcome context, not a newly imposed delay on every chat open. |
| `public/videos/orion-sleep.mp4` | 6.01 s | Original closed-launcher loop. Preserve the asset, but do not replace the working floating Orion with the obsolete boxed/circular live launcher. |

The two Orion clips are H.264 1080 by 1920 with AAC audio. They are not recordings of the full student assessment. The original cinematic transmission and interactive questions are application components.

## Asset hashes

```text
d94d84b25446e6bffe3bfd39c1eb0912bc036f07d0645d6e9e15b69fc78fa0b7  module_1_intro.mp4
3763ecb17be3b63694dcbc7923e893c164f349cc8c66b7b2cb60855b7c5dd804  module_2_intro.mp4
14cc6be10d5836e0ff84b7a889d5437d021b337b74d0476f5f028e19d289747f  module_3_intro.mp4
e0bde1461fb2eaad77cc6e3f8df8abb56df20e795fd82fe8699c31029a781954  module_4_intro.mp4
bee78895d241946757d7bccef037b192aa0e5e27fa6578ac01a0e3e51a5cf2d8  module_5_intro.mp4
424a3eef032f96e471d6915f6808693abe0002591b8e48544c7f223ea4502930  module_6_intro.mp4
369a0f24263cea50501fb2263ef58e0d0110d034f8752a1b2229995c587855d4  module_7_intro.mp4
12686917cdc93d0d10022050e53b233bd607a0e8504e6a293afff74031bcfd91  module_8_intro.mp4
0704ad99c0cb22b7c6a6aa32e64e833821b9da26f23dd859bac321ead8ff7485  module_9_intro.mp4
e7fb2968ac69491ac6058fff188a3955b0e824f5ef642e1396e04b88a2ed81c9  module_10_intro.mp4
5de27c38f3df3d45421a3eea3ee6e2c3ceadc5a30cb34c1dceeaa945c5faa5a7  playiq-vsl.mp4
82e946e4602a26693b97cb19a218b712fe03f9bbc5852ba636fb47b3e8239746  orion-awake.mp4
86a627607ccbb730d9988145895909319f62cf1f302e264626b9585894b918cd  orion-sleep.mp4
```

The parent coordinator independently recalculated all thirteen hashes. Metadata/file presence establishes identity and decode format, not narrated accuracy, hosted playback, or student acceptance.
