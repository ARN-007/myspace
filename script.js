/* ---------- THEME ---------- */
const themeSwitcher = document.getElementById("themeSwitcher");
const savedTheme = localStorage.getItem("theme") || "dark";
document.body.setAttribute("data-theme", savedTheme);
themeSwitcher.value = savedTheme;

themeSwitcher.addEventListener("change", () => {
  document.body.setAttribute("data-theme", themeSwitcher.value);
  localStorage.setItem("theme", themeSwitcher.value);
});

/* ---------- PAGE NAV ---------- */
function openPage(id) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}
function goHome() {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById('hero').style.display = 'block';
}
document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
document.getElementById('hero').style.display = 'block';


/* ---------- CALENDAR ---------- */

let currentDate = new Date();
let selectedDate = null;

let calendarEvents = JSON.parse(localStorage.getItem("calendarEvents") || "{}");

const calendarGrid = document.getElementById("calendarGrid");
const monthYear = document.getElementById("monthYear");

function saveCalendarEvents() {
  localStorage.setItem("calendarEvents", JSON.stringify(calendarEvents));
}

let editingEventIndex = null;
let editingEventDate = null;

function editEvent(date, index) {
  editingEventDate = date;
  editingEventIndex = index;

  document.getElementById("editEventInput").value =
    calendarEvents[date][index].text;

  openPopup("editEventPopup");
}

function saveEditedEvent() {
  if (editingEventDate === null || editingEventIndex === null) return;

  const newText = document.getElementById("editEventInput").value.trim();
  if (!newText) return;

  calendarEvents[editingEventDate][editingEventIndex].text = newText;

  saveCalendarEvents();
  renderEvents();

  editingEventDate = null;
  editingEventIndex = null;
  closePopup("editEventPopup");
}

/* -------- DATE SELECTION -------- */

function selectDate(year, month, day) {
  selectedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  document.getElementById("selectedDateTitle").textContent = selectedDate;

  const selected = new Date(year, month, day);
  const today = new Date();
  today.setHours(0,0,0,0);

  const addBtn = document.getElementById("addEventBtn");

  if (selected < today) {
    addBtn.disabled = true;
    addBtn.style.opacity = "0.5";
  } else {
    addBtn.disabled = false;
    addBtn.style.opacity = "1";
  }

  renderEvents();
}


/* -------- RENDER EVENTS -------- */

function renderEvents() {
  const list = document.getElementById("eventsList");
  list.innerHTML = "";

  if (!selectedDate || !calendarEvents[selectedDate]) return;

  calendarEvents[selectedDate].forEach((event, i) => {
    const card = document.createElement("div");
    card.className = "event-card" + (event.completed ? " completed" : "");

   card.innerHTML = `
  <span>${event.text}</span>
  <div class="event-actions">
    ${
      event.completed
        ? `<button onclick="toggleEvent('${selectedDate}', ${i})">❌</button>`
        : `<button onclick="toggleEvent('${selectedDate}', ${i})">✓</button>`
    }
    <button onclick="editEvent('${selectedDate}', ${i})">✏️</button>
    <button onclick="deleteEvent('${selectedDate}', ${i})">🗑</button>
  </div>
`;


    list.appendChild(card);
  });
}

/* -------- EVENT ACTIONS -------- */

const addEventBtn = document.getElementById("addEventBtn");
if (addEventBtn) {
  addEventBtn.onclick = () => {
    const text = document.getElementById("eventText").value.trim();
    if (!text || !selectedDate) return;

    calendarEvents[selectedDate] = calendarEvents[selectedDate] || [];
    calendarEvents[selectedDate].push({ text, completed: false });

    document.getElementById("eventText").value = "";
    saveCalendarEvents();
    renderEvents();
  };
}


function toggleEvent(date, index) {
  calendarEvents[date][index].completed = !calendarEvents[date][index].completed;
  saveCalendarEvents();
  renderEvents();
}



function deleteEvent(date, index) {
  calendarEvents[date].splice(index, 1);
  if (calendarEvents[date].length === 0) delete calendarEvents[date];
  saveCalendarEvents();
  renderEvents();
}

/* -------- RENDER CALENDAR -------- */

function renderCalendar() {
  calendarGrid.innerHTML = "";

  const y = currentDate.getFullYear();
  const m = currentDate.getMonth();

  monthYear.textContent =
    currentDate.toLocaleString("default", { month: "long" }) + " " + y;

  const firstDay = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const e = document.createElement("div");
    e.className = "empty";
    calendarGrid.appendChild(e);
  }

  const today = new Date();

  for (let d = 1; d <= days; d++) {
    const c = document.createElement("div");
    c.textContent = d;

    if (
      d === today.getDate() &&
      m === today.getMonth() &&
      y === today.getFullYear()
    ) {
      c.classList.add("today");
    }

    c.onclick = () => selectDate(y, m, d);
    calendarGrid.appendChild(c);
  }
}

/* -------- MONTH NAVIGATION -------- */

document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

renderCalendar();


/* ---------- TODO ---------- */
const todoInput=document.getElementById("todoInput");
const todoList=document.getElementById("todoList");

function loadTodos(){
  todoList.innerHTML="";
  JSON.parse(localStorage.getItem("todos")||"[]").forEach((t,i)=>{
    const li=document.createElement("li");
    li.textContent=t;
    li.onclick=()=>{const a=JSON.parse(localStorage.getItem("todos"));a.splice(i,1);localStorage.setItem("todos",JSON.stringify(a));loadTodos();}
    todoList.appendChild(li);
  });
}
todoInput.addEventListener("keypress",e=>{
  if(e.key==="Enter"&&todoInput.value){
    const a=JSON.parse(localStorage.getItem("todos")||"[]");
    a.push(todoInput.value); localStorage.setItem("todos",JSON.stringify(a));
    todoInput.value=""; loadTodos();
  }
});
loadTodos();

/* ---------- TIMER (FIXED) ---------- */
let time=0, interval=null;
function updateTimer(){
  const m=String(Math.floor(time/60)).padStart(2,"0");
  const s=String(time%60).padStart(2,"0");
  document.getElementById("timerDisplay").textContent=`${m}:${s}`;
}
function startTimer(){
  if(interval) return;
  interval=setInterval(()=>{if(time>0){time--;updateTimer();}},1000);
}
function pauseTimer(){clearInterval(interval);interval=null;}
function resetTimer(){pauseTimer();time=0;updateTimer();}
updateTimer();

function setCustomTimer() {
  const minutes = parseInt(document.getElementById("customMinutes").value);

  if (isNaN(minutes) || minutes <= 0) return;

  pauseTimer();           
  time = minutes * 60;       
  updateTimer();              
}


/* ---------- NOTES ---------- */
let notesData=JSON.parse(localStorage.getItem("notesData")||"[]");
let currentNoteIndex=0;
const notesList=document.getElementById("notesList");
const notesInput=document.getElementById("notesInput");

function saveNotes(){localStorage.setItem("notesData",JSON.stringify(notesData));}
function loadNotes(){
  notesList.innerHTML="";
  notesData.forEach((n,i)=>{
    const o=document.createElement("option");
    o.value=i; o.textContent=n.title; notesList.appendChild(o);
  });
  if(notesData.length===0) createNote();
  notesList.value=currentNoteIndex;
  notesInput.value=notesData[currentNoteIndex]?.content||"";
}
function createNote(){
  notesData.push({title:`Note ${notesData.length+1}`,content:""});
  currentNoteIndex=notesData.length-1;
  saveNotes(); loadNotes();
}
notesList.onchange=()=>{currentNoteIndex=notesList.value;notesInput.value=notesData[currentNoteIndex].content;}
notesInput.oninput=()=>{notesData[currentNoteIndex].content=notesInput.value;saveNotes();}
let pendingDeleteIndex = null;

function deleteNote(){
  if(!notesData.length) return;
  pendingDeleteIndex = currentNoteIndex;
  openPopup("deleteConfirmPopup");
}

function confirmDeleteNote(){
  if(pendingDeleteIndex === null) return;

  notesData.splice(pendingDeleteIndex,1);
  currentNoteIndex = Math.max(0, currentNoteIndex - 1);

  saveNotes();
  loadNotes();

  pendingDeleteIndex = null;
  closePopup("deleteConfirmPopup");
}


/* ---------- POPUPS ---------- */
function openPopup(id){
  const p=document.getElementById(id);
  p.classList.remove("hidden");
  requestAnimationFrame(()=>p.classList.add("active"));
}
function closePopup(id){
  const p=document.getElementById(id);
  p.classList.remove("active");
  setTimeout(()=>p.classList.add("hidden"),300);
}

function openAsPopup(pageId, popupId) {
  const page = document.getElementById(pageId);
  const popupBox = document.querySelector(`#${popupId} .popup-box`);

  // Force page visible
  page.style.display = "block";

  popupBox.appendChild(page);
  openPopup(popupId);
}

function closePopupAndRestore(popupId, pageId) {
  const page = document.getElementById(pageId);

  // Restore page to body
  document.body.appendChild(page);

  // Hide again (so SPA still works)
  page.style.display = "none";

  closePopup(popupId);
}

