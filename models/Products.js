const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensure price is non-negative
  },
  category: {
    type: String,
    required: true,
    enum: ["Electronics", "Clothing", "Books", "Home Appliances", "Beauty"], // Add your categories here
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  likes: {
    type: Number,
    default: 0, // Initialize with 0 likes
  },
  saves: {
    type: Number,
    default: 0, // Initialize with 0 saves
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  country: {
    type: String,
    required: true, // Make it required if necessary
  },
  address: {
    type: String,
    required: false, // Optional field
  },
  number: {
    type: String,
    required: false, // Optional field
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);


// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0, // Ensure price is non-negative
//   },
//   category: {
//     type: String,
//     required: true,
//     enum: ["Electronics", "Clothing", "Books", "Home Appliances", "Beauty"], // Add your categories here
//   },
//   image: {
//     type: String,
//     required: true,
//     validate: {
//       validator: function (v) {
//         return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
//       },
//       message: (props) => `${props.value} is not a valid URL!`,
//     },
//   },
//   likes: {
//     type: Number,
//     default: 0, // Initialize with 0 likes
//   },
//   saves: {
//     type: Number,
//     default: 0, // Initialize with 0 saves
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   country: {
//     type: String,
//     required: true, // Make it required if necessary
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('Product', productSchema);
