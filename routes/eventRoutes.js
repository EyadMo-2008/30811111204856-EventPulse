const express = require('express');
const { body } = require('express-validator');
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getMyRegistrations
} = require('../controllers/eventController');
const { requireAuth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/my-registrations', requireAuth, getMyRegistrations);
router.get('/', getEvents);
router.get('/:id', getEventById);

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('category').isMongoId().withMessage('Valid category ID is required'),
    validate
  ],
  createEvent
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('admin'),
  [
    body('title').optional().notEmpty(),
    body('description').optional().notEmpty(),
    body('date').optional().isISO8601(),
    body('city').optional().notEmpty(),
    body('capacity').optional().isInt({ min: 1 }),
    body('category').optional().isMongoId(),
    validate
  ],
  updateEvent
);

router.delete('/:id', requireAuth, requireRole('admin'), deleteEvent);

router.post('/:id/register', requireAuth, registerForEvent);
router.delete('/:id/register', requireAuth, cancelRegistration);

module.exports = router;