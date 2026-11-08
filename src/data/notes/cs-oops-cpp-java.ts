import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Four pillars",
      points: [
        "Encapsulation: bundle data with methods and hide it behind private fields and public methods",
        "Abstraction: expose what an object does, not how – abstract classes and interfaces",
        "Inheritance: a derived class reuses and extends a base class ('is-a'); composition is 'has-a'",
        "Polymorphism: compile-time (overloading, C++ templates and operator overloading) and run-time (overriding with dynamic dispatch)",
      ],
    },
    {
      heading: "Constructors and destructors",
      points: [
        "Construction runs base → derived; destruction runs derived → base (C++)",
        "The compiler supplies a default constructor only if you declare no constructor at all",
        "C++ copy constructor takes `const T&`; taking T by value would recurse forever",
        "Delete through a base pointer without a virtual destructor → derived destructor skipped (undefined behaviour)",
        "Java: `this(...)` or `super(...)` must be the first statement; Java has no destructors – the garbage collector frees memory",
        "Calling an overridable method from a constructor: Java runs the derived version (fields still default), C++ runs the base version",
      ],
    },
    {
      heading: "Overloading vs overriding",
      points: [
        "Overloading: same name, different parameter list, chosen at compile time from declared types",
        "Return type alone cannot distinguish overloads",
        "Overriding: same signature in a subclass, chosen at run time from the actual object",
        "Overriding cannot reduce visibility or (Java) throw broader checked exceptions; covariant return types are allowed",
        "Static and private methods and fields are not polymorphic – a static method with the same signature hides, not overrides",
        "In C++ only `virtual` functions dispatch dynamically; non-virtual calls use the pointer's declared type",
        "Java overload choice: exact match → widening → boxing → varargs; `null` goes to the most specific type",
      ],
    },
    {
      heading: "Inheritance, abstract classes and interfaces",
      points: [
        "Java: one superclass, many interfaces; C++: multiple inheritance, diamond fixed with `virtual` base classes",
        "C++ pure virtual `virtual void f() = 0;` makes a class abstract; it cannot be instantiated",
        "Java abstract class may have constructors, state and concrete methods; interfaces have public static final fields",
        "Java 8+ interfaces allow default and static methods; Java 9+ allows private methods",
        "Access: private (class), default/package-private (package, Java), protected (package + subclasses in Java; subclasses in C++), public",
        "`final` class cannot be extended, `final` method cannot be overridden; C++ `friend` gives access to private members",
      ],
    },
    {
      heading: "Java strings, wrappers and collections",
      points: [
        "Strings are immutable; literals are pooled, so `\"ab\" == \"ab\"` is true but `new String(\"ab\") == \"ab\"` is false",
        "Use `equals` for content; overriding `equals` requires overriding `hashCode` consistently",
        "StringBuilder is mutable and unsynchronised; StringBuffer is mutable and synchronised",
        "Integer cache −128 to 127: `Integer a = 127, b = 127; a == b` is true, for 128 it is false",
        "HashMap allows one null key and is unordered; TreeMap is sorted and rejects null keys; LinkedHashMap keeps insertion order",
        "ArrayList: O(1) random access; LinkedList: O(1) insert/remove at ends",
      ],
    },
    {
      heading: "Exceptions",
      points: [
        "Checked exceptions (IOException) must be caught or declared; unchecked (RuntimeException, Error) need not",
        "Catch subclasses before superclasses, otherwise the later catch is unreachable – compile error",
        "`finally` runs even after `return`; a return in finally overrides the try's return",
        "try-with-resources closes resources in reverse order of opening, before catch and finally run",
      ],
    },
  ],
  formulas: [
    "Compile time: overloading, field access, static methods; run time: overridden instance methods",
    "Base* p = new Derived; p->f() calls Derived::f only if f is virtual",
    "Constructor order: base → members → derived body; destructor order is the exact reverse",
  ],
  traps: [
    "Expecting field access through a base reference to see the subclass field",
    "Thinking a static method can be overridden",
    "Comparing Strings or Integers above 127 with ==",
    "Forgetting the virtual destructor in a polymorphic C++ base class",
    "Assuming the default constructor still exists after adding a parameterised one",
  ],
  examTips: [
    "Placement tests (TCS, Infosys, Wipro, Cognizant) mix definition MCQs with 'what does this print' on inheritance and dispatch",
    "For output questions, first ask: is this overloading (declared type) or overriding (actual object)?",
    "Interviews follow up with 'difference between abstract class and interface' and 'why equals/hashCode together'",
  ],
};

export default notes;
