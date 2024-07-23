const Task = require('../models/task');
const logger = require('../logger')

const createTask = async (req, res) => {
  const { title } = req.body;
  const task = new Task({ title });
  await task.save();
  res.status(201).send(task);
};

const getTasks = async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).send(tasks);
};

const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).send({ message: 'Task not found' });
  }
  res.status(200).send(task);
};



//Mise à jour de la tâche
const updateTask = async (req, res) => {

    logger.info('Requête PUT reçue avec les données suivantes:',{ body: req.body});
    logger.info(`ID de la tâche: ${req.params.id}`);
  
    try {
      const result = await Task.updateOne({ _id: req.params.id }, req.body);
      logger.info('Résultat de l\'opération de mise à jour:', {result});
      if (result.matchedCount === 0) {
        logger.info(`Aucune tâche trouvé avec l'ID: ${req.params.id}`);
        return res.status(404).send({ message: 'tâche non trouvée => ' + req.params.id });
      }
      if (result.modifiedCount === 0) {
        logger.info('Aucune modification apportée à la tâche (peut-être aucune donnée nouvelle ou tâche non trouvée).');
  
      }
      res.status(200).send({ id: req.params.id, message: 'Tâche traitée avec succès' });
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour de la tâche:', ${error}`);
      res.status(500).send(error);
    }
//   })
};


const deleteTask = async (req, res) => {

    logger.info('ici on delete');
  try {
    const result = await Task.deleteOne({ _id: req.params.id });
    logger.info('Résultat de l\'opération de suppression:', {result});
    logger.info('Résultat de l\'opération de suppression:', result);
    console.log('Résultat de l\'opération de suppression:', result);

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.status(200).send({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
};
  
module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
