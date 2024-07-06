document.addEventListener('DOMContentLoaded', loadTodos);

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const dueDateInput = document.getElementById('due-date');
const priorityInput = document.getElementById('priority');
const todoList = document.getElementById('todo-list');

todoForm.addEventListener('submit', addTodo);

function addTodo(event) {
    event.preventDefault();
    const todoText = todoInput.value;
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;
    const todoItem = document.createElement('li');
    todoItem.classList.add(`priority-${priority}`);
    todoItem.innerHTML = `
        <span class="todo-text">${todoText} (Jatuh Tempo: ${dueDate})</span>
        <div>
            <button class="edit-btn">✏️</button>
            <button class="complete-btn">✔️</button>
            <button class="delete-btn">❌</button>
        </div>
    `;
    todoList.appendChild(todoItem);
    saveTodos();
    todoInput.value = '';
    dueDateInput.value = '';
}

todoList.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-btn')) {
        editTodo(event.target);
    } else if (event.target.classList.contains('complete-btn')) {
        toggleComplete(event.target);
    } else if (event.target.classList.contains('delete-btn')) {
        deleteTodo(event.target);
    }
});

function editTodo(button) {
    const todoItem = button.closest('li');
    const todoTextElement = todoItem.querySelector('.todo-text');
    const [todoText, dueDateText] = todoTextElement.innerText.split(' (Jatuh Tempo: ');
    const dueDate = dueDateText.replace(')', '');
    const newTodoText = prompt('Edit tugas Anda', todoText);
    const newDueDate = prompt('Edit tanggal jatuh tempo', dueDate);

    if (newTodoText !== null && newDueDate !== null) {
        todoTextElement.innerText = `${newTodoText} (Jatuh Tempo: ${newDueDate})`;
        saveTodos();
    }
}

function toggleComplete(button) {
    const todoItem = button.closest('li');
    todoItem.classList.toggle('completed');
    saveTodos();
}

function deleteTodo(button) {
    const todoItem = button.closest('li');
    todoItem.remove();
    saveTodos();
}

function clearAll() {
    todoList.innerHTML = '';
    saveTodos();
}

function filterTodos(filter) {
    const todos = document.querySelectorAll('#todo-list li');
    todos.forEach(todo => {
        switch (filter) {
            case 'all':
                todo.style.display = 'flex';
                break;
            case 'completed':
                todo.style.display = todo.classList.contains('completed') ? 'flex' : 'none';
                break;
            case 'incomplete':
                todo.style.display = todo.classList.contains('completed') ? 'none' : 'flex';
                break;
        }
    });
}

function saveTodos() {
    const todos = [];
    document.querySelectorAll('#todo-list li').forEach(todoItem => {
        todos.push({
            text: todoItem.querySelector('.todo-text').innerText,
            completed: todoItem.classList.contains('completed'),
            priority: todoItem.classList.contains('priority-high') ? 'high' : todoItem.classList.contains('priority-medium') ? 'medium' : 'low'
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.classList.add(`priority-${todo.priority}`);
        if (todo.completed) {
            todoItem.classList.add('completed');
        }
        todoItem.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            <div>
                <button class="edit-btn">✏️</button>
                <button class="complete-btn">✔️</button>
                <button class="delete-btn">❌</button>
            </div>
        `;
        todoList.appendChild(todoItem);
    });
}