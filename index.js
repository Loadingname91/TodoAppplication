// require the express module
const express = require('express');

// require the cors module
const cors = require('cors');

// create an instance of express to serve our end points
var app = express();

// require the use of multer
var multer = require('multer');
var upload = multer();

// for parsing multipart/form-data
app.use([upload.array(),express.json()]);

// create a default set of tasks to do
var tasks = [
    'Wake up',
    'Eat breakfast',
    'Code all day',
    'Sleep'
];


// get all the tasks
app.get('/tasks', function (req, res) {
    res.json(tasks);
});


// add a new task with data passed in request body
app.post('/tasks', function (req, res) {
    var requestData = req.body
    tasks.push(requestData.task);
    res.json(tasks);
});

// delete a task
app.delete('/tasks/:id', function (req, res) {
    var id = req.params.id;
    tasks.splice(id, 1);
    res.json(tasks);
});

// update a task
app.put('/tasks/:id', function (req, res) {
    var id = req.params.id;
    var updatedTask = req.body.task;
    tasks[id] = updatedTask;
    res.json(tasks);
});



// enable Cross Origin Resource Sharing so this API can be used from web-apps on other domains
app.use(cors());

// listen on port 3100
app.listen(3100, function () {
    console.log('Example app listening on port 3100!');
});