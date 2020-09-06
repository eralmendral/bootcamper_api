exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
}

exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create single bootcamp' });
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