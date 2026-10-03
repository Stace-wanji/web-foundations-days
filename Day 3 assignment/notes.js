/* ============================================
   Day 3 assignment – My Notes 📓
   A tiny note-taking script, tested in the console.
   ============================================ */

// ---------- Starting data ----------
const notes = [
  { id: 1, text: "Buy groceries after class",              category: "personal", date: "2026-10-01" },
  { id: 2, text: "Finish the Day 3 JavaScript assignment", category: "school",   date: "2026-10-02" },
  { id: 3, text: "Call mum on Sunday",                     category: "personal", date: "2026-10-02" },
  { id: 4, text: "Revise CSS flexbox before the quiz",     category: "school",   date: "2026-09-30" },
  { id: 5, text: "Idea: food delivery app for the group project", category: "ideas", date: "2026-10-01" },
];

// Rules for what makes a note acceptable
const MAX_LENGTH = 120;
const ALLOWED_CATEGORIES = ["personal", "school", "ideas"];

// ---------- 1. searchNotes ----------
function searchNotes(notes, keyword) {
  const query = keyword.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(query));
}

console.log(searchNotes(notes, "class"));
// Expected output: [ { id: 1, text: "Buy groceries after class", category: "personal", date: "2026-10-01" },
//                     { id: 2, text: "Finish the Day 3 JavaScript assignment", category: "school", date: "2026-10-02" } ]

console.log(searchNotes(notes, "pizza"));
// Expected output: []  (no matches — edge case)

// ---------- 2. longestNote ----------
function longestNote(notes) {
  if (notes.length === 0) return null;           // nothing to compare yet

  let longest = notes[0];
  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}

console.log(longestNote(notes));
// Expected output: { id: 5, text: "Idea: food delivery app for the group project", category: "ideas", date: "2026-10-01" }

console.log(longestNote([]));
// Expected output: null  (empty array — edge case)

// ---------- 3. countByCategory ----------
function countByCategory(notes) {
  const counts = {};
  for (const note of notes) {
    if (counts[note.category]) {
      counts[note.category] += 1;
    } else {
      counts[note.category] = 1;
    }
  }
  return counts;
}

console.log(countByCategory(notes));
// Expected output: { personal: 2, school: 2, ideas: 1 }

console.log(countByCategory([]));
// Expected output: {}  (empty array — edge case)

// ---------- 4. getSummary ----------
function getSummary(notes) {
  const counts = countByCategory(notes);
  const total = notes.length;
  const word = total === 1 ? "note" : "notes";   // "note" only for exactly one

  const parts = Object.entries(counts)
    .map(([category, count]) => `${count} in ${category}`)
    .join(", ");

  return `You have ${total} ${word} — ${parts}. Keep going! 💪`;
}

console.log(getSummary(notes));
// Expected output: "You have 5 notes — 2 in personal, 2 in school, 1 in ideas. Keep going! 💪"

console.log(getSummary([{ id: 1, text: "One lonely note", category: "personal", date: "2026-10-02" }]));
// Expected output: "You have 1 note — 1 in personal. Keep going! 💪"  (singular "note" — edge case)

// ---------- 5. isDuplicate ----------
function isDuplicate(notes, text) {
  const cleaned = text.trim().toLowerCase();
  return notes.some((note) => note.text.trim().toLowerCase() === cleaned);
}

console.log(isDuplicate(notes, "Call mum on Sunday"));
// Expected output: true

console.log(isDuplicate(notes, "   CALL MUM ON SUNDAY   "));
// Expected output: true  (trimmed + lower-case still matches — edge case)

console.log(isDuplicate(notes, "Book flight to Mombasa"));
// Expected output: false  (not in the list)

// ---------- 6. addNote ----------
function addNote(notes, text, category) {
  if (isDuplicate(notes, text)) return false;                    // already got this one
  if (text.trim().length === 0 || text.length > MAX_LENGTH) return false;  // too short or too long
  if (!ALLOWED_CATEGORIES.includes(category)) return false;      // unknown category

  notes.push({
    id: notes.length + 1,
    text: text.trim(),
    category: category,
    date: new Date().toISOString().slice(0, 10),
  });
  return true;
}

console.log(addNote(notes, "Pay rent before Friday", "personal"));
// Expected output: true  (note gets added)

console.log(addNote(notes, "Call mum on Sunday", "personal"));
// Expected output: false  (duplicate — rejected)

console.log(addNote(notes, "", "personal"));
// Expected output: false  (empty text — rejected)

console.log(addNote(notes, "Random thought", "diary"));
// Expected output: false  ("diary" is not an allowed category — rejected)
