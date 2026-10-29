# AI Jargon Buster - Developer Workbench

AI Jargon Buster is a high-productivity developer and executive workbench that instantly translates convoluted technical documentation, dense academic machine-learning papers, and cryptic code snippets into crystal-clear explanations across three tailored tones: **"Explain like I'm 5"**, **"Executive Summary"**, and **"Deep Technical Breakdown"**.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during the interactive interview:

- **Visual Aesthetic & Theme**: Modern developer workbench inspired by linear high-craft engineering tools, featuring seamless Dark & Light theme switching, clean neutral zinc/slate palette, monospace typography for technical syntax, and zero-pill typographic metadata.
- **Interactive Capabilities**:
  1. **Interactive Jargon Highlighter**: Automatically detects obscure terms, acronyms, and specialized jargon in the input and output; clicking any highlighted term reveals an instant contextual micro-definition tooltip.
  2. **Multi-Tone Comparison**: Seamless toggle between a focused view of the selected tone and a side-by-side comparison grid displaying all 3 tones simultaneously.
  3. **Audio Speech Playback**: High-fidelity text-to-speech audio narration using `gemini-3.8-flash-lite-tts` with browser Web Audio playback controls (play, pause, seek, speed).
  4. **Markdown Export & Shareable Cards**: One-click clipboard copy, clean `.md` file download, and formatted summary cards ready for sharing in Slack/Teams/Notion.
- **Preset Snippet Library**: Instant one-click sample presets covering Cloud Architecture (Kubernetes, Service Mesh), AI/ML (Attention Mechanisms, LoRA Fine-Tuning), and DevOps/SRE (Distributed Tracing, Chaos Engineering).

---

## 1. Overview & Core Concept

### What It Does
AI Jargon Buster demystifies complex technical text. Users paste code, API docs, system specifications, or whitepapers, choose a target audience tone, and receive an instant structured breakdown:
- **Core Explanation**: Calibrated precisely to the chosen persona:
  - *Explain like I'm 5*: Real-world analogies (e.g., postal systems, traffic cops, restaurant kitchens), zero buzzwords, simple language.
  - *Executive Summary*: Business impact, ROI, resource trade-offs, architecture value, risk mitigation, and strategic bottom line.
  - *Deep Technical Breakdown*: Low-level mechanics, protocols, memory/latency characteristics, failure modes, and code-level flow.
- **De-Jargonized Glossary**: Key terms extracted and translated with simple plain-English definitions and one-sentence analogies.
- **Key Takeaways & Mental Model**: 3 bulleted takeaway principles that cement understanding.
- **Interactive Audio**: Listen to the explanation on the go.

### Target Audience & Persona
- Software engineers deciphering unfamiliar framework documentation or legacy architectures.
- Engineering managers and executives needing quick technical briefings without getting lost in acronym soup.
- Students, junior developers, and cross-functional partners (Product Managers, Designers, Marketers) collaborating with deep-tech teams.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Explore or Paste**:
   - The user opens the workbench. They can immediately click a preset chip (e.g., *Kubernetes Raft Consensus*, *Transformer Self-Attention*, *eBPF Kernel Probing*) or paste custom text into a syntax-aware monospaced editor with character/token counter and clear button.
2. **Select Persona & Mode**:
   - The user selects the desired tone from a segmented control or dropdown:
     - 🧸 **Explain like I'm 5**
     - 💼 **Executive Summary**
     - 🔬 **Deep Technical Breakdown**
   - Option to toggle **"Compare All Tones Side-by-Side"** to generate and inspect all three simultaneously.
3. **Analyze & Demystify**:
   - Clicking **"Bust Jargon"** triggers a rapid server-side Gemini 3.8 request.
   - A skeleton placeholder reflects layout geometry while processing.
4. **Interact with Results**:
   - **Highlighted Terms**: Obscure jargon is subtly underlined with dotted accents; hovering or clicking opens a contextual definition popover.
   - **Audio Playback**: Click the speaker button to hear an expressive narration generated via Gemini TTS.
   - **Export & Share**: Copy clean markdown, download as a file, or toggle a sleek shareable summary card preview.

### Visual Identity & Theme
- **Aesthetic Direction**: Modern developer workbench (clean, authoritative, distraction-free). Strict adherence to anti-slop rules: no generic purple gradients, no pill sandwiches, no decorative comment headers (`// 01 ARCHITECTURE`), and no fake telemetry tickers.
- **Color Palette**:
  - *Dark Mode (Default)*: Slate/Zinc deep background (`#090D16`), card surface (`#131B2E`), subtle hairline borders (`#1E293B`), text primary (`#F8FAFC`), text muted (`#94A3B8`), accent indigo/cyan (`#38BDF8` / `#6366F1`).
  - *Light Mode*: Crisp clean canvas (`#F8FAFC`), structural surfaces (`#FFFFFF`), hairline borders (`#E2E8F0`), text primary (`#0F172A`), text muted (`#64748B`), accent sapphire (`#2563EB`).
- **Typography**:
  - Display / Headings: `Plus Jakarta Sans` (crisp, modern neo-grotesque).
  - Body & Reading: `DM Sans` / `Plus Jakarta Sans` (open counter forms, high legibility).
  - Code & Technical Snippets: `JetBrains Mono` / monospace tabular numerals (`tabular-nums`).
- **Layout Rhythm**:
  - Top Bar Contract: Wordmark on the left, theme switcher + preset quick-links in center, GitHub/docs link or Reset action on right.
  - Split Workspace on Desktop: Left column (Input & Configuration, Presets) and Right column (Busted Explanation, Interactive Glossary, Audio player & Export). On wide viewports or Compare mode, expands into a multi-column comparative view.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Server-Side Gemini API Architecture with Structured Outputs
- **Chosen Approach**: Full-stack Vite + Express application where Express runs on port 3000 (with Vite middleware in dev and static serving in production) exposing `/api/bust-jargon` and `/api/synthesize-speech`.
- **Why**: Keeps `GEMINI_API_KEY` strictly secure on the server side in compliance with AI Studio guidelines, and uses `@google/genai` with `gemini-3.8-flash` with structured JSON schema (`responseSchema`) for predictable term extraction, analogies, takeaways, and formatted prose.
- **Alternatives Considered**: Client-side SDK calls were rejected because exposing API keys in browser bundles is strictly prohibited.

### Decision 2: Audio Synthesis via `gemini-3.8-flash-lite-tts`
- **Chosen Approach**: A dedicated `/api/synthesize-speech` endpoint that invokes `gemini-3.8-flash-lite-tts` with unary audio response (`audio/wav`), returning base64 audio data for browser `AudioContext` playback.
- **Why**: Delivers lifelike, natural-sounding voice explanations tailored to the tone. Includes automatic graceful fallback to the browser's native `window.speechSynthesis` if TTS quotas or offline constraints occur.
- **Alternatives Considered**: Raw streaming PCM was evaluated, but unary WAV responses are smaller, self-contained, and can be directly played or downloaded as `.wav`.

### Decision 3: Interactive Jargon Highlighting Engine
- **Chosen Approach**: The Gemini JSON response extracts an array of identified `jargonTerms` with `term`, `category`, `simpleDefinition`, and `analogy`. The client text renderer matches these tokens within the explanation text and renders interactive inline badges that open a clean popover on hover/click.
- **Why**: Eliminates manual searching and lets users build intuition without leaving the reading flow.

---

## 4. Technical Architecture & Data Strategy

### System Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AI Jargon Buster Client                         │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ TopBar: Wordmark · Theme Toggle · Reset Action                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌───────────────────────────────┐  ┌────────────────────────────────┐ │
│  │         Input Panel           │  │       Explanation Canvas       │ │
│  │  - Preset Selector Chips      │  │  - Tone Tabs / Side-by-Side    │ │
│  │  - Monospace Code/Text Area   │  │  - Audio Player (TTS)          │ │
│  │  - Tone Dropdown Selector     │  │  - Jargon Highlighted Prose    │ │
│  │  - Compare All Mode Toggle    │  │  - Extracted Glossary Grid     │ │
│  │  - "Bust Jargon" Action CTA   │  │  - Key Takeaways Checklist     │ │
│  │  - Token / Word Counter       │  │  - Copy & Markdown Export      │ │
│  └───────────────────────────────┘  └────────────────────────────────┘ │
└───────────────────────────────┬────────────────────────────────────────┘
                                │ HTTP POST (JSON)
                                ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Express Backend (server.ts)                        │
│                                                                        │
│  POST /api/bust-jargon           POST /api/synthesize-speech           │
│  - Validate text & tone          - Validate text & voice style         │
│  - Call @google/genai SDK        - Call gemini-3.8-flash-lite-tts      │
│  - Model: gemini-3.8-flash       - Returns base64 WAV audio            │
│  - Structured JSON response      - User-Agent: 'aistudio-build'        │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Structures & State Schema

```typescript
export type ToneType = 'eli5' | 'executive' | 'technical';

export interface JargonTerm {
  term: string;
  category: 'acronym' | 'protocol' | 'concept' | 'architecture' | 'buzzword';
  simpleDefinition: string;
  analogy: string;
}

export interface ToneExplanation {
  tone: ToneType;
  title: string;
  coreExplanation: string;
  mentalModelAnalogy?: string;
  keyTakeaways: string[];
  jargonTerms: JargonTerm[];
  targetReadingLevel: string;
}

export interface JargonBusterResponse {
  originalTextSummary: string;
  detectedDomain: string; // e.g., 'Cloud Infrastructure', 'Machine Learning'
  explanations: Record<ToneType, ToneExplanation>;
}
```

### Interactive State Transitions
1. **Idle State**: Displays sample preset buttons with short descriptions.
2. **Generating State**: Disables submit button with spinning state; displays animated skeleton placeholders.
3. **Success State**:
   - Renders active tone explanation with clickable highlighted terms.
   - Allows switching between 'ELI5', 'Executive', and 'Deep Technical' without re-fetching (all 3 tones are returned in a single comprehensive Gemini request).
   - Audio narration is available on demand with playback controls.
4. **Error Handling**: Displays an inline notification with actionable retry button and error message.
