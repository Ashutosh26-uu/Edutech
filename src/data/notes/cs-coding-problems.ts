import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Reading the constraints",
      points: [
        "About 10⁸ simple operations run in a second: n ≤ 10⁵–10⁶ needs O(n) or O(n log n); n ≤ 5000 allows O(n²); n ≤ 500 allows O(n³); n ≤ 20 allows O(2ⁿ · n); n ≤ 10 allows O(n!)",
        "Values up to 10⁹ summed over 10⁵ items overflow a 32-bit int: use long / long long",
        "\"Return the answer modulo 10⁹ + 7\" signals counting DP or combinatorics; take the modulus after every addition and multiplication",
        "Always test the edge cases: empty input, one element, all equal, all negative, already sorted, duplicates",
      ],
    },
    {
      heading: "Two pointers",
      points: [
        "Signals: sorted array, pair or triplet with a target sum, remove duplicates in place, palindrome check, merging two sorted lists",
        "Template: l = 0, r = n − 1; if the sum is too small move l right, if too large move r left; each step discards one candidate, so O(n)",
        "Same-direction version (slow/fast): slow marks the next write position, fast scans; used for in-place compaction",
        "3-sum: sort, fix one element, two-pointer the rest – O(n²); skip equal neighbours to avoid duplicate triplets",
      ],
    },
    {
      heading: "Sliding window",
      points: [
        "Signals: contiguous subarray or substring, \"longest/shortest/count with at most k …\", all elements non-negative",
        "Fixed window: add the new element, remove the one leaving, update the answer – O(n)",
        "Variable window: extend r every step; while the window is invalid, shrink from l; each index enters and leaves once, so O(n)",
        "A frequency map or array (size 26 / 128) tracks the window's characters; a deque of indices gives the window maximum in O(n)",
        "Does not work for sums with negative numbers – use prefix sums with a hash map instead",
      ],
    },
    {
      heading: "Prefix sums and hashing",
      points: [
        "P[0] = 0, P[i + 1] = P[i] + A[i]; sum of A[l..r] = P[r + 1] − P[l]",
        "Count subarrays with sum k: walk once, add count[P − k] to the answer, then count[P]++ (start with count[0] = 1)",
        "Divisible by k: group prefixes by P mod k (fix negative remainders with ((P % k) + k) % k)",
        "Hash map / set gives O(1) average lookups: two-sum, first repeat, anagram grouping (key = sorted word or 26-count tuple), longest consecutive run",
        "2-D prefix sums answer rectangle sums in O(1) after O(rows × cols) preprocessing; a difference array applies range updates in O(1) each",
      ],
    },
    {
      heading: "Binary search (on an index or on the answer)",
      points: [
        "On a sorted array: lower bound = first index with A[i] ≥ x; use lo + (hi − lo) / 2 to avoid overflow",
        "On the answer: if feasible(x) is monotonic (false…false true…true), binary search x – minimum ship capacity, minimum eating speed, split array to minimise the largest sum, maximise the minimum gap",
        "Cost: O(log(range) × cost of feasible); typical feasible check is a greedy O(n) pass",
        "Rotated sorted array: one half around mid is always sorted; decide which half can contain the target",
      ],
    },
    {
      heading: "Stacks, queues and monotonic structures",
      points: [
        "Stack signals: matching brackets, undo, evaluate expressions, \"nearest previous/next greater or smaller\"",
        "Monotonic stack: pop while the top is smaller (for next greater) – each index pushed and popped once, O(n) total",
        "Largest rectangle in a histogram and stock-span style problems are monotonic-stack problems",
        "Queue/deque: BFS, sliding-window maximum (keep indices with decreasing values), task scheduling simulations",
      ],
    },
    {
      heading: "Linked lists and trees",
      points: [
        "Linked list: a dummy head node removes special cases; slow/fast pointers find the middle and detect cycles; reverse with prev/curr/next",
        "Remove the k-th node from the end in one pass: move fast k steps ahead, then move both together",
        "Trees: most answers are a post-order recursion that returns something from each subtree (height, sum, is-balanced, best path through the node)",
        "BST: in-order is sorted; validate with (low, high) bounds, not just comparing with direct children",
        "Level order uses a queue; the lowest common ancestor in a BST is the first node whose value lies between the two keys",
      ],
    },
    {
      heading: "Graphs: BFS, DFS, topological sort, shortest paths, union-find",
      points: [
        "Grids are graphs: 4 neighbours per cell; mark visited when you push, not when you pop, to avoid duplicates in the queue",
        "BFS gives the fewest edges (unweighted shortest path); multi-source BFS starts with every source in the queue at distance 0",
        "DFS counts connected components and islands; a directed cycle shows up as an edge to a node still on the recursion stack",
        "Kahn's algorithm: push all indegree-0 nodes, pop and decrement neighbours; if fewer than V nodes come out there is a cycle",
        "Dijkstra with a min-heap O((V + E) log V) for non-negative weights; 0-1 BFS with a deque when weights are 0 or 1; Bellman–Ford for negative edges",
        "Union-find with path compression and union by rank: near O(1) per operation; detects cycles in undirected graphs and powers Kruskal",
      ],
    },
    {
      heading: "Heaps and greedy",
      points: [
        "Top-k largest: keep a min-heap of size k – O(n log k); k-th smallest: max-heap of size k",
        "Merge k sorted lists with a heap of k heads: O(N log k)",
        "Running median: max-heap for the lower half, min-heap for the upper half, sizes differ by at most one",
        "Greedy needs a proof (exchange argument): interval scheduling sorts by end time; meeting rooms sort by start and use a heap of end times",
        "When greedy fails (coins {1, 3, 4} for 6), switch to DP",
      ],
    },
    {
      heading: "Recursion, backtracking and dynamic programming",
      points: [
        "Backtracking: choose, recurse, un-choose; subsets 2ⁿ, permutations n!, prune early when the partial answer is already invalid",
        "DP recipe: state (what changes), transition (how a state uses smaller states), base case, order of evaluation, answer location",
        "1-D: climbing stairs, house robber, coin change (min coins and number of ways), decode ways, word break",
        "2-D: grid paths, LCS, edit distance, 0/1 knapsack (loop capacity downwards for a 1-D array), unbounded knapsack (upwards)",
        "LIS in O(n log n) with patience sorting: tails[k] = smallest tail of an increasing run of length k + 1; binary search where each element goes",
        "Memoisation turns exponential recursion (naive Fibonacci O(2ⁿ)) into O(states × transitions)",
      ],
    },
    {
      heading: "Bit manipulation and math",
      points: [
        "x & (x − 1) clears the lowest set bit (power of two check: x > 0 and x & (x − 1) == 0); x & −x isolates it",
        "XOR of all elements cancels pairs – finds the single unpaired number; a ^ a = 0, a ^ 0 = a",
        "Subsets of n items as bitmasks 0 … 2ⁿ − 1; bit i of mask is (mask >> i) & 1",
        "gcd by Euclid O(log min(a, b)); lcm = a / gcd × b (divide first to avoid overflow)",
        "Fast power by squaring O(log e); modular inverse with a prime modulus = a^(p − 2) mod p; sieve of Eratosthenes O(n log log n)",
      ],
    },
  ],
  formulas: [
    "Subarrays of n elements = n(n + 1)/2; subsets = 2ⁿ; permutations = n!",
    "Sum of A[l..r] = P[r + 1] − P[l]",
    "Binary search iterations ≈ ⌈log₂(range)⌉",
    "Edges in a tree = V − 1; a grid of R × C has about 2RC edges",
    "Catalan numbers 1, 1, 2, 5, 14, 42: BST shapes, valid bracket strings",
    "MOD = 1 000 000 007 is prime, so a⁻¹ ≡ a^(MOD − 2)",
  ],
  traps: [
    "Using a sliding window when the array has negative numbers – the window sum is no longer monotonic",
    "Forgetting count[0] = 1 in prefix-sum counting, which misses subarrays that start at index 0",
    "while (lo < hi) with hi = mid − 1 or lo = mid: off-by-one loops that skip the answer or never end",
    "Marking BFS nodes visited on pop instead of on push, which enqueues the same node many times",
    "Iterating 0/1 knapsack capacity upwards with a 1-D array, which reuses an item more than once",
    "Integer overflow in (lo + hi) / 2, in sums of large values, and in a × b before taking the modulus",
    "Checking a BST only against its direct children instead of the whole valid range",
    "Python's % is never negative for a positive divisor, but C, C++ and Java keep the sign of the dividend",
  ],
  examTips: [
    "In code-output MCQs, trace on the given input with a small table of variables; do not guess from the function name",
    "For \"which approach passes\" questions, multiply out the complexity with the largest n before choosing",
    "Bug-finding questions usually hide the bug in a loop bound, an initial value, the update order or a missing base case",
    "Name the pattern first (two pointers, window, prefix + hash, binary search on answer, BFS, DP); the complexity usually follows from it",
  ],
};

export default notes;
