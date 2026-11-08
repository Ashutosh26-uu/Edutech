import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Operators and precedence",
      points: [
        "Order (high → low): postfix `++ --` → unary `! ~ ++ -- * & sizeof` → `* / %` → `+ -` → `<< >>` → relational → `== !=` → `&` → `^` → `|` → `&&` → `||` → `?:` → assignment → comma",
        "`x & 1 == 0` parses as `x & (1 == 0)`; `1 << 2 + 1` is `1 << 3` = 8",
        "`a = 1, 2;` sets a to 1 (assignment beats comma); `a = (1, 2);` sets a to 2",
        "Integer division truncates toward zero: −7 / 2 = −3, −7 % 2 = −1 (sign of the dividend)",
        "`&&`/`||` short-circuit; `sizeof(i++)` does not evaluate i++",
        "Modifying a variable twice without a sequence point (`i = i++ + ++i`) is undefined behaviour – choose 'undefined' if offered",
      ],
    },
    {
      heading: "Types and conversions",
      points: [
        "Typical sizes on 32/64-bit compilers: char 1, short 2, int 4, float 4, double 8; pointer 4 or 8",
        "Mixed signed/unsigned comparison converts to unsigned: `-1 < sizeof(int)` is false",
        "Unsigned arithmetic wraps around; `unsigned char c = 256` stores 0",
        "`printf` returns the number of characters printed; `scanf` returns the number of items read",
        "`switch` falls through to the next case unless there is a `break`",
      ],
    },
    {
      heading: "Pointers and arrays",
      points: [
        "`a[i]` ≡ `*(a + i)` ≡ `i[a]`; the array name decays to a pointer to its first element",
        "`p + 1` moves by `sizeof(*p)` bytes; for `int a[5]`, `&a + 1` skips all 20 bytes",
        "Inside a function an array parameter is a pointer, so `sizeof(arr)` gives the pointer size",
        "`*p++` reads *p then advances p; `(*p)++` increments the pointed value",
        "`const int *p` – value is read-only; `int *const p` – pointer is fixed",
        "Dangling pointer: returning the address of a local; NULL dereference and wild pointers crash or misbehave",
      ],
    },
    {
      heading: "Strings",
      points: [
        "A literal of n characters occupies n + 1 bytes: `sizeof(\"abc\")` is 4, `strlen(\"abc\")` is 3",
        "`char s[] = \"hi\"` is a modifiable copy; `char *s = \"hi\"` points to a literal that must not be modified",
        "`strcmp` returns 0 for equal strings; comparing with `==` compares addresses",
      ],
    },
    {
      heading: "Storage classes and functions",
      points: [
        "auto (default local): garbage initial value, lives for one call",
        "static local: initialised once to 0 (or the given value) and keeps its value across calls, including recursive ones",
        "Global and static variables default to 0; `extern` declares without defining; `register` is a hint and you cannot take its address",
        "C passes arguments by value – to change the caller's variable, pass its address",
      ],
    },
    {
      heading: "Structures, unions and macros",
      points: [
        "Struct size includes padding for alignment, so it can exceed the sum of its members",
        "Union size is the largest member (rounded up for alignment); all members share the same memory",
        "Macros are pure text substitution: `#define SQ(x) x*x` makes `SQ(2+3)` = 2+3*2+3 = 11",
        "`SQ(i++)` increments i twice; always parenthesise the body and each parameter",
        "`#` turns a macro argument into a string; `##` pastes tokens together",
      ],
    },
  ],
  formulas: [
    "~x = −(x + 1); x << k = x × 2ᵏ; x >> k = x / 2ᵏ (non-negative x)",
    "Address of a[i][j] (row-major) = base + (i × cols + j) × element size",
    "Recursion with a static counter: one counter shared by every call",
  ],
  traps: [
    "Reading `x & 1 == 0` as `(x & 1) == 0`",
    "Using `sizeof` on an array parameter to get the element count",
    "Forgetting the '\\0' when sizing char arrays",
    "Expecting a macro to behave like a function with arguments that have side effects",
    "Assuming `char` is always signed – it is implementation-defined",
    "Comparing a negative int with an unsigned value or `sizeof` result",
  ],
  examTips: [
    "TCS NQT, Infosys, Wipro, Accenture and Capgemini technical MCQs are mostly 'predict the output' snippets in C",
    "Pointers, precedence, static variables and macros together cover most questions – practise each with tiny programs",
    "When an option says 'compile error' or 'undefined', check for modifying a literal, missing break, or double modification first",
  ],
};

export default notes;
