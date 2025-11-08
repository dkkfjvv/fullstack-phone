const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("제대로 명령어써야");

  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.tqjqxo4.mongodb.net/phone?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const phoneSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
});

const Phone = mongoose.model("Phone", phoneSchema);

// ===
const b =
  ({
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
  });
// ===
if (process.argv.length === 3) {
  console.log("개수 3개임");

  console.log("3개는 find");
  Phone.find({}).then((result) => {
    result.forEach((item) => {
      console.log(item);
    });
  });
  console.log("꺼져라잇!");
  mongoose.connection.close();
  return;
}

if (process.argv.length === 5) {
  console.log("process.argv[3]", process.argv[3]);
  console.log("process.argv[4]", process.argv[4]);

  const phoneName = String(process.argv[3]);
  const phoneNumber = String(process.argv[4]);
  console.log("phoneName", phoneName);
  console.log("phoneNumber", phoneNumber);

  //임시로 아이디번호 랜덤
  const random = Math.floor(Math.random() * 10000);
  console.log("random", random);

  const phone = new Phone({
    id: String(random),
    name: phoneName,
    number: phoneNumber,
  });

  phone.save().then((result) => {
    console.log("마무리 완");
    console.log("result", result);

    console.log(`added ${result.name} number ${result.number} to phonebook`);

    mongoose.connection.close();
  });

  return;
}

// const phone = new Phone({
//   id: "99",
//   name: "Maryegieck",
//   number: "39323122",
// });

phone.save().then((result) => {
  console.log(result);
  mongoose.connection.close();
});
