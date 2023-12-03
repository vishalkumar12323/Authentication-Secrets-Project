import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
// import encrypt from "mongoose-encryption";
// import md5 from "md5";

const app = express();
const port = 3000;

mongoose.connect(process.env.DATABASE_URL);
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// userSchema.plugin(encrypt, {
//   secret: process.env.ENCRYPTION_KEY,
//   encryptedFields: ["password"],
// });
const User = new mongoose.model("user", userSchema);

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  try {
    bcrypt.hash(password, 10, function (err, hash) {
      console.log(hash);
      const newUser = new User({
        username: username,
        password: hash,
      });
      if (!newUser) {
        res
          .status(400)
          .send("<h3> Fill the email and password feild currectly </h3>");
      } else {
        newUser.save();
        res.render("secrets.ejs");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const foundUser = await User.findOne({ username: username });
    bcrypt.compare(password, foundUser.password, function (err, result) {
      console.log(result);
      if (result == true) {
        res.render("secrets.ejs");
      } else {
        console.log(err);
        res.status(400).send("<h3> Invalid Credentials </h3>");
      }
    });
  } catch (error) {
    console.log(error);
  }
});
app.listen(port, () => {
  console.log(`server listening on url http://localhost:${port}`);
});
