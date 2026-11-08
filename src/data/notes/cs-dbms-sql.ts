import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "ER model and keys",
      points: [
        "Entity, attribute (simple, composite, multivalued, derived), relationship with cardinality 1:1, 1:N, M:N",
        "Weak entity: no key of its own, identified by owner + partial key; drawn as a double rectangle",
        "Super key: any set that identifies a row; candidate key: a minimal super key; primary key: the chosen candidate",
        "Foreign key refers to a key of another (or the same) table; it may be NULL unless declared NOT NULL",
        "Three-schema architecture: external, conceptual, internal; logical vs physical data independence",
      ],
    },
    {
      heading: "Functional dependencies and normal forms",
      points: [
        "Armstrong's axioms: reflexivity, augmentation, transitivity; find keys with attribute closure X⁺",
        "1NF: atomic values; 2NF: no non-prime attribute depends on part of a candidate key",
        "3NF: for every X → A, X is a superkey or A is prime; BCNF: every determinant X is a superkey",
        "Decomposition is lossless if the common attributes form a key of at least one part",
        "3NF can always be reached lossless and dependency-preserving; BCNF is lossless but may lose dependencies",
      ],
    },
    {
      heading: "SQL essentials",
      points: [
        "DDL: CREATE, ALTER, DROP, TRUNCATE; DML: SELECT, INSERT, UPDATE, DELETE; DCL: GRANT, REVOKE; TCL: COMMIT, ROLLBACK, SAVEPOINT",
        "DELETE removes chosen rows and can be rolled back; TRUNCATE removes all rows quickly; DROP removes the table itself",
        "Logical order: FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT",
        "Joins: INNER keeps matches; LEFT/RIGHT keep all of one side with NULLs; FULL keeps both; CROSS gives m × n rows",
        "UNION removes duplicates, UNION ALL keeps them; INTERSECT and EXCEPT also remove duplicates",
        "Correlated subquery reruns for each outer row; EXISTS stops at the first match",
      ],
    },
    {
      heading: "NULLs and aggregates",
      points: [
        "Any comparison with NULL is UNKNOWN; WHERE keeps only TRUE rows; use IS NULL",
        "`x NOT IN (1, NULL)` is never TRUE, so it returns no rows – use NOT EXISTS",
        "COUNT(*) counts rows; COUNT(col), SUM, AVG, MIN, MAX ignore NULLs",
        "On an empty set COUNT is 0 but SUM, AVG and MAX are NULL",
        "GROUP BY, DISTINCT and set operators treat all NULLs as one group",
      ],
    },
    {
      heading: "Transactions and concurrency",
      points: [
        "ACID: atomicity (all or nothing), consistency, isolation, durability",
        "Conflicting operations: same item, different transactions, at least one write",
        "Conflict serializable ⇔ precedence graph has no cycle; every conflict-serializable schedule is view serializable",
        "Basic 2PL (growing then shrinking) ensures conflict serializability but allows deadlock and cascading rollback; strict 2PL holds write locks till commit",
        "Isolation levels: read uncommitted (dirty reads) → read committed → repeatable read (stops non-repeatable reads) → serializable (stops phantoms)",
        "Deadlock prevention by timestamps: wait-die (older waits) and wound-wait (older pre-empts)",
      ],
    },
    {
      heading: "Indexing, recovery and window functions",
      points: [
        "B+ tree: data pointers only in leaves, leaves linked for range scans; one clustered index per table",
        "Dense index has an entry per record; sparse index per block (needs sorted data)",
        "Recovery uses write-ahead logging: undo uncommitted, redo committed transactions after the last checkpoint",
        "ROW_NUMBER never ties; RANK leaves gaps after ties (1, 1, 3); DENSE_RANK does not (1, 1, 2)",
        "SUM() OVER (ORDER BY x) is a running total that includes all rows tied on x",
      ],
    },
  ],
  formulas: [
    "Number of super keys with one candidate key of k attributes in n attributes = 2^(n − k)",
    "Rows in a CROSS JOIN of m and n rows = m × n; LEFT JOIN rows ≥ rows in the left table",
    "BCNF ⊂ 3NF ⊂ 2NF ⊂ 1NF",
  ],
  traps: [
    "Filtering on an aggregate in WHERE instead of HAVING",
    "Using = NULL instead of IS NULL",
    "Using NOT IN against a subquery that can return NULL",
    "Assuming 2PL prevents deadlocks",
    "Thinking AVG(col) divides by all rows – it divides by non-NULL rows only",
  ],
  examTips: [
    "Placement tests give a 4–6 row table and ask the output of a query with GROUP BY, joins or window functions – compute it on paper",
    "Normalization questions give a relation with FDs and ask the candidate key or the highest normal form",
    "Interviews almost always ask ACID, DELETE vs TRUNCATE vs DROP, and the types of joins",
  ],
};

export default notes;
