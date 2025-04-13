let {Grade, Student, Course} = require('../model/schemas');

function getAll(req, res) {
    Grade.find()
        .populate('student')
        .populate('course')
        .then((grades) => {
            res.send(grades);
        }).catch((err) => {
        res.send(err);
    });
}


function create(req, res) {
    let grade = new Grade();

    grade.student = req.body.student;
    grade.course = req.body.course;
    grade.grade = req.body.grade;
    grade.date = req.body.date;

    grade.save()
        .then((grade) => {
                res.json({message: `grade saved with id ${grade.id}!`});
            }
        ).catch((err) => {
        console.log(err);
        res.status(400).send('cant post grade ', err.message);
    });
}

function deleteGrade(req, res) {
    const {id} = req.params;

    Grade.findByIdAndDelete(id)
        .then((grade) => {
            if (!grade) return res.status(404).send("Grade not found");
            res.json({ message: `Grade deleted with id ${id}` });
        })
        .catch((err) => {
            res.status(400).send('Cannot delete grade: ' + err.message);
        });
}

function update(req, res) {
    const {id} = req.params;

    Grade.findByIdAndUpdate(id, {
        student: req.body.student,
        course: req.body.course,
        grade: req.body.grade,
        date: req.body.date
    }, { new: true })
        .then((grade) => {
            if (!grade) return res.status(404).send("Grade not found");
            res.json({ message: `Grade updated with id ${id}` });
        })
        .catch((err) => {
            res.status(400).send('Cannot update grade: ' + err.message);
        });
}

module.exports = {getAll, create, update, deleteGrade};
