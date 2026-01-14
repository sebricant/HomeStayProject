"use client";
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@alleppey/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [revenueData, setRevenueData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [statsRes, reportsRes, revenueRes] = await Promise.all([
                    fetch('/api/enquiries/stats').then(r => r.json()).catch(() => ({ success: false })),
                    fetch('/api/reports/monthly').then(r => r.json()).catch(() => ({ success: false })),
                    fetch('/api/reports/revenue').then(r => r.json()).catch(() => ({ success: false }))
                ]);

                if (statsRes.success) setStats(statsRes.data);
                else setError('Failed to load stats');

                if (reportsRes.success) setReports(reportsRes.data);
                if (revenueRes.success) setRevenueData(revenueRes.data);

            } catch (e) {
                console.error("Failed to fetch dashboard data", e);
                setError('Network error or API down');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) return <div className="p-12 text-center text-text-muted animate-pulse">Loading Dashboard...</div>;
    if (error) return <div className="p-12 text-center text-status-error font-bold">Error: {error} <br /><button onClick={() => window.location.reload()} className="mt-4 underline text-sm text-gray-500">Retry</button></div>;
    if (!stats) return null;

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-3xl font-heading font-bold text-primary-dark mb-2">Morning, Admin</h1>
            <p className="text-text-muted mb-8">Here is what's happening at Palm Grove today.</p>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <a href="/admin/enquiries" className="block transition-transform hover:-translate-y-1">
                    <Card className="flex items-center justify-between !p-6 border-l-4 border-l-primary cursor-pointer hover:shadow-lg transition-shadow">
                        <div>
                            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Total Enquiries</p>
                            <h3 className="text-4xl font-heading font-bold text-primary mt-2">{stats.totalEnquiries}</h3>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <Icon name="Users" size={24} />
                        </div>
                    </Card>
                </a>
                <a href="/admin/enquiries?status=New" className="block transition-transform hover:-translate-y-1">
                    <Card className="flex items-center justify-between !p-6 border-l-4 border-l-accent-coral cursor-pointer hover:shadow-lg transition-shadow">
                        <div>
                            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">New Leads</p>
                            <h3 className="text-4xl font-heading font-bold text-accent-coral mt-2">{stats.newEnquiries}</h3>
                        </div>
                        <div className="p-3 bg-accent-coral/10 rounded-full text-accent-coral">
                            <Icon name="AlertCircle" size={24} />
                        </div>
                    </Card>
                </a>
                <a href="/admin/enquiries?status=Confirmed" className="block transition-transform hover:-translate-y-1">
                    <Card className="flex items-center justify-between !p-6 border-l-4 border-l-status-success cursor-pointer hover:shadow-lg transition-shadow">
                        <div>
                            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Confirmed</p>
                            <h3 className="text-4xl font-heading font-bold text-status-success mt-2">{stats.confirmedBookings}</h3>
                        </div>
                        <div className="p-3 bg-status-success/10 rounded-full text-status-success">
                            <Icon name="CheckCircle" size={24} />
                        </div>
                    </Card>
                </a>
                <div className="block">
                    <Card className="flex items-center justify-between !p-6 border-l-4 border-l-accent-gold">
                        <div>
                            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Revenue (Total)</p>
                            <h3 className="text-4xl font-heading font-bold text-accent-gold mt-2">₹{(revenueData?.totalRevenue || stats.totalRevenue || 0).toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-accent-gold/10 rounded-full text-accent-gold">
                            <Icon name="Banknote" size={24} />
                        </div>
                    </Card>
                </div>
            </div>

            {/* Revenue Analytics Section */}
            {revenueData && (
                <div className="mb-8">
                    <h2 className="text-xl font-heading font-bold text-primary-dark mb-4">Revenue Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card className="p-4 bg-surface-sand/30 border border-surface-sand">
                            <p className="text-xs font-bold text-primary/60 uppercase">Today's Earnings</p>
                            <h3 className="text-2xl font-bold text-primary mt-1">₹{revenueData.todayRevenue.toLocaleString()}</h3>
                        </Card>
                        <Card className="p-4 bg-surface-sand/30 border border-surface-sand">
                            <p className="text-xs font-bold text-primary/60 uppercase">This Month</p>
                            <h3 className="text-2xl font-bold text-primary mt-1">₹{revenueData.monthlyRevenue.toLocaleString()}</h3>
                        </Card>
                        <Card className="p-4 bg-surface-sand/30 border border-surface-sand">
                            <p className="text-xs font-bold text-primary/60 uppercase">Lifetime Total</p>
                            <h3 className="text-2xl font-bold text-primary mt-1">₹{revenueData.totalRevenue.toLocaleString()}</h3>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="h-[350px] p-4">
                            <h3 className="text-md font-bold text-gray-600 mb-4">Daily Earnings (Last 7 Days)</h3>
                            <ResponsiveContainer width="100%" height="90%">
                                <LineChart data={revenueData.dailyEarnings}>
                                    <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Earnings']} />
                                    <Line type="monotone" dataKey="amount" stroke="#0E4D64" strokeWidth={3} dot={{ r: 4, fill: "#0E4D64" }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                        <Card className="h-[350px] p-4">
                            <h3 className="text-md font-bold text-gray-600 mb-4">Monthly Trends (6 Months)</h3>
                            <ResponsiveContainer width="100%" height="90%">
                                <BarChart data={revenueData.monthlyEarnings}>
                                    <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
                                    <Bar dataKey="amount" fill="#FF7F50" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>
                </div>
            )}

            {/* Original Enquiry Volume Chart - Keep as Secondary */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 pb-8">
                <Card className="h-[300px]">
                    <h3 className="text-xl font-heading font-bold text-primary-dark mb-6">Enquiry Volume</h3>
                    <EnquiryChart data={reports} />
                </Card>
            </div>
        </div>
    );
}

function RevenueChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="total" fill="#0E4D64" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

function EnquiryChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#5FA8D3" strokeWidth={3} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
}
