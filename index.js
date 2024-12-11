const tracer = require("./tracing")("todo-service"); // Import tracing
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const port = 3000;
let db;

// Start the server and initialize MongoDB
const startServer = async () => {
    try {
        const client = await MongoClient.connect("mongodb://localhost:27017/");
        db = client.db("todo");

        // Insert sample data
        await db.collection("todos").insertMany([
            { id: "1", title: "Buy groceries" },
            { id: "2", title: "Install Aspecto" },
            { id: "3", title: "Buy my own name domain" },
        ]);

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    } catch (err) {
        console.error("Error starting server:", err);
    }
};
startServer();

// Define API endpoints
app.get("/todo", async (req, res) => {
    try {
        const todos = await db.collection("todos").find({}).toArray();
        res.send(todos);
    } catch (err) {
        res.status(500).send({ error: "Error fetching todos" });
    }
});

app.get("/todo/:id", async (req, res) => {
    try {
        const todo = await db.collection("todos").findOne({ id: req.params.id });
        if (!todo) {
            res.status(404).send({ error: "Todo not found" });
        } else {
            res.send(todo);
        }
    } catch (err) {
        res.status(500).send({ error: "Error fetching todo" });
    }
});
