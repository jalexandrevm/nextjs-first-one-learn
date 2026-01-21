import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Event, {IEvent} from '@/database/event.model';

type RouteParams = {
  params: Promise<{ slug: string }>;
};

/**
 * Fetches an event identified by its slug.
 *
 * Validates and sanitizes the `slug` route parameter, queries the database for a matching event,
 * and returns the event when found.
 *
 * @param params - Route parameters object containing `slug`; the slug is trimmed and lowercased before lookup.
 * @returns A NextResponse with JSON:
 * - `200`: `{ message: 'Event fetched successfully', event }`
 * - `400`: `{ message: 'Invalid or missing slug parameter' }` or `{ message: "Event with slug '<slug>' not found" }`
 * - `500`: `{ message: 'Database configuration error', error }`, `{ message: 'Failed to fetch events', error }`, or `{ message: 'An unexpected error occurred' }`
 */
export async function GET(
  req: NextRequest,
  {params}: RouteParams
): Promise<NextResponse> {
  try {
    // Connect to database
    await connectDB();
    // Await and extract slug from params
    const {slug} = await params;
    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        {message: 'Invalid or missing slug parameter'},
        {status: 400}
      );
    }
    // Sanitize slug (remove any potential malicious input)
    const sanitizedSlug = slug.trim().toLowerCase();
    // Query event by slug
    const event = await Event.findOne({slug: sanitizedSlug}).lean();
    // Handle event not found
    if (!event) {
      return NextResponse.json(
        {message: `Event with slug '${sanitizedSlug}' not found`},
        {status: 400}
      );
    }
    // Return successful response with event data
    return NextResponse.json(
      {message: 'Event fetched successfully', event},
      {status: 200}
    );
  } catch (error) {
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV !== 'development') {
      console.error('Error fetching events by slug', error);
    }
    // Handle specific error types
    if (error instanceof Error) {
      // Handle database connection errors
      if (error.message.includes('MONGODB_URI')) {
        return NextResponse.json(
          {message: 'Database configuration error', error: error.message},
          {status: 500}
        );
      }
      // Return generic error with error message
      return NextResponse.json(
        {message: 'Failed to fetch events', error: error.message},
        {status: 500}
      );
    }
    // Handle unknown errors
    return NextResponse.json(
      {message: 'An unexpected error occurred'},
      {status: 500}
    );
  }
}