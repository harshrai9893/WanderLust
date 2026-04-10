require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.MONGO_URL;
console.log("MONGO URL:", process.env.MONGO_URL);

async function main() {
  await mongoose.connect(dbUrl);
  console.log(" MongoDB Connected");
}

const initDB = async () => {
  console.log(" Running initDB...");
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log(" data was initialized");
};

main()
  .then(() => initDB())
  .catch((err) => console.log(err));

