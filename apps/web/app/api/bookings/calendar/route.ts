import { NextResponse } from 'next/server';
import { dbConnect, Enquiry } from '@alleppey/database';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const enquiries = await Enquiry.find({
            status: { $in: ['New', 'Contacted', 'Confirmed', 'Payment Received', 'Completed'] }
        }).select('name checkIn checkOut status roomType');

        const events = enquiries.map(e => ({
            id: e._id,
            title: e.name,
            start: e.checkIn,
            end: e.checkOut,
            status: e.status,
            room: e.roomType || 'Standard'
        }));

        return NextResponse.json({ success: true, data: events });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
