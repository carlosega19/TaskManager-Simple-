// Estado de la aplicación
let todos = [];
let currentFilter = 'all';

// Elementos del DOM
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const todoFilters = document.getElementById('todoFilters');
const emptyState = document.getElementById('emptyState');
const filterEmptyState = document.getElementById('filterEmptyState');
const todoStats = document.getElementById('todoStats');
const clearCompletedBtn = document.getElementById('clearCompleted');

// Contadores
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');
const totalCount = document.getElementById('totalCount');
const pendingCount = document.getElementById('pendingCount');
const completedStatsCount = document.getElementById('completedStatsCount');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Cargar todos del localStorage
     loadTodosFromStorage();
     
     // Event listeners
     todoForm.addEventListener('submit', handleAddTodo);
     todoInput.addEventListener('input', handleInputChange);
     clearCompletedBtn.addEventListener('click', clearCompleted);
     
     // Filtros
     const filterBtns = document.querySelectorAll('.filter-btn');
     filterBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
               const filter = e.target.getAttribute('data-filter');
               setFilter(filter);
          });
     });
     
     // Renderizar vista inicial
     render();
});

// Funciones principales
function generateId() {
     return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function handleAddTodo(e) {
     e.preventDefault();
     const text = todoInput.value.trim();
     
     if (!text) return;
     
     const newTodo = {
          id: generateId(),
          text: text,
          completed: false,
          createdAt: new Date().toISOString()
     };
     
     todos.unshift(newTodo);
     todoInput.value = '';
     
     saveTodosToStorage();
     render();
}

function handleInputChange() {
     const hasText = todoInput.value.trim().length > 0;
     addBtn.disabled = !hasText;
}

function toggleTodo(id) {
     todos = todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
     );
     
     saveTodosToStorage();
     render();
}

function deleteTodo(id) {
     todos = todos.filter(todo => todo.id !== id);
     
     saveTodosToStorage();
     render();
}

function clearCompleted() {
     todos = todos.filter(todo => !todo.completed);
     
     saveTodosToStorage();
     render();
}

function setFilter(filter) {
     currentFilter = filter;
     
     // Actualizar botones de filtro
     const filterBtns = document.querySelectorAll('.filter-btn');
     filterBtns.forEach(btn => {
          btn.classList.remove('active');
          if (btn.getAttribute('data-filter') === filter) {
               btn.classList.add('active');
          }
     });
     
     render();
}

// Funciones de renderizado
function render() {
     const filteredTodos = getFilteredTodos();
     
     renderTodoList(filteredTodos);
     renderFilters();
     renderStats();
     renderEmptyStates(filteredTodos);
}

function getFilteredTodos() {
     switch (currentFilter) {
          case 'active':
               return todos.filter(todo => !todo.completed);
          case 'completed':
               return todos.filter(todo => todo.completed);
          default:
               return todos;
     }
}

function renderTodoList(filteredTodos) {
     todoList.innerHTML = '';
     
     filteredTodos.forEach(todo => {
          const todoItem = createTodoElement(todo);
          todoList.appendChild(todoItem);
     });
}

function createTodoElement(todo) {
     const todoItem = document.createElement('div');
     todoItem.className = 'todo-item';
     
     todoItem.innerHTML = `
          <input 
               type="checkbox" 
               class="todo-checkbox" 
               ${todo.completed ? 'checked' : ''}
               onchange="toggleTodo('${todo.id}')"
          >
          <span class="todo-text ${todo.completed ? 'completed' : ''}">${escapeHtml(todo.text)}</span>
          <button class="delete-btn" onclick="deleteTodo('${todo.id}')">
               <svg class="trash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="m19,6v14a2,2 0 0 1-2,2H7a2,2 0 0 1-2-2V6m3,0V4a2,2 0 0 1 2-2h4a2,2 0 0 1 2,2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
               </svg>
          </button>
     `;
     
     return todoItem;
}

function renderFilters() {
     const activeTodos = todos.filter(todo => !todo.completed).length;
     const completedTodos = todos.filter(todo => todo.completed).length;
     
     activeCount.textContent = `(${activeTodos})`;
     completedCount.textContent = `(${completedTodos})`;
     
     // Mostrar/ocultar filtros
     todoFilters.style.display = todos.length > 0 ? 'flex' : 'none';
     
     // Mostrar/ocultar botón de limpiar completadas
     clearCompletedBtn.style.display = completedTodos > 0 ? 'block' : 'none';
}

function renderStats() {
     const activeTodos = todos.filter(todo => !todo.completed).length;
     const completedTodos = todos.filter(todo => todo.completed).length;
     
     totalCount.textContent = todos.length;
     pendingCount.textContent = activeTodos;
     completedStatsCount.textContent = completedTodos;
     
     todoStats.style.display = todos.length > 0 ? 'block' : 'none';
}

function renderEmptyStates(filteredTodos) {
     const hasNoTodos = todos.length === 0;
     const hasNoFilteredTodos = todos.length > 0 && filteredTodos.length === 0;
     
     emptyState.style.display = hasNoTodos ? 'block' : 'none';
     filterEmptyState.style.display = hasNoFilteredTodos ? 'block' : 'none';
     todoList.style.display = filteredTodos.length > 0 ? 'block' : 'none';
}

// Funciones utilitarias
function escapeHtml(text) {
     const div = document.createElement('div');
     div.textContent = text;
     return div.innerHTML;
}

function saveTodosToStorage() {
     localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodosFromStorage() {
     try {
          const savedTodos = localStorage.getItem('todos');
          if (savedTodos) {
               todos = JSON.parse(savedTodos);
          }
     } catch (error) {
          console.error('Error loading todos from localStorage:', error);
          todos = [];
     }
}