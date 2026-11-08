import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Arrays and strings",
      points: [
        "Access by index O(1); insert or delete in the middle O(n) because elements shift",
        "Two pointers: sorted pair-sum, reverse, remove duplicates in O(n)",
        "Sliding window: fixed or variable window for subarray/substring problems in O(n)",
        "Prefix sums: P[0] = 0, P[i + 1] = P[i] + A[i]; sum A[l..r] = P[r + 1] − P[l]",
        "Kadane's algorithm finds the maximum subarray sum in O(n)",
        "Hidden O(n) steps: Python `list.pop(0)`, Java string `+=` inside a loop (use StringBuilder)",
      ],
    },
    {
      heading: "Linked lists",
      points: [
        "Access O(n); insert/delete at head O(1); at tail O(1) only if a tail pointer is kept",
        "Doubly linked list deletes a known node in O(1) but needs an extra pointer per node",
        "Floyd's slow/fast pointers detect a cycle and find the middle in one pass",
        "Reversal needs three pointers (prev, curr, next) and runs in O(n) time, O(1) space",
        "Given only a node pointer, delete it by copying the next node – impossible for the last node",
      ],
    },
    {
      heading: "Stacks",
      points: [
        "LIFO; push, pop, peek all O(1)",
        "Uses: parenthesis matching, undo, function calls, postfix evaluation, next greater element",
        "Infix → postfix: operands go out directly; pop operators of higher precedence (or equal, if left-associative) before pushing; `^` is right-associative",
        "Postfix evaluation: push operands; on an operator pop b, then a, push a op b",
        "Pushing 1..n in order and popping any time gives Catalan(n) valid output orders (n = 3 → 5)",
      ],
    },
    {
      heading: "Queues",
      points: [
        "FIFO; enqueue at rear, dequeue at front",
        "Circular queue: rear = (rear + 1) mod N; with one slot kept empty it holds N − 1 items",
        "Full when (rear + 1) mod N = front; empty when front = rear",
        "Queue from two stacks: O(1) amortised per operation; deque allows both ends",
        "Priority queue is usually a binary heap: insert and delete-min O(log n)",
      ],
    },
    {
      heading: "Hashing",
      points: [
        "Load factor α = n/m (keys / slots); average O(1), worst case O(n)",
        "Chaining: each slot holds a list, α can exceed 1",
        "Linear probing (h + i) suffers primary clustering; quadratic (h + i²) secondary clustering; double hashing (h₁ + i·h₂) avoids both",
        "Deleting under open addressing needs a tombstone marker, or later searches stop too early",
      ],
    },
    {
      heading: "Searching and sorting",
      points: [
        "Linear search O(n); binary search O(log n) on sorted data, at most ⌊log₂ n⌋ + 1 comparisons",
        "Stable: bubble, insertion, merge, counting; unstable: selection, quick, heap",
        "Insertion sort: O(n) on sorted input; number of shifts = number of inversions",
        "Selection sort makes at most n − 1 swaps; bubble sort with a swap flag is O(n) on sorted input",
        "Quick sort: O(n log n) average, O(n²) worst (sorted input with first/last pivot)",
        "Merge sort O(n log n) always with O(n) extra space; heap sort O(n log n) in place",
      ],
    },
  ],
  formulas: [
    "Bubble/insertion/selection: O(n²) average and worst",
    "Merge, heap: O(n log n) in all cases; quick: O(n log n) average, O(n²) worst",
    "Counting sort O(n + k); radix sort O(d(n + k))",
    "Catalan(n) = (2n)! / ((n + 1)! n!): 1, 1, 2, 5, 14, 42",
    "Worst-case comparisons to merge two sorted lists of m and n items = m + n − 1",
  ],
  traps: [
    "Popping operands in the wrong order for − and ÷ in postfix evaluation (second pop is the left operand)",
    "Treating `^` as left-associative during infix → postfix conversion",
    "Saying a circular array queue of size N holds N items when one slot is kept empty",
    "Calling heap sort or quick sort stable",
    "Forgetting the +1 in binary search's maximum comparisons",
  ],
  examTips: [
    "Placement MCQs ask complexity tables, stable vs unstable, and exact counts (swaps, comparisons, probes) on a small array",
    "Infix → postfix and postfix evaluation appear in almost every test – practise with ^ and brackets",
    "Hash questions give a table size and keys and ask the final slot of a key under linear or quadratic probing",
  ],
};

export default notes;
