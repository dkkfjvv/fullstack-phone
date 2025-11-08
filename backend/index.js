//env
require("dotenv").config();
//
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

//mongo
const Phone = require("./models/mongo.js");
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
  // res.json(persons);

  //mongo방식
  Phone.find({}).then((result) => {
    res.status(200).json(result);
    console.log("result는?:", result);
    console.log("result 길이는?:", result.length);

    result.forEach((item) => {
      console.log("phone", item);
    });
  });
});

//옜날거라 생략해야되나..?
app.get("/info", (req, res) => {
  // const personCount = persons.length;
  /**mongo */
  let personCount = -3;
  Phone.find({}).then((result) => (personCount = result.length));
  const time = new Date(); // 요즘은 temporal 많이쓰려한대
  // console.log(time.toString());

  res.send(
    `<p>Phonebook has info for ${personCount} people</p> <p>${time.toString()}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  // const id = req.params.id;

  // const person = persons.find((person) => person.id === id);
  // if (!person) {
  //   return res.status(404).end();
  // }
  // res.status(200).json(person);

  //mongo방식
  // let id=req.params.id

  Phone.findById(req.params.id).then((phone) => {
    res.status(200).json(phone);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  // const id = req.params.id;

  // persons = persons.filter((person) => person.id !== id);
  // res.status(204).end();

  /**mongo */
  Phone.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
      console.log("삭제됨 결과", result);
    })
    .catch((err) => {
      console.log("삭제에러");
      next(err);
    });
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
  // ! if (persons.some((person) => person.name === body.name)) {
  //   return (
  //     res
  //       .status(400)
  //      // .send("이미 있는이름입니다");
  //       .json({ error: "이미 있는이름입니다" })
  //   );
  // }

  //**? 중복 체크를 이제 mongo로 / 라고 할려 했는데  프론트에서 일단 중복처리한다니까 일단 이거는 아니기로하자  */
  // Phone.findOne({ name: body.name }).then((result) => {
  //   //* 있으면 오류보낼려다가 그냥 put 하라네?
  //   // if (result) {
  //   //   return res.status(400).json({ error: "이미있는 이름입니다" });
  //   // }
  //   if (result) {
  //     const phone = new Phone({
  //       name: body.name,
  //       number: body.number,
  //     });
  //     phone.
  //   }

  // const phone = new Phone({
  //   name: body.name,
  //   number: body.number,
  // });
  // //**일단 이름 중복처리는 안한대 */
  // phone.save().then((result) => {
  //   res.status(201).json(result);
  // });
  // });

  // const person = {
  //   id: generateId(),
  //   name: body.name,
  //   number: body.number,
  // };
  // persons = persons.concat(person);
  // res.status(201).json(person);

  const phone = new Phone({
    name: body.name,
    number: body.number,
  });
  //**일단 이름 중복처리는 안한대 */
  phone.save().then((result) => {
    res.status(201).json(result);
  });
});

app.put("/api/persons/:id", (req, res) => {
  const { name, number } = req.body;
  // const id = req.params.id
  Phone.findById(req.params.id).then((result) => {
    if (!result) {
      return res.status(404).send("못찾았음");
    }

    result.name = name;
    result.number = number;

    return result
      .save()
      .then((updatePhone) => {
        console.log("updatePhone", updatePhone);
        res.json(updatePhone);
      })
      .catch((error) => next(error));
  });
});

const elseUri = (req, res) => {
  console.log("잘못된 주소임");
  console.log(req.header);

  res.status(404).send({ error: "여기는 잘못된 주소입니다" });
};

//endpoint 잘못됐을때
app.use(elseUri);

const errorHandler = (error, req, res, next) => {
  console.log("error메세지", error);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    res.status(400).send({ error: "제대로 써라" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.port;
app.listen(PORT, () => {
  console.log(`서버들어왔다 포트는 ${PORT} 이거`);
});
