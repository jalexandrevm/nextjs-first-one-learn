'use server';

import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();

    const event = await Event.findOne({slug});
    // const similars = await Event.find({
    //   _id: {
    //     $ne: event._id
    //   },
    //   tags: {$in: event.tags}
    // });
    // return similars;
    return await Event.find({
      _id: {
        $ne: event._id
      },
      tags: {$in: event.tags}
    }).lean();

  } catch (error) {
    console.error(error);
    return [];
  }
}