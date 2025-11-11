import { Schema, model, models, Document, Types } from 'mongoose';

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
        validator: function (v: string) {
          // Standard email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to validate that the referenced event exists
 * Prevents orphaned bookings by checking event existence before saving
 */
BookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's modified or the document is new
  if (this.isModified('eventId')) {
    try {
      // Dynamically import Event model to avoid circular dependency
      const Event = models.Event || (await import('./event.model')).default;
      
      const eventExists = await Event.findById(this.eventId);
      
      if (!eventExists) {
        return next(new Error('Referenced event does not exist'));
      }
    } catch (error) {
      return next(new Error('Failed to validate event reference'));
    }
  }
  
  next();
});

// Create index on eventId for faster queries and lookups
BookingSchema.index({ eventId: 1 });

// Create compound index for email and eventId to prevent duplicate bookings
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

/**
 * Use existing model if it exists (prevents recompilation in development)
 * Otherwise, create a new model
 */
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
