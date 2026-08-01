const Event = require('../models/Event');
const Registration = require('../models/Registration');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create(req.body);
  res.status(201).json({ status: 'success', data: event });
});

exports.getEvents = asyncHandler(async (req, res, next) => {
  const { category, city, startDate, endDate, search, page = 1, limit = 10, sort } = req.query;
  const query = {};

  if (category) query.category = category;
  if (city) query.city = city;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  let sortOptions = {};
  if (sort === 'date') {
    sortOptions.date = 1;
  }

  const skip = (page - 1) * limit;
  const events = await Event.find(query)
    .populate('category')
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

  const total = await Event.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: events.length,
    total,
    page: Number(page),
    data: events
  });
});

exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('category');
  if (!event) return next(new AppError('Event not found', 404));
  res.status(200).json({ status: 'success', data: event });
});

exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!event) return next(new AppError('Event not found', 404));
  res.status(200).json({ status: 'success', data: event });
});

exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return next(new AppError('Event not found', 404));
  res.status(200).json({ status: 'success', data: null });
});

exports.registerForEvent = asyncHandler(async (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const event = await Event.findById(eventId);
  if (!event) return next(new AppError('Event not found', 404));

  const currentCount = await Registration.countDocuments({ event: eventId });
  if (currentCount >= event.capacity) {
    return next(new AppError('Event capacity reached', 400));
  }

  const existingReg = await Registration.findOne({ user: userId, event: eventId });
  if (existingReg) {
    return next(new AppError('You are already registered for this event', 400));
  }

  const registration = await Registration.create({ user: userId, event: eventId });
  res.status(201).json({ status: 'success', data: registration });
});

exports.getMyRegistrations = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const registrations = await Registration.find({ user: userId }).populate({
    path: 'event',
    populate: { path: 'category' }
  });

  res.status(200).json({
    status: 'success',
    results: registrations.length,
    data: registrations
  });
});

exports.cancelRegistration = asyncHandler(async (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const reg = await Registration.findOneAndDelete({ user: userId, event: eventId });
  if (!reg) return next(new AppError('Registration not found', 404));

  res.status(200).json({ status: 'success', message: 'Registration cancelled' });
});