// require the express module
const express = require('express');

// require the cors module
const cors = require('cors');

// create an instance of express to serve our end points
var app = express();

// require the use of multer
var multer = require('multer');
var upload = multer();

// use the express-static middleware
app.use([upload.array(), express.json(),cors()]);

// require mongodb
const {MongoClient,ObjectId} = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });

async function mongoConnect(){
    await client.connect();
}

// connect to the database
mongoConnect();

// database name: tasks
const db = client.db('tasks');

// table name: tasks
const tasks = db.collection('tasks');


// create a default set of tasks to do
db.createCollection('tasks');

// prepopulate the tasks collection
async function populateCollection(){
    if (await tasks.countDocuments() !== 0) return;
    await tasks.insertMany([
        {task: 'Buy some milk',status: 'not_started'},
        {task: 'Pick up the kids',status:'not_started'},
        {task: 'Send out invitations',status:'not_started'},
        {task: 'Book a hotel for the party',status:'not_started'},
        {task: 'Call the plumber',status:'not_started'}
    ]);
}

populateCollection();


// get a list of tasks
app.get('/tasks', function (req, res) {
    async function getTasks(){
        const cursor = await tasks.find();
        const results = await cursor.toArray();
        res.json(results);
    }
    return getTasks();
});


// get a single task
app.get('/tasks/:id', function (req, res) {
    const id = req.params.id;
    const mongoId = new ObjectId(id);
    async function getTask(){
        const result = await tasks.findOne({_id: mongoId});
        res.json(result);
    }
    return getTask();
});

// add a task
app.post('/tasks', function (req, res) {
    async function addTask(){
        const result = await tasks.insertOne({task: req.body.task, status: 'not_started'});
        res.json({task: req.body.task, status: 'not_started', _id: result.insertedId});
    }
    return addTask();
});

// delete a task
app.delete('/tasks/:id', function (req, res) {
    const id = req.params.id;
    const mongoId = new ObjectId(id);
    async function deleteTask(){
        const result = await tasks.deleteOne({_id: mongoId});
        res.json({message: 'Task deleted for id ' + id});
    }
    return deleteTask();
});

// update a task
app.put('/tasks/:id', function (req, res) {
    const id = req.params.id;
    const mongoId = new ObjectId(id);
    async function updateTask(){
        const result = await tasks.updateOne({_id:mongoId}, {$set: {task: req.body.task}});
        if (result.modifiedCount === 0){
            return res.json({message: 'Nothing to update'});
        }
        res.json({message: 'Task updated for id ' + id});
    }
    return updateTask();
});

// update a task status
app.put('/tasks/:id/status', function (req, res) {
    const id = req.params.id;
    const mongoId = new ObjectId(id);
    async function updateTaskStatus(){
        const result = await tasks.updateOne({_id:mongoId}, {$set: {status: req.body.status}});
        if (result.modifiedCount === 0){
            return res.json({message: 'Nothing to update'});
        }
        res.json({message: 'Task status updated for id ' + id});
    }
    return updateTaskStatus();
});



// start the server listening on port 3100\
app.listen(3100, () => {
    console.log('Connected to Database, app listening on port 3100');
});