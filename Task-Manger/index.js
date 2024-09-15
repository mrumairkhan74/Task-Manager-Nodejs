// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// In-memory task storage
let tasks = [];

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/tasks', (req, res) => {
    res.json(tasks);
});


// task post
app.post('/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        description: req.body.description
    };
    tasks.push(newTask);
    res.json(newTask);
});

// task update
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updatedDescription = req.body.description;
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.description = updatedDescription;
        res.json(task);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// task delete

app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    tasks = tasks.filter(task => task.id !== id);
    res.status(204).end();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
