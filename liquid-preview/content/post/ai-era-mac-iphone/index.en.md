---
title: "Why Mac and iPhone Increasingly Look Like the Answer in the AI Era"
slug: ai-era-mac-iphone
date: "2026-11-27T19:00:00+08:00"
written: "2026.11"
note: true
share: false
license: false
math: true
---

Over the past couple of years I've come to feel that the logic of choosing a computer or a phone is different from what it used to be.

When choosing a personal device, I find myself asking three questions more and more:

- **Can it help AI understand me better?**
- **Can it let AI act on my behalf more easily?**
- **Can it flexibly use both local and cloud computing?**

When buying a computer, we used to care about the CPU, the graphics card, the screen, the weight and the price; when buying a phone, about the camera, battery life and whether the system felt smooth. After using AI more heavily, I find myself asking a few more concrete questions: can this machine run an agent well? Will new AI tools arrive here first? Can the calendar, health data and personal memories on my phone actually be used by AI?

Factor those in and the case for Mac and iPhone becomes stronger than before. What's more interesting is that this judgment doesn't depend on how strong Apple Intelligence is. I'd even argue that even if Apple never builds the leading model itself, its devices may still be a very good choice in the AI era.

## The criteria for personal computing devices have changed

In the past, a person opened software, entered commands and performed operations, and the computer was a tool. After ChatGPT appeared, people started consulting AI, getting an answer, and then doing the work themselves. Agents are changing the next step: a person states a goal, and the AI calls tools, operates software and produces a result on its own.

There are three questions here: does the AI know my situation, can it act on my behalf, and where does the computing happen. These correspond to Context, Action and Compute. Look at computers and phones through these three dimensions and you get a different set of evaluation criteria than before.

| Dimension | What mattered before | What matters more in the AI era |
| --- | --- | --- |
| Hardware | Performance for apps and games | Model inference, memory capacity, energy efficiency |
| Operating system | How people operate software | Whether agents can access tools and execute independently |
| Software ecosystem | Number and quality of apps | How quickly and completely AI tools are supported |
| Personal data | Recording, backup, sync | Whether it can become usable personal context |

Let me talk about Mac and iPhone separately.

## Mac: a productivity terminal for the AI era

### The first-mover advantage in AI software

There is an interesting pattern in the AI industry: quite a few new products support Mac first. In February 2026 OpenAI released the Codex app with macOS support first, and Windows only followed on March 4; when Computer Use launched in April, Mac again led. This isn't to say Windows can't use AI — it's that Mac users often get to new interaction patterns and features earlier.

This may have to do with developers' device preferences, a Unix environment, a relatively uniform hardware platform, and commercial terms. One very practical reason is that a large share of programmers use Macs, and developers are exactly the early core users and source of feedback for AI tools. When a product is first used by its own team and the developers closest to it, optimization naturally happens around that setup first — the Mac version is likely to be faster, more stable and more complete. This isn't Apple doing anything special; it's simply that polishing follows the users.

But for users, the cause may matter less than the result. In an industry where product capabilities change on a weekly cadence, getting a feature a month earlier means a month more to fold it into your workflow.

For AI practitioners, developers and creators in particular, that time difference has real value. It isn't a permanent moat, but it is a factor worth weighing when choosing a device today.

### Unix fits agentic AI naturally

If you weren't a programmer, there used to be little reason to care that macOS is a Unix system. The arrival of agents has extended this once-technical advantage to ordinary users.

Take a tool like Codex: it doesn't just generate code in a chat box. It inspects files, runs shell commands, installs dependencies, executes Python scripts, calls APIs, reads and writes databases, and uses Git to manage changes when needed. MCP, Skills and various CLI tools give it even more capability.

macOS has a Unix environment natively, and many command-line tools are installed and used much as they are on Linux. At the same time it has mature desktop apps, office software and creative tools. For someone who needs both a development environment and everyday office work, that combination is very convenient.

Windows now has mature WSL and PowerShell, and Linux certainly has no shortage of such capability. But differences in file paths, permissions, networking and runtime environments can still exist between WSL and the Windows host. Mac's appeal is that in many scenarios you don't have to switch between two environments. Of course it isn't Linux either — ARM architecture and CUDA compatibility still need considering.

**In the past, programmers needed Unix; now, even a user who doesn't program may benefit from Unix through the AI agent they use.**

### Unified memory matters more in the era of local AI

When Apple Silicon first arrived, people mostly talked about performance and power consumption. In the age of local large models, its unified memory architecture has taken on a new significance.

On a traditional discrete-GPU computer, system memory and GPU VRAM are usually separate. A machine with 64 GB of RAM and 12 GB of VRAM that wants to run a model entirely on the GPU is still constrained by that 12 GB of VRAM. You can expand model size by offloading to CPU memory, but usually at a performance cost.

<figure class="ev-figure">
  <svg class="ev-svg" xmlns="http://www.w3.org/2000/svg" width="640" height="220" viewBox="0 0 640 220" role="img" aria-label="Dedicated VRAM vs. unified memory" style="max-width:100%;height:auto;display:block;margin:0 auto"><style>
    svg.ev-svg{--fg:#292d33;--muted:#767c86;--line:#e6e8ed;--accent:#30669b;--soft:#f4f7fa;--paper:#fff}
    svg.ev-svg text{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Noto Sans SC","Microsoft YaHei",Arial,sans-serif;fill:var(--fg)}
    svg.ev-svg .node{fill:var(--soft);stroke:var(--line);stroke-width:1.5}
    svg.ev-svg .special{fill:var(--soft);stroke:var(--accent);stroke-width:1.5}
    svg.ev-svg .arrow{stroke:var(--muted);fill:none;stroke-width:1.5}
    svg.ev-svg .dim{fill:var(--muted)}
    @media (prefers-color-scheme:dark){
      svg.ev-svg{--fg:#e2e4e8;--muted:#a0a5af;--line:#3b3e45;--accent:#8fb8e4;--soft:#2d333b;--paper:#24262b}
    }
  </style><text x="155" y="24" text-anchor="middle" font-size="16" font-weight="600">Traditional discrete GPU</text><text x="485" y="24" text-anchor="middle" font-size="16" font-weight="600">Apple Silicon</text><path d="M320 15V198" stroke="var(--line)" stroke-dasharray="5 5"/><g font-size="15" text-anchor="middle"><rect class="node" x="21" y="45" width="118" height="50" rx="6"/><rect class="node" x="171" y="45" width="118" height="50" rx="6"/><text x="80" y="75">CPU</text><text x="230" y="75">GPU</text><path class="arrow" d="M80 95V119 M230 95V119 M139 70H171"/><rect class="node" x="21" y="119" width="118" height="53" rx="6"/><rect class="special" x="171" y="119" width="118" height="53" rx="6"/><text x="80" y="141">System RAM</text><text class="dim" x="80" y="159" font-size="12">RAM</text><text x="230" y="141">Dedicated VRAM</text><text class="dim" x="230" y="159" font-size="12">VRAM</text><rect class="node" x="348" y="45" width="85" height="50" rx="6"/><rect class="node" x="443" y="45" width="85" height="50" rx="6"/><rect class="node" x="538" y="45" width="85" height="50" rx="6"/><text x="390" y="75">CPU</text><text x="485" y="75">GPU</text><text x="580" y="75">NPU</text><path class="arrow" d="M390 95V119 M485 95V119 M580 95V119"/><rect class="special" x="348" y="119" width="275" height="53" rx="6"/><text x="485" y="141">Unified memory</text><text class="dim" x="485" y="159" font-size="12">Unified Memory</text><text class="dim" x="155" y="197" font-size="12">GPU-available capacity is capped by VRAM</text><text class="dim" x="485" y="197" font-size="12">Multiple units share one memory pool</text></g></svg>
  <figcaption>Figure 1: A simplified comparison of dedicated VRAM and unified memory. Not all PCs use a discrete GPU, and the unified memory available to a model is smaller than the machine's advertised capacity.</figcaption>
</figure>

On a Mac, the CPU and GPU can share one memory pool. Take a 70B-parameter model: counting only 4-bit quantized weights, it would need roughly 35 GB in theory:

$$
70 \times 10^{9} \times 4 / 8 \approx 35\ \text{GB}
$$

In practice you also need quantization metadata, the KV cache, runtime buffers and room for the operating system. So a Mac with 64 GB of unified memory, with a suitable model and context configuration, has a chance of running a quantized model of that scale locally. Apple has also open-sourced MLX, a machine learning framework designed for Apple Silicon that uses unified memory to simplify data sharing between CPU and GPU.

This doesn't mean a Mac is necessarily faster than an NVIDIA GPU at inference. Training, high-throughput inference and the CUDA software ecosystem remain NVIDIA's strengths. Mac's advantage lies more in usable memory capacity on a consumer device, energy efficiency, and the convenience of deploying local models.

### Computer Use: can people and AI work at the same time?

This may be the most interesting current difference between Mac and Windows. Computer Use lets AI operate desktop applications directly: view windows, click buttons, fill forms and check results. Even older software without an API has a chance of being used by an agent.

But if every action requires my mouse, keyboard and foreground window, I can only wait for it to finish. I wanted the AI to save me time, yet during the task the computer is unusable for me.

When OpenAI launched Computer Use for Mac in April 2026, it already supported background operation and an independent cursor. Its current documentation states that Windows also supports Computer Use, but within the same Windows desktop session it takes over foreground input, so — unlike on Mac — you can't keep working in other applications at the same time.

<figure class="ev-figure">
  <svg class="ev-svg" xmlns="http://www.w3.org/2000/svg" width="640" height="220" viewBox="0 0 640 220" role="img" aria-label="Foreground-locked vs. background Computer Use" style="max-width:100%;height:auto;display:block;margin:0 auto"><style>
    svg.ev-svg{--fg:#292d33;--muted:#767c86;--line:#e6e8ed;--accent:#30669b;--soft:#f4f7fa;--paper:#fff}
    svg.ev-svg text{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Noto Sans SC","Microsoft YaHei",Arial,sans-serif;fill:var(--fg)}
    svg.ev-svg .node{fill:var(--soft);stroke:var(--line);stroke-width:1.5}
    svg.ev-svg .special{fill:var(--soft);stroke:var(--accent);stroke-width:1.5}
    svg.ev-svg .arrow{stroke:var(--muted);fill:none;stroke-width:1.5}
    svg.ev-svg .dim{fill:var(--muted)}
    @media (prefers-color-scheme:dark){
      svg.ev-svg{--fg:#e2e4e8;--muted:#a0a5af;--line:#3b3e45;--accent:#8fb8e4;--soft:#2d333b;--paper:#24262b}
    }
  </style><g font-size="15" text-anchor="middle"><text x="155" y="25" font-weight="600">Foreground-locked Computer Use</text><text x="485" y="25" font-weight="600">Background Computer Use</text></g><path d="M320 15V204" stroke="var(--line)" stroke-dasharray="5 5"/><g font-size="13"><text x="18" y="76">User</text><text x="18" y="124">Agent</text><text x="348" y="76">User</text><text x="348" y="124">Agent</text></g><g fill="var(--accent)" opacity=".8"><rect x="75" y="57" width="66" height="28" rx="4"/><rect x="208" y="57" width="84" height="28" rx="4"/><rect x="405" y="57" width="217" height="28" rx="4"/></g><g fill="#82949d"><rect x="141" y="105" width="67" height="28" rx="4"/><rect x="405" y="105" width="143" height="28" rx="4"/></g><g font-size="12" text-anchor="middle"><text x="108" y="76" style="fill:white">Working</text><text x="250" y="76" style="fill:white">Keep working</text><text x="174" y="124" style="fill:white">Running task</text><text x="514" y="76" style="fill:white">Keep working</text><text x="476" y="124" style="fill:white">Running task</text><text x="174" y="51" class="dim">Waiting</text></g><path class="arrow" d="M75 151H292m-7-4 7 4-7 4M405 151H622m-7-4 7 4-7 4"/><g text-anchor="middle" font-size="12"><text x="183" y="172" class="dim">Time</text><text x="513" y="172" class="dim">Time</text><text x="155" y="199">Shared foreground, serial tasks</text><text x="485" y="199">Parallel work in supported apps</text></g></svg>
  <figcaption>Figure 2: The difference in how interaction resources are occupied; the timeline is qualitative only and does not represent a speed benchmark.</figcaption>
</figure>

Technically, Computer Use isn't limited to screenshot recognition and simulated mouse clicks. Operating systems generally offer accessibility interfaces that expose a control's text, hierarchy and available actions.

| Capability | macOS | Windows |
| --- | --- | --- |
| Visual capture | ScreenCaptureKit and other window-capture APIs | Windows Graphics Capture, etc. |
| Semantic operation | Accessibility API (AXUIElement) | UI Automation (UIA) |
| Input and automation | CoreGraphics, AppleScript, etc. | SendInput, Win32 messages, etc. |

Both systems have the underlying capabilities to implement Computer Use. Windows UI Automation can likewise operate some controls without relying on ordinary mouse clicks, while simulated system input usually requires the target window to be in the foreground. OpenAI hasn't fully disclosed its implementation, so the current product difference shouldn't be read as proof that background operation is impossible on Windows at a system level.

From a practical standpoint, though, the difference already matters. For example, let an agent organize data in another app while you keep writing a paper, or let it check a generated web page in another window while you get on with something else.

**The productivity value of AI depends not only on how fast it finishes a task, but also on whether it occupies your own working time while doing it.**

### The stronger the cloud, the more valuable a light laptop becomes

I used to care about how much local computing power a laptop could deliver. But for many AI workflows, the most compute-intensive part has already moved to the cloud: calling model APIs, remote training, running agents on a cloud computer. The local machine handles interaction, viewing results and files that must stay local.

Codex Cloud is a ready example: tasks can run in a cloud environment without requiring the local computer to stay awake. For many knowledge workers, the need to carry a heavy, high-performance laptop around is diminishing. Lightness, long battery life and low noise become more valuable. When you do need a locally resident agent, a Mac mini can serve as a low-power always-on host.

Cloud computing and unified memory don't contradict each other. Tasks suited to local execution run locally; tasks needing more power go to the cloud. The combination is what I'm more optimistic about as a way of personal computing. Of course, an equally light and long-lasting Windows laptop can benefit from cloudification too.

## iPhone: the data and interaction terminal for a personal agent

Compared with the Mac, the iPhone's value in the AI era may not lie in how large a model it can run, but in the fact that it follows you every day and accumulates large amounts of personal information. A sufficiently capable Personal Agent needs to know not just general knowledge, but who I am, what I've done and what state I'm in now.

### Generic system apps lower the cost of connecting personal context

Apple built a relatively unified set of system apps and development interfaces early on. Take health data: whether it comes from an Apple Watch or from third-party devices and apps integrated with HealthKit, supported health data has a chance of entering the same data system.

| Data or app | Development API | Value to a Personal Agent |
| --- | --- | --- |
| Health | HealthKit | Sleep, exercise, heart rate, physical state |
| Calendar, Reminders | EventKit | Schedule, to-dos, future plans |
| Contacts | Contacts | People and relationship clues |
| Photos | PhotoKit | Life experiences, visual records |
| Location | Core Location | Current place, spatial context |
| Home | HomeKit | Connected home devices and their state |

For companies building Personal Agents, consistent data types, permissions and interfaces reduce integration cost. Android has mechanisms such as Calendar Provider and Health Connect too, but manufacturers' own health services, system apps and permission implementations can differ, so the actual integration experience still depends on the product.

Imagine a health-management agent that knows how long I slept last night, whether I have meetings today, and which muscle groups I trained yesterday, and then schedules today's exercise for me. That's a completely different experience from manually entering my personal situation every time I open an AI.

In the past we recorded data mainly for ourselves to look at; now recorded data can also become context for AI. For long-term accumulation, whether the data has a unified format, can be read with authorization, and can be carried over to a different AI product may matter more than how many features a single system app has.

### How well AI apps are adapted

In 2023 ChatGPT launched its iOS client first, with Android arriving more than two months later. Similar priority can be seen in some AI-native apps. Beyond whether the app can be installed, much of the phone AI experience depends on system integration: the share menu, home-screen widgets, lock-screen entry points, Shortcuts, the Action Button, and support on wearables.

AI is a tool we use with increasing frequency. Copying an article into a chat box to ask a question versus handing it straight to AI from the share menu may differ by only a few steps — but repeated dozens of times a day, those differences add up.

iPhone's relatively concentrated hardware and OS versions also help developers make these adaptations. This refers to first-mover and integration advantages in some products, not that all AI apps prioritize iOS, nor that Android's system-level capabilities are necessarily weaker.

### In China, Mijia and peers are actively adapting to iPhone

This deserves a separate discussion in China. Xiaomi's smart-home and appliance ecosystem is rich, but using Mijia doesn't require buying a Xiaomi phone. The Mijia iOS client supports core capabilities such as device binding, remote control, scenes and automation, and even has an Apple Watch version. The same approach extends to Xiaomi's cars and smart cabins: remote vehicle control, checking battery level, pre-conditioning the cabin and navigation handoff generally work on an iPhone as well.

The old assumption that "Xiaomi devices require a Xiaomi phone" no longer really holds. From Mijia and smart-home devices to today's electric cars and smart cabins, manufacturers are actively adapting to iPhone rather than asking users to switch phones just to control the lights at home or the screen in their car. Conversely, with a phone like a Huawei, some apps and in-car features may be more constrained — app ecosystems, system permissions and cross-device integration each have their own rules, and switching systems doesn't necessarily buy you more complete control.

"Apple compatibility" has become close to a standard selling point for Chinese manufacturers, and users have nicknamed the practice *qiangjian* — "forcibly compatible." Xiaomi got there early: Mijia has an Apple Watch app, and a Xiaomi car can be controlled and its navigation handed off from an iPhone. How deep each vendor goes varies, but for users, one more door in beats one fewer.

For core smart-home functions, iPhone users can already use Mijia quite completely, with no need to choose between Apple's personal-device ecosystem and Xiaomi's smart-home ecosystem. Sometimes the iOS experience is even better than on Xiaomi's own phones — though the release cadence and development priorities on the two platforms aren't public, so that comparison only holds for specific features. Xiaomi phones still have their own advantages in areas like Super XiaoAI and cross-device system integration.

How does this relate to AI? A future Personal Agent shouldn't only handle information in computers and phones — with authorization it should also interact with devices in the real world. Lights, air conditioners, robot vacuums and home sensors are all valuable tools or sources of information. Mijia's cross-platform compatibility preserves the possibility for iPhone users to connect to these capabilities; but whether a third-party agent can directly control a given device still depends on Mijia, the device maker and the relevant interfaces being open.

### Continuously capturing multimodal personal context, from health and voice to space

People generate enormous amounts of information every day, but most of it never enters a digital system. Things discussed in meetings, thoughts had on a walk, the state of our bodies, scenes we see — much of it stays only in memory. Compared with asking people to keep a manual diary, hardware can lower the cost of recording this information.

**Apple Watch: physical state.** Heart rate, activity and sleep data can form a long-term physiological record. In traditional health software these are mostly statistics for a human to view; with AI it becomes easier to correlate them across time and across types. For example, put the last week's training, sleep and calendar together to help judge whether the current training load is reasonable.

**AirPods: spoken information from real life.** I came across a product by Leto Bao called [AideMemo](https://www.aidememo.com/), with an interesting idea: record voice via AirPods, Apple Watch or iPhone, then transcribe, summarize and archive it, turning everyday conversation and thoughts into searchable personal memory. The official docs show that once recording starts on iPhone, it can continue with the screen locked until the user stops it.

AirPods aren't an all-day AI recording device, and battery life and background permissions are limited. But the case shows that existing consumer hardware can serve as an input for personal-memory products. Recording that involves other people must respect their knowledge, consent and local law — the value of personal memory doesn't mean every conversation should by default be recorded.

**The iPhone camera: more than taking pictures.** Multimodal models can already understand photos and videos, but the real world isn't only two-dimensional images — it also has distance, scale, position and spatial relationships. Starting with the iPhone 15 Pro, Apple supports native spatial video recording: the main and ultra-wide cameras capture the same scene from two viewpoints at once, preserving genuine binocular disparity, and the resulting footage can be replayed in three dimensions on Vision Pro. This is no longer just about "a nice photo" — the camera is beginning to record the geometry of the scene itself. In the AI era, the iPhone camera deserves to be reconsidered.

The LiDAR scanner on Pro models adds depth information. Together with ARKit and RoomPlan, the iPhone can reconstruct a three-dimensional model of a real environment: RoomPlan generates a room model with furniture and dimensions, while ARKit on Vision Pro adds scene reconstruction and spatial tracking.

**Vision Pro: presenting spatial content.** Take these threads together and Apple has, in effect, built a stack that runs from spatial capture, through environment modeling, to spatial presentation — iPhone captures, ARKit and RoomPlan model, and headsets like Vision Pro render the three-dimensional content again; lighter smart glasses could turn this layer into an always-available interface.

This is where I'm most inclined to discuss it alongside Spatial Intelligence and World Models. For such models to truly understand the physical world, flat images alone aren't enough; they also need to know where things are, how large they are, how they occlude one another, and where the person is standing. Three-dimensional spatial information is precisely the raw material for that understanding. Today these technologies mainly serve photography, augmented reality and immersive experiences. But as spatial intelligence and world models develop, 3D spatial information could also become an important context for a Personal Agent to understand the physical world — for example, film a room and let AI suggest a furniture layout based on real dimensions, instead of guessing from a single picture.

<figure class="ev-figure">
  <svg class="ev-svg" xmlns="http://www.w3.org/2000/svg" width="640" height="330" viewBox="0 0 640 330" role="img" aria-label="Data capture, model reasoning, and task execution in a personal AI stack" style="max-width:100%;height:auto;display:block;margin:0 auto"><style>
    svg.ev-svg{--fg:#292d33;--muted:#767c86;--line:#e6e8ed;--accent:#30669b;--soft:#f4f7fa;--paper:#fff}
    svg.ev-svg text{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Noto Sans SC","Microsoft YaHei",Arial,sans-serif;fill:var(--fg)}
    svg.ev-svg .node{fill:var(--soft);stroke:var(--line);stroke-width:1.5}
    svg.ev-svg .special{fill:var(--soft);stroke:var(--accent);stroke-width:1.5}
    svg.ev-svg .arrow{stroke:var(--muted);fill:none;stroke-width:1.5}
    svg.ev-svg .dim{fill:var(--muted)}
    @media (prefers-color-scheme:dark){
      svg.ev-svg{--fg:#e2e4e8;--muted:#a0a5af;--line:#3b3e45;--accent:#8fb8e4;--soft:#2d333b;--paper:#24262b}
    }
  </style><defs><marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7" fill="var(--muted)"/></marker></defs><g text-anchor="middle"><g font-size="15" font-weight="600"><rect class="node" x="12" y="12" width="146" height="65" rx="7"/><text x="85" y="38">Apple Watch</text><rect class="node" x="169" y="12" width="146" height="65" rx="7"/><text x="242" y="38">AirPods</text><rect class="node" x="326" y="12" width="146" height="65" rx="7"/><text x="399" y="38">iPhone</text><rect class="node" x="483" y="12" width="145" height="65" rx="7"/><text x="555" y="38">Vision Pro</text></g><g font-size="12" class="dim"><text x="85" y="57">Health data</text><text x="242" y="57">Voice notes</text><text x="399" y="57">Vision, space, location</text><text x="555" y="57">Smart glasses · 3D</text></g><path class="arrow" d="M85 77V98H555V77 M242 77V98 M399 77V98 M320 98V115" marker-end="url(#arr)"/><rect class="special" x="100" y="117" width="440" height="52" rx="7"/><text x="320" y="137" font-weight="600" font-size="15">Personal context &amp; memory</text><text x="320" y="155" font-size="12" class="dim">Authorized access · filter · retrieve · update</text><path class="arrow" d="M320 169V186" marker-end="url(#arr)"/><rect class="special" x="100" y="188" width="440" height="52" rx="7"/><text x="320" y="209" font-weight="600" font-size="15">Personal Agent</text><text x="320" y="226" class="dim" font-size="12">Local model + cloud API · task planning</text><path class="arrow" d="M320 240V254H112V270 M320 254V270 M320 254H528V270"/><g font-size="14"><rect class="node" x="12" y="270" width="200" height="49" rx="7"/><text x="112" y="291">Mac / cloud PC</text><text x="112" y="307" class="dim" font-size="11">Files &amp; app actions</text><rect class="node" x="220" y="270" width="200" height="49" rx="7"/><text x="320" y="291">System apps / APIs</text><text x="320" y="307" class="dim" font-size="11">Personal admin</text><rect class="node" x="428" y="270" width="200" height="49" rx="7"/><text x="528" y="291">Smart home</text><text x="528" y="307" class="dim" font-size="11">Physical environment</text></g></g></svg>
  <figcaption>Figure 3: A possible shape for a personal AI system. This is not a complete product Apple has already shipped; each data source and tool requires suitable interfaces, permissions and user authorization.</figcaption>
</figure>

Viewed together, Apple Watch, AirPods, iPhone, Vision Pro and smart glasses have a clear division of labor: Apple Watch records the body's physiological state, AirPods capture spoken language, the iPhone records visual and spatial information, Vision Pro presents spatial content in three dimensions, and smart glasses bring that presentation closer to everyday life. The value of Apple's hardware ecosystem is moving beyond consumer-electronics functions and toward giving personal AI multimodal perception.

### Price: computing demand is reshaping value for money

In the AI era, demand for computing power is also pushing up the price of phone hardware. Running local models calls for more memory and a stronger NPU, and those costs eventually show up in the retail price. For Android vendors whose software and service margins are thin, hardware volume is the main source of revenue, so when costs rise they often have to raise prices more sharply — and value for money declines. The iPhone is expensive in absolute terms, but its premium rests more on the ecosystem and long-term experience, leaving it relatively less exposed to this round of hardware cost inflation. As "phones that can run AI" get more expensive, the value-for-money calculation is worth doing again.

Put last year's and this year's flagships side by side across the Standard, Pro and Pro Max tiers, and at both 256GB and 512GB, and the picture gets clearer. Switch the tier and storage below to compare price increases:

{{< price-lab >}}

The bigger the storage, the steeper the increase: the four Android makers' Pro 512GB tiers went up by roughly 23% to 33%, while the iPhone Pro's 512GB rose by only about 9%. The iPhone has the smallest increase at both tiers, so the price gap between it and Android flagships narrowed in this round. One caveat: the Mate 80 Pro launched RMB 500 below its own predecessor in 2025, so measured against the Mate 70 Pro the Huawei two-year increase is smaller still.

When every phone is getting more expensive, the end of the market that was already priciest and least dependent on hardware volume can look relatively less expensive simply because it rose more slowly. The iPhone hasn't become cheap — it's still expensive. It's just that the price gap between it and Android flagships narrowed in this round.

### Other capabilities worth watching

One is App Intents and Shortcuts. The former lets developers expose app operations to system features like Siri and Shortcuts in a structured way, sharing some common ground with a large model's tool calling. If an app already provides interfaces for creating tasks or querying the calendar, there's no need to have AI recognize buttons from screenshots and simulate clicks each time. That said, third-party models can't automatically call every App Intent, and Android is developing similar capabilities.

The other is remote coordination between phone and computer. Many tasks may be initiated on a phone, executed on a Mac or cloud PC, and then tracked on the phone, with further requirements added and key actions confirmed there. This pattern is already appearing in some agent products, and a Windows host can support remote control as well. Tasks on a phone are no longer limited by which desktop software the phone itself can run.
