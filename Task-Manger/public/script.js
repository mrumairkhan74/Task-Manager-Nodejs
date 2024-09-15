// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const editForm = document.getElementById('editForm');
    const editTaskForm = document.getElementById('updateTaskForm');
    const editTaskId = document.getElementById('editTaskId');
    const editTaskInput = document.getElementById('editTaskInput');
    const cancelEdit = document.getElementById('cancelEdit');

    // Fetch tasks from server
    const fetchTasks = async () => {
        const response = await fetch('/tasks');
        const tasks = await response.json();
        taskTable.innerHTML = ''; // Clear table body
        tasks.forEach(task => {
            const row = taskTable.insertRow();
            row.innerHTML = `
                <td>${task.id}</td>
                <td>${task.description}</td>
                <td>
                    <button onclick="editTask(${task.id}, '${task.description}')">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </td>
            `;
        });
    };

    // Add a new task
    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const description = taskInput.value.trim();
        if (description) {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    description: description
                })
            });
            const newTask = await response.json();
            taskInput.value = '';
            fetchTasks(); // Refresh task list
        }
    });

    // Edit a task
    window.editTask = (id, description) => {
        editTaskId.value = id;
        editTaskInput.value = description;
        editForm.style.display = 'block';
    };

    // Update a task
    editTaskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = parseInt(editTaskId.value, 10);
        const description = editTaskInput.value.trim();
        if (description) {
            const response = await fetch(`/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    description: description
                })
            });
            const updatedTask = await response.json();
            editForm.style.display = 'none';
            fetchTasks(); // Refresh task list
        }
    });

    // Cancel edit
    cancelEdit.addEventListener('click', () => {
        editForm.style.display = 'none';
    });

    // Delete a task
    window.deleteTask = async (id) => {
        await fetch(`/tasks/${id}`, {
            method: 'DELETE'
        });
        fetchTasks(); // Refresh task list
    };

    // Initial fetch
    fetchTasks();
});
