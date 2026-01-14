"use client";
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@alleppey/ui';
// import { EnquiryModal } from '@/components/admin/EnquiryModal'; // Need to build this

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function EnquiriesContent() {
    const searchParams = useSearchParams();
    const initialFilter = searchParams.get('status') || 'All';

    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [filter, setFilter] = useState(initialFilter);
    const [search, setSearch] = useState('');
    const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);

    useEffect(() => {
        fetch('/api/enquiries')
            .then(r => r.json())
            .then(json => {
                if (json.success) setEnquiries(json.data);
            });
    }, []);

    const filteredEnquiries = enquiries.filter(e => {
        const matchStatus = filter === 'All' || e.status === filter;
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-heading font-bold text-gray-800">Enquiries</h1>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                            <th className="p-4">Date</th>
                            <th className="p-4">Guest</th>
                            <th className="p-4">Room</th>
                            <th className="p-4">Dates</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Payment</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredEnquiries.map(enq => (
                            <tr key={enq._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-sm">{new Date(enq.createdAt).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{enq.name}</div>
                                    <div className="text-xs text-gray-500">{enq.email}</div>
                                    <div className="text-[10px] font-mono text-primary/70 mt-1">{enq.inquiryId}</div>
                                </td>
                                <td className="p-4 text-sm font-medium text-primary-dark">
                                    {enq.roomType || 'Standard'}
                                </td>
                                <td className="p-4 text-sm">
                                    {new Date(enq.checkIn).toLocaleDateString()} &rarr; {new Date(enq.checkOut).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                                    ${enq.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            enq.status === 'New' ? 'bg-blue-50 text-blue-600' :
                                                enq.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {enq.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold
                                    ${enq.payment?.status === 'Received' ? 'text-teal-700 bg-teal-50' : 'text-gray-400 bg-gray-50'}`}>
                                        {enq.payment?.status || 'Pending'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => setSelectedEnquiry(enq)} className="text-sm border border-gray-200 px-3 py-1 rounded hover:bg-white hover:border-primary hover:text-primary transition-all">
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredEnquiries.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-400">No enquiries found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedEnquiry && (
                <ManageModal
                    enquiry={selectedEnquiry}
                    onClose={() => setSelectedEnquiry(null)}
                    onUpdate={() => {
                        fetch('/api/enquiries').then(r => r.json()).then(j => j.success && setEnquiries(j.data));
                    }}
                />
            )}
        </div>
    );
}

export default function EnquiriesPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Enquiries...</div>}>
            <EnquiriesContent />
        </Suspense>
    );
}

function ManageModal({ enquiry, onClose, onUpdate }: { enquiry: any, onClose: () => void, onUpdate: () => void }) {
    const [status, setStatus] = useState(enquiry.status);
    const [roomType, setRoomType] = useState(enquiry.roomType || 'Standard');

    // Payment State
    const [paymentStatus, setPaymentStatus] = useState(enquiry.payment?.status || 'Pending');
    const [amount, setAmount] = useState(enquiry.payment?.amount || '');
    const [mode, setMode] = useState(enquiry.payment?.mode || 'Cash');
    const [paymentDate, setPaymentDate] = useState(enquiry.payment?.date ? new Date(enquiry.payment.date).toISOString().split('T')[0] : '');
    const [notes, setNotes] = useState(enquiry.payment?.notes || '');

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/enquiries/${enquiry._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    roomType,
                    payment: {
                        status: paymentStatus,
                        amount: Number(amount),
                        mode,
                        date: paymentDate,
                        notes
                    }
                })
            });
            if (res.ok) {
                onUpdate();
                onClose();
            }
        } catch (e) {
            alert('Failed to update');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
                <div className="bg-primary-dark p-6 text-white flex justify-between items-center sticky top-0 z-10">
                    <h3 className="font-heading font-bold text-xl">Manage Enquiry</h3>
                    <button onClick={onClose}><Icon name="X" /></button>
                </div>
                <div className="p-6 space-y-6">
                    {/* Guest Summary */}
                    <div className="bg-surface-sand/30 p-4 rounded-lg border border-surface-sand">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-bold text-lg text-primary-dark">{enquiry.name}</p>
                                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{enquiry.inquiryId}</p>
                            </div>
                            <Badge variant={status === 'Confirmed' ? 'success' : 'neutral'}>{status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                            <div>
                                <p className="text-xs text-text-muted uppercase font-bold">Check-in</p>
                                <p className="font-medium">{new Date(enquiry.checkIn).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-muted uppercase font-bold">Check-out</p>
                                <p className="font-medium">{new Date(enquiry.checkOut).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Room Type</label>
                            <select className="w-full p-2 border rounded bg-gray-50" value={roomType} onChange={e => setRoomType(e.target.value)}>
                                <option value="Standard">Standard</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="Sea View">Sea View</option>
                                <option value="Family Suite">Family Suite</option>
                                <option value="Houseboat">Houseboat</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                            <select className="w-full p-2 border rounded bg-gray-50" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Payment Received">Payment Received</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="border-t pt-4">
                        <h4 className="font-heading font-bold text-primary mb-4 flex items-center gap-2">
                            <Icon name="Banknote" size={18} /> Payment Details
                        </h4>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Payment Status</label>
                                <select className="w-full p-2 border rounded" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                                    <option value="Pending">Pending</option>
                                    <option value="Received">Received</option>
                                </select>
                            </div>

                            {paymentStatus === 'Received' && (
                                <div className="grid grid-cols-2 gap-3 animate-fade-in-up">
                                    <div className="col-span-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (₹)</label>
                                        <input type="number" className="w-full p-2 border rounded" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                                        <input type="date" className="w-full p-2 border rounded" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Payment Mode</label>
                                        <select className="w-full p-2 border rounded" value={mode} onChange={e => setMode(e.target.value)}>
                                            <option value="Cash">Cash</option>
                                            <option value="UPI">UPI / GPay</option>
                                            <option value="Bank Transfer">Bank Transfer</option>
                                            <option value="Card">Credit/Debit Card</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notes / Ref ID</label>
                                        <input type="text" className="w-full p-2 border rounded" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Transaction ID..." />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 border-t flex gap-4 justify-end sticky bottom-0">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
                    <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark font-bold transition-colors shadow-lg shadow-primary/20">
                        {loading ? 'Saving...' : 'Save & Close'}
                    </button>
                </div>
            </div>
        </div>
    );
}
