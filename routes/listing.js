const express = require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js")
const ExpressError =require("../utils/ExpressError.js")
const {listingSchema } = require("../schema.js")
const Listing = require("../models/listing.js");

const validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();  
  }
};

// index route ----
router.get("/",async (req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", {allListings});
})

// new route ---
router.get("/new",  (req,res)=>{
   res.render("listings/new.ejs");
});

// show route ---
router.get("/:id", 
  wrapAsync(async (req,res)=>{
    let{id} =req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error", "Listing you requested does not exist !");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));


// create route ---

router.post("/", validateListing,
  wrapAsync(async (req, res, next) => {

    let listingData = req.body.listing;

    // If image URL is empty, set it undefined
    if (!req.body.listing.image.url) {
  req.body.listing.image.url = undefined;
}

    const newListing = new Listing(listingData);
    await newListing.save();
     req.flash("success", "new listing created!");
    res.redirect("/listings");
}));


// Edit route ---

router.get("/:id/edit", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested does not exist !");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
});

// update route ---
router.put("/:id", validateListing,
    wrapAsync( async (req,res)=>{
      let {id} = req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      req.flash("success", " listing updated!");
      res.redirect(`/listings/${id}`); // updated id me redirect krega
}));

// delete route ----
router.delete("/:id", async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", " listing deleted!");
    res.redirect("/listings");
})

module.exports = router;