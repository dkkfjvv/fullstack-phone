const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then((result) => {
    console.log("잘들어옴");
  })
  .catch((err) => {
    console.log("접속오류", err.message);
  });

const phoneSchema = new mongoose.Schema({
  // name: String,
  name: {
    type: String,
    minLength: 3,
    required: 5,
  },
  number: String,
});

phoneSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Phone", phoneSchema);
