const express = require("express");
const app = express()
const bodyParser = require("body-parser");
const file = require("fs");
const data = require("./json/db.json");
const time = new Date();

//use internal css
app.use(express.static("views"));

//using body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//view engine ejs
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render('index.ejs', { data })
})

// Function to save task to json file
const saveTask = () => {
    file.writeFile("./json/db.json", JSON.stringify(data), (err) => {
        if (err)
            throw err;
        console.log("Data written to file");
    });
}

// Create a new task
app.post('/create', (req, res, next) => {
    acc = {
        id : time.getTime() + Math.floor(Math.random() * 100),
        task: req.body.book
    };
    next()
}, (req, res) => {
        data.push(acc);
        saveTask();
        res.redirect('/')
})

// Delete a task
app.get('/del/:id', (req, res) => {
    data.forEach((item, index) => {
        if (item.id == req.params.id) {
            data.splice(index, 1);
        }
    })
    saveTask();
    res.redirect('/')
})

// Update a task
app.post('/update/:id', (req, res) => {
    data.forEach((item, index) => {
        if (item.id == req.params.id) {
            data[index].task = req.body.text;
        }
    })
    saveTask();
    res.redirect('/')
})

app.get('/api-test', (req, res) => {
    res.sendFile(__dirname + '/json/db.json')
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
})
