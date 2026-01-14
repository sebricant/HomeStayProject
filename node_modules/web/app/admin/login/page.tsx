"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const json = await res.json();

            if (json.success) {
                // Set cookie for middleware
                document.cookie = `token=${json.token}; path=/; max-age=86400`; // 1 day
                router.push('/admin');
            } else {
                setError(json.message);
            }
        } catch (err) {
            setError('Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center text-primary mb-6">Admin Sign In</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <button type="submit" className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-primary-dark transition-colors">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
