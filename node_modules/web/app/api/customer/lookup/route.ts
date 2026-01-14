import { NextResponse } from 'next/server';
import { dbConnect, Enquiry } from '@alleppey/database';

export async function POST(req: Request) {
    try {
        const { email, id } = await req.json();

        if (!email || !id) {
            return NextResponse.json({ success: false, message: 'Email and ID required' }, { status: 400 });
        }

        await dbConnect();

        // Find by Inquiry ID (Case Insensitive) and Email
        const enquiry = await Enquiry.findOne({
            inquiryId: { $regex: new RegExp(`^${id}$`, 'i') },
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        });

        if (!enquiry) {
            return NextResponse.json({ success: false, message: 'No booking found with these details.' }, { status: 404 });
        }

        const publicData = {
            id: enquiry._id,
            inquiryId: enquiry.inquiryId,
            name: enquiry.name,
            dates: { start: enquiry.checkIn, end: enquiry.checkOut },
            roomType: enquiry.roomType,
            status: enquiry.status,
            payment: enquiry.payment,
            replies: enquiry.replies.filter(r => r.by === 'Admin')
        };

        return NextResponse.json({ success: true, data: publicData });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
