// THEME
const themeSwitcher = document.getElementById("themeSwitcher");
const savedTheme = localStorage.getItem("theme") || "dark";
document.body.setAttribute("data-theme", savedTheme);
themeSwitcher.value = savedTheme;

themeSwitcher.addEventListener("change", () => {
  document.body.setAttribute("data-theme", themeSwitcher.value);
  localStorage.setItem("theme", themeSwitcher.value);
});

// CALENDAR
let currentDate = new Date();
const calendarGrid = document.getElementById("calendarGrid");
const monthYear = document.getElementById("monthYear");

function renderCalendar() {
  calendarGrid.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent =
    currentDate.toLocaleString("default", { month: "long" }) + " " + year;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Empty cells before day 1
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("empty");
    calendarGrid.appendChild(empty);
  }

  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.textContent = day;

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.classList.add("today");
    }

    cell.onclick = () => addEvent(year, month, day);
    calendarGrid.appendChild(cell);
  }
}


document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

function addEvent(y, m, d) {
  const text = prompt(`Event for ${d}/${m + 1}/${y}`);
  if (!text) return;
  const events = JSON.parse(localStorage.getItem("events") || "[]");
  events.push({ y, m, d, text });
  localStorage.setItem("events", JSON.stringify(events));
}

renderCalendar();

// TODO
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

function loadTodos() {
  todoList.innerHTML = "";
  const todos = JSON.parse(localStorage.getItem("todos") || "[]");
  todos.forEach((t, i) => {
    const li = document.createElement("li");
    li.textContent = t;
    li.onclick = () => {
      todos.splice(i, 1);
      localStorage.setItem("todos", JSON.stringify(todos));
      loadTodos();
    };
    todoList.appendChild(li);
  });
}

todoInput.addEventListener("keypress", e => {
  if (e.key === "Enter" && todoInput.value) {
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");
    todos.push(todoInput.value);
    localStorage.setItem("todos", JSON.stringify(todos));
    todoInput.value = "";
    loadTodos();
  }
});

loadTodos();

// TIMER
let time = 1500;
let interval;

function updateTimer() {
  const min = String(Math.floor(time / 60)).padStart(2, "0");
  const sec = String(time % 60).padStart(2, "0");
  document.getElementById("timer").textContent = `${min}:${sec}`;
}

function startTimer() {
  if (interval) return;
  interval = setInterval(() => {
    if (time > 0) {
      time--;
      updateTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  pauseTimer();
  time = 1500;
  updateTimer();
}

updateTimer();

// NOTES
const notes = document.getElementById("notes");
notes.value = localStorage.getItem("notes") || "";
notes.addEventListener("input", () => {
  localStorage.setItem("notes", notes.value);
});

function openPage(id) {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });
  document.getElementById(id).style.display = 'block';
}

function goHome() {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });
  document.getElementById('hero').style.display = 'block';
}

// INITIAL LOAD
document.querySelectorAll('.page').forEach(page => {
  page.style.display = 'none';
});
document.getElementById('hero').style.display = 'block';

let notesData = JSON.parse(localStorage.getItem("notesData") || "[]");
let currentNoteIndex = 0;

const notesList = document.getElementById("notesList");
const notesInput = document.getElementById("notesInput");

function saveNotes() {
  localStorage.setItem("notesData", JSON.stringify(notesData));
}

function loadNotes() {
  notesList.innerHTML = "";

  notesData.forEach((note, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = note.title;
    notesList.appendChild(option);
  });

  if (notesData.length === 0) {
    createNote();
  } else {
    notesList.value = currentNoteIndex;
    notesInput.value = notesData[currentNoteIndex].content;
  }
}

function createNote() {
  const title = `Note ${notesData.length + 1}`;
  notesData.push({ title, content: "" });
  currentNoteIndex = notesData.length - 1;
  saveNotes();
  loadNotes();
}

notesList.addEventListener("change", () => {
  currentNoteIndex = notesList.value;
  notesInput.value = notesData[currentNoteIndex].content;
});

notesInput.addEventListener("input", () => {
  notesData[currentNoteIndex].content = notesInput.value;
  saveNotes();
});

loadNotes();
function deleteNote() {
  if (notesData.length === 0) return;

  const confirmDelete = confirm("Delete this note?");
  if (!confirmDelete) return;

  notesData.splice(currentNoteIndex, 1);

  if (currentNoteIndex > 0) {
    currentNoteIndex--;
  }

  saveNotes();
  loadNotes();
}
function openPopup(id) {
  const popup = document.getElementById(id);
  popup.classList.remove("hidden");

  requestAnimationFrame(() => {
    popup.classList.add("active");
  });
}

function closePopup(id) {
  const popup = document.getElementById(id);
  popup.classList.remove("active");

  setTimeout(() => {
    popup.classList.add("hidden");
  }, 300);
}
document.addEventListener("click", e => {
  if (e.target.classList.contains("popup-overlay")) {
    e.target.classList.remove("active");
    setTimeout(() => e.target.classList.add("hidden"), 300);
  }
});
