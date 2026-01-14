import { NextResponse } from 'next/server';
import { dbConnect, Enquiry } from '@alleppey/database';

export async function GET() {
    try {
        await dbConnect();

        // 1. Total Revenue (Lifetime)
        const totalRevenueResult = await Enquiry.aggregate([
            { $match: { 'payment.status': 'Received' } },
            { $group: { _id: null, total: { $sum: '$payment.amount' } } }
        ]);
        const totalRevenue = totalRevenueResult[0]?.total || 0;

        // 2. Today's Earnings
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayRevenueResult = await Enquiry.aggregate([
            {
                $match: {
                    'payment.status': 'Received',
                    'payment.date': { $gte: today }
                }
            },
            { $group: { _id: null, total: { $sum: '$payment.amount' } } }
        ]);
        const todayRevenue = todayRevenueResult[0]?.total || 0;

        // 3. Monthly Revenue (Current Month)
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthlyRevenueResult = await Enquiry.aggregate([
            {
                $match: {
                    'payment.status': 'Received',
                    'payment.date': { $gte: firstDayOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: '$payment.amount' } } }
        ]);
        const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

        // 4. Daily Earnings Chart (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyEarnings = await Enquiry.aggregate([
            {
                $match: {
                    'payment.status': 'Received',
                    'payment.date': { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$payment.date" } },
                    total: { $sum: "$payment.amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 5. Monthly Revenue Chart (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyEarnings = await Enquiry.aggregate([
            {
                $match: {
                    'payment.status': 'Received',
                    'payment.date': { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$payment.date" } },
                    total: { $sum: "$payment.amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalRevenue,
                todayRevenue,
                monthlyRevenue,
                dailyEarnings: dailyEarnings.map(d => ({ date: d._id, amount: d.total })),
                monthlyEarnings: monthlyEarnings.map(d => ({ month: d._id, amount: d.total }))
            }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
