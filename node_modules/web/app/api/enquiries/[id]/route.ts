import { NextResponse } from 'next/server';
import { dbConnect, Enquiry } from '@alleppey/database';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { status, payment, roomType } = await req.json();
        await dbConnect();

        const updateData: any = {};
        if (status) updateData.status = status;

        // Handle deeply nested payment fields if provided individually or as object
        if (payment) {
            if (payment.status) updateData['payment.status'] = payment.status;
            if (payment.amount) updateData['payment.amount'] = payment.amount;
            if (payment.mode) updateData['payment.mode'] = payment.mode;
            if (payment.date) updateData['payment.date'] = payment.date;
            if (payment.notes) updateData['payment.notes'] = payment.notes;
        }

        if (roomType) updateData.roomType = roomType;

        const enquiry = await Enquiry.findByIdAndUpdate(id, { $set: updateData }, { new: true });

        if (!enquiry) {
            return NextResponse.json({ success: false, message: 'Enquiry not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: enquiry });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await dbConnect();
        const enquiry = await Enquiry.findById(id);
        if (!enquiry) {
            return NextResponse.json({ success: false, message: 'Enquiry not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: enquiry });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
