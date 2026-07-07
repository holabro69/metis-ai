import { StudySubject, QuizQuestion, Flashcard, StudyPlanItem } from "./types";

export const DEFAULT_SUBJECTS: StudySubject[] = [
  {
    id: "quantum-physics",
    name: "Quantum Physics",
    icon: "Atom",
    description: "Study wave-particle duality, superposition, quantum entanglement, and the Schrodinger equation.",
    difficulty: "Advanced",
    defaultQuestions: [
      "Explain Wave-Particle Duality in simple terms.",
      "What is Quantum Entanglement and why did Einstein call it 'spooky action at a distance'?",
      "How does Schrödinger's Cat illustrate the Copenhagen Interpretation?"
    ]
  },
  {
    id: "bioinformatics",
    name: "Genetics & Bioinformatics",
    icon: "Dna",
    description: "Explore gene sequencing, sequence alignment algorithms, phylogenetic trees, and structural genomics.",
    difficulty: "Advanced",
    defaultQuestions: [
      "How does the Needleman-Wunsch algorithm align DNA sequences?",
      "Explain the role of CRISPR-Cas9 in targeted gene editing.",
      "What is a phylogenetic tree and how is it constructed from sequence data?"
    ]
  },
  {
    id: "computer-science",
    name: "Computer Science (Algorithms)",
    icon: "Terminal",
    description: "Master algorithmic complexity, dynamic programming, graph traversals, and modern system design.",
    difficulty: "Intermediate",
    defaultQuestions: [
      "Explain Dynamic Programming with a simple memoization example.",
      "Compare BFS vs DFS and when to use each.",
      "What is Big O notation and how do I compute it for nested loops?"
    ]
  },
  {
    id: "macroeconomics",
    name: "Macroeconomics",
    icon: "TrendingUp",
    description: "Analyze monetary policies, inflation, fiscal stimulus, GDP structures, and trade balance dynamics.",
    difficulty: "Intermediate",
    defaultQuestions: [
      "How do interest rates affect inflation and overall economic growth?",
      "Explain the difference between monetary policy and fiscal policy.",
      "What is the GDP multiplier effect and why does it matter?"
    ]
  },
  {
    id: "creative-writing",
    name: "Creative Writing",
    icon: "PenTool",
    description: "Refine character development, narrative arcs, subtext, world-building, and dialog pacing.",
    difficulty: "Beginner",
    defaultQuestions: [
      "How do I use the Three-Act Structure to outline a sci-fi novel?",
      "Explain the concept of 'Show, Don't Tell' with examples.",
      "How do I write compelling subtext in a heated dialogue scene?"
    ]
  }
];

export const MOCK_EXPLANATIONS: Record<string, string> = {
  "Explain Wave-Particle Duality in simple terms.": `### Wave-Particle Duality: The Ultimate Cosmic Paradox

At its core, **Wave-Particle Duality** is the mind-bending reality that every quantum entity (like an electron or a photon) can behave as both a **discrete particle** and a **continuous wave**.

Here's how to think about it simply:

1. **The Particle View**: Imagine throwing marbles at a wall. They strike in specific, distinct, localized spots.
2. **The Wave View**: Imagine dropping a stone in water. Ripples spread out, passing through channels and interfering with each other.

#### The Magic of Measurement
When we aren't looking, quantum entities spread out like waves of potential. But the moment we measure or observe them, they "collapse" into a single point, behaving like localized particles.

* **Wave Properties**: Refraction, interference (like the famous Double Slit Experiment), and frequency.
* **Particle Properties**: Packets of energy (photons), localized momentum, and distinct interactions.`,

  "What is Quantum Entanglement and why did Einstein call it 'spooky action at a distance'?": `### Quantum Entanglement: Cosmic Synchronization

**Quantum Entanglement** occurs when two or more particles become intertwined in such a way that the physical state of one instantly dictates the state of the other—no matter how far apart they are.

#### Why Einstein Hated It ("Spooky Action")
Albert Einstein's Theory of Relativity states that nothing can travel faster than the speed of light. Under Entanglement, however:
* Spin particle **A** clockwise.
* Particle **B** (located 10 light-years away) instantly spins counter-clockwise.

This instant transfer of state seemed to violate the "local speed limit" of the universe, prompting Einstein to write it off as *"spooky action at a distance"* (*spukhafte Fernwirkung*).

#### How It Works in Practice
Think of a pair of socks cut in half. If you put one half in a box in London and the other in Paris, opening the London box and seeing a "left-side" sock instantly reveals the Paris box holds the "right-side" sock. In the quantum world, however, the socks aren't decided until you look!`,

  "How does Schrödinger's Cat illustrate the Copenhagen Interpretation?": `### Schrödinger's Cat: The Superposition Dilemma

In 1935, physicist Erwin Schrödinger proposed a famous thought experiment to illustrate the absurdity of the **Copenhagen Interpretation** of quantum mechanics when applied to everyday scales.

#### The Setup
Imagine a cat placed inside a sealed steel box along with:
1. A radioactive atom.
2. A Geiger counter.
3. A tiny hammer and a vial of poison.

If the atom decays, the counter detects it, drops the hammer, shatters the poison, and the cat dies. If the atom does not decay, the cat lives.

#### The Copenhagen Paradox
According to the Copenhagen Interpretation, until the box is opened (observed), the atom is in a **superposition**—it is both *decayed and not decayed* at the same time. 

By extension, Schrödinger argued, the cat must be simultaneously **both alive and dead** until the observer opens the box. 

* **Purpose**: This wasn't a real experiment! Schrödinger wanted to show that the bridge between quantum micro-states and macroscopic reality still has deep, unresolved mystery.`,

  "How does the Needleman-Wunsch algorithm align DNA sequences?": `### The Needleman-Wunsch Algorithm: Aligning the Code of Life

Developed in 1970, the **Needleman-Wunsch algorithm** is a cornerstone of bioinformatics. It performs a **global alignment** of two sequences (like DNA or proteins) using **Dynamic Programming**.

#### The 3-Step Core Process
The algorithm mathematically scores every possible alignment to find the absolute best match:

1. **Initialization**: Create a grid (matrix) where one sequence sits on top, and the other on the left.
2. **Matrix Filling**: Calculate a score for each cell using three possibilities:
   * **Match/Mismatch**: Move diagonally.
   * **Gap in Sequence A**: Move vertically.
   * **Gap in Sequence B**: Move horizontally.
3. **Traceback**: Starting from the bottom-right corner, follow the highest scoring path backward to the top-left to retrieve the optimal alignment.

#### The Scoring System
Typically, alignments are scored with:
* **Match**: $+1$ or $+2$ points.
* **Mismatch**: $-1$ point.
* **Gap Penalty**: $-2$ points (forces the algorithm to avoid excessive gaps).`,

  "Explain the role of CRISPR-Cas9 in targeted gene editing.": `### CRISPR-Cas9: Molecular Scissors

**CRISPR-Cas9** is a revolutionary gene-editing technology that allows scientists to make highly precise, targeted changes to the DNA of living organisms.

#### The Two Core Components

1. **The Guide RNA (gRNA)**: A synthetic piece of RNA designed to match a specific 20-letter sequence of target DNA. It acts as the "GPS navigator" inside the cell.
2. **The Cas9 Protein**: An enzyme that acts as "molecular scissors." Guided by the gRNA, it binds to the target DNA sequence and performs a double-strand cut.

#### The Cellular Repair
Once Cas9 cuts the DNA, the cell's natural repair mechanisms kick in:
* **Disruption**: The cell glues the ends together imperfectly, effectively knocking out/disabling the gene.
* **Correction/Insertion**: Scientists can inject a template DNA strand along with CRISPR, prompting the cell to repair the break by stitching in a brand new, healthy gene!`,

  "Explain Dynamic Programming with a simple memoization example.": `### Mastering Dynamic Programming (DP)

**Dynamic Programming** is an algorithmic technique used to solve complex problems by breaking them down into simpler, overlapping subproblems, solving each subproblem exactly once, and storing their solutions.

#### The Two Core Strategies
1. **Top-Down (Memoization)**: Solve the big problem recursively, but cache the results of subproblems in a hash map or array so we never recalculate them.
2. **Bottom-Up (Tabulation)**: Solve the smallest subproblems first, storing results in a table (usually an array), and use them to build up to the big solution iteratively.

#### The Classic Example: Fibonacci Numbers
Without DP, calculating the $N$-th Fibonacci number ($F(n) = F(n-1) + F(n-2)$) takes exponential $O(2^N)$ time because of massive redundant work.

\`\`\`javascript
// Dynamic Programming with Memoization (Top-Down)
function fib(n, memo = {}) {
  if (n in memo) return memo[n]; // Retrieve cached result
  if (n <= 1) return n;
  
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo); // Store in cache
  return memo[n];
}
// Time Complexity: O(N) | Space Complexity: O(N)
\`\`\``,

  "Compare BFS vs DFS and when to use each.": `### BFS vs DFS: Graph Navigation Mastery

When traversing graphs or trees, **Breadth-First Search (BFS)** and **Depth-First Search (DFS)** are the two fundamental paradigms.

| Metric | Breadth-First Search (BFS) | Depth-First Search (DFS) |
| :--- | :--- | :--- |
| **Strategy** | Explores level-by-level (radiates outwards). | Explores as deep as possible before backtracking. |
| **Data Structure**| Uses a **Queue** (FIFO). | Uses a **Stack** (LIFO) or Recursion. |
| **Best Use Case** | Finding the **shortest path** on unweighted graphs. | Finding paths, topological sorting, solving mazes. |
| **Memory** | High (stores an entire frontier of nodes). | Low (only stores active search path). |

#### When to Choose BFS
* You want to find the shortest distance from a starting point (e.g., social network degree of separation).
* The target node is likely close to the starting source.

#### When to Choose DFS
* You need to explore every possible outcome/decision (e.g., chess engine planning moves).
* Memory is constrained, and the tree is very wide.`,

  "How do interest rates affect inflation and overall economic growth?": `### The Central Bank lever: Interest Rates & Inflation

Interest rates are the primary tool used by central banks (like the Federal Reserve) to manage economic speed, prices, and employment.

#### The Dual Economic Cycles

#### 1. Rate Hikes (Tightening Policy)
When inflation runs too high, the central bank raises rates:
* **The Mechanism**: Borrowing money becomes expensive for businesses and consumers.
* **The Impact**: Spending slows down, expansion projects are paused, demand decreases.
* **Result**: Inflation cools off, but economic growth slows (risk of recession).

#### 2. Rate Cuts (Easing Policy)
When the economy is sluggish or in recession, the central bank cuts rates:
* **The Mechanism**: Loans, mortgages, and business credit become highly affordable.
* **The Impact**: Consumers spend more, companies hire and invest, aggregate demand expands.
* **Result**: Economic growth accelerates, but inflation risks creeping upwards.`,

  "How do I use the Three-Act Structure to outline a sci-fi novel?": `### The Three-Act Structure in Science Fiction

The **Three-Act Structure** is a classical plot architecture that divides a narrative into three clear segments: setup, confrontation, and resolution. Here is how to apply it to a Sci-Fi epic:

#### Act I: Setup ($0\% - 25\%$)
* **The Status Quo**: Introduce your protagonist in their familiar sci-fi setting (e.g., a mining colony on Mars).
* **The Inciting Incident**: An event disrupts their world (e.g., discovering an ancient, alien beacon).
* **Crossing the Threshold**: The protagonist takes a point-of-no-return action to deal with the incident.

#### Act II: Confrontation ($25\% - 75\%$)
* **Rising Action**: The protagonist faces escalating obstacles, learning the alien beacon is activating a self-destruct cycle.
* **Midpoint**: A major twist changes the stakes (e.g., discovering the colonial government knew about it all along).
* **The Dark Night of the Soul**: The lowest point, where all hope seems lost (e.g., the protagonist is captured and their allies scatter).

#### Act III: Resolution ($75\% - 100\%$)
* **The Climax**: The ultimate confrontation where the protagonist uses everything they've learned to resolve the core conflict.
* **The New Normal**: A final scene showing how the world and the characters have been permanently changed.`
};

export const DEFAULT_EXPLANATION = `### Personal Study Plan & Exploration

I have initialized your customized study dashboard for **METIS AI**. 

#### How to proceed:
1. Select any **Subject Card** in the sidebar on the left.
2. Click one of the **Quick Questions** listed below to immediately explore a core topic.
3. Use the input bar to type any custom question or study prompt.
4. Try out **Mock AI Mode** in the sidebar to test prompt performance with instantly styled study cards, quizzes, and dynamic 3D-flipping flashcards!`;

export const getMockQuiz = (subjectId: string): QuizQuestion[] => {
  switch (subjectId) {
    case "quantum-physics":
      return [
        {
          id: "q_qp_1",
          question: "What is the physical interpretation of the square of the wave function |Ψ|² in quantum mechanics?",
          options: [
            "The exact trajectory of a particle.",
            "The particle's energy levels.",
            "The probability density of finding the particle at a specific position.",
            "The velocity vector of the wave packet."
          ],
          correctAnswerIndex: 2,
          explanation: "In the Born interpretation, the square of the absolute value of the wave function (|Ψ|²) represents the probability density of finding a particle at a given point in space and time."
        },
        {
          id: "q_qp_2",
          question: "Which interpretation of quantum mechanics asserts that physical systems do not have definite properties prior to being measured?",
          options: [
            "Many-Worlds Interpretation",
            "Copenhagen Interpretation",
            "De Broglie-Bohm Pilot Wave Theory",
            "Objective Collapse Theories"
          ],
          correctAnswerIndex: 1,
          explanation: "The Copenhagen Interpretation, formulated largely by Niels Bohr and Werner Heisenberg, states that physical systems only have probabilities until they are collapsed by measurement."
        },
        {
          id: "q_qp_3",
          question: "What quantum phenomenon describes particles maintaining an interconnected state regardless of physical separation distance?",
          options: [
            "Quantum Tunneling",
            "Superposition",
            "The Photoelectric Effect",
            "Quantum Entanglement"
          ],
          correctAnswerIndex: 3,
          explanation: "Quantum Entanglement is the state where physical properties of particles are perfectly correlated, such that observing one instantly determines the state of the other over any distance."
        }
      ];
    case "computer-science":
      return [
        {
          id: "q_cs_1",
          question: "What is the time complexity of searching for an element in a perfectly balanced Binary Search Tree (BST)?",
          options: [
            "O(1)",
            "O(N)",
            "O(log N)",
            "O(N log N)"
          ],
          correctAnswerIndex: 2,
          explanation: "In a balanced BST, each comparison discards half of the remaining elements, yielding a logarithmic O(log N) search complexity."
        },
        {
          id: "q_cs_2",
          question: "Which of the following is a primary characteristic of Dynamic Programming?",
          options: [
            "Iterative backtracking with random swaps.",
            "Overlapping subproblems and optimal substructure.",
            "Greedy selection of the local optimum at every step.",
            "Multi-threaded division of unlinked datasets."
          ],
          correctAnswerIndex: 1,
          explanation: "Dynamic Programming is defined by having overlapping subproblems (which allows memoization) and optimal substructure (the global optimum is constructed from local subproblem optima)."
        },
        {
          id: "q_cs_3",
          question: "Which graph traversal algorithm uses a Queue (FIFO) as its underlying auxiliary data structure?",
          options: [
            "Depth-First Search (DFS)",
            "Breadth-First Search (BFS)",
            "Dijkstra's Shortest Path",
            "Kruskal's Minimum Spanning Tree"
          ],
          correctAnswerIndex: 1,
          explanation: "Breadth-First Search (BFS) processes nodes level-by-level, utilizing a FIFO Queue to track the frontier of nodes to visit next."
        }
      ];
    default:
      return [
        {
          id: "q_gen_1",
          question: "What is the primary benefit of active recall in study methodologies?",
          options: [
            "It decreases the overall attention span.",
            "It forces the brain to retrieve information, strengthening neural pathways.",
            "It allows students to study while sleeping.",
            "It eliminates the need for spaced repetition."
          ],
          correctAnswerIndex: 1,
          explanation: "Active recall challenges the brain to reconstruct and retrieve information, which creates significantly stronger, more durable long-term memory traces than passive reading."
        },
        {
          id: "q_gen_2",
          question: "How does the Spaced Repetition technique optimize learning?",
          options: [
            "By studying for 12 hours straight before an exam.",
            "By reviewing information right before it is about to be forgotten.",
            "By memorizing words in alphabetical order.",
            "By limiting study material to one page."
          ],
          correctAnswerIndex: 1,
          explanation: "Spaced repetition schedules reviews at increasing intervals, exploiting the psychological spacing effect to maximize recall efficiency before the brain naturally discards the data."
        },
        {
          id: "q_gen_3",
          question: "What is the 'Feynman Technique'?",
          options: [
            "A system for doing complex calculations in your head.",
            "Explaining a concept in simple, plain language to a child to identify gaps in your understanding.",
            "Using flashcards with visual drawings of physical elements.",
            "A fast reading algorithm developed for Nobel Laureates."
          ],
          correctAnswerIndex: 1,
          explanation: "The Feynman Technique involves teaching a concept simply to find blind spots in your own knowledge, forcing you to strip away jargon and clarify core principles."
        }
      ];
  }
};

export const getMockFlashcards = (subjectId: string, subjectName: string): Flashcard[] => {
  switch (subjectId) {
    case "quantum-physics":
      return [
        { id: "fc_qp_1", subject: subjectName, front: "What is Wavefunction Collapse?", back: "The physical process where a quantum superposition is reduced to a single, localized eigenstate upon interaction or measurement by an observer." },
        { id: "fc_qp_2", subject: subjectName, front: "Define Quantum Superposition.", back: "The principle that a physical system exists in multiple states or configurations simultaneously until it is observed or measured." },
        { id: "fc_qp_3", subject: subjectName, front: "What does Heisenberg's Uncertainty Principle state?", back: "It is physically impossible to simultaneously measure both the exact position (x) and exact momentum (p) of a subatomic particle with absolute precision." },
        { id: "fc_qp_4", subject: subjectName, front: "What is Quantum Tunneling?", back: "The wave-like phenomenon where a particle traverses a potential energy barrier that classical physics predicts it does not have enough kinetic energy to pass." }
      ];
    case "computer-science":
      return [
        { id: "fc_cs_1", subject: subjectName, front: "What is Memoization?", back: "An optimization technique used in dynamic programming that stores the results of expensive function calls and returns the cached result when the same inputs occur again." },
        { id: "fc_cs_2", subject: subjectName, front: "What is a Hash Collision?", back: "A situation where two distinct keys passed into a hash function produce the exact same array index output. Solved by chaining or open addressing." },
        { id: "fc_cs_3", subject: subjectName, front: "What is the difference between dynamic and static typing?", back: "Static typing checks types at compile-time (e.g., TS, Java), catching errors early. Dynamic typing checks types at runtime (e.g., JS, Python), allowing faster prototyping." },
        { id: "fc_cs_4", subject: subjectName, front: "Define Time vs Space Complexity.", back: "Time complexity measures the number of operations an algorithm performs as input grows, while Space complexity measures the amount of auxiliary memory allocated." }
      ];
    default:
      return [
        { id: "fc_gen_1", subject: subjectName, front: "Active Recall", back: "An exceptionally efficient study method where you actively test your memory during retrieval rather than passively re-reading text." },
        { id: "fc_gen_2", subject: subjectName, front: "The Spacing Effect", back: "The psychological phenomenon where learning is significantly greater when reviews are spaced out over time rather than massed in a single study marathon." },
        { id: "fc_gen_3", subject: subjectName, front: "The Feynman Method", back: "A learning mental model: Study a topic, write down an explanation as if teaching it to a 10-year-old child, identify your knowledge gaps, review, and simplify." },
        { id: "fc_gen_4", subject: subjectName, front: "Pomodoro Technique", back: "A time management framework: Work with absolute focus for 25 minutes, take a 5-minute restorative break, and repeat. Prevents mental fatigue." }
      ];
  }
};

export const getMockStudyPlan = (subjectId: string): StudyPlanItem[] => {
  switch (subjectId) {
    case "quantum-physics":
      return [
        { id: "pl_qp_1", title: "Master Wave-Particle Duality & Interference Patterns", duration: "2 Hours", completed: false },
        { id: "pl_qp_2", title: "Solve Schrödinger's 1D Time-Independent Equation", duration: "3 Hours", completed: false },
        { id: "pl_qp_3", title: "Analyze Superposition & Bell's Theorem Entanglement", duration: "2 Hours", completed: false },
        { id: "pl_qp_4", title: "Review Quantum Tunneling Coefficients", duration: "1.5 Hours", completed: false }
      ];
    case "computer-science":
      return [
        { id: "pl_cs_1", title: "Understand Big-O & Logarithmic Run Times", duration: "1 Hour", completed: false },
        { id: "pl_cs_2", title: "Build Tree Traversal Algorithms (BFS & DFS)", duration: "2.5 Hours", completed: false },
        { id: "pl_cs_3", title: "Solve Overlapping Subproblems with Memoization", duration: "3 Hours", completed: false },
        { id: "pl_cs_4", title: "Test Boundary Conditions & Space Complexity", duration: "1.5 Hours", completed: false }
      ];
    default:
      return [
        { id: "pl_gen_1", title: "Core Lecture Comprehension & Synthesis", duration: "1.5 Hours", completed: false },
        { id: "pl_gen_2", title: "Active Recall Flashcard Formulation", duration: "1 Hour", completed: false },
        { id: "pl_gen_3", title: "Interactive Quiz Verification Challenge", duration: "45 Mins", completed: false },
        { id: "pl_gen_4", title: "Feynman Technique Peer Explanation Test", duration: "1 Hour", completed: false }
      ];
  }
};
