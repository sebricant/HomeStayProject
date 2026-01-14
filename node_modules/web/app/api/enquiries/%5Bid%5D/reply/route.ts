import { NextResponse } from 'next/server';
import { dbConnect, Enquiry } from '@alleppey/database';
// import nodemailer from 'nodemailer'; // TODO: Implement Helper

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { subject, message } = await req.json();

        await dbConnect();
        const enquiry = await Enquiry.findById(id);

        if (!enquiry) {
            return NextResponse.json({ success: false, message: 'Enquiry not found' }, { status: 404 });
        }

        // Update Status
        if (enquiry.status === 'New') {
            enquiry.status = 'Contacted';
        }

        // Add Reply
        enquiry.replies.push({
            subject,
            content: message,
            by: 'Admin',
            date: new Date()
        });

        await enquiry.save();

        // TODO: Send Email logic using Nodemailer

        return NextResponse.json({ success: true, message: 'Reply sent' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
