// URL del backend API
const API_URL = 'http://localhost:8000/api';

// Cargar todas las tareas al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    
    // Permitir crear tarea con Enter
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createTodo();
        }
    });
});

// Función para cargar todas las tareas desde el backend
async function loadTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`);
        const todos = await response.json();
        
        displayTodos(todos);
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        alert('Error al conectar con el servidor. Verifica que el backend esté corriendo.');
    }
}

// Función para mostrar las tareas en el HTML
function displayTodos(todos) {
    const todoList = document.getElementById('todoList');
    
    if (todos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">No hay tareas. ¡Agrega una nueva!</div>';
        return;
    }
    
    todoList.innerHTML = todos.map(todo => `
        <div class="todo-item" data-id="${todo.id}">
            <span class="todo-text">${todo.title}</span>
            <button class="update-btn" onclick="updateTodo(${todo.id})">
                Actualizar
                </button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                Eliminar
            </button>
        </div>
    `).join('');
}

// Función para crear una nueva tarea
async function createTodo() {
    const input = document.getElementById('todoInput');
    const title = input.value.trim();
    
    if (!title) {
        alert('Por favor escribe una tarea');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title })
        });
        
        if (response.ok) {
            input.value = '';
            loadTodos(); // Recargar la lista
        }
    } catch (error) {
        console.error('Error al crear tarea:', error);
        alert('Error al crear la tarea');
    }
}

// Función para eliminar una tarea
async function deleteTodo(id) {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadTodos(); // Recargar la lista
        }
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        alert('Error al eliminar la tarea');
    }
}


// Función para actualizar una tarea
async function updateTodo(id) {
    // 1. **CORRECCIÓN:** Selecciona el elemento .todo-text DENTRO del .todo-item
    const todoElement = document.querySelector(`.todo-item[data-id="${id}"] .todo-text`);
    
    // Si no se encuentra el elemento, no se puede obtener el título actual
    if (!todoElement) {
        console.error('Elemento de tarea no encontrado para ID:', id);
        return;
    }
    
    // Usa el texto del elemento encontrado para el prompt
    const newtitle = prompt("Ingresa el nuevo título para la tarea", todoElement.textContent.trim()); 
    
    if (!newtitle || newtitle.trim() === '') {
        alert('La tarea no puede estar vacía');
        return;
    }

    try {
        // 2. **CORRECCIÓN:** Usar Template Literal (`) y enviar el cuerpo de la solicitud
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            // Enviar el nuevo título
            body: JSON.stringify({ title: newtitle }) 
        });

        if (response.ok) {
            loadTodos();
            // Ya no es necesario el alert, la recarga ya muestra el cambio
        } else {
            // Manejo de errores mejorado
            const errorData = await response.json();
            console.error('Error del servidor al actualizar:', errorData);
            alert(`Error al actualizar: ${errorData.detail || 'Fallo desconocido'}`);
        }
    } catch (error) {
        console.error('Error de red al actualizar tarea:', error);
        alert('Error de conexión al actualizar la tarea');
    }
}