const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const {campgroundSchema} = require('./joiSchemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
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

const validateCampground = (req, res, next) => {
  const {error} = campgroundSchema.validate(req.body);
  if( error) {
    const msg = error.details.map( el => el.message.join(','));
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

app.get('/campgrounds', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds});
}));

app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.render('campgrounds/show', {campground});
}));

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', {campground});
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const {id} = req.params;
  const deletedItem = await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}))

app.put('/campgrounds/:id', validateCampground ,catchAsync(async (req, res) => {
  const {id} = req.params;
  const prod = await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true, new: true});
  res.redirect('/camp');
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', {campground});
}));

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500} = err;
  if(!err.message) err.message === 'Something went wrong...';
  res.status(statusCode).render('error');
})

app.listen(3000, ()=> {
  console.log('App is listening on port 3000');
});