require("dotenv").config();
const mongoose = require("mongoose"); 
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const dbUrl = process.env.MONGO_URL;
console.log("MONGO URL:", process.env.MONGO_URL);

async function main() {
  await mongoose.connect(dbUrl);
  console.log(" MongoDB Connected");
}

const initDB = async () => {
  console.log("Running initDB...");
  await Listing.deleteMany({});

  const user = await User.findOne(); // get any existing user

  const newData = initData.data.map((obj) => ({
    ...obj,
    owner: user._id, 
  }));

  await Listing.insertMany(newData);

  console.log("Data initialized");
};
main()
  .then(() => initDB())
  .catch((err) => console.log(err));

