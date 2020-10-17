const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [ true , 'Please add a name' ],
    unique: true,
    trim: true,
    maxlength: [ 50, 'Name can not be more than 50 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [ true, 'Please add a description'],
    maxlength: [ 500, 'Description can not be more than 500 characters']
  },
  website: {
    type: String,
    match: [ /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    , 'Please add a valid website url.']
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone can not be more than 20 characters']
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      'Please add a valid email.'
    ]
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: [ 'Point' ],
    },
    coordinates: {
      type: [ Number ],
      required: false,
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  careers : {
    // Array of strings
    type: [ String ],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI UX',
      'Data Science',
      'Business',
      'Machine Learning',
      'Other'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating can not be more than 10']
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: true
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi : {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create a resource slug from the name
BootcampSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocode & create location field
BootcampSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [ loc[0].longitude, loc[0].latitude ],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  }
  
  /// Do not save address in DB
  this.address = undefined;

  next();
})

// Cascade delete courses when bootcamp is deleted
BootcampSchema.pre('remove', async function(next) {
  await this.model('Course').deleteMany({ bootcamp: this._id });
  next();
})

// Reverse populate with schema
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
})

module.exports = mongoose.model('Bootcamp', BootcampSchema);