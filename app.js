const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

const app = express();

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{
  console.log('Connected to MongoDB');
})
.catch(()=>{
  console.log('Failed to connect to MongoDB');
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));



app.get('/', (req, res) => {
  res.render('home');
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds});
});

app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.render('campgrounds/show', {campground});
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', {campground});
});

app.patch('/campgrounds/:id', async (req, res) => {
  const {id} = req.params;
  const prod = await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true, new: true});
  res.redirect('/camp');
});

app.get('/campgrounds/:id/edit', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', {campground});
});


app.listen(3000, ()=> {
  console.log('App is listening on port 3000');
});