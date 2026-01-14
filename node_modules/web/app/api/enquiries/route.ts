import { NextResponse } from 'next/server';
import { dbConnect, Enquiry } from '@alleppey/database';
// import nodemailer from 'nodemailer'; // TODO: Setup email helper

export async function GET(req: Request) {
    try {
        await dbConnect();
        // TODO: Add auth check middleware (verify JWT from headers)

        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: enquiries });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await dbConnect();

        // Detailed Validation
        const missingFields = [];
        if (!body.name) missingFields.push('Name');
        if (!body.email) missingFields.push('Email');
        if (!body.checkIn) missingFields.push('Check-in Date');
        if (!body.checkOut) missingFields.push('Check-out Date');
        if (!body.roomType) missingFields.push('Room Type');
        if (!body.phone) missingFields.push('Phone'); // Validation for Phone

        if (missingFields.length > 0) {
            return NextResponse.json({
                success: false,
                message: `Please fill in all required fields: ${missingFields.join(', ')}`
            }, { status: 400 });
        }

        // Validate Dates
        const start = new Date(body.checkIn);
        const end = new Date(body.checkOut);
        if (end <= start) {
            return NextResponse.json({
                success: false,
                message: 'Check-out date must be after Check-in date.'
            }, { status: 400 });
        }

        // Check for Double Booking (Overlap)
        // Overlap occurs if RequestStart < ExistingEnd AND RequestEnd > ExistingStart
        const conflict = await Enquiry.findOne({
            roomType: body.roomType,
            status: { $in: ['Confirmed', 'Payment Received', 'Completed'] },
            checkIn: { $lt: end },
            checkOut: { $gt: start }
        });

        if (conflict) {
            return NextResponse.json({
                success: false,
                message: `Selected dates are not available for ${body.roomType}. Please try different dates or room.`
            }, { status: 400 });
        }

        const enquiry = await Enquiry.create(body);

        // TODO: Send Email Notification logic here (extract to a helper)

        return NextResponse.json({ success: true, data: enquiry, message: 'Enquiry submitted successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Enquiry Submission Error:', error);
        return NextResponse.json({ success: false, message: 'Server error: ' + error.message || 'Unknown error' }, { status: 500 });
    }
}
