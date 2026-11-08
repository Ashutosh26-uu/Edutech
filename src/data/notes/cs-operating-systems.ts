import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Processes and threads",
      points: [
        "Process states: new → ready → running → waiting → terminated; details kept in the PCB",
        "Threads of a process share code, data, heap and open files; each has its own stack, registers and program counter",
        "Zombie: child finished but parent has not called wait(); orphan: parent ended first, adopted by init",
        "fork() returns 0 in the child and the child's PID in the parent; n forks in sequence → 2ⁿ processes",
      ],
    },
    {
      heading: "CPU scheduling",
      points: [
        "FCFS: simple, non-preemptive, convoy effect behind a long job",
        "SJF gives the minimum average waiting time (non-preemptive); SRTF is its preemptive form; both can starve long jobs",
        "Round Robin: time quantum q; very large q behaves like FCFS, very small q wastes time in switches",
        "Priority scheduling can starve low-priority jobs – fixed by aging",
        "Draw a Gantt chart, then compute completion, turnaround, waiting and response time for each process",
      ],
    },
    {
      heading: "Synchronisation and deadlock",
      points: [
        "Critical-section solution needs mutual exclusion, progress and bounded waiting",
        "Semaphore: wait/P decrements (blocks below 0), signal/V increments; binary semaphore works like a mutex",
        "Classic problems: producer–consumer (mutex, empty, full), readers–writers, dining philosophers",
        "Deadlock needs all four: mutual exclusion, hold and wait, no preemption, circular wait",
        "Handling: prevention (break a condition), avoidance (Banker's), detection and recovery, or ignore",
        "Banker's: Need = Max − Allocation; grant a request only if a safe sequence still exists",
        "Resource-allocation graph: a cycle means deadlock only when every resource has a single instance",
      ],
    },
    {
      heading: "Memory management",
      points: [
        "First fit, best fit, worst fit; contiguous allocation causes external fragmentation, fixed partitions and paging cause internal",
        "Paging: logical address = page number + offset; page table maps pages to frames",
        "TLB caches page-table entries; multilevel paging shrinks page-table size",
        "Segmentation uses variable-sized logical units and suffers external fragmentation",
        "Thrashing: too many page faults because processes lack frames; cure with working-set or fewer processes",
      ],
    },
    {
      heading: "Page replacement",
      points: [
        "FIFO replaces the oldest page and can show Belady's anomaly (more frames, more faults)",
        "OPT replaces the page used farthest in the future – lowest faults, used as a benchmark",
        "LRU replaces the least recently used page; LRU and OPT are stack algorithms with no Belady's anomaly",
        "Count faults by writing the frame contents after every reference; the first k distinct pages always fault",
      ],
    },
    {
      heading: "Files and disks",
      points: [
        "File allocation: contiguous (fast, external fragmentation), linked (no random access), indexed (index block per file)",
        "Disk access time = seek time + rotational latency + transfer time; average latency = half a rotation",
        "FCFS fair but slow; SSTF picks nearest request and may starve",
        "SCAN goes to the disk end then reverses; C-SCAN returns to the start and serves one way",
        "LOOK and C-LOOK turn at the last pending request instead of the disk end",
      ],
    },
  ],
  formulas: [
    "Turnaround = completion − arrival; waiting = turnaround − burst; response = first run − arrival",
    "n sequential fork() calls → 2ⁿ processes (2ⁿ − 1 new children)",
    "Deadlock-free if R ≥ Σ (maxᵢ − 1) + 1; for n processes needing k each: n(k − 1) + 1",
    "Semaphore final value = initial − (number of P) + (number of V)",
    "EAT with page faults = (1 − p) × memory access + p × fault service time",
    "EMAT with TLB = h(t + m) + (1 − h)(t + (levels + 1) m)",
    "Page-table entries = 2^(logical address bits − offset bits); offset bits = log₂(page size)",
  ],
  traps: [
    "Subtracting burst from completion to get waiting time when arrival is not 0",
    "Saying LRU is always better than FIFO – it never has Belady's anomaly, but can still fault more on a given string",
    "Treating any RAG cycle as deadlock with multi-instance resources",
    "Forgetting short-circuit: `fork() && fork()` does not always run the second fork",
    "Ignoring whether C-SCAN's return sweep is counted in head movement",
  ],
  examTips: [
    "Placement MCQs favour Gantt-chart numericals (average waiting/turnaround), page-fault counts and fork() output counts",
    "Banker's algorithm questions ask whether a state is safe or give the safe sequence",
    "Interview favourites: process vs thread, deadlock conditions, paging vs segmentation, thrashing",
  ],
};

export default notes;
