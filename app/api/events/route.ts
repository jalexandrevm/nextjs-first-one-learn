import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import {v2 as cloudinary} from "cloudinary";
import Event from '@/database/event.model';
import {formDataToObject} from "@/lib/utils";

/**
 * Handles POST requests that create a new event with an uploaded image.
 *
 * @param req - Incoming multipart/form-data request containing event fields and an `image` file
 * @returns A `NextResponse`:
 * - Status 201 with `{ message: 'Event created successfully', event }` on success
 * - Status 400 with `{ message: 'Invalid JSON data format' }` if form data cannot be parsed
 * - Status 400 with `{ message: 'Image file is required' }` if no image file is provided
 * - Status 500 with `{ message: 'Event Creation Failed', error: string }` on server error
 */
export async function POST(req: NextRequest) {
  console.log('Estamos no POST');
  try {
    await connectDB();
    const formData = await req.formData();

    let event;

    try {
      event = formDataToObject(formData);
      // event = Object.fromEntries(formData.entries());
    } catch (e) {
      return NextResponse.json({message: 'Invalid JSON data format'}, {status: 400})
    }
    const file = formData.get('image') as File;
    if (!file) {
      return NextResponse.json({message: 'Image file is required'}, {status: 400});
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
          resource_type: "image",
          folder: "events",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }).end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create(event);

    return NextResponse.json({
        message: 'Event created successfully',
        event: createdEvent
      },
      {status: 201});
  } catch (e) {
    console.error(e);
    return NextResponse.json({
        message: 'Event Creation Failed',
        error: e instanceof Error ? e.message : 'Unknown'
      },
      {status: 500})
  }
}

/**
 * Fetches all events from the database sorted by creation date descending.
 *
 * @returns A NextResponse containing `{ message: string; events: Event[] }` with status 200 on success; on failure, a NextResponse containing `{ message: string; error: any }` with status 500.
 */
export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({createdAt: -1});
    return NextResponse.json(
      {message: 'Events fetched successfully', events},
      {status: 200}
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown';
    return NextResponse.json(
      {message: 'Event fetching failed', error: message},
      {status: 500}
    );
    );
  }
}