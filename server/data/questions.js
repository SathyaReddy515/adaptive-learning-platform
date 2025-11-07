const questions = [
  // --- ALGEBRA: EASY (6) ---
  {
    content: "What is the value of x in the equation 2x + 3 = 11?",
    type: "mcq",
    options: [
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false },
      { text: "8", isCorrect: false }
    ],
    explanation: "Subtract 3 from both sides (2x = 8), then divide by 2 (x = 4).",
    metadata: { topic: "Algebra", difficulty: "easy" }
  },
  {
    content: "Simplify the expression: 3(x + 2)",
    type: "mcq",
    options: [
      { text: "3x + 6", isCorrect: true },
      { text: "3x + 2", isCorrect: false },
      { text: "x + 6", isCorrect: false },
      { text: "3x + 5", isCorrect: false }
    ],
    explanation: "Use the distributive property: 3 * x + 3 * 2 = 3x + 6.",
    metadata: { topic: "Algebra", difficulty: "easy" }
  },
  {
    content: "If y = 5, what is the value of 4y - 2?",
    type: "mcq",
    options: [
      { text: "20", isCorrect: false },
      { text: "18", isCorrect: true },
      { text: "22", isCorrect: false },
      { text: "8", isCorrect: false }
    ],
    explanation: "Substitute 5 for y: 4(5) - 2 = 20 - 2 = 18.",
    metadata: { topic: "Algebra", difficulty: "easy" }
  },
  {
    content: "What is 5x + 2x simplified?",
    type: "short-answer",
    correctAnswer: "7x",
    explanation: "Combine like terms: 5x + 2x = (5+2)x = 7x.",
    metadata: { topic: "Algebra", difficulty: "easy" }
  },
  {
    content: "Solve for a: a - 7 = 10",
    type: "short-answer",
    correctAnswer: "17",
    explanation: "Add 7 to both sides of the equation: a = 10 + 7, so a = 17.",
    metadata: { topic: "Algebra", difficulty: "easy" }
  },
  {
    content: "What is the value of x if 10/x = 2?",
    type: "short-answer",
    correctAnswer: "5",
    explanation: "Multiply both sides by x (10 = 2x), then divide by 2 (x = 5).",
    metadata: { topic: "Algebra", difficulty: "easy" }
  },

  // --- ALGEBRA: MEDIUM (6) ---
  {
    content: "Solve for x: 5x - 3 = 2x + 9",
    type: "mcq",
    options: [
      { text: "2", isCorrect: false },
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "6", isCorrect: false }
    ],
    explanation: "Subtract 2x from both sides (3x - 3 = 9). Add 3 to both sides (3x = 12). Divide by 3 (x = 4).",
    metadata: { topic: "Algebra", difficulty: "medium" }
  },
  {
    content: "What is the slope of the line y = 2x + 3?",
    type: "short-answer",
    correctAnswer: "2",
    explanation: "The equation is in slope-intercept form (y = mx + b), where 'm' is the slope. In this case, m = 2.",
    metadata: { topic: "Algebra", difficulty: "medium" }
  },
  {
    content: "Factor the expression: x² - 4",
    type: "mcq",
    options: [
      { text: "(x - 2)(x + 2)", isCorrect: true },
      { text: "(x - 2)(x - 2)", isCorrect: false },
      { text: "(x + 4)(x - 1)", isCorrect: false },
      { text: "(x - 4)(x + 1)", isCorrect: false }
    ],
    explanation: "This is a difference of squares: a² - b² = (a - b)(a + b). Here a=x and b=2.",
    metadata: { topic: "Algebra", difficulty: "medium" }
  },
  {
    content: "Solve the inequality: 3x + 5 < 20",
    type: "short-answer",
    correctAnswer: "x < 5",
    explanation: "Subtract 5 from both sides (3x < 15), then divide by 3 (x < 5).",
    metadata: { topic: "Algebra", difficulty: "medium" }
  },
  {
    content: "What are the coordinates of the y-intercept of the line y = -3x + 6?",
    type: "mcq",
    options: [
      { text: "(0, 6)", isCorrect: true },
      { text: "(6, 0)", isCorrect: false },
      { text: "(0, -3)", isCorrect: false },
      { text: "(2, 0)", isCorrect: false }
    ],
    explanation: "The y-intercept is the 'b' value in y = mx + b. It's the point where x=0, so y = -3(0) + 6 = 6. The coordinates are (0, 6).",
    metadata: { topic: "Algebra", difficulty: "medium" }
  },
  {
    content: "Find the value of 2³.",
    type: "short-answer",
    correctAnswer: "8",
    explanation: "2³ means 2 * 2 * 2, which equals 8.",
    metadata: { topic: "Algebra", difficulty: "medium" }
  },

  // --- ALGEBRA: HARD (6) ---
  {
    content: "What are the solutions to the quadratic equation: x² - 5x + 6 = 0?",
    type: "mcq",
    options: [
      { text: "x=2 and x=3", isCorrect: true },
      { text: "x=-2 and x=-3", isCorrect: false },
      { text: "x=1 and x=6", isCorrect: false },
      { text: "x=-1 and x=-6", isCorrect: false }
    ],
    explanation: "Factor the quadratic: (x - 2)(x - 3) = 0. The solutions are the values that make the factors zero, so x=2 and x=3.",
    metadata: { topic: "Algebra", difficulty: "hard" }
  },
  {
    content: "Solve the system of equations: y = 2x + 1 and y = -x + 4",
    type: "short-answer",
    correctAnswer: "x=1, y=3",
    explanation: "Set the equations equal: 2x + 1 = -x + 4. Add x to both sides (3x + 1 = 4). Subtract 1 (3x = 3). Divide by 3 (x = 1). Substitute x=1 into either equation: y = 2(1) + 1 = 3.",
    metadata: { topic: "Algebra", difficulty: "hard" }
  },
  {
    content: "Simplify: (4x³y²)(2x²y⁵)",
    type: "short-answer",
    correctAnswer: "8x⁵y⁷",
    explanation: "Multiply the coefficients (4*2=8) and add the exponents for like bases (x³*x² = x⁵) and (y²*y⁵ = y⁷).",
    metadata: { topic: "Algebra", difficulty: "hard" }
  },
  {
    content: "What is the distance between the points (2, 3) and (5, 7)?",
    type: "short-answer",
    correctAnswer: "5",
    explanation: "Use the distance formula: d = sqrt((x₂-x₁)² + (y₂-y₁)²). d = sqrt((5-2)² + (7-3)²) = sqrt(3² + 4²) = sqrt(9 + 16) = sqrt(25) = 5.",
    metadata: { topic: "Algebra", difficulty: "hard" }
  },
  {
    content: "What is the vertex of the parabola y = (x - 3)² + 5?",
    type: "mcq",
    options: [
      { text: "(-3, 5)", isCorrect: false },
      { text: "(3, 5)", isCorrect: true },
      { text: "(3, -5)", isCorrect: false },
      { text: "(-3, -5)", isCorrect: false }
    ],
    explanation: "The vertex form is y = a(x - h)² + k, where the vertex is at (h, k). In this equation, h=3 and k=5, so the vertex is (3, 5).",
    metadata: { topic: "Algebra", difficulty: "hard" }
  },
  {
    content: "Simplify the square root: √72",
    type: "mcq",
    options: [
      { text: "3√8", isCorrect: false },
      { text: "9√8", isCorrect: false },
      { text: "6√2", isCorrect: true },
      { text: "8√9", isCorrect: false }
    ],
    explanation: "Find the largest perfect square factor of 72, which is 36. √72 = √(36 * 2) = √36 * √2 = 6√2.",
    metadata: { topic: "Algebra", difficulty: "hard" }
  },

  // --- CALCULUS: EASY (2) ---
  {
    content: "What is the derivative of f(x) = x²?",
    type: "short-answer",
    correctAnswer: "2x",
    explanation: "Using the power rule, d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x²) = 2x¹ = 2x.",
    metadata: { topic: "Calculus", difficulty: "easy" }
  },
  {
    content: "What is the derivative of a constant, f(x) = 5?",
    type: "short-answer",
    correctAnswer: "0",
    explanation: "The derivative of any constant is always 0, as its rate of change is zero.",
    metadata: { topic: "Calculus", difficulty: "easy" }
  },

  // --- CALCULUS: MEDIUM (2) ---
  {
    content: "Find the derivative of f(x) = 3x³ + 2x - 1",
    type: "mcq",
    options: [
      { text: "9x² + 2", isCorrect: true },
      { text: "3x² + 2", isCorrect: false },
      { text: "9x²", isCorrect: false },
      { text: "6x + 2", isCorrect: false }
    ],
    explanation: "Apply the power rule to each term: d/dx(3x³) = 9x², d/dx(2x) = 2, d/dx(-1) = 0. Summing them gives 9x² + 2.",
    metadata: { topic: "Calculus", difficulty: "medium" }
  },
  {
    content: "What is the integral of 2x dx?",
    type: "short-answer",
    correctAnswer: "x² + C",
    explanation: "Using the reverse power rule, ∫xⁿ dx = (xⁿ⁺¹)/(n+1) + C. So ∫2x dx = 2(x²)/2 + C = x² + C.",
    metadata: { topic: "Calculus", difficulty: "medium" }
  },

  // --- CALCULUS: HARD (2) ---
  {
    content: "Find the derivative of f(x) = x² * sin(x) using the Product Rule.",
    type: "mcq",
    options: [
      { text: "2x * cos(x)", isCorrect: false },
      { text: "2x * sin(x) + x² * cos(x)", isCorrect: true },
      { text: "2x * sin(x) - x² * cos(x)", isCorrect: false },
      { text: "2x + cos(x)", isCorrect: false }
    ],
    explanation: "Product Rule (f'g + fg'): f=x², g=sin(x). f'=2x, g'=cos(x). Result is (2x)(sin(x)) + (x²)(cos(x)).",
    metadata: { topic: "Calculus", difficulty: "hard" }
  },
  {
    content: "Find the derivative of f(x) = (x² + 1)³ using the Chain Rule.",
    type: "short-answer",
    correctAnswer: "6x(x² + 1)²",
    explanation: "Let u = x² + 1, so f(u) = u³. f'(u) = 3u². u' = 2x. The derivative is f'(u) * u' = 3(x² + 1)² * (2x) = 6x(x² + 1)².",
    metadata: { topic: "Calculus", difficulty: "hard" }
  },

  // --- GEOMETRY: EASY (2) ---
  {
    content: "What is the area of a rectangle with length 5 and width 3?",
    type: "short-answer",
    correctAnswer: "15",
    explanation: "Area of a rectangle = length × width. Area = 5 × 3 = 15.",
    metadata: { topic: "Geometry", difficulty: "easy" }
  },
  {
    content: "How many degrees are in a right angle?",
    type: "short-answer",
    correctAnswer: "90",
    explanation: "A right angle is defined as an angle of 90 degrees.",
    metadata: { topic: "Geometry", difficulty: "easy" }
  },

  // --- GEOMETRY: MEDIUM (2) ---
  {
    content: "What is the area of a circle with a radius of 3?",
    type: "mcq",
    options: [
      { text: "6π", isCorrect: false },
      { text: "9π", isCorrect: true },
      { text: "3π", isCorrect: false },
      { text: "27π", isCorrect: false }
    ],
    explanation: "The formula for the area of a circle is A = πr². A = π(3)² = 9π.",
    metadata: { topic: "Geometry", difficulty: "medium" }
  },
  {
    content: "What is the perimeter of a square with a side length of 7?",
    type: "short-answer",
    correctAnswer: "28",
    explanation: "A square has 4 equal sides. Perimeter = 4 × side. P = 4 × 7 = 28.",
    metadata: { topic: "Geometry", difficulty: "medium" }
  },

  // --- GEOMETRY: HARD (2) ---
  {
    content: "What is the length of the hypotenuse of a right triangle with legs of length 3 and 4?",
    type: "short-answer",
    correctAnswer: "5",
    explanation: "Use the Pythagorean theorem: a² + b² = c². 3² + 4² = c². 9 + 16 = c². 25 = c². c = 5.",
    metadata: { topic: "Geometry", difficulty: "hard" }
  },
  {
    content: "What is the volume of a sphere with a radius of 3?",
    type: "mcq",
    options: [
      { text: "12π", isCorrect: false },
      { text: "108π", isCorrect: false },
      { text: "36π", isCorrect: true },
      { text: "9π", isCorrect: false }
    ],
    explanation: "The formula for the volume of a sphere is V = (4/3)πr³. V = (4/3)π(3)³ = (4/3)π(27) = 4 * 9π = 36π.",
    metadata: { topic: "Geometry", difficulty: "hard" }
  }
];

module.exports = questions;