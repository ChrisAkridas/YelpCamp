const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seeHelpers');

const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{
  console.log('Connected to MongoDB');
})
.catch(()=>{
  console.log('Failed to connect to MongoDB');
})

const sample = array => array[Math.floor(Math.random() * places.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for(let i  = 0; i < 50; i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({ 
      title: `${sample(descriptors)}, ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
    })
    await camp.save();
  }
}

seedDB().then(()=>{
  mongoose.connection.close();
})