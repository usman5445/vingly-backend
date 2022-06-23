const express = require("express");
const app = express();
const Joi = require("joi");

app.use(express.json());
//Creating validatore function for reusablity
function validateFunc(data) {
  //Creating joi schema object for validation

  const userSchema = Joi.object({
    name: Joi.string().min(3).max(15),
    age: Joi.number().min(10).max(50),
  });
  return userSchema.validate(data).error;
}

//Making Dummy Database

let db = [
  { id: 1, name: "John", age: 21 },
  { id: 2, name: "Jane", age: 31 },
  { id: 3, name: "Doe", age: 30 },
  { id: 4, name: "Susan", age: 35 },
  { id: 5, name: "Bob", age: 40 },
];

//Creating RESTfull CRUD routes for vingly...

//Creating Create/Post route to create a new user

app.post("/api/users", (req, res) => {
  const validate = validateFunc(req.body);
  if (validate) return res.status(400).send(validate);
  const newUser = { id: db.length + 1, name: req.body.name, age: req.body.age };
  db.push(newUser);
  res.send(`User created successfully with id = ${newUser.id}`);
  res.end();
});

//Creating Read/Get route to fetch all users
app.get("/api/users", (req, res) => {
  res.send(db);
  res.end();
});

//Creating Read/Get route to fetch specific user
app.get("/api/users/:id", (req, res) => {
  const user = db.find((user) => user.id == req.params.id);
  if (!user) return res.status(404).send("user not found");
  res.send(user);
  res.end();
});

//Creating Update/Put route to update existing user
app.put("/api/users/:id", (req, res) => {
  const user = db.findIndex((user) => user.id == req.params.id);
  const validate = validateFunc(req.body);
  if (user < 0) return res.status(404).send("user not found");
  if (validate) return res.status(400).send(validate);
  db[user] = { ...db[user], name: req.body.name, age: req.body.age };
  res.send(db[user]);
  res.end();
});

//Creating Delete route to delete existing user
app.delete("/api/users/:id", (req, res) => {
  const user = db.findIndex((user) => user.id == req.params.id);
  if (user < 0) return res.status(404).send("user not found");
  res.send(db.splice(user, 1));
  res.end();
});

//listning on envirment PORT or 5000 PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serving on http://localhost:${PORT}`));
