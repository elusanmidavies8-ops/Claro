// Minimal editable task UI with localStorage persistence and greeting
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('onboarding-7');
  if (!root) return;

  // greeting
  const name = (function(){ try { return localStorage.getItem('claro_name') || 'Friend'; } catch(e){ return 'Friend'; } })();
  const greet = document.getElementById('greetings');
  if (greet) greet.textContent = `Welcome ${name}`;

  // basic UI container
  const container = document.createElement('div');
  container.className = 'task-container';
  container.innerHTML = `
    <div class="task-add">
      <input id="new-task" placeholder="Add a task for today" />
      <button id="add-btn">Add</button>
    </div>
    <div id="tasks-list"></div>
  `;
  root.appendChild(container);

  // load/save helpers
  function loadTasks(){
    try { return JSON.parse(localStorage.getItem('claro_tasks') || '[]'); } catch(e){ return []; }
  }
  function saveTasks(t){ try { localStorage.setItem('claro_tasks', JSON.stringify(t)); } catch(e){} }

  let tasks = loadTasks();

  const listEl = container.querySelector('#tasks-list');
  function render(){
    listEl.innerHTML = '';
    tasks.forEach((task, i) => {
      const el = document.createElement('div');
      el.className = 'task';
      el.innerHTML = `
        <input type="checkbox" class="chk" ${task.done? 'checked': ''} data-i="${i}">
        <span class="title" contenteditable="true" data-i="${i}">${escapeHtml(task.title)}</span>
        <button class="del" data-i="${i}">Delete</button>
      `;
      listEl.appendChild(el);
    });

    // wire events
    listEl.querySelectorAll('.chk').forEach(cb => cb.addEventListener('change', (e)=>{
      const i = +e.target.dataset.i; tasks[i].done = e.target.checked; saveTasks(tasks); render();
    }));
    listEl.querySelectorAll('.del').forEach(btn => btn.addEventListener('click', (e)=>{
      const i = +e.target.dataset.i; tasks.splice(i,1); saveTasks(tasks); render();
    }));
    listEl.querySelectorAll('.title').forEach(span=>{
      span.addEventListener('input', (e)=>{ const i=+e.target.dataset.i; tasks[i].title = e.target.textContent.trim(); saveTasks(tasks); });
    });
  }

  // add
  const newInput = container.querySelector('#new-task');
  container.querySelector('#add-btn').addEventListener('click', ()=>{
    const v = newInput.value.trim(); if (!v) return; tasks.unshift({ title: v, done: false, id: Date.now() }); saveTasks(tasks); newInput.value=''; render();
  });

  render();
});

function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }
