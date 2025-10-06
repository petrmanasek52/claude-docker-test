// API Base URL
const API_URL = '/api/todos';

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todosList = document.getElementById('todos-list');
const emptyState = document.getElementById('empty-state');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const stats = document.getElementById('stats');
const statsText = document.getElementById('stats-text');

// State
let todos = [];

// ============ API Functions ============

async function fetchTodos() {
    try {
        showLoading();
        hideError();

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch todos');
        }

        todos = data.data;
        renderTodos();
        hideLoading();
    } catch (err) {
        console.error('Error fetching todos:', err);
        showError('Nepodařilo se načíst úkoly. Zkontroluj připojení k serveru.');
        hideLoading();
    }
}

async function createTodo(title) {
    try {
        hideError();

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to create todo');
        }

        // Add new todo to the beginning of the list
        todos.unshift(data.data);
        renderTodos();
    } catch (err) {
        console.error('Error creating todo:', err);
        showError('Nepodařilo se vytvořit úkol: ' + err.message);
    }
}

async function toggleTodo(id) {
    try {
        hideError();

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to toggle todo');
        }

        // Update todo in the list
        const index = todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            todos[index] = data.data;
            renderTodos();
        }
    } catch (err) {
        console.error('Error toggling todo:', err);
        showError('Nepodařilo se aktualizovat úkol: ' + err.message);
    }
}

async function deleteTodo(id) {
    try {
        hideError();

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to delete todo');
        }

        // Remove todo from the list
        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
    } catch (err) {
        console.error('Error deleting todo:', err);
        showError('Nepodařilo se smazat úkol: ' + err.message);
    }
}

// ============ UI Functions ============

function renderTodos() {
    // Clear the list
    todosList.innerHTML = '';

    // Show/hide empty state
    if (todos.length === 0) {
        emptyState.classList.remove('hidden');
        stats.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    // Render each todo
    todos.forEach(todo => {
        const li = createTodoElement(todo);
        todosList.appendChild(li);
    });

    // Update stats
    updateStats();
}

function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.className = 'w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer';
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const text = document.createElement('span');
    text.className = `flex-1 text-gray-800 ${todo.completed ? 'line-through text-gray-400' : ''}`;
    text.textContent = todo.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded hover:bg-red-50 transition-colors duration-200';
    deleteBtn.textContent = 'Smazat';
    deleteBtn.addEventListener('click', () => {
        if (confirm('Opravdu chceš smazat tento úkol?')) {
            deleteTodo(todo.id);
        }
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);

    return li;
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;

    statsText.textContent = `Celkem: ${total} | Hotovo: ${completed} | Zbývá: ${pending}`;
    stats.classList.remove('hidden');
}

function showLoading() {
    loading.classList.remove('hidden');
    todosList.classList.add('hidden');
    emptyState.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
    todosList.classList.remove('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    error.classList.remove('hidden');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    error.classList.add('hidden');
}

// ============ Event Handlers ============

todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = todoInput.value.trim();

    if (!title) {
        showError('Zadej název úkolu!');
        return;
    }

    await createTodo(title);
    todoInput.value = '';
    todoInput.focus();
});

// ============ Initialize App ============

document.addEventListener('DOMContentLoaded', () => {
    fetchTodos();
    todoInput.focus();
});
