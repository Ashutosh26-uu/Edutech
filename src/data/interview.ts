// Interview-preparation guide for freshers in campus and off-campus placements.
// Original content written for this project. Model answers are meant to be adapted, not memorised.

export interface InterviewItem { q: string; a: string; tip?: string }
export interface InterviewSection { id: string; title: string; intro: string; items: InterviewItem[] }

export const INTERVIEW: InterviewSection[] = [
  {
    id: "hr",
    title: "HR round",
    intro:
      "The HR round checks whether you can communicate clearly, whether you will fit and stay, and whether anything in your profile is a risk. Each answer below gives a framework first and then a short sample you can rewrite in your own words.",
    items: [
      {
        q: "Tell me about yourself.",
        a: "Framework: present (who you are now) → past (two or three things that shaped you: projects, internship, a skill) → future (why this role fits). Keep it under 90 seconds and leave out family details unless asked. Sample: 'I'm a final-year B.Tech student in Computer Science from Pune. Over the last two years I've mostly worked on backend development; my final-year project is an attendance system built with Spring Boot and MySQL that our department now uses. I also did a two-month internship where I wrote REST APIs and learned how code reviews work in a real team. I enjoy turning a vague problem into working software, and that's why a developer role here interests me.'",
        tip: "Don't recite your resume line by line; pick the two things you most want them to ask about next.",
      },
      {
        q: "What are your strengths?",
        a: "Framework: name one or two strengths that matter for the job and back each with a small, concrete example. Sample: 'I'm persistent with problems that don't work the first time. During my project, our app crashed only on certain phones; I spent two evenings reading logs and found it was a date-format issue on older Android versions. I'm also comfortable explaining technical things simply, which helped when I taught juniors basic Git in our coding club.'",
        tip: "Do attach evidence to every strength; an adjective alone sounds memorised.",
      },
      {
        q: "What is your biggest weakness?",
        a: "Framework: a real but non-fatal weakness, what it cost you once, and what you are doing about it. Avoid fake weaknesses like 'I work too hard'. Sample: 'I used to hesitate to ask for help because I wanted to solve everything myself. In my internship I lost almost a day on a configuration issue my mentor fixed in ten minutes. Now I give myself a time limit, usually an hour, and if I'm stuck I ask with a clear summary of what I've already tried.'",
        tip: "Don't name a weakness that is a core requirement of the role, such as poor communication for a client-facing job.",
      },
      {
        q: "Why do you want to join our company?",
        a: "Framework: one point about the company (its work, domains, training approach, scale), one point about you (skill or interest that matches), and one point about growth. Do ten minutes of research on their website and recent news before the interview. Sample: 'I read that your company works with clients in banking and healthcare, and I'm interested in building systems where reliability really matters. I also like that freshers go through structured training before projects, because I'd rather learn the right practices early. Long term, I want to grow into someone who understands both the technology and the client's business.'",
        tip: "Don't say 'because it is a big brand'; name something specific you found.",
      },
      {
        q: "Why should we hire you?",
        a: "Framework: match two or three of your qualities to what the role needs, and end with attitude. Sample: 'You need freshers who can pick up new technologies quickly and work in teams. I learned React on my own in a month for our project, and I've worked in a four-member team where I handled integration between front end and back end. I'm also willing to start wherever I'm most needed and learn from there.'",
        tip: "Do keep it to 30–40 seconds; confidence, not arrogance.",
      },
      {
        q: "Are you willing to relocate?",
        a: "Framework: answer honestly. Most service companies place freshers based on project needs, so a flat 'no' can end the conversation. If you have a genuine constraint, state it calmly and show flexibility elsewhere. Sample: 'Yes, I'm open to relocating. I see it as a chance to work with different teams. I've already lived away from home during college, so adjusting to a new city isn't a concern for me.'",
        tip: "Don't say yes if you truly cannot relocate; a reneged offer later hurts more.",
      },
      {
        q: "Are you comfortable working in night shifts or rotational shifts?",
        a: "Framework: say what you can genuinely do, and show you understand why shifts exist (global clients, support coverage). Sample: 'Yes, I understand that many projects support clients in other time zones, and I'm comfortable with rotational shifts. I'd just like to know the typical schedule in advance so I can plan my routine and stay productive.'",
        tip: "Do ask a clarifying question if needed, but don't negotiate shifts in the first round.",
      },
      {
        q: "Are you okay with signing a service agreement or bond?",
        a: "Framework: show that you plan to stay and learn, and that you have read or will read the terms. Sample: 'Yes. I'm looking to build my career here for the next few years, not leave after training, so an agreement doesn't worry me. I'd like to read the exact terms in the offer letter so I fully understand them.'",
        tip: "Do read every clause of any agreement before signing; never sign a blank or unclear document.",
      },
      {
        q: "What are your salary expectations?",
        a: "Framework: for campus roles the package is usually fixed and announced in advance, so show that you know this and focus on learning. For off-campus roles, research the typical range for the role and give a range rather than a single figure. Sample: 'For this role I understand the package is already defined for freshers, and I'm comfortable with it. At this stage my priority is the training and the kind of projects I'll get to work on.'",
        tip: "Don't quote a number you haven't researched, and don't sound like money is your only reason.",
      },
      {
        q: "There is a gap in your education. Can you explain it?",
        a: "Framework: state the reason briefly and honestly (health, family, exam preparation, financial), then show what you did during that time and that it is behind you. Sample: 'After 12th I took a year to prepare for engineering entrance exams. I didn't get the college I aimed for, but that year taught me discipline and how to study consistently. I also learned basic Python on my own during that time, which made my first year much easier.'",
        tip: "Don't over-explain or sound apologetic; one honest sentence plus what you learned is enough.",
      },
      {
        q: "Tell me about a failure and what you learned from it.",
        a: "Framework: pick a real setback, own your part, and focus most of the answer on what changed afterwards. Sample: 'In my third year, I volunteered to lead our hackathon team and tried to build too many features. At the demo, the core feature didn't work. I realised I had planned features, not priorities. In the next hackathon, we agreed on one must-have feature on day one, finished it first, and we reached the finals.'",
        tip: "Don't blame teammates or teachers; interviewers listen for ownership.",
      },
      {
        q: "Are you planning to go for higher studies?",
        a: "Framework: if your plan is to work, say so clearly. If you may study later, frame it as something that adds to your work, not as an exit plan. Sample: 'Right now my focus is on gaining industry experience. If I study further in the future, it would be after a few years of work, and ideally something like a part-time or company-supported programme that helps me in my role.'",
        tip: "Don't say you are preparing for GATE or CAT 'just in case'; it signals you may leave soon.",
      },
      {
        q: "Where do you see yourself in five years?",
        a: "Framework: show direction without naming an exact title: become strong technically, take ownership, maybe guide juniors. Sample: 'In five years I'd like to be someone the team relies on for a particular area, maybe a domain like cloud or data, and be trusted to own features end to end. I'd also like to be mentoring new joiners the way I hope someone will mentor me.'",
        tip: "Don't say 'in your chair' or 'running my own startup'; keep it tied to growth in this company.",
      },
      {
        q: "What do you know about our company?",
        a: "Framework: cover three things: what they do (services, products, domains), something recent (an expansion, a project area, a value they talk about), and how it connects to you. Sample: 'You're an IT services company working across industries like banking, retail and manufacturing, with a large focus on cloud and digital transformation. I read about your training programme for new hires. That appeals to me because I want to build strong fundamentals before working on client projects.'",
        tip: "Do check the company's own website before the interview; don't guess numbers you aren't sure about.",
      },
      {
        q: "Do you have any other offers?",
        a: "Framework: be honest without sounding like you are bargaining. Sample if you have one: 'Yes, I have an offer from another company, but this role interests me more because of the kind of work and training. I'd be happy to join here.' Sample if you don't: 'Not yet. I've been selective about where I apply, and this is one of the companies I was most keen on.'",
        tip: "Don't invent offers to seem in demand; placement cells often know.",
      },
      {
        q: "How do you handle pressure or tight deadlines?",
        a: "Framework: describe your method (break work down, prioritise, communicate early) and give one example. Sample: 'I break the work into small tasks and do the riskiest part first. During end-semester exams I also had a project submission; I made a day-by-day plan, finished the project core in the first week, and kept the documentation for the last two days. If I see I'll miss a deadline, I'd rather tell my lead early than surprise them.'",
        tip: "Do mention communicating early; that is what managers most want to hear.",
      },
      {
        q: "Do you prefer working alone or in a team?",
        a: "Framework: show you can do both, with a slight lean towards teamwork since most roles require it. Sample: 'I'm comfortable either way. For focused work like debugging I like to concentrate alone, but I enjoy team projects because others catch things I miss. In my project, our daily ten-minute check-ins saved us from building the same thing twice.'",
        tip: "Don't say you dislike teams, even jokingly.",
      },
      {
        q: "Why did you choose engineering or computer science?",
        a: "Framework: an honest origin (curiosity, a person, a moment), and how your interest grew once you started. It is fine if the start was ordinary. Sample: 'Honestly, I chose it partly because my cousin was in IT and it seemed like a good career. But in my first semester I wrote a small program that calculated my attendance percentage, and I liked that I could build something useful myself. Since then I've been more interested every year.'",
        tip: "Do be honest; a genuine ordinary story beats a dramatic made-up one.",
      },
      {
        q: "Your branch is not computer science. Why IT?",
        a: "Framework: acknowledge your branch, show what you did to build IT skills, and connect your branch knowledge as an advantage. Sample: 'I'm from electronics, and I enjoyed the programming parts of my course most, like microcontroller coding. I've since completed online courses in Java and DBMS and built two small web projects. My electronics background also helps me think about how software interacts with hardware.'",
        tip: "Do show proof of effort: courses, projects, coding practice.",
      },
      {
        q: "How do you keep yourself updated with technology?",
        a: "Framework: name a couple of real habits, not a long list. Sample: 'I follow a couple of developer newsletters and watch conference talks when a topic interests me. Recently I tried building a small app with a new framework over a weekend just to see how it works. I learn best by building something small rather than only reading.'",
        tip: "Don't name a source you can't discuss; they may ask what you read last week.",
      },
      {
        q: "What motivates you?",
        a: "Framework: one intrinsic motivator (learning, solving problems) and one about impact or people. Sample: 'I'm motivated when I solve something that seemed hard at first. I also like seeing people actually use what I built; when our department started using our attendance app, that felt better than any marks.'",
        tip: "Do keep it genuine and short.",
      },
      {
        q: "What would you do if you disagreed with your manager?",
        a: "Framework: listen first, raise the concern privately with facts, accept the final decision once heard. Sample: 'I'd first make sure I understood their reasoning. If I still thought there was a problem, I'd explain my concern privately, with data or an example. If they decided to go ahead anyway, I'd support the decision fully, because they may have context I don't.'",
        tip: "Don't say you'd never disagree; it sounds passive.",
      },
      {
        q: "How would your friends or teachers describe you?",
        a: "Framework: two or three words, each with a reason someone would actually say it. Sample: 'My friends would say I'm reliable, because when we split work for assignments, mine is done on time. My project guide would probably say I ask a lot of questions, sometimes too many, but that it helped us find issues early.'",
        tip: "Do pick traits that match what you said earlier in the interview.",
      },
      {
        q: "Tell me about your hobbies or interests outside studies.",
        a: "Framework: one or two real hobbies, with a line on what they give you. Sample: 'I play badminton most evenings, which helps me reset after long screen time. I also like cooking; it's a bit like debugging, because when something tastes wrong you have to figure out which step caused it.'",
        tip: "Don't list a hobby you can't talk about for two minutes; follow-up questions are common.",
      },
      {
        q: "Do you have any questions for us?",
        a: "Framework: always ask one or two thoughtful questions about the role, team, or learning, never only about leave or salary. Good options: 'What does the training period look like for new joiners?', 'What skills would help me contribute faster in the first few months?', or 'What do people who do well here have in common?'. Sample: 'Yes, what would you suggest I learn or practise before joining, so I can start contributing quickly?'",
        tip: "Don't say 'No, nothing'; it can read as lack of interest.",
      },
    ],
  },
  {
    id: "behavioural",
    title: "Behavioural & situational (STAR)",
    intro:
      "Behavioural questions ask what you did; situational questions ask what you would do. Answer with STAR: Situation (one line of context), Task (your responsibility), Action (what you specifically did, the longest part), Result (outcome, ideally measurable, plus what you learned).",
    items: [
      {
        q: "Describe a time you worked in a team that had a conflict.",
        a: "Situation: in our mini project, two teammates disagreed on whether to use Firebase or our own backend. Task: as the person handling integration, I needed us to decide quickly. Action: I asked each to write down three pros and cons in a shared document, and we compared them against our deadline and our guide's requirement to show database design. Result: we chose our own backend with MySQL, both agreed because the reasoning was visible, and we submitted on time.",
        tip: "Do show how you moved the team forward, not who was right.",
      },
      {
        q: "Tell me about a time you took initiative.",
        a: "Situation: our college lab had no system to book computers for project work, so students queued. Task: nobody had asked, but I wanted to fix it. Action: I built a simple booking form with Google Sheets and a small script, then showed it to the lab in-charge. Result: it was used for the whole semester, waiting time dropped, and I learned that small tools can solve real problems.",
        tip: "Do pick something you started without being told to.",
      },
      {
        q: "Describe a situation where you had to learn something quickly.",
        a: "Situation: two weeks before our project review, our guide asked us to add charts to the dashboard. Task: I had never used a charting library. Action: I spent two days on the official documentation and built three throwaway examples before touching our code, then integrated it. Result: the charts were ready for the review, and I now start any new tool with small experiments first.",
        tip: "Do describe your learning method, not just that you learned it.",
      },
      {
        q: "Tell me about a time you made a mistake. How did you handle it?",
        a: "Situation: during my internship I pushed code that broke a feature in the test environment. Task: I needed to fix it and make sure it didn't happen again. Action: I told my mentor immediately, reverted my change, found that I hadn't run the full test suite, then fixed the bug and added a test for that case. Result: it was fixed within an hour, and I've run the full tests before every push since.",
        tip: "Do report the mistake quickly in your story; hiding it is the real red flag.",
      },
      {
        q: "Describe a time you had to meet a very tight deadline.",
        a: "Situation: our hackathon problem statement changed with 18 hours left. Task: I owned the backend. Action: we listed features, kept only the two essential ones, and I wrote the APIs first so the front-end teammate wasn't blocked; we checked progress every three hours. Result: we demoed a working product and placed in the top five, and I learned to cut scope early instead of rushing everything.",
        tip: "Don't make the story about heroically staying up all night; focus on prioritising.",
      },
      {
        q: "Tell me about a time you helped a struggling teammate.",
        a: "Situation: a teammate in our project was falling behind on the database part. Task: we shared a deadline, so his delay was my problem too. Action: I sat with him for two evenings, explained joins and normalisation with our own tables, and we split his remaining work so he kept the parts he understood. Result: we finished on time, and he later handled the database viva questions confidently.",
        tip: "Do show respect for the teammate; don't portray them as incompetent.",
      },
      {
        q: "Describe a time you received critical feedback.",
        a: "Situation: after my first internship presentation, my mentor said it was too detailed and hard to follow. Task: I had another presentation in two weeks. Action: I asked what a good presentation looked like to him, then restructured mine as problem, approach, result, with details only in backup slides. Result: the second one went well, and I now always ask 'what does the listener need?' first.",
        tip: "Do show you welcomed feedback and changed something concrete.",
      },
      {
        q: "Tell me about a time you led a group.",
        a: "Situation: I coordinated a coding contest for our college fest. Task: I had a six-person team and two weeks. Action: I split work into problem setting, platform setup and publicity, set a short daily check-in, and stepped in where we were behind, mainly testing problems. Result: over 200 students participated without platform issues, and I learned that leading is mostly about removing blockers for others.",
        tip: "Do talk about how you supported others, not just how you gave instructions.",
      },
      {
        q: "What would you do if you were given a task you didn't know how to do?",
        a: "I'd first make sure I understood what was expected and by when. Then I'd spend a limited time researching on my own, through documentation, internal wikis or existing code, so I come with specific questions. If I'm still stuck, I'd ask a teammate or my lead, explaining what I've tried. I'd also keep my lead updated so the deadline isn't at risk.",
        tip: "Do show a balance between independence and asking for help.",
      },
      {
        q: "What would you do if a teammate isn't doing their share of the work?",
        a: "I'd first talk to them privately, because there may be a reason I don't know, like a personal issue or confusion about the task. I'd try to agree on clear deliverables and dates together. If the problem continued and affected the project, I'd raise it with the lead, focusing on the work rather than blaming the person.",
        tip: "Don't jump straight to complaining to the manager.",
      },
      {
        q: "What would you do if a client or senior asked for something you think is wrong?",
        a: "I'd make sure I understood the request and the reason behind it. If I still saw a problem, like a security risk or a bug, I'd politely explain my concern with facts and suggest an alternative. If it was beyond my authority, I'd involve my lead. If it was simply a preference I disagreed with, I'd go with their decision.",
        tip: "Do separate 'I prefer differently' from 'this will cause harm'.",
      },
      {
        q: "What would you do if you realised you would miss a deadline?",
        a: "I'd inform my lead as soon as I realised, not on the deadline day. I'd explain why, what is already done, and give a realistic new estimate or options, such as delivering the core part first. Then I'd focus on reducing the delay and keep them updated.",
        tip: "Do emphasise early communication; surprises are what managers dislike most.",
      },
      {
        q: "Tell me about a time you went beyond what was expected.",
        a: "Situation: in my internship I was asked to fix one bug in a report export. Task: just that fix. Action: while testing, I noticed the same date-format issue in two other exports, so I told my mentor, and with his approval fixed all three and added a shared helper function. Result: the team avoided future bug reports on the same issue, and my mentor started giving me larger tasks.",
        tip: "Do mention you checked before expanding scope; going beyond shouldn't mean going rogue.",
      },
      {
        q: "Describe a time you had to adapt to a big change.",
        a: "Situation: our internship moved from in-office to fully remote in the second week. Task: I had to keep learning without sitting next to my mentor. Action: I started writing a short daily update, kept a list of questions to ask in one call instead of many messages, and recorded my screen when explaining bugs. Result: my mentor said my updates made remote mentoring easy, and I still use the daily-notes habit.",
        tip: "Do show a positive, practical response to change.",
      },
      {
        q: "How would you handle multiple tasks with the same deadline?",
        a: "I'd list all the tasks with their effort and impact, and check with my lead which matters most to the team or client. I'd then work on the highest-priority one first, and if two were equally urgent, I'd see if part of the work could be shared or one deadline moved. I'd keep everyone informed about what is done and what is pending.",
        tip: "Do mention checking priorities with your lead instead of guessing.",
      },
    ],
  },
  {
    id: "oop",
    title: "OOP concepts",
    intro:
      "OOP questions come up in almost every technical round. Interviewers want a clear definition, a real example, and ideally a line of code or a language-specific detail. Prepare in the language you listed on your resume.",
    items: [
      {
        q: "What is object-oriented programming?",
        a: "OOP is a way of designing programs around objects, which bundle data (fields) and the behaviour that works on that data (methods). Instead of writing a sequence of functions acting on separate data, you model entities like `Student` or `BankAccount`. Its four main pillars are encapsulation, abstraction, inheritance and polymorphism. It helps with reusability, organising large codebases and modelling real-world problems.",
        tip: "Do name the four pillars and be ready for a follow-up on each.",
      },
      {
        q: "What is the difference between a class and an object?",
        a: "A class is a blueprint that defines what data and methods its objects will have; an object is an actual instance created from that blueprint, occupying memory. For example, `Car` is a class, while `Car myCar = new Car();` creates an object. Many objects can be created from one class, each with its own state.",
        tip: "Do give the blueprint-versus-house analogy plus one line of code.",
      },
      {
        q: "What is encapsulation?",
        a: "Encapsulation means bundling data and methods together and restricting direct access to the data. Typically fields are `private` and accessed through public methods like getters and setters, which can validate input. For example, a `BankAccount` keeps `balance` private and only allows changes through `deposit()` and `withdraw()`, which can reject negative amounts. It protects the object's internal state and lets you change the implementation without affecting callers.",
        tip: "Do mention validation in setters; that is why encapsulation matters.",
      },
      {
        q: "What is abstraction, and how is it different from encapsulation?",
        a: "Abstraction means exposing only what an object does and hiding how it does it, like using a car's steering without knowing the gear mechanism. In code it is achieved with abstract classes and interfaces. Encapsulation is about hiding and protecting data inside a class. Simply put, abstraction is a design-level idea about what to show, while encapsulation is the implementation-level way of hiding the details.",
        tip: "Don't say they are the same; this comparison is a favourite follow-up.",
      },
      {
        q: "What is inheritance? What are its types?",
        a: "Inheritance lets a class acquire the fields and methods of another class, representing an 'is-a' relationship, such as `Dog extends Animal`. It enables code reuse and is the base for runtime polymorphism. Types include single, multilevel (A → B → C), hierarchical (one parent, many children), multiple (one child, many parents) and hybrid. Java does not allow multiple inheritance of classes but allows it through interfaces; C++ and Python allow multiple inheritance of classes.",
        tip: "Do mention why Java avoids multiple class inheritance: the diamond problem.",
      },
      {
        q: "What is polymorphism? Explain compile-time and runtime polymorphism.",
        a: "Polymorphism means one interface with many forms: the same method call behaves differently depending on the object. Compile-time polymorphism is method overloading, where the compiler picks the method based on parameter types or count. Runtime polymorphism is method overriding, where a subclass provides its own version and the JVM decides which to call based on the actual object, as in `Animal a = new Dog(); a.sound();` calling `Dog`'s version.",
        tip: "Do give the parent-reference, child-object example; it is what interviewers look for.",
      },
      {
        q: "What is the difference between method overloading and overriding?",
        a: "Overloading is having multiple methods with the same name in the same class but different parameter lists; it is resolved at compile time. Overriding is a subclass redefining a parent method with the same signature; it is resolved at runtime. Overloading cannot be done by changing only the return type. In overriding, the access level cannot be more restrictive, and `static`, `private` and `final` methods cannot be overridden.",
        tip: "Do mention that return type alone cannot overload a method.",
      },
      {
        q: "What is the difference between an abstract class and an interface?",
        a: "An abstract class can have both abstract and concrete methods, instance variables, and constructors; a class can extend only one. An interface defines a contract; in Java its fields are `public static final` and since Java 8 it can have `default` and `static` methods, and a class can implement many interfaces. Use an abstract class when related classes share code and state, and an interface when unrelated classes should share a capability, like `Comparable`.",
        tip: "Do end with when you would choose each; that shows understanding beyond definitions.",
      },
      {
        q: "What is a constructor? Can it be private?",
        a: "A constructor is a special method with the same name as the class and no return type, called automatically when an object is created to initialise it. If you write none, the compiler provides a default no-argument constructor. Constructors can be overloaded, but not inherited or overridden. A constructor can be private, which prevents outside code from creating objects; this is used in the Singleton pattern and utility classes.",
        tip: "Do connect private constructors to Singleton; it is a common next question.",
      },
      {
        q: "What are access modifiers?",
        a: "Access modifiers control visibility. In Java, `private` is visible only within the class, default (no keyword) within the same package, `protected` within the package and in subclasses, and `public` everywhere. C++ has `private`, `protected` and `public`, with class members private by default. Python has no enforced modifiers; a leading underscore is a convention for internal use and double underscore triggers name mangling.",
        tip: "Do know the default access level in the language on your resume.",
      },
      {
        q: "What is the `this` keyword, and what is `super`?",
        a: "`this` refers to the current object; it is used to distinguish fields from parameters with the same name, as in `this.name = name;`, and to call another constructor of the same class. `super` refers to the parent class; it is used to call the parent's constructor with `super(...)` or a parent method that the child has overridden. In Java, a call to `this()` or `super()` must be the first statement in a constructor.",
      },
      {
        q: "What is the diamond problem?",
        a: "The diamond problem occurs with multiple inheritance when class D inherits from B and C, and both inherit from A. If B and C override the same method from A, it is ambiguous which version D gets. C++ handles it with virtual inheritance, and Python uses its method resolution order. Java avoids it by not allowing multiple class inheritance; with interfaces that have conflicting default methods, the implementing class must override the method explicitly.",
      },
      {
        q: "What is the difference between composition and inheritance?",
        a: "Inheritance models an 'is-a' relationship, such as `Car` is a `Vehicle`, while composition models a 'has-a' relationship, such as `Car` has an `Engine`, by holding an object as a field. Composition is generally more flexible because you can swap parts and it avoids tight coupling to a parent class. A common design principle is to prefer composition over inheritance unless there is a true 'is-a' relationship.",
        tip: "Do mention 'prefer composition over inheritance'; it signals design maturity.",
      },
      {
        q: "What is a static member?",
        a: "A static field or method belongs to the class rather than to any object, so all objects share one copy. For example, a `static int count` can track how many objects were created. Static methods can be called without an object, like `Math.max()`, but they cannot directly access instance fields or use `this`. A static block in Java runs once when the class is loaded.",
      },
      {
        q: "What are SOLID principles? Explain briefly.",
        a: "SOLID is a set of five design principles. Single Responsibility: a class should have one reason to change. Open/Closed: open for extension, closed for modification. Liskov Substitution: a subclass should be usable wherever its parent is expected without breaking behaviour. Interface Segregation: prefer small, specific interfaces over one large one. Dependency Inversion: depend on abstractions, not concrete classes.",
        tip: "Do prepare one example for at least Single Responsibility; few freshers can give one.",
      },
    ],
  },
  {
    id: "dsa",
    title: "Data structures & algorithms",
    intro:
      "In interviews, DSA is often discussed verbally before or instead of coding. Explain the idea, state the time and space complexity, and mention trade-offs. Think aloud: interviewers judge your reasoning, not just the final answer.",
    items: [
      {
        q: "What is the difference between an array and a linked list?",
        a: "An array stores elements in contiguous memory, so access by index is O(1), but inserting or deleting in the middle is O(n) because elements must shift, and a static array's size is fixed. A linked list stores nodes anywhere in memory, each pointing to the next, so insertion or deletion at a known node is O(1), but accessing the k-th element is O(n). Arrays are also more cache-friendly. Use arrays for frequent random access and linked lists for frequent insertions and deletions.",
        tip: "Do mention cache locality; it shows you think beyond Big-O.",
      },
      {
        q: "What is time complexity, and what does Big-O mean?",
        a: "Time complexity describes how an algorithm's running time grows as the input size grows. Big-O gives an upper bound on that growth, ignoring constants and lower-order terms; for example, 3n² + 5n is O(n²). Common orders from fastest to slowest are O(1), O(log n), O(n), O(n log n), O(n²) and O(2ⁿ). We usually state the worst case unless asked otherwise.",
      },
      {
        q: "What is the difference between a stack and a queue? Give uses.",
        a: "A stack is LIFO: the last element pushed is the first popped, with push and pop at the top in O(1). A queue is FIFO: elements are added at the rear and removed from the front. Stacks are used for function calls, undo, expression evaluation and bracket matching. Queues are used in BFS, task scheduling, printer queues and buffering.",
        tip: "Do give one real-world and one algorithmic use for each.",
      },
      {
        q: "How would you check whether a string of brackets is balanced?",
        a: "I'd use a stack. Scan the string; on an opening bracket push it, and on a closing bracket check that the stack is not empty and its top is the matching opening bracket, then pop. If there's a mismatch or the stack is empty when a closing bracket arrives, it is unbalanced. At the end, the string is balanced only if the stack is empty. This is O(n) time and O(n) space.",
      },
      {
        q: "Explain binary search. When can it be used?",
        a: "Binary search works on a sorted array. Compare the target with the middle element; if equal you're done, if smaller search the left half, otherwise the right half. Each step halves the search space, so time is O(log n). Calculate the middle as `low + (high - low) / 2` to avoid integer overflow. More generally, it works on any problem where the answer space is monotonic, such as finding the minimum feasible value.",
        tip: "Do mention the overflow-safe mid formula; interviewers notice.",
      },
      {
        q: "Compare common sorting algorithms.",
        a: "Bubble, selection and insertion sort are O(n²); insertion sort is good for small or nearly sorted data and is stable. Merge sort is O(n log n) in all cases and stable but needs O(n) extra space. Quick sort is O(n log n) on average and in-place, but O(n²) in the worst case with bad pivots; random pivots make that unlikely. Heap sort is O(n log n) and in-place but not stable.",
        tip: "Do know which ones are stable and why that matters (sorting by multiple keys).",
      },
      {
        q: "How does quick sort work?",
        a: "Quick sort picks a pivot, partitions the array so smaller elements are on the left and larger on the right, which places the pivot in its final position, then recursively sorts both parts. Average time is O(n log n). The worst case O(n²) happens when the pivot is always the smallest or largest element, for example a sorted array with the first element as pivot. It is in-place apart from O(log n) recursion stack on average.",
      },
      {
        q: "What is a hash table, and how are collisions handled?",
        a: "A hash table stores key-value pairs; a hash function converts the key into an index in an array, giving average O(1) insert, search and delete. A collision happens when two keys map to the same index. Chaining stores colliding entries in a list at that index; open addressing finds another free slot using probing such as linear probing. When the load factor gets high, the table is resized and entries are rehashed. The worst case can degrade to O(n).",
        tip: "Do mention load factor and rehashing; it is the natural follow-up.",
      },
      {
        q: "How would you find two numbers in an array that add up to a target?",
        a: "The brute-force way checks every pair in O(n²). Better: use a hash set or map. For each element x, check whether target − x is already in the map; if yes, you've found the pair, otherwise add x. This is O(n) time and O(n) space. If the array is sorted, a two-pointer approach from both ends works in O(n) time and O(1) space.",
        tip: "Do start with brute force, then optimise; interviewers like to see the progression.",
      },
      {
        q: "How do you detect a cycle in a linked list?",
        a: "I'd use Floyd's algorithm with two pointers: slow moves one step and fast moves two steps. If there is a cycle, they eventually meet inside it; if fast reaches null, there is no cycle. It takes O(n) time and O(1) space. To find the start of the cycle, reset one pointer to the head and move both one step at a time; they meet at the cycle's start.",
      },
      {
        q: "How do you reverse a linked list?",
        a: "Iteratively, keep three pointers: `prev` starting as null, `curr` at the head, and `next`. In each step, save `curr.next`, point `curr.next` to `prev`, then move `prev` and `curr` forward. When `curr` becomes null, `prev` is the new head. It is O(n) time and O(1) space; a recursive version also works but uses O(n) stack space.",
      },
      {
        q: "What is a binary search tree?",
        a: "A BST is a binary tree where, for every node, all values in the left subtree are smaller and all in the right subtree are larger. This allows search, insert and delete in O(h), where h is the height. In a balanced tree h is O(log n), but if you insert sorted data it degrades to a linked list with O(n). Self-balancing trees like AVL and red-black trees keep the height O(log n). An inorder traversal of a BST gives sorted order.",
        tip: "Do mention the skewed-tree worst case and the inorder-gives-sorted property.",
      },
      {
        q: "Explain tree traversals.",
        a: "Depth-first traversals are inorder (left, root, right), preorder (root, left, right) and postorder (left, right, root). Preorder is useful for copying a tree, postorder for deleting it or evaluating expression trees, and inorder gives sorted output for a BST. Level-order traversal is breadth-first and uses a queue to visit nodes level by level. All of them take O(n) time.",
      },
      {
        q: "What is the difference between BFS and DFS?",
        a: "BFS explores a graph level by level using a queue, so in an unweighted graph it finds the shortest path in terms of edges. DFS goes as deep as possible along one path before backtracking, using recursion or a stack; it's useful for cycle detection, topological sort and connected components. Both take O(V + E) with an adjacency list. BFS can use more memory on wide graphs, while DFS can hit deep recursion on long paths.",
        tip: "Do say 'BFS gives shortest path in unweighted graphs'; it is the key distinction.",
      },
      {
        q: "What is a heap, and where is it used?",
        a: "A heap is a complete binary tree where each parent is smaller than its children (min-heap) or larger (max-heap). It is usually stored in an array, where for index i the children are at 2i+1 and 2i+2. Insert and remove-top take O(log n), and peeking at the top is O(1). Heaps implement priority queues and are used in heap sort, Dijkstra's algorithm, and problems like finding the k largest elements.",
      },
      {
        q: "What is recursion? What are its drawbacks?",
        a: "Recursion is when a function calls itself on a smaller version of the problem, with a base case that stops it. It makes problems like tree traversal, factorial and divide-and-conquer natural to write. Drawbacks: each call uses stack memory, so deep recursion can cause a stack overflow, and naive recursion can repeat work, like the exponential Fibonacci. Memoisation or converting to iteration fixes these.",
      },
      {
        q: "What is dynamic programming?",
        a: "Dynamic programming solves problems that have overlapping subproblems and optimal substructure by storing the results of subproblems so each is solved only once. Top-down uses recursion with memoisation; bottom-up fills a table iteratively. For example, Fibonacci goes from O(2ⁿ) to O(n). Classic DP problems include 0/1 knapsack, longest common subsequence, coin change and edit distance.",
        tip: "Do name both properties; that is how you recognise a DP problem.",
      },
      {
        q: "What is the difference between greedy algorithms and dynamic programming?",
        a: "A greedy algorithm makes the locally best choice at each step and never revisits it, which is fast but only correct when the problem has the greedy-choice property, as in activity selection or Dijkstra with non-negative weights. DP considers all relevant choices by combining stored subproblem results, so it is correct more often but usually slower. For example, fractional knapsack is solved greedily, but 0/1 knapsack needs DP.",
      },
      {
        q: "How would you find the first non-repeating character in a string?",
        a: "Make two passes. In the first, count the frequency of each character with a hash map or an array of size 26 for lowercase letters. In the second, scan the string again and return the first character whose count is 1. It is O(n) time and O(1) extra space for a fixed alphabet, or O(k) for k distinct characters.",
      },
      {
        q: "How would you find the maximum subarray sum?",
        a: "I'd use Kadane's algorithm. Keep a running sum `current` and the best sum `best`. For each element, set `current` to the larger of the element alone or `current` plus the element, then update `best`. It runs in O(n) time and O(1) space. If all numbers are negative, initialising `best` with the first element ensures the answer is the largest single element.",
        tip: "Do mention the all-negative edge case; it shows care with edge cases.",
      },
    ],
  },
  {
    id: "dbms",
    title: "DBMS & SQL",
    intro:
      "DBMS questions test core concepts (keys, normalisation, transactions) and practical SQL. Expect at least one query to write on paper or a shared screen, so practise joins, grouping and subqueries by hand.",
    items: [
      {
        q: "What is a DBMS, and how is an RDBMS different?",
        a: "A DBMS is software that stores, retrieves and manages data while handling concurrency, security and backup, instead of each program managing its own files. An RDBMS stores data in tables with rows and columns and relates tables through keys, using SQL for queries. Examples of RDBMS are MySQL, PostgreSQL, Oracle and SQL Server. RDBMS also enforce integrity constraints and support ACID transactions.",
      },
      {
        q: "Explain primary key, foreign key, candidate key and unique key.",
        a: "A candidate key is any minimal set of columns that uniquely identifies a row. The primary key is the candidate key chosen as the main identifier; it cannot be null and there is one per table. A unique key also enforces uniqueness but allows a null value (how many depends on the database) and a table can have several. A foreign key is a column that refers to the primary key of another table, enforcing referential integrity.",
        tip: "Do explain the primary-versus-unique difference clearly; it is very commonly asked.",
      },
      {
        q: "What is normalisation? Explain 1NF, 2NF and 3NF.",
        a: "Normalisation organises tables to reduce redundancy and avoid insert, update and delete anomalies. 1NF: every column holds atomic values, with no repeating groups. 2NF: in 1NF and no non-key column depends on only part of a composite primary key. 3NF: in 2NF and no non-key column depends on another non-key column, that is, no transitive dependency. BCNF is stricter: every determinant must be a candidate key.",
        tip: "Do prepare one small table example you can normalise step by step.",
      },
      {
        q: "What is denormalisation, and when is it used?",
        a: "Denormalisation intentionally adds redundancy, such as storing a customer's name in the orders table, to avoid expensive joins. It is used in read-heavy systems, reporting and data warehouses where query speed matters more than storage. The trade-off is that updates become harder because the same data must be kept consistent in multiple places.",
      },
      {
        q: "What are ACID properties?",
        a: "Atomicity: a transaction happens completely or not at all. Consistency: a transaction moves the database from one valid state to another, respecting constraints. Isolation: concurrent transactions don't interfere and behave as if run one after another. Durability: once committed, changes survive crashes. A bank transfer is the classic example: debit and credit must both happen or neither.",
        tip: "Do use the bank transfer example; it makes all four properties concrete.",
      },
      {
        q: "Explain the different types of joins.",
        a: "An inner join returns only rows with matching values in both tables. A left join returns all rows from the left table and matches from the right, with nulls where there is no match; a right join is the reverse. A full outer join returns all rows from both, with nulls where missing. A cross join gives the Cartesian product, and a self join joins a table with itself, for example employees with their managers.",
      },
      {
        q: "What is the difference between `DELETE`, `TRUNCATE` and `DROP`?",
        a: "`DELETE` is a DML command that removes selected rows using a `WHERE` clause, fires triggers and can be rolled back in a transaction. `TRUNCATE` removes all rows quickly, usually resets identity counters and is generally not filterable; whether it can be rolled back depends on the database. `DROP` removes the entire table, including its structure, indexes and constraints.",
      },
      {
        q: "What is the difference between `WHERE` and `HAVING`?",
        a: "`WHERE` filters individual rows before grouping and cannot use aggregate functions. `HAVING` filters groups after `GROUP BY` and can use aggregates like `COUNT` or `SUM`. For example, `WHERE salary > 30000` filters employees, while `HAVING COUNT(*) > 5` keeps only departments with more than five employees. A query can use both.",
      },
      {
        q: "What is an index? What are its pros and cons?",
        a: "An index is a separate data structure, usually a B-tree or B+ tree, that lets the database find rows without scanning the whole table, much like a book's index. It speeds up searches, joins and sorting on indexed columns. The downsides are extra storage and slower inserts, updates and deletes, because the index must also be updated. A clustered index determines the physical order of rows, so a table has only one; non-clustered indexes are separate structures pointing to rows.",
        tip: "Don't say 'index every column'; mention the write-cost trade-off.",
      },
      {
        q: "SQL: Find the second highest salary from an `Employee` table.",
        a: "One portable way is a subquery: `SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);`. This returns null if there is no second highest. Another way, which handles duplicates cleanly and generalises to the N-th highest, uses `DENSE_RANK()`: `SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk FROM Employee) t WHERE rnk = 2;`, adding `DISTINCT` if needed.",
        tip: "Do mention how duplicates affect the answer; that is what the interviewer is testing.",
      },
      {
        q: "SQL: Count employees in each department and show only departments with more than 3 employees.",
        a: "Group by department and filter groups with `HAVING`: `SELECT dept_id, COUNT(*) AS emp_count FROM Employee GROUP BY dept_id HAVING COUNT(*) > 3;`. To show department names, join first: `SELECT d.name, COUNT(e.id) AS emp_count FROM Department d JOIN Employee e ON e.dept_id = d.id GROUP BY d.name HAVING COUNT(e.id) > 3;`.",
      },
      {
        q: "SQL: Find duplicate email addresses in a `Users` table.",
        a: "Group by email and keep groups that appear more than once: `SELECT email, COUNT(*) AS times FROM Users GROUP BY email HAVING COUNT(*) > 1;`. If emails may differ only in letter case, group by `LOWER(email)` instead. To see the full duplicate rows, join this result back to `Users` on email.",
      },
      {
        q: "What is a view?",
        a: "A view is a virtual table defined by a stored `SELECT` query; it doesn't store data itself (except materialised views) and shows current data each time it is queried. Views simplify complex queries, provide security by exposing only certain columns, and present data in a consistent format. Simple views on one table can sometimes be updated, but views with joins or aggregates usually cannot.",
      },
      {
        q: "What are transaction isolation levels?",
        a: "Isolation levels balance consistency against concurrency. Read Uncommitted allows dirty reads. Read Committed prevents dirty reads but allows non-repeatable reads. Repeatable Read prevents non-repeatable reads but in the standard can still allow phantom reads. Serializable prevents all three by making transactions behave as if run one at a time, at the cost of performance.",
        tip: "Do define dirty read, non-repeatable read and phantom read alongside the levels.",
      },
      {
        q: "What is the difference between SQL and NoSQL databases?",
        a: "SQL databases are relational, use fixed schemas and tables, support joins and strong ACID transactions, and usually scale vertically, though they can be scaled out too. NoSQL databases include document, key-value, column-family and graph stores; they have flexible schemas and are designed to scale horizontally, often relaxing consistency. Use SQL for structured data with complex relationships like banking, and NoSQL for large-scale, rapidly changing or unstructured data like user activity feeds.",
      },
    ],
  },
  {
    id: "os",
    title: "Operating systems",
    intro:
      "OS questions focus on processes, threads, scheduling, memory and synchronisation. A good answer gives the definition, a simple example, and the reason the concept exists.",
    items: [
      {
        q: "What is an operating system? What are its main functions?",
        a: "An operating system is system software that sits between hardware and applications, managing resources and providing services to programs. Its main functions are process management, memory management, file system management, device and I/O management, and security. It also provides system calls so programs can request these services. Examples include Windows, Linux and macOS.",
      },
      {
        q: "What is the difference between a process and a thread?",
        a: "A process is a program in execution with its own memory space, resources and at least one thread. A thread is a lightweight unit of execution inside a process; threads of the same process share code, data and open files but have their own stack and registers. Creating and switching between threads is cheaper than processes, and they communicate easily through shared memory, but a bug in one thread can crash the whole process.",
        tip: "Do mention what threads share versus what they have separately.",
      },
      {
        q: "What is a context switch?",
        a: "A context switch is when the CPU stops running one process or thread and starts another. The OS saves the current one's state, such as registers, program counter and stack pointer, into its process control block, then loads the saved state of the next. It allows multitasking but is pure overhead, since no useful work is done during the switch. Thread switches within the same process are cheaper because the memory map doesn't change.",
      },
      {
        q: "Explain common CPU scheduling algorithms.",
        a: "FCFS runs processes in arrival order; it's simple but short jobs may wait behind long ones (convoy effect). SJF runs the shortest job first and minimises average waiting time, but needs burst-time estimates and can starve long jobs. Priority scheduling runs the highest priority first and can cause starvation, fixed by ageing. Round Robin gives each process a fixed time quantum in turn, which is fair and good for interactive systems; the quantum size matters.",
        tip: "Do mention starvation and ageing; it is the common follow-up.",
      },
      {
        q: "What is a deadlock? What are its necessary conditions?",
        a: "A deadlock is when a set of processes are each waiting for a resource held by another, so none can proceed. Four conditions must all hold: mutual exclusion, hold and wait, no preemption, and circular wait. For example, process A holds a printer and waits for a scanner, while B holds the scanner and waits for the printer. Breaking any one condition prevents deadlock.",
        tip: "Do name all four conditions; interviewers often ask for them by name.",
      },
      {
        q: "How can deadlocks be handled?",
        a: "There are four approaches. Prevention breaks one of the four conditions, for example by ordering resources so circular wait can't happen. Avoidance checks each request and grants it only if the system stays in a safe state, as in the Banker's algorithm. Detection and recovery lets deadlocks happen, detects them with a wait-for graph, then kills or rolls back a process. Many general-purpose systems simply ignore rare deadlocks, sometimes called the ostrich approach.",
      },
      {
        q: "What is the difference between a mutex and a semaphore?",
        a: "A mutex is a locking mechanism that allows only one thread into a critical section, and only the thread that locked it should unlock it. A semaphore is an integer counter with `wait` and `signal` operations; a counting semaphore allows up to N threads to access a resource at once, while a binary semaphore has values 0 and 1. Semaphores are also used for signalling between threads, such as in the producer-consumer problem.",
        tip: "Do mention ownership: a mutex has an owner, a semaphore does not.",
      },
      {
        q: "What is a race condition and a critical section?",
        a: "A race condition occurs when the result depends on the unpredictable order in which threads access shared data, for example two threads incrementing a counter at the same time and losing an update. A critical section is the part of code that accesses shared resources and must not be executed by more than one thread at a time. It is protected using mutexes, semaphores or other synchronisation, ensuring mutual exclusion, progress and bounded waiting.",
      },
      {
        q: "What is virtual memory?",
        a: "Virtual memory gives each process the illusion of a large, private address space, larger than physical RAM, by keeping only the needed pages in RAM and the rest on disk. Addresses used by programs are virtual and are translated to physical addresses by the MMU using page tables. It enables running large programs, isolates processes from each other, and makes memory allocation simpler. The cost is page faults when data must be fetched from disk.",
      },
      {
        q: "Explain paging and page faults.",
        a: "Paging divides virtual memory into fixed-size pages and physical memory into frames of the same size, so a process's memory doesn't need to be contiguous, avoiding external fragmentation. A page table maps pages to frames, and the TLB caches recent translations for speed. A page fault occurs when a program accesses a page not currently in RAM; the OS loads it from disk, possibly evicting another page using a replacement policy like LRU or FIFO.",
      },
      {
        q: "What is thrashing?",
        a: "Thrashing happens when a system spends more time swapping pages in and out of memory than executing processes, usually because too many processes are running and each doesn't have enough frames for its working set. CPU utilisation drops sharply even though the system looks busy. It can be fixed by reducing the number of running processes, adding RAM, or using working-set or page-fault-frequency based allocation.",
      },
      {
        q: "What is the difference between internal and external fragmentation?",
        a: "Internal fragmentation is wasted space inside an allocated block, when a process gets a larger block than it needs, such as unused space at the end of a fixed-size page. External fragmentation is when enough total free memory exists but it is scattered in small non-contiguous pieces, so a large request can't be satisfied. Paging removes external fragmentation but can cause internal; compaction or segmentation-plus-paging help with external.",
      },
    ],
  },
  {
    id: "cn",
    title: "Computer networks",
    intro:
      "Networking questions usually start with models and protocols and then move to 'what happens when…' questions. Be ready to explain layers, TCP versus UDP, DNS and HTTP in plain language.",
    items: [
      {
        q: "Explain the OSI model.",
        a: "The OSI model has seven layers. Physical carries raw bits over cables or radio; Data Link handles frames and MAC addresses between neighbouring devices; Network does logical addressing and routing with IP; Transport provides end-to-end delivery with TCP or UDP and port numbers; Session manages connections; Presentation handles formats, encoding and encryption; Application is what users interact with, like HTTP or SMTP. Each layer serves the one above it.",
        tip: "Do give one protocol or device per layer; it shows real understanding.",
      },
      {
        q: "How is the TCP/IP model different from OSI?",
        a: "TCP/IP is the practical model the internet uses, with four layers: Link (network access), Internet, Transport and Application. Its Application layer combines OSI's Application, Presentation and Session layers, and its Link layer covers Physical and Data Link. OSI is a conceptual reference model, while TCP/IP was built around actual protocols. Some textbooks describe TCP/IP with five layers by splitting Link into Physical and Data Link.",
      },
      {
        q: "What is the difference between TCP and UDP?",
        a: "TCP is connection-oriented: it sets up a connection with a three-way handshake and guarantees ordered, reliable delivery with acknowledgements, retransmission, flow control and congestion control. UDP is connectionless and sends datagrams without guarantees, so it has lower overhead and latency. TCP is used for web pages, email and file transfers; UDP for video calls, live streaming, online games and DNS lookups where speed matters more than every packet.",
        tip: "Do give use cases for both; 'TCP is reliable' alone is too shallow.",
      },
      {
        q: "Explain the TCP three-way handshake.",
        a: "First, the client sends a SYN with its initial sequence number. Second, the server replies with SYN-ACK, acknowledging the client's number and sending its own. Third, the client sends an ACK, and the connection is established. This synchronises sequence numbers on both sides so data can be delivered reliably and in order. Closing a connection normally uses a four-step FIN and ACK exchange.",
      },
      {
        q: "What happens when you type a URL into the browser and press Enter?",
        a: "The browser checks its cache, then resolves the domain name to an IP address through DNS, using browser, OS and resolver caches before querying DNS servers. It opens a TCP connection to the server, and for HTTPS performs a TLS handshake. It sends an HTTP request, the server returns a response with HTML, and the browser parses it, fetches CSS, JavaScript and images, builds the page and renders it.",
        tip: "Do structure it as DNS → TCP → TLS → HTTP → render; it's a top favourite.",
      },
      {
        q: "What is DNS, and how does it work?",
        a: "DNS translates human-readable domain names into IP addresses, like a phone book for the internet. When a name is not cached, a recursive resolver asks a root server, which points to the top-level-domain server, such as for `.com`, which points to the domain's authoritative server, which returns the IP. Results are cached according to their TTL to speed up later lookups. DNS mostly uses UDP on port 53.",
      },
      {
        q: "What is the difference between HTTP and HTTPS?",
        a: "HTTP sends data in plain text, so anyone on the network path can read or modify it. HTTPS is HTTP over TLS, which encrypts the data, verifies the server's identity through a certificate issued by a trusted authority, and ensures integrity. HTTP uses port 80 by default and HTTPS port 443. HTTPS is essential for logins and payments and is now standard for all websites.",
      },
      {
        q: "What is an IP address? Explain IPv4 versus IPv6.",
        a: "An IP address is a logical address that identifies a device on a network so packets can be routed to it. IPv4 uses 32 bits, written as four decimal numbers like `192.168.1.10`, giving about 4.3 billion addresses, which ran short. IPv6 uses 128 bits, written in hexadecimal groups, giving a vastly larger space, along with simpler headers and built-in support for auto-configuration. Private IPv4 ranges and NAT helped extend IPv4's life.",
      },
      {
        q: "What is the difference between a MAC address and an IP address?",
        a: "A MAC address is a 48-bit physical address assigned to a network interface, used for delivery within the same local network at the Data Link layer. An IP address is a logical address at the Network layer, used for routing across networks, and it can change when a device moves. ARP maps an IP address to the MAC address within a local network.",
      },
      {
        q: "What is subnetting?",
        a: "Subnetting divides a larger network into smaller logical networks by borrowing bits from the host part of an IP address. The subnet mask, such as `255.255.255.0` or `/24`, shows which bits are the network portion. It improves address utilisation, reduces broadcast traffic and makes security and management easier. For example, a `/24` network can be split into two `/25` subnets of 128 addresses each.",
      },
      {
        q: "What is the difference between a hub, a switch and a router?",
        a: "A hub works at the physical layer and simply broadcasts incoming data to all ports, causing collisions and wasted bandwidth. A switch works at the Data Link layer and forwards frames only to the correct port using a MAC address table. A router works at the Network layer and forwards packets between different networks using IP addresses and routing tables, for example connecting your home network to the internet.",
      },
      {
        q: "Name some common protocols and their default ports.",
        a: "HTTP uses port 80 and HTTPS 443. FTP uses 21 for control and 20 for data in active mode, and SSH uses 22. SMTP for sending email uses 25 (587 for submission), POP3 uses 110 and IMAP 143. DNS uses 53 and DHCP uses UDP 67 and 68. Knowing what each protocol does matters more than memorising every number.",
        tip: "Do know at least HTTP, HTTPS, SSH, DNS and SMTP without hesitation.",
      },
    ],
  },
  {
    id: "prog",
    title: "Programming language basics",
    intro:
      "Expect questions on the language you listed on your resume, plus comparisons between C, Java and Python. Interviewers check whether you understand memory, compilation and error handling rather than just syntax.",
    items: [
      {
        q: "What are the key differences between C, Java and Python?",
        a: "C is a procedural, compiled language that gives direct memory control through pointers and manual allocation; it is fast and used for systems programming. Java is object-oriented, compiled to bytecode that runs on the JVM, statically typed, and uses garbage collection, so it is portable and widely used for enterprise backends. Python is dynamically typed and interpreted (compiled to bytecode internally), has very concise syntax and a huge library ecosystem, and is popular for scripting, data and AI, though usually slower for CPU-heavy work.",
        tip: "Do frame differences in terms of typing, memory management and execution model.",
      },
      {
        q: "Is Java platform-independent? How?",
        a: "Yes. Java source code is compiled by `javac` into bytecode, which is not tied to any processor. That bytecode runs on a JVM, and each operating system has its own JVM implementation that interprets or JIT-compiles it into native code. So the bytecode is platform-independent while the JVM itself is platform-dependent. This is the idea behind 'write once, run anywhere'.",
      },
      {
        q: "What is the difference between JDK, JRE and JVM?",
        a: "The JVM is the virtual machine that executes bytecode and handles memory and garbage collection. The JRE includes the JVM plus the core libraries needed to run Java programs. The JDK includes the JRE plus development tools like the compiler `javac`, debugger and other utilities. To write and compile code you need the JDK; recent Java versions mostly distribute the JDK rather than a separate JRE.",
      },
      {
        q: "Explain stack versus heap memory.",
        a: "Stack memory stores function call frames, local variables and references; it's allocated and freed automatically in LIFO order, fast, and limited in size, so deep recursion can overflow it. Heap memory stores dynamically allocated data, like objects created with `new` in Java or `malloc` in C; it's larger but slower to manage. In C you must free heap memory with `free`, while Java and Python reclaim it automatically with garbage collection.",
        tip: "Do mention where objects versus their references live in Java.",
      },
      {
        q: "What is a pointer? Does Java have pointers?",
        a: "A pointer is a variable that stores the memory address of another variable; in C, `int *p = &x;` makes `p` point to `x`, and `*p` accesses its value. Pointers enable dynamic memory, arrays and efficient parameter passing, but mistakes cause bugs like dangling pointers and segmentation faults. Java doesn't expose pointers; it has references to objects, but you can't do pointer arithmetic or access raw addresses, which makes it safer.",
      },
      {
        q: "What is a memory leak, and how do you prevent it?",
        a: "A memory leak happens when memory that is no longer needed isn't released, so usage grows over time and can slow or crash the program. In C it's typically forgetting to call `free` after `malloc`. In garbage-collected languages it happens when references are unintentionally kept, for example objects stored in a static collection that's never cleared. Prevention includes freeing what you allocate, closing resources, and removing unused references; tools like Valgrind or profilers help find leaks.",
      },
      {
        q: "How does garbage collection work in Java?",
        a: "The garbage collector automatically frees heap memory used by objects that are no longer reachable from any live reference, starting from roots like local variables and static fields. Modern JVMs use generational collection: most objects die young, so new objects go into the young generation, which is collected frequently, and long-lived ones are promoted to the old generation. You can request collection with `System.gc()`, but the JVM doesn't guarantee when it will run.",
      },
      {
        q: "What is exception handling? Explain `try`, `catch`, `finally`.",
        a: "Exception handling lets a program deal with runtime errors without crashing. Code that may fail goes in `try`; `catch` blocks handle specific exception types; `finally` runs whether or not an exception occurred, which is useful for closing resources. Java also has `throw` to raise an exception and `throws` to declare it in a method signature, and try-with-resources closes resources automatically. Python uses `try`, `except`, `else` and `finally`.",
      },
      {
        q: "What is the difference between checked and unchecked exceptions in Java?",
        a: "Checked exceptions, like `IOException` and `SQLException`, are checked at compile time; you must handle them with `try`/`catch` or declare them with `throws`. Unchecked exceptions are subclasses of `RuntimeException`, like `NullPointerException` and `ArrayIndexOutOfBoundsException`, and usually indicate programming bugs; the compiler doesn't force you to handle them. `Error`s such as `OutOfMemoryError` are serious problems that applications generally shouldn't try to catch.",
      },
      {
        q: "What is the difference between `==` and `.equals()` in Java?",
        a: "`==` compares primitive values directly, but for objects it checks whether two references point to the same object in memory. `.equals()` compares logical content, if the class overrides it, as `String` does. So `new String(\"hi\") == new String(\"hi\")` is false, while `.equals()` returns true. If you override `equals()`, you should also override `hashCode()` so the objects work correctly in hash-based collections.",
        tip: "Do mention the `equals`/`hashCode` contract; it impresses interviewers.",
      },
      {
        q: "Why are strings immutable in Java?",
        a: "Once a `String` is created, its value can't change; operations like `concat` return a new object. Immutability allows the string pool, where identical literals share one object to save memory, and makes strings safe to share between threads without synchronisation. It also matters for security, since strings are used for file paths, URLs and class names, and lets the hash code be cached. For frequent modifications, use `StringBuilder`.",
      },
      {
        q: "What is the difference between a list and a tuple in Python?",
        a: "A list is mutable: you can add, remove or change elements, and it's written with square brackets. A tuple is immutable once created and written with parentheses. Because they're immutable, tuples can be used as dictionary keys if their elements are hashable, are slightly more memory-efficient, and signal that data shouldn't change, such as coordinates. Use lists for collections that change and tuples for fixed records.",
      },
      {
        q: "What is the difference between call by value and call by reference?",
        a: "In call by value, the function receives a copy, so changes inside don't affect the caller's variable. In call by reference, the function receives the variable's address, so changes are visible to the caller; C simulates this with pointers and C++ supports references directly. Java is always pass-by-value, but for objects the value passed is a copy of the reference, so you can modify the object's fields but not make the caller's variable point to a new object. Python passes object references, often described as pass-by-object-reference.",
        tip: "Do clear up the 'Java is pass-by-value' point; many candidates get it wrong.",
      },
      {
        q: "What are the differences between `final`, `finally` and `finalize` in Java?",
        a: "`final` is a keyword: a final variable can't be reassigned, a final method can't be overridden, and a final class can't be extended. `finally` is a block after `try`/`catch` that runs whether or not an exception occurs, typically for cleanup. `finalize()` was a method the garbage collector might call before reclaiming an object, but it's unreliable and deprecated; try-with-resources or explicit cleanup should be used instead.",
      },
      {
        q: "What is multithreading? How do you create a thread in Java?",
        a: "Multithreading means running multiple threads within one process so tasks can run concurrently, improving responsiveness and using multiple CPU cores. In Java you can extend `Thread` and override `run()`, or implement `Runnable` and pass it to a `Thread`; implementing `Runnable` is preferred because the class can still extend another. In real projects, `ExecutorService` thread pools are used instead of creating threads manually. Shared data must be protected with `synchronized`, locks or concurrent collections.",
      },
    ],
  },
  {
    id: "project",
    title: "Explaining your final-year project and internship",
    intro:
      "For most freshers, the project discussion is the longest part of the technical interview. Interviewers want to know what you personally did, why you made your choices, and whether you understand your own code. Prepare a two-minute version and be ready to go deeper anywhere.",
    items: [
      {
        q: "Explain your final-year project.",
        a: "Use a simple structure: problem → solution → your role → technology → result. Sample: 'Our college tracked attendance on paper, which took ten minutes per lecture and caused errors. We built a web app where teachers mark attendance on their phones and students see their percentage live. I built the backend in Spring Boot with MySQL and designed the database. It's now used by our department, and marking takes under a minute.'",
        tip: "Do practise this aloud until it fits in two minutes without reading.",
      },
      {
        q: "What was your specific contribution?",
        a: "Be precise and use 'I' for your work and 'we' for team work. Name the modules you built, a decision you made, and a problem you solved. Sample: 'I designed the database schema, wrote the REST APIs for attendance and reports, and handled authentication with JWT. I also wrote the script that generates monthly defaulter lists, which teachers asked for after the first demo.'",
        tip: "Don't claim the whole project; interviewers will probe modules you didn't build.",
      },
      {
        q: "Why did you choose this technology stack?",
        a: "Give reasons tied to the problem, your skills and constraints, and be honest if familiarity was a factor. Sample: 'We used Spring Boot because two of us knew Java and it has good support for REST APIs and security. MySQL suited us because our data was relational: students, classes and attendance records. If I rebuilt it, I'd consider PostgreSQL for better reporting features, but MySQL worked well at our scale.'",
        tip: "Do mention an alternative you considered; it shows you made a real decision.",
      },
      {
        q: "What was the biggest challenge in your project, and how did you solve it?",
        a: "Pick a real technical or team challenge and walk through how you diagnosed it. Sample: 'Report generation became slow once we loaded a full semester of data, around eight seconds per report. I checked the query and found we were doing a separate query for each student. I rewrote it as a single query with `GROUP BY` and added an index on the student and date columns, which brought it under a second.'",
        tip: "Do include numbers before and after if you have them.",
      },
      {
        q: "Draw or describe the architecture of your project.",
        a: "Describe the main components and how data flows between them: client, backend, database, and any external services. Sample: 'The front end is React and calls REST APIs on a Spring Boot server. The server validates the JWT token, runs business logic and talks to MySQL through JPA. Reports are generated on request and downloaded as PDF. Everything is deployed on a single cloud VM.'",
        tip: "Do practise drawing a simple block diagram on paper in under a minute.",
      },
      {
        q: "Explain your database design.",
        a: "List the main tables, their key columns and relationships, and why it is normalised. Sample: 'We have `Student`, `Course`, `Lecture` and `Attendance` tables. `Attendance` links a student to a lecture with a status, using foreign keys to both, and a composite unique key on student and lecture prevents duplicate marking. Keeping courses separate from lectures avoided repeating course details for every class.'",
        tip: "Do expect a follow-up SQL query on your own schema; practise one.",
      },
      {
        q: "If you had more time, what would you improve or add?",
        a: "Show that you can see your project's limitations honestly. Sample: 'I'd add automated tests, since we tested mostly by hand and caught some bugs late. I'd also add offline support so teachers can mark attendance without internet and sync later. And I'd move to proper role-based access so heads of department see summaries across classes.'",
        tip: "Don't say 'nothing'; every project has limitations and admitting them shows maturity.",
      },
      {
        q: "Explain your internship. What did you work on?",
        a: "Use the same structure: company type and team, your tasks, the technology, what you delivered, and what you learned. Sample: 'I interned for two months with a small software firm's backend team. I wrote REST APIs for an inventory module in Node.js, fixed bugs from their tracker and wrote unit tests. My biggest learning was working with Git branches and code reviews, which changed how I write code.'",
        tip: "Don't share confidential client names or internal details; describe the work generally.",
      },
      {
        q: "How did you test your project?",
        a: "Be honest about what you did and show you know what good testing involves. Sample: 'We did manual testing for each feature and kept a checklist of test cases, including edge cases like marking attendance twice or a student not enrolled. I wrote some unit tests for the attendance percentage logic with JUnit. I know we should have added integration tests for the APIs, and that's something I want to practise.'",
      },
      {
        q: "Was your project inspired by an existing product? How is it different?",
        a: "Interviewers ask this to check originality and awareness. Acknowledge similar products and explain what is different about yours, even if it is the context or scale. Sample: 'Commercial attendance systems exist, but they're built for large institutions and need biometric hardware. Ours was designed for our department's actual workflow, works on teachers' own phones, and generates the exact reports our office already used.'",
        tip: "Do be honest if it is a learning project; understanding beats originality claims.",
      },
    ],
  },
  {
    id: "process",
    title: "How placement drives work",
    intro:
      "Every company and college runs drives a little differently, so always read the official notice from your placement cell or the company's careers page. This section explains the general flow so nothing surprises you.",
    items: [
      {
        q: "What are the typical rounds in a placement drive?",
        a: "Most mass-recruitment drives have an online assessment (aptitude, logical reasoning, verbal ability and often coding), followed by a technical interview and an HR interview; some combine the last two into one. Some companies add a group discussion, a spoken-English or communication test, or a coding round for higher-package roles. Product companies usually have more coding-heavy rounds, sometimes with system design basics.",
        tip: "Do check the exact rounds in the drive notice; don't rely on seniors' memories alone.",
      },
      {
        q: "What are common eligibility criteria?",
        a: "Companies usually set a minimum percentage or CGPA in 10th, 12th and graduation, a maximum number of active backlogs (often none at the time of the drive), and sometimes limits on education gaps. They also specify eligible branches and passing-out year. Criteria differ by company and role and change between years, so always confirm from the official notice.",
        tip: "Don't hide backlogs or gaps on the form; mismatches can lead to rejection later during verification.",
      },
      {
        q: "What documents should I carry to a placement drive?",
        a: "Carry several printed copies of your resume, a government photo ID, your college ID, passport-size photos, and mark sheets for 10th, 12th and every semester, plus photocopies of each. Bring the registration acknowledgement or admit card if the company provides one. Keep the originals in a folder and arrange everything in the order a verifier would ask for.",
        tip: "Do keep digital scans on your phone too, in case an extra copy is needed.",
      },
      {
        q: "How should I prepare for and behave during an online test?",
        a: "Test your system, browser, camera and internet a day before, and close other tabs and applications. Sit in a quiet, well-lit room, keep your ID ready, and don't use a second screen or phone, since proctoring software may flag movement, noise or tab switching. Read section rules carefully, as some tests don't allow going back or have negative marking. Never share test content or take help; it can lead to disqualification.",
        tip: "Don't switch tabs or look away from the screen repeatedly; proctoring may flag it.",
      },
      {
        q: "How should I dress and behave on interview day?",
        a: "Wear clean formal clothes that are comfortable: a plain shirt, trousers and formal shoes, or equivalent formal wear. Arrive early, keep your phone silent, greet the panel politely, and sit upright. Listen fully before answering, and if you don't know something, say so and explain how you'd find out. For virtual interviews, use a neutral background and good lighting, and dress formally on camera as well.",
      },
      {
        q: "What is the difference between on-campus and off-campus placement?",
        a: "In on-campus placement, companies visit or conduct drives through your college's placement cell, which handles registration and communication. Off-campus placement means applying directly on company career portals, hiring challenges or job platforms, competing with candidates from many colleges. Many large service companies also run national-level hiring exams open to multiple colleges. Off-campus requires you to track openings and deadlines yourself.",
        tip: "Do apply only through official company portals; be cautious of anyone asking for money for a job.",
      },
      {
        q: "What is an offer letter, and what should I check in it?",
        a: "An offer letter is the company's formal written offer of employment. Check your name and details, job role, compensation structure, work location or location policy, joining date or the statement that it will be communicated, probation period, any service agreement, and conditions such as clearing all semesters. Read every clause and ask HR if anything is unclear before accepting.",
        tip: "Do keep a saved copy of every email and letter from the company.",
      },
      {
        q: "What is the difference between a letter of intent and an offer letter?",
        a: "A letter of intent (LOI) usually shows that the company intends to hire you, often issued soon after selection, with the formal offer to follow. An offer letter is the formal document with terms of employment. An appointment letter is typically given on or after joining. Terms vary by company, so read each document to understand what it actually confirms.",
      },
      {
        q: "What happens between getting an offer and joining?",
        a: "Companies typically ask you to complete onboarding forms, upload documents, and finish background verification of your education and identity. You must clear all your semesters, as offers are usually conditional on graduating within the required criteria. Joining dates can vary and sometimes take months, so keep checking your email and the company portal. Use this time to strengthen your fundamentals and any technology the company mentions.",
        tip: "Do respond to onboarding emails promptly; missed deadlines can delay or cancel joining.",
      },
      {
        q: "How do I handle multiple offers or the college's placement policy?",
        a: "Many colleges have policies, such as students who are placed not being allowed to sit for further drives except for higher-category offers. Read your college's policy before registering, because accepting a drive spot you don't intend to take can block others. If you receive multiple offers, decide carefully and inform the company you are declining politely and promptly, so the position can go to someone else.",
        tip: "Don't accept and then silently not join; it affects your college's relationship with the company.",
      },
    ],
  },
];
