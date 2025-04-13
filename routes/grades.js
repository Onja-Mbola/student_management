let { Grade, Student, Course } = require('../model/schemas');

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
    if (!Array.isArray(req.body)) {
        return res.status(400).send('Body should be an array of grade objects');
    }

    const gradePromises = req.body.map(gradeData => {
        let grade = new Grade();

        grade.student = gradeData.student;
        grade.course = gradeData.course;
        grade.grade = gradeData.grade;
        grade.date = new Date(gradeData.date);

        return grade.save();
    });

    Promise.all(gradePromises)
        .then((grades) => {
            const gradeIds = grades.map(grade => grade.id);
            res.json({ message: `Grades saved with ids ${gradeIds.join(', ')}!` });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send('Cant post grades: ' + err.message);
        });
}

function deleteGrade(req, res) {
    const { id } = req.params;

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
    const { id } = req.params;

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

module.exports = { getAll, create, update, deleteGrade };
