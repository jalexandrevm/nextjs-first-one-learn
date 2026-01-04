import {Schema, model, models, Document, Types} from 'mongoose';
import {ValidationError} from "ajv";

/**
 * TypeScript interface for Booking document
 * Extends Document to include Mongoose document methods
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322 compliant email validation regex
          const emailRegex = /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/gm;
          return emailRegex.test(email);
          // Standard email validation regex
          // return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

/**
 * Pre-save hook to validate that the referenced event exists
 * Prevents orphaned bookings by checking event existence before saving
 */
BookingSchema.pre('save', async function (next) {
  const booking = this as IBooking;

  // Only validate eventId if it's modified or the document is new
  if (booking.isModified('eventId')) {
    try {
      // Dynamically import Event model to avoid circular dependency
      const Event = models.Event || (await import('./event.model')).default;

      const eventExists = await Event.findById(booking.eventId).select('_id');

      if (!eventExists) {
        const error = new Error(`Event with ID ${booking.eventId} does not exist`);
        error.name = 'ValidationError';
        return next(error);
      }
    } catch {
      const validationError = new Error('Invalid event ID format or database' +
        ' error');
      validationError.name = 'ValidationError';
      return next(validationError);
    }
  }

  next();
});

// Create index on eventId for faster queries and lookups
BookingSchema.index({eventId: 1});

// Create compound index for common queries (event bookings by date)
BookingSchema.index({eventId: 1, createdAt: -1});

// Create index on email for user booking lookups
BookingSchema.index({email: 1});

// Enforcing one booking per event per email
BookingSchema.index({eventId: 1, email: 1}, {unique: true, name: 'uniq_event_email'});

/**
 * Use existing model if it exists (prevents recompilation in development)
 * Otherwise, create a new model
 */
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
