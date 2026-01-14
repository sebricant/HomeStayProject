"use client";
import { useState } from 'react';
import { Card, Badge, Button } from '@alleppey/ui';
import { Icon } from '@/components/ui/Icon';

export default function GuestPortal() {
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/customer/lookup', {
                method: 'POST',
                body: JSON.stringify({ email, id })
            });
            const json = await res.json();
            if (json.success) {
                setData(json.data);
            } else {
                setError(json.message);
            }
        } catch (err) {
            setError('Failed to connect. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (data) {
        // Result View
        return (
            <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2088&auto=format&fit=crop')] bg-cover bg-center flex flex-col items-center justify-center p-4">
                <div className="absolute inset-0 bg-primary-dark/60 backdrop-blur-sm"></div>

                <Card className="w-full max-w-lg relative z-10 animate-fade-in-up overflow-hidden">
                    <div className="bg-primary-dark p-6 text-white text-center">
                        <h2 className="text-2xl font-heading font-bold mb-1">Your Reservation</h2>
                        <p className="text-white/70 text-sm font-mono tracking-widest uppercase">{data.inquiryId}</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Status Banner */}
                        <div className="flex justify-between items-center bg-surface-sand/50 p-4 rounded-lg border border-surface-sand">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-text-muted font-bold">Status</p>
                                <p className="font-heading font-bold text-primary text-xl">{data.status}</p>
                            </div>
                            <Badge variant={data.status === 'Confirmed' ? 'success' : 'neutral'}>{data.status}</Badge>
                        </div>

                        {/* Booking Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <p className="text-gray-500 text-xs font-bold uppercase">Check-in</p>
                                <p className="font-bold text-gray-800 text-lg">{new Date(data.dates.start).toLocaleDateString()}</p>
                                <p className="text-gray-400 text-xs">After 12:00 PM</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-gray-500 text-xs font-bold uppercase">Check-out</p>
                                <p className="font-bold text-gray-800 text-lg">{new Date(data.dates.end).toLocaleDateString()}</p>
                                <p className="text-gray-400 text-xs">Before 11:00 AM</p>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase">Room Type</p>
                                <p className="font-bold text-primary text-lg">{data.roomType || 'Standard Room'}</p>
                            </div>
                            <Icon name="Home" className="text-primary/20" size={32} />
                        </div>

                        {/* Payment Info */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2 text-sm uppercase">
                                <Icon name="Banknote" size={16} /> Payment Status
                            </h4>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-500">Total Paid</p>
                                    <p className="font-bold text-lg text-primary">₹{(data.payment?.amount || 0).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${data.payment?.status === 'Received' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {data.payment?.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t bg-gray-50">
                        <Button onClick={() => setData(null)} variant="outline" className="w-full">
                            Check Another Booking
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Search Form
    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center flex flex-col items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 to-primary/50 backdrop-blur-sm"></div>

            <Card className="w-full max-w-md relative z-10 animate-fade-in-up !p-8 md:!p-12">
                <div className="text-center mb-8">
                    <span className="text-accent-gold uppercase font-bold tracking-[0.2em] text-xs mb-2 block">Guest Access</span>
                    <h1 className="text-4xl font-heading font-bold text-primary mb-2">Track Your Stay</h1>
                    <p className="text-text-muted">Enter Inquiry ID & Email to view reservation</p>
                </div>

                <form onSubmit={handleLookup} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Inquiry ID</label>
                        <input
                            type="text"
                            required
                            className="w-full p-4 bg-surface-sand border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-primary font-medium placeholder:text-gray-400"
                            placeholder="e.g. PGH-2026-0005"
                            value={id}
                            onChange={e => setId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full p-4 bg-surface-sand border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-primary font-medium placeholder:text-gray-400"
                            placeholder="john@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    {error && <div className="text-status-error text-sm text-center font-bold bg-status-error/10 p-2 rounded">{error}</div>}

                    <Button
                        type="submit"
                        disabled={loading}
                        size="lg"
                        className="w-full"
                    >
                        {loading ? 'Checking...' : 'View Status'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
