const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const geocoder = require('../utils/geocoder');
const path = require('path');

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advanceResults);
})

exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp })
})

exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');;
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: bootcamp });
})

exports.updateBootcamp = asyncHandler(
    async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: bootcamp, message: 'Bootcamp updated' })
    })


exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    bootcamp.remove();

    res.status(200).json({ success: true, data: {}, message: 'Bootcamp deleted' })
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
            $geoWithin: { $centerSphere: [[lng, lat], radius] }
        }
    })

    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
})


// @Desc upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access  private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file.`, 400));
    }

    console.log('debug photo uploading:', req.files.file)
    const file = req.files.file;
    // Validate if image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file.`, 400));
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_SIZE) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_SIZE}.`, 400));
    }

    // Create custom file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log('Error uploading file:', err);
            return next(new ErrorResponse(`Problem with file upload.`, 500));
        }

        // Insert the filename into the database

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({ success: true, data: file.name })

    })
})