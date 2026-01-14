"use client";
import { useState } from 'react';
import { Button, Card } from '@alleppey/ui';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        roomType: 'Standard',
        message: ''
    });
    const [status, setStatus] = useState<'' | 'sending' | 'success' | 'error'>('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMessage('');

        try {
            const res = await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const json = await res.json();

            if (json.success) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', checkIn: '', checkOut: '', roomType: 'Standard', message: '' });
                // Auto-reset success message after 5s
                setTimeout(() => setStatus(''), 5000);
            } else {
                setStatus('error');
                setErrorMessage(json.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setStatus('error');
            setErrorMessage('Network error. Please try again later.');
        }
    };

    return (
        <section id="contact" className="py-24 bg-primary-dark text-white px-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <span className="text-accent-gold font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Book Your Stay</span>
                <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">Plan Your Getaway</h2>
                <p className="text-primary-light/80 mb-12 text-lg font-light">Send us an enquiry and we'll get back to you within 24 hours.</p>

                <Card className="!bg-white text-left !p-8 md:!p-12 max-w-2xl mx-auto shadow-2xl">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">Name</label>
                                <input type="text" required className="w-full p-3 bg-surface-sand rounded-lg outline-none focus:ring-2 focus:ring-primary text-primary"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">Email</label>
                                <input type="email" required className="w-full p-3 bg-surface-sand rounded-lg outline-none focus:ring-2 focus:ring-primary text-primary"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">Phone Number</label>
                            <input type="tel" required className="w-full p-3 bg-surface-sand rounded-lg outline-none focus:ring-2 focus:ring-primary text-primary"
                                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+91 98765 43210" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">Check-in</label>
                                <input type="date" required className="w-full p-3 bg-surface-sand rounded-lg outline-none focus:ring-2 focus:ring-primary text-primary"
                                    value={formData.checkIn} onChange={e => setFormData({ ...formData, checkIn: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">Check-out</label>
                                <input type="date" required className="w-full p-3 bg-surface-sand rounded-lg outline-none focus:ring-2 focus:ring-primary text-primary"
                                    value={formData.checkOut} onChange={e => setFormData({ ...formData, checkOut: e.target.value })} />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">Preferred Accommodation</label>
                            <select
                                className="w-full p-3 bg-surface-sand rounded-lg outline-none focus:ring-2 focus:ring-primary text-primary appearance-none cursor-pointer"
                                value={formData.roomType}
                                onChange={e => setFormData({ ...formData, roomType: e.target.value })}
                            >
                                <option value="Standard">Standard Room</option>
                                <option value="Deluxe">Deluxe Room</option>
                                <option value="Sea View">Sea View Room</option>
                                <option value="Family Suite">Family Suite</option>
                                <option value="Houseboat">Luxury Houseboat</option>
                            </select>
                        </div>

                        <div className="mb-8">
                            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">Message (Optional)</label>
                            <textarea className="w-full p-3 bg-surface-sand rounded-lg outline-none focus:ring-2 focus:ring-primary h-32 text-primary"
                                value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}></textarea>
                        </div>

                        <Button type="submit" disabled={status === 'sending'} size="lg" className="w-full">
                            {status === 'sending' ? 'Sending...' : 'Send Enquiry'}
                        </Button>

                        {status === 'success' && <p className="text-status-success text-center mt-4 font-bold animate-fade-in-up">Enquiry sent successfully! We will contact you soon.</p>}
                        {status === 'error' && <p className="text-status-error text-center mt-4 font-bold animate-fade-in-up">{errorMessage}</p>}
                    </form>
                </Card>
            </div>
        </section>
    );
}
