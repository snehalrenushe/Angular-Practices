const User = require("../db/user");

async function addUser(userModel) {
  //add user into db
  let user = new User({
    ...userModel,
  });
  await user.save();
  return user.toObject();
}

async function getUsers() {
  //get user into db
  const users = await User.find();
  return users.map((ob) => ob.toObject());
}

async function getUserById(id) {
  //getby id user into db
  const users = await User.findById(id);
  return users.toObject();
}

async function updateUser(id, userModel) {
  //update user into db
  const filter = { _id: id };
  await User.findOneAndUpdate(filter, userModel);
}

async function deleteUser(id) {
  //delete user into db
  await User.findByIdAndDelete(id);
}

module.exports = { addUser, getUsers, getUserById, updateUser, deleteUser };
