const inputField = document.querySelector('.input-new-to-do');
const addButton = document.querySelector('.button-new');
const toDoListContainer = document.querySelector('.to-do-list-container');
const toDoItemContainer = document.querySelector('.to-do-item-container');
const editIcon = document.querySelector('.icon-edit');
const menuFilter = document.querySelector('.menu-filter');
const taskTitle = document.querySelector('.title');

document.addEventListener('DOMContentLoaded', () => {
  animateTaskTitle(taskTitle);
});

function animateTaskTitle(taskTitleElement) {
  const lettersAndSpaces = taskTitleElement.querySelectorAll('.letter, .space');

  lettersAndSpaces.forEach((item, index) => {
    item.style.setProperty('--i', index);
  });
}

if (!toDoItemContainer) {
  console.error('element not found');
}

let tasks = loadTasksFromLocalStorage();
let filter = 'all';

addButton.addEventListener('click', () => {
  const taskText = inputField.value.trim();

  if (taskText !== '') {
    tasks.push({ text: taskText, done: false });
    inputField.value = '';
    saveTasksToLocalStorage();
    renderTasks();
  }
});

editIcon.addEventListener('click', () => {
  if (menuFilter.style.display === 'none' || menuFilter.style.display === '') {
    menuFilter.style.display = 'flex';
  } else {
    menuFilter.style.display = 'none';
  }
});


document.addEventListener('click', (event) => {
  if (!menuFilter.contains(event.target) && event.target !== editIcon) {
    menuFilter.style.display = 'none';
  }
});

menuFilter
  .querySelector('.menu-item:nth-child(1)')
  .addEventListener('click', () => {
    filter = 'all';
    renderTasks();
    menuFilter.style.display = 'none';
  });

menuFilter
  .querySelector('.menu-item:nth-child(2)')
  .addEventListener('click', () => {
    filter = 'completed';
    renderTasks();
    menuFilter.style.display = 'none';
  });

menuFilter
  .querySelector('.menu-item:nth-child(3)')
  .addEventListener('click', () => {
    filter = 'pending';
    renderTasks();
    menuFilter.style.display = 'none';
  });

function renderTasks() {
  toDoListContainer.innerHTML = '';

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') {
      return task.done;
    }
    if (filter === 'pending') {
      return !task.done;
    }
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const newToDoItemContainer = toDoItemContainer.cloneNode(true);
    newToDoItemContainer.style.display = 'flex';


    newToDoItemContainer.dataset.index = index;

    const taskTextElement = newToDoItemContainer.querySelector('.text-to-do');
    taskTextElement.textContent = task.text;



    updateTaskAppearance(taskTextElement, task.done);



    const doneButton = newToDoItemContainer.querySelector('.button-done');
    doneButton.addEventListener('click', () => {
      task.done = !task.done;

      updateTaskAppearance(taskTextElement, task.done);

      // if (task.done) {
      //   taskTextElement.style.textDecoration = 'line-through';
      //   taskTextElement.style.color = 'gray';
      // } else {
      //   taskTextElement.style.textDecoration = 'none';
      //   taskTextElement.style.color = 'black';
      // }

      console.log(task);

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

function updateTaskAppearance(taskTextElement, isDone) {
  if (isDone) {
    taskTextElement.style.textDecoration = 'line-through';
    taskTextElement.style.color = 'gray';
  } else {
    taskTextElement.style.textDecoration = 'none';
    taskTextElement.style.color = 'black';
  }
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
  const targetIndex = event.target.closest('.to-do-item-container').dataset
    .index;

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
