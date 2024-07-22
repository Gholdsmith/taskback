const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const taskController = require('./controllers/taskController');
const userController = require('./controllers/userController');
const authenticateToken = require('./middleware/authMiddleware');

const PORT = process.env.PORT || 3000;

app.use(express.json()); // Pour parser le JSON dans les requêtes

app.use(cors());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   next();
//   });
  
  
  // Connect to MongoDB
  const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoDB';
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


app.post('/register', userController.register);
app.post('/login', userController.login);



app.post('/tasks', taskController.createTask);
app.get('/tasks', taskController.getTasks);


// app.post('/tasks', authenticateToken, taskController.createTask);
// app.get('/tasks', authenticateToken, taskController.getTasks);
// app.get('/tasks:id', authenticateToken, taskController.getTaskById);
// app.put('/task:id', authenticateToken, taskController.updateTask);





app.get('/tasks/:id', taskController.getTaskById);
app.put('/tasks/:id', taskController.updateTask);
app.delete('/tasks/:id', taskController.deleteTask);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

