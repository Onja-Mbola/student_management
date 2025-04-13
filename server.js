let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let student = require('./routes/students');
let course = require('./routes/courses');
let grade = require('./routes/grades');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// URI de connexion à la base MongoDB dans le cloud
const uri = 'mongodb+srv://admin:admin@cluster0.mbrnsmf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const options = {};

mongoose.connect(uri, options)
    .then(() => {
            console.log("Connexion à la base OK");
        },
        err => {
            console.log('Erreur de connexion: ', err);
        });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;


const prefix = '/api';

app.route(prefix + '/students')
    .get(student.getAll)    
    .post(student.create);  

app.route(prefix + '/students/:id_student')
    .put(student.update)    
    .delete(student.deleteStudent);  

// Routes pour les cours
app.route(prefix + '/courses')
    .get(course.getAll)    
    .post(course.create);  

app.route(prefix + '/courses/:id')
    .put(course.update)    
    .delete(course.deleteCourse);

// Routes pour les notes
app.route(prefix + '/grades')
    .get(grade.getAll)    
    .post(grade.create);   

app.route(prefix + '/grades/:id')
    .put(grade.update)    
    .delete(grade.deleteGrade);

app.listen(port, "0.0.0.0", () => {
    console.log('Serveur démarré sur http://localhost:' + port);
});

module.exports = app;
