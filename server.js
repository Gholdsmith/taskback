const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json()); // Pour parser le JSON dans les requêtes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/todoDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Définir le schéma de la tâche
const taskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false }
});

// Créer le modèle MongoDB à partir du schéma
const Task = mongoose.model('Task', taskSchema);

// Endpoint pour créer une nouvelle tâche
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  const task = new Task({ title });
  await task.save();
  res.status(201).send(task);
});

// Endpoint pour récupérer toutes les tâches
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).send(tasks);
});


// Dans ton server.js ou dans un contrôleur dédié aux tâches
app.delete('/tasks/:id', async (req, res) => {
  try {
    const result = await Task.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Tâche non trouvée' });
    }
    res.status(200).send({ id: res._id, message: 'Tâche supprimée' });
  } catch (error) {
    res.status(500).send(error);
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

