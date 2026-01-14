import { NextResponse } from 'next/server';
import { dbConnect, Enquiry } from '@alleppey/database';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Parallel fetch for stats
        const [totalEnquiries, newEnquiries, confirmedBookings, revenueAgg] = await Promise.all([
            Enquiry.countDocuments(),
            Enquiry.countDocuments({ status: 'New' }),
            Enquiry.countDocuments({ status: 'Confirmed' }),
            Enquiry.aggregate([
                { $match: { 'payment.status': 'Received' } },
                { $group: { _id: null, total: { $sum: '$payment.amount' } } }
            ])
        ]);

        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        return NextResponse.json({
            success: true,
            data: {
                totalEnquiries,
                newEnquiries,
                confirmedBookings,
                totalRevenue
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
