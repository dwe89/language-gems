// Quick test to verify duplicate detection works

const testQuestion = {
  id: "test_p1",
  type: "multiple_choice",
  question: "Complete: Si tú _____ (comprar) ese libro, aprenderías mucho.",
  options: ["comprarías", "comprarías", "comprarías", "compraría"],
  correct_answer: "comprarías",
  explanation: "Test",
  difficulty: "beginner"
};

console.log("Testing duplicate detection...\n");
console.log("Question options:", testQuestion.options);

// Check for duplicate options
const uniqueOptions = new Set(testQuestion.options);
console.log("Unique options:", Array.from(uniqueOptions));
console.log("Unique count:", uniqueOptions.size);
console.log("Total count:", testQuestion.options.length);

if (uniqueOptions.size !== testQuestion.options.length) {
  const duplicates = testQuestion.options.filter((opt: string, idx: number) => 
    testQuestion.options.indexOf(opt) !== idx
  );
  console.log("\n❌ ERROR: Duplicate options found:", duplicates);
  console.log("This question would be REJECTED and trigger a retry!");
} else {
  console.log("\n✅ All options are unique!");
}

