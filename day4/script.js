const MAX_CHARS = 200;

const textarea = document.getElementById('note-text');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const themeToggle = document.getElementById('theme-toggle');

function updateCounts() {
  const text = textarea.value;
  const chars = text.length;
  const words = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

  charCount.textContent = `${chars} / ${MAX_CHARS} characters`;
  wordCount.textContent = `${words} words`;

  charCount.classList.toggle('warning', chars > 180 && chars <= MAX_CHARS);
  charCount.classList.toggle('over', chars > MAX_CHARS);
}

function saveDraft() {
  localStorage.setItem('note-draft', textarea.value);
}

function clearAll() {
  textarea.value = '';
  localStorage.removeItem('note-draft');
  updateCounts();
  textarea.focus();
}

function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
}

textarea.addEventListener('input', () => {
  updateCounts();
  saveDraft();
});

textarea.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    clearAll();
  }
});

clearBtn.addEventListener('click', clearAll);

themeToggle.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark');
  applyTheme(isDark);
  localStorage.setItem('note-theme', isDark ? 'dark' : 'light');
});

// Restore draft and theme on page load
const savedDraft = localStorage.getItem('note-draft');
if (savedDraft !== null) {
  textarea.value = savedDraft;
}

applyTheme(localStorage.getItem('note-theme') === 'dark');

updateCounts();
