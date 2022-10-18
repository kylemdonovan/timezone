import 'dotenv/config';
import express from 'express';
import * as exercises from './exercises-model.mjs';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// CREATE controller ******************************************
app.post ('/exercises', (req,res) => {
    exercises.createExercise(
        req.body.name,
        req.body.reps,

        )
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error: 'Creation of a document failed due to invalid syntax.' });
        });
});


// RETRIEVE controller ****************************************************
// GET exercises by ID
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => {
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: 'Document not found' });
            }
         })
        .catch(error => {
            res.status(400).json({ Error: 'Request to retrieve document failed' });
        });

});


// GET exercises filtered
app.get('/exercises', (req, res) => {
    let filter = {};

    exercises.findExercises(filter)
    .then(exercises => {
        res.json(exercises);
    })
    .catch(error => {
        console.error(error);
        res.status(400)({ Error: 'Request to retrieve documents failed' });
    });

});

// DELETE Controller ******************************
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Document not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request to delete a document failed' });
        });
});

// UPDATE controller ************************************
app.put('/exercises/:_id', (req, res) => {
    exercises.replaceExercise(
        req.params._id, 
        req.body.name, 
        req.body.reps, 

    )

    .then(numUpdated => {
        if (numUpdated === 1) {
            res.json({ 
                _id: req.params._id, 
                name: req.body.name, 
                reps: req.body.reps, 

            })
        } else {
            res.status(404).json({ Error: 'Document not found' });
        }
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({ Error: 'Request to update a document failed' });
    });
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});