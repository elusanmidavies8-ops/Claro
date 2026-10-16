// ==========================================
// CLARO — DAILY TASK SYSTEM
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('onboarding-7');

  if (!root) return;

  // ==========================================
  // USER
  // ==========================================

  const name = getStoredName();

  // ==========================================
  // GREETING
  // ==========================================

  const greeting = document.getElementById('greetings');

  if (greeting) {
    greeting.innerHTML = `
      <div class="today-label">${getTodayLabel()}</div>
      <div class="welcome-message">Welcome, ${escapeHtml(name)}</div>
    `;
  }

  // ==========================================
  // TASK DATA
  // ==========================================

  let tasks = loadTasks();

  // Give first-time users some example tasks.
  if (tasks.length === 0) {
    tasks = getDefaultTasks();
    saveTasks(tasks);
  }

  // ==========================================
  // MAIN CONTAINER
  // ==========================================

  const container = document.createElement('div');

  container.className = 'task-container';

  container.innerHTML = `
    <section class="day-overview">

      <div class="overview-heading">
        <div>
          <p class="section-label">YOUR DAY</p>
          <h2>Today's Plan</h2>
        </div>

        <div class="progress-summary">
          <strong id="progress-count">0 / 0</strong>
          <span>completed</span>
        </div>
      </div>

      <div class="progress-bar">
        <div id="progress-fill"></div>
      </div>

    </section>


    <section class="now-section">

      <div class="section-heading">
        <span>NOW</span>
      </div>

      <div id="current-task"></div>

    </section>


    <section class="up-next-section">

      <div class="section-heading">
        <span>UP NEXT</span>
      </div>

      <div id="tasks-list"></div>

    </section>


    <section class="task-add">

      <input
        id="new-task"
        type="text"
        placeholder="What do you need to get done?"
        autocomplete="off"
      />

      <button id="add-btn" type="button">
        + Add task
      </button>

    </section>
  `;

  root.appendChild(container);


  // ==========================================
  // ELEMENTS
  // ==========================================

  const listEl = container.querySelector('#tasks-list');
  const currentTaskEl = container.querySelector('#current-task');

  const newInput = container.querySelector('#new-task');
  const addButton = container.querySelector('#add-btn');

  const progressCount = container.querySelector('#progress-count');
  const progressFill = container.querySelector('#progress-fill');


  // ==========================================
  // RENDER EVERYTHING
  // ==========================================

  function render() {
    renderCurrentTask();
    renderTaskList();
    renderProgress();
  }


  // ==========================================
  // CURRENT TASK
  // ==========================================

  function renderCurrentTask() {
    currentTaskEl.innerHTML = '';

    const currentTask = getCurrentTask();

    if (!currentTask) {
      currentTaskEl.innerHTML = `
        <div class="empty-now">
          <div class="empty-icon">✨</div>
          <div>
            <strong>You're all caught up.</strong>
            <p>No unfinished tasks right now.</p>
          </div>
        </div>
      `;

      return;
    }


    const taskIndex = tasks.indexOf(currentTask);

    const card = document.createElement('div');

    card.className = `current-task ${
      currentTask.done ? 'completed' : ''
    }`;

    card.innerHTML = `
      <div class="current-task-top">

        <div class="task-icon">
          ${escapeHtml(currentTask.icon)}
        </div>

        <div class="current-task-status">
          NOW
        </div>

      </div>


      <div class="current-task-content">

        <div class="current-task-title">
          ${escapeHtml(currentTask.title)}
        </div>

        <div class="current-task-time">
          ${escapeHtml(currentTask.time)}
        </div>

        <p class="current-task-description">
          ${escapeHtml(currentTask.description)}
        </p>

      </div>


      <div class="current-task-actions">

        <button
          class="complete-current"
          data-i="${taskIndex}"
          type="button"
        >
          ${currentTask.done ? 'Completed ✓' : 'Mark complete'}
        </button>

      </div>
    `;

    currentTaskEl.appendChild(card);


    const completeButton =
      card.querySelector('.complete-current');

    completeButton.addEventListener('click', () => {
      const i = Number(completeButton.dataset.i);

      tasks[i].done = !tasks[i].done;

      saveTasks(tasks);
      render();
    });
  }


  // ==========================================
  // TASK LIST
  // ==========================================

  function renderTaskList() {
    listEl.innerHTML = '';

    const currentTaskIndex = tasks.findIndex(task => !task.done);

    const upcomingTasks = tasks.filter((task, index) => {
      return !task.done && index !== currentTaskIndex;
    });


    if (upcomingTasks.length === 0) {
      listEl.innerHTML = `
        <div class="empty-list">
          Nothing else planned.
        </div>
      `;

      return;
    }


    upcomingTasks.forEach(task => {
      const taskIndex = tasks.indexOf(task);

      const element = document.createElement('div');

      element.className = `
        task
        ${task.done ? 'completed' : ''}
      `;


      element.innerHTML = `

        <label class="task-check">

          <input
            type="checkbox"
            class="chk"
            data-i="${taskIndex}"
            ${task.done ? 'checked' : ''}
          >

          <span class="checkmark"></span>

        </label>


        <div class="task-icon">
          ${escapeHtml(task.icon)}
        </div>


        <div class="task-content">

          <div class="task-top">

            <span
              class="title"
              contenteditable="true"
              data-i="${taskIndex}"
            >
              ${escapeHtml(task.title)}
            </span>

            <span class="task-time">
              ${escapeHtml(task.time)}
            </span>

          </div>


          <div class="task-description">
            ${escapeHtml(task.description)}
          </div>

        </div>


        <button
          class="del"
          data-i="${taskIndex}"
          type="button"
          aria-label="Delete task"
        >
          ×
        </button>

      `;


      listEl.appendChild(element);
    });


    // ==========================================
    // CHECKBOXES
    // ==========================================

    listEl.querySelectorAll('.chk').forEach(checkbox => {

      checkbox.addEventListener('change', event => {

        const index =
          Number(event.target.dataset.i);

        tasks[index].done =
          event.target.checked;

        saveTasks(tasks);

        render();
      });

    });


    // ==========================================
    // DELETE
    // ==========================================

    listEl.querySelectorAll('.del').forEach(button => {

      button.addEventListener('click', event => {

        const index =
          Number(event.target.dataset.i);

        tasks.splice(index, 1);

        saveTasks(tasks);

        render();
      });

    });


    // ==========================================
    // EDIT TASK TITLE
    // ==========================================

    listEl.querySelectorAll('.title').forEach(title => {

      title.addEventListener('blur', event => {

        const index =
          Number(event.target.dataset.i);

        const newTitle =
          event.target.textContent.trim();

        if (!newTitle) {
          event.target.textContent =
            tasks[index].title;

          return;
        }

        tasks[index].title = newTitle;

        saveTasks(tasks);

        render();
      });

    });

  }


  // ==========================================
  // PROGRESS
  // ==========================================

  function renderProgress() {

    const total = tasks.length;

    const completed =
      tasks.filter(task => task.done).length;


    progressCount.textContent =
      `${completed} / ${total}`;


    const percentage =
      total === 0
        ? 0
        : Math.round((completed / total) * 100);


    progressFill.style.width =
      `${percentage}%`;
  }


  // ==========================================
  // ADD TASK
  // ==========================================

  function addTask() {

    const value =
      newInput.value.trim();

    if (!value) return;


    const newTask = {
      id: Date.now(),

      title: value,

      icon: '📌',

      time: 'Anytime',

      description: 'Added to your day',

      done: false
    };


    tasks.push(newTask);

    saveTasks(tasks);

    newInput.value = '';

    render();
  }


  addButton.addEventListener('click', addTask);


  newInput.addEventListener('keydown', event => {

    if (event.key === 'Enter') {
      addTask();
    }

  });


  // ==========================================
  // INITIAL RENDER
  // ==========================================

  render();
});


// ==========================================
// DEFAULT TASKS
// ==========================================

function getDefaultTasks() {

  return [

    {
      id: Date.now() + 1,

      title: 'Morning Reset',

      icon: '🌅',

      time: '7:00 – 8:00 AM',

      description:
        'Wake up, wash up, eat and get ready',

      done: false
    },


    {
      id: Date.now() + 2,

      title: 'Deep Work',

      icon: '🎯',

      time: '8:30 – 10:30 AM',

      description:
        'Focus on your most important academic task',

      done: false
    },


    {
      id: Date.now() + 3,

      title: 'Recharge',

      icon: '☕',

      time: '10:30 – 11:00 AM',

      description:
        'Step away, eat something and reset',

      done: false
    },


    {
      id: Date.now() + 4,

      title: 'Skill Builder',

      icon: '🧠',

      time: '11:00 AM – 12:00 PM',

      description:
        'Work on one skill that moves you forward',

      done: false
    },


    {
      id: Date.now() + 5,

      title: 'Study Block',

      icon: '📚',

      time: '2:00 – 4:00 PM',

      description:
        'Continue your current course or learning goal',

      done: false
    },


    {
      id: Date.now() + 6,

      title: 'Reset Walk',

      icon: '🌿',

      time: '4:00 – 4:30 PM',

      description:
        'Get away from the screen and clear your head',

      done: false
    },


    {
      id: Date.now() + 7,

      title: 'Review',

      icon: '🔍',

      time: '7:00 – 7:30 PM',

      description:
        'Check what you finished and what remains',

      done: false
    },


    {
      id: Date.now() + 8,

      title: 'Tomorrow Setup',

      icon: '🌙',

      time: '9:00 – 9:15 PM',

      description:
        'Prepare tomorrow’s priorities',

      done: false
    }

  ];
}


// ==========================================
// CURRENT TASK
// ==========================================

function getCurrentTask() {

  const unfinished =
    window.claroTasksForCurrentTask || null;

  // The first unfinished task is treated
  // as the current task for now.

  try {

    const tasks =
      JSON.parse(
        localStorage.getItem('claro_tasks') || '[]'
      );

    return tasks.find(task => !task.done) || null;

  } catch (error) {

    return null;
  }
}


// ==========================================
// LOCAL STORAGE
// ==========================================

function loadTasks() {

  try {

    const stored =
      localStorage.getItem('claro_tasks');

    if (!stored) return [];

    const parsed =
      JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    // Upgrade old tasks that only had
    // title + done.

    return parsed.map(task => ({

      id:
        task.id || Date.now() + Math.random(),

      title:
        task.title || 'Untitled task',

      icon:
        task.icon || '📌',

      time:
        task.time || 'Anytime',

      description:
        task.description || 'Added to your day',

      done:
        Boolean(task.done)

    }));

  } catch (error) {

    console.error(
      'Could not load Claro tasks:',
      error
    );

    return [];
  }
}


function saveTasks(tasks) {

  try {

    localStorage.setItem(
      'claro_tasks',
      JSON.stringify(tasks)
    );

  } catch (error) {

    console.error(
      'Could not save Claro tasks:',
      error
    );
  }
}


// ==========================================
// USER NAME
// ==========================================

function getStoredName() {

  try {

    return (
      localStorage.getItem('claro_name') ||
      'Friend'
    );

  } catch (error) {

    return 'Friend';
  }
}


// ==========================================
// DATE
// ==========================================

function getTodayLabel() {

  const today = new Date();


  const formatted =
    today.toLocaleDateString('en-US', {

      weekday: 'long',

      month: 'short',

      day: 'numeric'

    });


  return `TODAY · ${formatted.toUpperCase()}`;
}


// ==========================================
// HTML ESCAPING
// ==========================================

function escapeHtml(value) {

  return String(value).replace(
    /[&<>"']/g,
    character => ({

      '&': '&amp;',

      '<': '&lt;',

      '>': '&gt;',

      '"': '&quot;',

      "'": '&#39;'

    })[character]
  );
}