const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const Mongo_url = 'mongodb+srv://Harshrai05:Harsh14114@cluster0.ajpeqqi.mongodb.net/?appName=Cluster0';

main()
    .then(()=>{
        console.log("connected in db");
    }).catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(Mongo_url);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data); 
    console.log("data was initialized");
};

initDB();