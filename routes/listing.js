const express = require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")



// index route ----
router.get("/",async (req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", {allListings});
})

// new route ---
router.get("/new", isLoggedIn,  (req,res)=>{
   res.render("listings/new.ejs");
});

// show route ---
router.get("/:id", 
  wrapAsync(async (req,res)=>{
    let{id} =req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
       path:"author",
    }})
    .populate("owner");
    if(!listing){
      req.flash("error", "Listing you requested does not exist !");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}));


// create route ---

router.post("/",isLoggedIn, validateListing,
  wrapAsync(async (req, res, next) => {
 
    // If image URL is empty, set it undefined
    if (!req.body.listing.image.url) {
  req.body.listing.image.url = undefined;
}

    let listingData = req.body.listing;
    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    await newListing.save();
     req.flash("success", "new listing created!");
    res.redirect("/listings");
}));


// Edit route ---

router.get("/:id/edit", isLoggedIn,isOwner , async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested does not exist !");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
});

// update route ---
router.put("/:id",  isLoggedIn,isOwner ,validateListing,
    wrapAsync( async (req,res)=>{
      let {id} = req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      req.flash("success", " listing updated!");
      res.redirect(`/listings/${id}`); // updated id me redirect krega
}));

// delete route ----
router.delete("/:id",isLoggedIn, isOwner ,async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", " listing deleted!");
    res.redirect("/listings");
})

module.exports = router;