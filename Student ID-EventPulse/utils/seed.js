require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Event = require('../models/Event');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();
    await Category.deleteMany();
    await Event.deleteMany();

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@eventpulse.com',
      password: 'password123',
      role: 'admin'
    });

    const category = await Category.create({
      name: 'Technology',
      description: 'Tech events and conferences'
    });

    await Event.create({
      title: 'Node.js Summit',
      description: 'Annual backend dev event',
      date: new Date(),
      city: 'Cairo',
      capacity: 100,
      category: category._id
    });

    console.log('Database Seeded Successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();