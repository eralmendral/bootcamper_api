const Bootcamp = require('../models/Bootcamp')

exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
}

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp })
  } catch (err) {
    console.log('error:', err);
    res.status(400).json({ success: false })
  }

}

exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show bootcamp with ID: ${req.params.id}` });
}

exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Update single bootcamp' });
}

exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Delete single bootcamp' });
}