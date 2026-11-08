import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Binary trees",
      points: [
        "Preorder: root-left-right; inorder: left-root-right; postorder: left-right-root; level order uses a queue",
        "Inorder plus preorder (or postorder) fixes a binary tree uniquely; preorder plus postorder does not",
        "In any binary tree, leaves = nodes with two children + 1",
        "Height h (root at height 0) holds at most 2^(h+1) − 1 nodes; n nodes need height at least ⌈log₂(n + 1)⌉ − 1",
        "Distinct unlabelled binary tree shapes (and BSTs on n keys) = Catalan(n)",
      ],
    },
    {
      heading: "BST, AVL, heaps and tries",
      points: [
        "BST: left < root < right; inorder gives sorted order; search/insert O(h), O(n) when skewed",
        "Deleting a node with two children: replace it with its inorder successor (or predecessor)",
        "AVL: balance factor in {−1, 0, 1}; fix with LL, RR, LR or RL rotations; height O(log n)",
        "Minimum nodes in an AVL tree of height h: N(h) = N(h − 1) + N(h − 2) + 1, N(0) = 1, N(1) = 2",
        "Binary heap (0-based array): children 2i + 1, 2i + 2, parent ⌊(i − 1)/2⌋; insert and extract O(log n), build-heap O(n)",
        "In a max-heap the minimum is in a leaf, i.e. in the last ⌈n/2⌉ positions",
        "Trie: insert and search O(length of word), independent of number of words",
      ],
    },
    {
      heading: "Graphs and traversals",
      points: [
        "Adjacency matrix: O(V²) space, O(1) edge check; adjacency list: O(V + E) space",
        "BFS uses a queue and gives shortest paths in edge count for unweighted graphs; DFS uses a stack or recursion; both O(V + E)",
        "Sum of degrees = 2E; complete graph Kₙ has n(n − 1)/2 edges; a tree on V vertices has V − 1 edges",
        "DFS back edge ⇒ cycle; topological order exists only for a DAG (Kahn's in-degree method or reverse DFS finish order)",
        "Kₙ has n^(n − 2) spanning trees (Cayley's formula)",
      ],
    },
    {
      heading: "Shortest paths and spanning trees",
      points: [
        "Dijkstra: greedy, O((V + E) log V) with a binary heap; fails with negative edge weights",
        "Bellman–Ford: V − 1 rounds of relaxing all edges, O(VE); a further improvement in round V means a negative cycle",
        "Floyd–Warshall: all pairs, O(V³)",
        "Kruskal: sort edges, add if no cycle (union-find), O(E log E); Prim grows from a start vertex, O(E log V)",
      ],
    },
    {
      heading: "Recursion and recurrences",
      points: [
        "Master theorem for T(n) = aT(n/b) + f(n): compare f(n) with n^(log_b a); smaller → Θ(n^(log_b a)), equal → Θ(n^(log_b a) log n), larger → Θ(f(n))",
        "T(n) = T(n/2) + 1 → Θ(log n); 2T(n/2) + 1 → Θ(n); 2T(n/2) + n → Θ(n log n)",
        "T(n) = T(n − 1) + 1 → Θ(n); T(n − 1) + n → Θ(n²); 2T(n − 1) + 1 → Θ(2ⁿ)",
        "Call count: C(n) = 1 + calls of the children; Tower of Hanoi needs 2ⁿ − 1 moves",
      ],
    },
    {
      heading: "Greedy and dynamic programming",
      points: [
        "Greedy works when a local best choice is always safe: activity selection (earliest finish), fractional knapsack (value/weight), Huffman, job sequencing",
        "DP needs overlapping subproblems and optimal substructure; memoisation is top-down, tabulation bottom-up",
        "0/1 knapsack O(nW) (pseudo-polynomial); LCS and edit distance O(mn); matrix chain O(n³); LIS O(n²) or O(n log n)",
        "Coin change: greedy is correct for canonical coin systems like 1, 2, 5, 10 but fails for {1, 3, 4} with amount 6",
      ],
    },
  ],
  formulas: [
    "Catalan(n) = (2n)! / ((n + 1)! n!): 1, 1, 2, 5, 14, 42",
    "Labelled binary trees on n nodes = Catalan(n) × n!",
    "Heap: parent ⌊(i − 1)/2⌋, children 2i + 1 and 2i + 2 (0-based); 1-based: i/2, 2i, 2i + 1",
    "AVL minimum nodes: 1, 2, 4, 7, 12, 20 for h = 0..5",
  ],
  traps: [
    "Mixing 0-based and 1-based heap index formulas",
    "Running Dijkstra on a graph with a negative edge",
    "Counting tree height in nodes in one formula and in edges in another – check the question's convention",
    "Assuming preorder + postorder fixes a tree",
    "Using greedy for 0/1 knapsack",
  ],
  examTips: [
    "Placement MCQs give a small tree or graph and ask a traversal order, the heap array after inserts/deletes, or the MST weight",
    "Recurrence and recursion-count questions are common in TCS, Infosys and GATE-style tests – memorise the standard recurrences",
  ],
};

export default notes;
