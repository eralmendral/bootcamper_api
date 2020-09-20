const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const geocoder = require('../utils/geocoder');

exports.getBootcamps = asyncHandler(async (req, res, next) => {

  let query;

  // Copy Request Query
  const reqQuery = { ...req.query };

  // Fields to Exclude
  const removeFields = ['select']

  // Loop over remove fields and delete them from request Query
  removeFields.forEach(param => delete reqQuery[param]);
  
  // Create Query String
  let queryStr = JSON.stringify(reqQuery);

  // Create Operators
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  // Select fields
  if(req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
  }

  // Execute query
  const bootcamps = await query;

  res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps});
})

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp })
})

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if(!bootcamp) {
    return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: bootcamp });
})

exports.updateBootcamp = asyncHandler(
  async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
  
    if(!bootcamp) {
      return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
  
    res.status(200).json({ success: true, data: bootcamp , message: 'Bootcamp updated'})
})


exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

  if(!bootcamp) {
    return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: {} , message: 'Bootcamp deleted'})
})


exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get latitude & longitude from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc Radius using radians
  // Divide distance by earth Radius
  // Earth radius = 3,693 mi |  6,378 km
  const radius = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { 
      $geoWithin: { $centerSphere: [[ lng, lat ], radius ] }
    }
  })

  res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
})