const Listing = require("../models/listing");


module.exports.index =async (req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", {allListings});
}

 module.exports.renderNewForm = (req,res)=>{
   res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
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
}

module.exports.createListing = async (req, res, next) => {
 
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
}

 module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested does not exist !");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}

 module.exports.updateListing = async (req,res)=>{
      let {id} = req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      req.flash("success", " listing updated!");
      res.redirect(`/listings/${id}`); // updated id me redirect krega
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", " listing deleted!");
    res.redirect("/listings");
}