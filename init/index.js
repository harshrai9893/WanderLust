const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const Mongo_url = 'mongodb+srv://harshrai05:Harsh14114@cluster0.xmztp4h.mongodb.net/';

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
    initData.data = initData.data.map((obj)=>({...obj, owner:"69c10149ef867c953852b1ea"}));
    await Listing.insertMany(initData.data); 
    console.log("data was initialized");
};

initDB();