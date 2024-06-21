const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 3000;


app.use(express.json()); // Pour parser le JSON dans les requêtes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
  });
  
  
  // Connect to MongoDB
  const mongoDB = process.env.OBJECTROCKET_URL || 'mongodb://localhost:27017/todoDB';
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));



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

// Endpoint pour récupérer une tâche
app.get('/tasks/:id', async (req, res) => {
  const tasks = await Task.findOne({ _id: req.params.id });
  res.status(200).send(tasks);
});


//Mise à jour de la tâche
app.put('/tasks/:id', async (req, res) => {
  console.log('Requête PUT reçue avec les données suivantes:', req.body);
  console.log('ID de la tâche:', req.params.id);

  try {
    const result = await Task.updateOne({ _id: req.params.id }, req.body);
    console.log('Résultat de l\'opération de mise à jour:', result);
    if (result.matchedCount === 0) {
      console.log(`Aucune tâche trouvé avec l'ID: ${req.params.id}`);
      return res.status(404).send({ message: 'tâche non trouvée => ' + req.params.id });
    }
    if (result.modifiedCount === 0) {
      console.log('Aucune modification apportée à la tâche (peut-être aucune donnée nouvelle ou tâche non trouvée).');

    }
    res.status(200).send({ id: req.params.id, message: 'Tâche traitée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).send(error);
  }
});

// Dans  server.js ou dans un contrôleur dédié aux tâches
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



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

