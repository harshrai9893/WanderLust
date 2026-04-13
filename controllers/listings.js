const Listing = require("../models/listing");


module.exports.index =async (req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", {allListings});
}

 module.exports.renderNewForm = async(req,res)=>{
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
  let url = req.file.path;
  let filename = req.file.filename;
  let listingData = req.body.listing;

  //  Safe check (no crash)
  if (!listingData.image || !listingData.image.url) {
    listingData.image = { url: "" }; // or default image
  }

  const newListing = new Listing(listingData); 
  newListing.owner = req.user._id;
  newListing.image = {url,filename};
  await newListing.save();

  req.flash("success", "new listing created!");
  return res.redirect("/listings"); //  add return
};

 module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested does not exist !");
      return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_200,w_250")
    res.render("listings/edit.ejs", {listing ,originalImageUrl});
}

 module.exports.updateListing = async (req,res)=>{
 
      let {id} = req.params;
    let listing =   await Listing.findByIdAndUpdate(id,{...req.body.listing});
       
    if (typeof req.file !=="undefined"){
        let url = req.file.path;
         let filename = req.file.filename;
         listing.image= {url,filename};
         await listing.save();
    }

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