const inputField = document.querySelector('.input-new-to-do');
const addButton = document.querySelector('.button-new');
const toDoListContainer = document.querySelector('.to-do-list-container');
const toDoItemContainer = document.querySelector('.to-do-item-container');

if (!toDoItemContainer) {
  console.error('element not found');
}

let tasks = loadTasksFromLocalStorage();

addButton.addEventListener('click', () => {
  const taskText = inputField.value.trim();

  if (taskText !== '') {
    tasks.push({ text: taskText, done: false });
    inputField.value = '';
    saveTasksToLocalStorage();
    renderTasks();
  }
});

function renderTasks() {
  toDoListContainer.innerHTML = '';

  tasks.forEach((task, index) => {
    const newToDoItemContainer = toDoItemContainer.cloneNode(true);
    newToDoItemContainer.style.display = 'flex';

    console.log(newToDoItemContainer.getAttribute('draggable')); // true oder false?
  
    newToDoItemContainer.dataset.index = index;

    const taskTextElement = newToDoItemContainer.querySelector('.text-to-do');
    taskTextElement.textContent = task.text;

    if (task.done) {
      taskTextElement.style.textDecoration = 'line-through';
    }

    const doneButton = newToDoItemContainer.querySelector('.button-done');
    doneButton.addEventListener('click', () => {
      task.done = !task.done;

      taskTextElement.style.textDecoration = task.done
        ? 'line-through'
        : 'none';

      saveTasksToLocalStorage();
    });

    const deleteButton = newToDoItemContainer.querySelector('.button-delete');
    deleteButton.addEventListener('click', () => {
      tasks.splice(index, 1);

      saveTasksToLocalStorage();

      renderTasks();
    });

    newToDoItemContainer.addEventListener('dragstart', handleDragStart);
    newToDoItemContainer.addEventListener('dragover', handleDragOver);
    newToDoItemContainer.addEventListener('drop', handleDrop);

    toDoListContainer.appendChild(newToDoItemContainer);
  });
}


function handleDragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.dataset.index);
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  const draggedIndex = event.dataTransfer.getData('text/plain');
  const targetIndex = event.target.closest('.to-do-item-container').dataset.index;

  if (draggedIndex !== targetIndex) {
    const draggedTask = tasks.splice(draggedIndex, 1)[0]; 
    tasks.splice(targetIndex, 0, draggedTask); 
    saveTasksToLocalStorage();
    renderTasks();
  }
}

function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks');
  return storedTasks ? JSON.parse(storedTasks) : [];
}

document.addEventListener('DOMContentLoaded', renderTasks);
