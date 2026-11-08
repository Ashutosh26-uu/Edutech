import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Numbers and operators",
      points: [
        "`/` always gives a float (`4 / 2` is `2.0`); `//` floors toward −∞, so `-7 // 2` is `-4`",
        "`%` takes the sign of the divisor: `-7 % 2` is `1`, `7 % -2` is `-1`",
        "`**` is right-associative and binds tighter than unary minus: `2 ** 3 ** 2` = 512, `-2 ** 2` = -4",
        "int has no overflow; `0.1 + 0.2 == 0.3` is False; `round(2.5)` is 2 (round half to even)",
        "bool is a subclass of int: `True + True` is 2, and `{1: 'a', True: 'b'}` has one key",
        "`and`/`or` return an operand, not a bool: `0 or 'x'` is `'x'`, `[] and 5` is `[]`",
        "Comparisons chain: `1 < x < 5` means `1 < x and x < 5`; `is` checks identity, `==` checks value",
      ],
    },
    {
      heading: "Strings, lists and slicing",
      points: [
        "Strings and tuples are immutable; lists, dicts and sets are mutable",
        "Slicing `s[a:b:c]` never raises IndexError; `s[::-1]` reverses; a slice of a list is a new (shallow) list",
        "`b = a` is an alias; `a[:]`, `list(a)` and `copy.copy(a)` are shallow; `copy.deepcopy` copies nested objects",
        "`[[0] * 3] * 3` repeats the same inner list three times – changing one row changes all",
        "`list.sort()` and `append()` return None; `sorted()` returns a new list",
        "`append(x)` adds one element; `extend(x)` adds each item; `lst += 'ab'` extends with 'a', 'b'",
      ],
    },
    {
      heading: "Dicts, sets and tuples",
      points: [
        "Dict keys must be hashable (no lists); dicts keep insertion order (Python 3.7+)",
        "`{}` is an empty dict, `set()` an empty set; `(5)` is an int, `(5,)` a tuple",
        "`d.get(k, default)` never raises; `d[k]` raises KeyError for a missing key",
        "A set removes duplicates and has no order or indexing; `1` and `1.0` are the same element",
      ],
    },
    {
      heading: "Functions, scope and closures",
      points: [
        "Name lookup is LEGB: Local → Enclosing → Global → Built-in",
        "Assigning to a name anywhere in a function makes it local; reading it before assignment gives UnboundLocalError",
        "`global` and `nonlocal` let a function rebind an outer name",
        "Default values are evaluated once at `def` time, so `def f(x=[])` shares one list across calls – use `x=None`",
        "`*args` collects a tuple, `**kwargs` a dict",
        "Closures bind late: `[lambda: i for i in range(3)]` all return 2; fix with `lambda i=i: i`",
      ],
    },
    {
      heading: "Iterators, generators and comprehensions",
      points: [
        "A function containing `yield` returns a generator; it is lazy and can be iterated only once",
        "`map`, `filter`, `zip` return one-shot iterators in Python 3; `zip` stops at the shortest input",
        "`range` is lazy but reusable – it is not a generator",
      ],
    },
    {
      heading: "Exceptions and classes",
      points: [
        "`try` → `except` (if error) → `else` (only if no error) → `finally` (always)",
        "A `return` in `finally` overrides any earlier return and swallows the exception",
        "Class attributes are shared; `obj.x = 5` creates an instance attribute that shadows the class one",
        "`super()` follows the MRO (C3 linearisation) of the actual object, not just the direct parent",
        "Defining `__eq__` without `__hash__` makes instances unhashable; `print` uses `__str__`, falling back to `__repr__`",
      ],
    },
  ],
  formulas: [
    "a == (a // b) * b + a % b for any ints a, b (b ≠ 0)",
    "Precedence (high → low): ** → unary − → * / // % → + − → comparisons → not → and → or",
    "Falsy values: 0, 0.0, '', [], (), {}, set(), None, False",
  ],
  traps: [
    "Expecting `-7 // 2` to be −3 (that is C's truncation, not Python's floor)",
    "Thinking `b = a` copies a list, or that a shallow copy protects nested lists",
    "Forgetting that `x = x.sort()` sets x to None",
    "Reusing an exhausted generator or map object and expecting the values again",
    "Expecting a mutable default argument to reset on each call",
  ],
  examTips: [
    "Most placement questions (TCS, Infosys, Accenture, Capgemini) show a 4–8 line snippet and ask the output – trace it line by line",
    "Expect at least one question each on floor division/modulo, mutable defaults, aliasing and late-binding closures",
    "Options often include 'Error' – check for TypeError (unhashable key, str + int) and UnboundLocalError before computing values",
  ],
};

export default notes;
