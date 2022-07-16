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
const randomPrice = () => {
  return Math.floor(Math.random() * 20 + 10);
}
const seedDB = async () => {
  await Campground.deleteMany({});
  for(let i  = 0; i < 50; i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({ 
      title: `${sample(descriptors)}, ${sample(places)}`,
      price: randomPrice(),
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: "https://images.unsplash.com/photo-1656931251449-07493b9f6caf?ixid=MnwzMDcyNTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTc0NjcxODY\u0026ixlib=rb-1.2.1",
      discreption: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum aperiam alias debitis esse quia, veniam earum voluptatibus officia obcaecati amet minima minus est voluptatem laborum saepe corporis modi. Neque, atque."
    })
    await camp.save();
  }
}

seedDB().then(()=>{
  mongoose.connection.close();
})