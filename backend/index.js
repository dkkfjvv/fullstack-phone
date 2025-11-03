const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());
// cors
const cors = require("cors");
app.use(cors());
//
// static
app.use(express.static("dist"));
//

morgan.token("info", (req, res) => {
  console.log("req.body", req.body);
  console.log("req", req.headers);
  console.log("req.method", req.method);
  console.log("req.method == ", req.method === "GET");

  if (req.method === "POST") {
    const testJson = { name: req.body.name, number: req.body.number };
    return JSON.stringify(testJson);
  }
});
// app.use(morgan("tiny"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :info")
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const personCount = persons.length;
  // console.log(req.headers);
  const time = new Date(); // 요즘은 temporal 많이쓰려한대
  // console.log(time.toString());

  res.send(
    `<p>Phonebook has info for ${personCount} people</p> <p>${time.toString()}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  const person = persons.find((person) => person.id === id);
  if (!person) {
    return res.status(404).end();
  }
  res.status(200).json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const randomNumber = Math.random() * 100000;
  return Math.floor(randomNumber);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return (
      res
        .status(400)
        // .send("이름이나 번호를 누락하셨거나 잘못된 방식으로 입력하셨습니다");
        .json({
          error: "이름이나 번호를 누락하셨거나 잘못된 방식으로 입력하셨습니다",
        })
    );
  }
  if (persons.some((person) => person.name === body.name)) {
    return (
      res
        .status(400)
        // .send("이미 있는이름입니다");
        .json({ error: "이미 있는이름입니다" })
    );
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  res.status(201).json(person);
});

const PORT = process.env.port || 3001;
app.listen(PORT, () => {
  console.log(`서버들어왔다 포트는 ${PORT} 이거`);
});
