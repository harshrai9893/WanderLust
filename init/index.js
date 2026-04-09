
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"69c10149ef867c953852b1ea"}));
    await Listing.insertMany(initData.data); 
    console.log("data was initialized");
};

 initDB();