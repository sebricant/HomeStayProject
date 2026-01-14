import { NextResponse } from 'next/server';
import { dbConnect, Enquiry } from '@alleppey/database';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Aggregate Enquiries by Month (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const monthlyStats = await Enquiry.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    enquiries: { $sum: 1 },
                    confirmed: {
                        $sum: { $cond: [{ $eq: ['$status', 'Confirmed'] }, 1, 0] }
                    },
                    revenue: {
                        $sum: {
                            $cond: [
                                { $eq: ['$payment.status', 'Received'] },
                                '$payment.amount',
                                0
                            ]
                        }
                    }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Format for Recharts
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Fill in missing months if necessary, but for now simple mapping
        const result = monthlyStats.map(item => ({
            name: months[item._id.month - 1],
            total: item.revenue,
            count: item.enquiries,
            confirmed: item.confirmed
        }));

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
