const Joi = require('joi');
// with joi we need to first define a schema
// a schema defines the shape of our obj
// what properties does our object have
const express = require('express');
const app = express();


app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];


// callback function below is also called a route handler
app.get('/', (req, res) => {
    res.send('Hello World!!!');
});



app.get('/api/courses', (req, res) => {
    res.send([1,2,3]);    
});

// POST METHOD
app.post('/api/courses', (req,res) => {
    // INPUT VALIDATION WITH joi

    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);
    //console.log(result);
    // INPUT VALIDATION

    if(result.error){
        //400 BAD REQ
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };    
    courses.push(course);
    res.send(course);
});



// /api/courses/1
// ROUTE PARAMETERS
// Handling GET
app.get('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given id wasnt found');
    res.send(course);
});


// handling PUT requests

app.put('/api/courses/:id', (req,res) => {
    //lookup the course
    // if does not exist, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given id wasnt found');

    //validate
    //if invalid, return 400 - bad req
    const result = validateCourse(req.body);
    
    const {error} = validateCourse(req.body); // result.error
    if(error){
        //400 BAD REQ
        res.status(400).send(error.details[0].message);
        return;
    }

    //update course
    course.name = req.body.name;
    //reutrn the updated course
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}














// env variable
// PORT instead of hardcoding 300

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port ${port}...`))
