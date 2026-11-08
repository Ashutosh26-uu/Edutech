import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "SDLC models and Scrum",
      points: [
        "Waterfall: linear phases, fits fixed, well-understood requirements",
        "V-model: each development phase paired with a test level (requirements ↔ acceptance, design ↔ system/integration, code ↔ unit)",
        "Spiral: iterative loops with risk analysis in every loop – suits large, risky projects",
        "Prototype: build a throwaway model to clarify unclear requirements; Incremental: deliver in usable pieces",
        "Scrum roles: Product Owner (orders the backlog), Scrum Master (coach, removes blockers), Developers",
        "Scrum events: Sprint (fixed, ≤ 1 month, not extended), Sprint Planning, Daily Scrum (15 min), Sprint Review, Retrospective",
        "Scrum artifacts: Product Backlog, Sprint Backlog, Increment",
      ],
    },
    {
      heading: "Testing",
      points: [
        "Levels: unit → integration → system → acceptance (alpha at developer site, beta at user site)",
        "Top-down integration uses stubs for missing lower modules; bottom-up uses drivers for missing upper modules",
        "Black-box (behaviour): equivalence partitioning, boundary value analysis, decision tables, state transition",
        "White-box (structure): statement, branch, path and condition coverage; branch coverage implies statement coverage",
        "Verification: are we building it right? Validation: are we building the right product?",
      ],
    },
    {
      heading: "Design principles and patterns",
      points: [
        "Aim for high cohesion and low coupling",
        "SOLID: Single responsibility, Open–closed (open to extension, closed to modification), Liskov substitution, Interface segregation, Dependency inversion",
        "Square overriding Rectangle's setWidth breaks Liskov; injecting a database interface instead of `new MySqlDatabase()` applies dependency inversion",
        "Creational: Singleton, Factory, Builder, Prototype; Structural: Adapter, Decorator, Facade, Proxy, Composite",
        "Behavioural: Observer (notify subscribers), Strategy (swap algorithms), Command, Iterator, Template Method",
        "Lazy Singleton with a plain null check is not thread-safe – use synchronisation or eager/holder initialisation",
      ],
    },
    {
      heading: "Git",
      points: [
        "`reset --soft` moves HEAD only (changes stay staged); `--mixed` (default) also unstages; `--hard` also discards working changes",
        "`revert` adds a new undo commit – safe on shared branches; reset and rebase rewrite history",
        "`rebase` replays commits on a new base, giving them new hashes; `merge` keeps both histories with a merge commit",
        "`merge --squash` stages the changes without recording a merge, so `branch -d` then refuses (use `-D`)",
        ".gitignore affects only untracked files; remove a tracked file with `git rm --cached`",
        "A conflict arises when both branches change the same lines (or one edits a file the other deletes)",
      ],
    },
    {
      heading: "REST, cloud and containers",
      points: [
        "REST is stateless: every request carries all the information needed",
        "Idempotent: GET, PUT, DELETE (also HEAD, OPTIONS); POST is not",
        "Status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 not authenticated, 403 forbidden, 404, 409 Conflict, 429 Too Many Requests, 500, 503",
        "IaaS: you manage OS upward; PaaS: you manage only code and data; SaaS: provider manages everything; FaaS: event-driven functions, pay per run, cold starts",
        "Type 1 hypervisor runs on bare metal; Type 2 runs on a host OS",
        "Containers share the host kernel, so they are lighter and start faster than VMs; Kubernetes' smallest unit is a Pod",
        "Dockerfile: copy requirements and install them before copying source code so the layer cache survives code edits",
      ],
    },
  ],
  formulas: [
    "Cyclomatic complexity V(G) = E − N + 2P = decision points + 1 = number of regions (planar graph)",
    "BVA test cases: 4n + 1; robust BVA 6n + 1; worst-case 5ⁿ; robust worst-case 7ⁿ (n variables)",
    "Basic COCOMO effort = a × (KLOC)^b: organic 2.4, 1.05; semi-detached 3.0, 1.12; embedded 3.6, 1.20",
    "Availability = MTBF / (MTBF + MTTR); in series multiply; in parallel 1 − Π(1 − Aᵢ)",
  ],
  traps: [
    "Calling 401 'forbidden' – 401 means not authenticated, 403 means authenticated but not allowed",
    "Thinking adding a file to .gitignore stops tracking an already committed file",
    "Using reset or rebase on a branch others have pulled",
    "Saying a Scrum sprint can be extended when work is unfinished",
    "Mixing stubs (top-down) with drivers (bottom-up)",
  ],
  examTips: [
    "Placement tests use scenario MCQs: a Git command sequence, a design situation to match with a pattern or SOLID principle, or an HTTP status to pick",
    "Numericals: cyclomatic complexity from code, BVA/equivalence class counts, COCOMO effort and availability",
    "Count 'how many statements are correct' items carefully – one wrong word (always, never) usually flips a statement",
  ],
};

export default notes;
