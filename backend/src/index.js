const express = require('express');
const config = require('../db.config');

const db = require('knex')({
    client: 'mysql2',
    connection: {
        host: config.HOST,
        port: config.PORT,
        user: config.USER,
        password: config.PASSWORD,
        database: config.DATABASE,
    },
});

const cors = require('cors');
const app = express();

const port = 4001;
app.use(express.json());
app.use(cors());

const TODO_TABLE = 'todo';
db.schema.hasTable(TODO_TABLE).then(function (exists) {
    if (!exists) {

        return db.schema.createTable(TODO_TABLE, function (t) {
            t.increments('id').primary();
            t.string('name', 255);
            t.text('description');
            t.date('date');
            t.boolean('finished');
        });
    }
});
app.get('/todos', async (req, res) => {
    const todos = await db.select().table(TODO_TABLE);
    res.send(todos);
});

app.post('/todos', async (req, res) => {
    const body = req.body;
    if (!body.name || !body.description || !body.date) {
        res.status(400).send({error: 'Missing required fields'});
        return;
    }
    const todo = {
        name: body.name,
        comment: body.description,
        date: body.date,
        finished: false,
    };
    try {
        const result = await db(TODO_TABLE).insert(todo);
        res.send(result);
    } catch (e) {
        console.error(e);
        res.status(500).send({error: 'Internal server error', e});
    }
});

app.delete('/todos/:todoId', async (req, res) => {
    const id = req.params.todoId;
    try {
        await db(TODO_TABLE).where({id: id}).del()
        res.send({success: true});
    } catch (e) {
        console.error(e)
        res.status(500).send({error: "Internal server error", e});
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
