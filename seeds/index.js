const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{
  console.log('Connected to MongoDB');
})
.catch(()=>{
  console.log('Failed to connect to MongoDB');
})

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  await Campground.deleteMany({});
  for(let i  = 0; i < 50; i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30 + 10);
    const camp = new Campground({ 
      title: `${sample(descriptors)}, ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      price,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bmF0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet sapiente saepe, temporibus ea dolor rem nobis. Sint, autem recusandae quisquam ipsa, adipisci dolorem quasi doloremque voluptatem ipsum, aperiam esse error."
    })
    await camp.save();
  }
}

seedDB().then(()=>{
  mongoose.connection.close();
})