const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const marioModel = require("./models/marioChar");
// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// your code goes here
app.get("/mario", async (req, res) => {
  res.send(await marioModel.find());
});

app.get("/mario/:id", async (req, res) => {
  const id = req.params.id;

  try {
    res.send(await marioModel.findById(id));
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

const isNullOrUndefined = (val) => val === null || val === undefined;

app.post("/mario", async (req, res) => {
  const newMario = req.body;

  if (isNullOrUndefined(newMario.name) || isNullOrUndefined(newMario.weight)) {
    res.status(400).send({
      message: "either name or weight is missing",
    });
  } else {
    const newMarioDoc = new marioModel(newMario);
    await newMarioDoc.save();
    res.status(201).send(newMarioDoc);
  }
});

app.patch("/mario/:id", async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  try {
    const existingMario = await marioModel.findById(id);
    if (body.name !== "" || body.weight !== "") {
      if (body.name !== "") {
        existingMario.name = body.name;
      }
      if (body.weight !== "") {
        existingMario.weight = body.weight;
      }
    }
    await existingMario.save();
    res.send(existingMario);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

app.delete("/mario/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const marioToDelete = await marioModel.findById(id);
    await marioModel.deleteOne({ _id: id });
    res.send({ message: "character deleted" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = app;
