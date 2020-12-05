const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const marioModel = require("./models/marioChar");
const port = 3000;
let newId = marioModel.length;
// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// your code goes here
app.get("/mario", (req, res) => {
  res.send(marioModel);
});

app.get("/mario/:id", (req, res) => {
  const body = req.body;
  const marioId = Number(req.params.id);
  let found = false;

  marioModel.forEach((mario) => {
    if (mario.id === marioId) {
      found = true;
      res.send(mario);
    }
  });

  if (!found) {
    res.status(400).send({
      message: "error.message",
    });
  }
});

app.post("/mario", (req, res) => {
  const body = req.body;

  if (body.name !== "" && body.weight !== "") {
    newId++;
    const newMario = {
      id: Number(newId),
      name: body.name,
      weight: Number(body.weight),
    };

    marioModel.push(newMario);
    res.status(201).send(newMario);
  } else {
    res.status(400).send({
      message: "either name or weight is missing",
    });
  }
});

app.patch("/mario/:id", (req, res) => {
  const body = req.body;
  if (body.name !== "" || body.weight !== "") {
    const marioId = Number(req.params.id);
    let found = false;

    marioModel.forEach((mario) => {
      if (mario.id === marioId) {
        found = true;
        if (body.hasOwnProperty("name")) {
          mario.name = body.name;
        }
        if (body.hasOwnProperty("weight")) {
          mario.weight = Number(body.weight);
        }

        res.send(mario);
      }
    });

    if (!found) {
      res.status(400).send({
        message: "error.message",
      });
    }
  } else {
    res.status(400).send({
      message: "error.message",
    });
  }
});

app.delete("/mario/:id", (req, res) => {
  const marioId = Number(req.params.id);
  let idToDelete = 0;
  let found = false;
  marioModel.forEach((mario, idx) => {
    if (mario.id === marioId) {
      found = true;
      idToDelete = idx;
    }
  });
  if (!found) {
    res.status(400).send({
      message: "error.message",
    });
  } else {
    marioModel.splice(idToDelete, 1);
    res.status(200).send({ message: "character deleted" });
  }
});

app.listen(port);

module.exports = app;
