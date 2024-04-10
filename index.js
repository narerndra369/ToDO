// require express for setting up the express server
const express = require('express');

// set up the port number
const port = 3369;

// importing the DataBase
const db = require('./config/mongoose');

// importng the Schema For tasks
const  Task  = require('./models/task');

// using express
const app = express();

// using static files
app.use(express.static("./views"));
// to use encrypted data
app.use(express.urlencoded());

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


// rendering the App Page
app.get('/', function(req, res) {
    Task.find({})
        .then(tasks => {
            return res.render('home', {
                title: "Home",
                tasks: tasks
            });
        })
        .catch(err => {
            console.log('Error in fetching tasks from db:', err);
            return res.status(500).send('Internal Server Error');
        });
});



// creating Tasks
app.post('/create-task', async function(req, res) {
    try {
        // Parse the date string to extract only the date part
        const date = new Date(req.body.date);
        const onlyDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const newTask = await Task.create({
            description: req.body.description,
            category: req.body.category,
            date: onlyDate
        });
        console.log('New task created:', newTask);
        return res.redirect('back');
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).send('Internal Server Error');
    }
});




// deleting Tasks
app.get('/delete-task', async function(req, res) {
    try {
        // Get the ids from the query
        var ids = req.query;

        // Checking the number of tasks selected to delete
        var count = Object.keys(ids).length;
        
        for (let i = 0; i < count; i++) {
            // Finding and deleting tasks from the DB one by one using id
            await Task.findByIdAndDelete(Object.keys(ids)[i]);
        }
        
        return res.redirect('back');
    } catch (error) {
        console.log('Error in deleting task:', error);
        return res.status(500).send('Internal Server Error');
    }
});

// make the app to listen on asigned port number
app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }

    console.log(`Server is running on port : ${port}`);
});