const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

let tasks = [
  { id: 1, title: 'Apprendre Angular', completed: false },
  { id: 2, title: 'Construire une API RESTful', completed: false }
];

app.use(cors());
app.use(bodyParser.json());

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.post('/tasks', (req, res) => {
  const task = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: req.body.completed
  };
  tasks.push(task);
  res.status(201).send(task);
});

app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex > -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    res.status(200).send(tasks[taskIndex]);
  } else {
    res.status(404).send("Task not found");
  }
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
