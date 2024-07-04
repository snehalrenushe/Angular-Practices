const express = require("express");
const router = express.Router();
const {
  addUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("./../handler/userHandler");

const cors = require("cors");
router.use(cors());

router.post("/users", async (req, res) => {
  //user add operation
  let user = await addUser(req.body);
  res.send(user);
});

router.get("/users", async (req, res) => {
  //user get operation
  let users = await getUsers();
  res.send(users);
});

router.get("/users/:id", async (req, res) => {
  //user get operation
  let user = await getUserById(req.params["id"]);
  res.send(user);
});

router.put("/users/:id", async (req, res) => {
  //user get operation
  await updateUser(req.params["id"], req.body);
  res.send({});
});

router.delete("/users/:id", async (req, res) => {
  //user get operation
  console.log(req.params["id"]);
  await deleteUser(req.params["id"]);
  res.send({});
});

module.exports = router;
