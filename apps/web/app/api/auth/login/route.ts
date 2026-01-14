import { NextResponse } from 'next/server';
import { dbConnect, Admin } from '@alleppey/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
        }

        await dbConnect();

        // Find admin handling connection state (Next.js hot reload safe)
        const admin = await Admin.findOne({ email });

        // For Demo: If no admin exists, create one (similar to original logic)
        if (!admin && email === 'admin@palmgrove.com' && password === 'admin123') {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newAdmin = await Admin.create({ email, password: hashedPassword });

            const token = jwt.sign({ id: newAdmin._id }, JWT_SECRET, { expiresIn: '1d' });
            return NextResponse.json({ success: true, token });
        }

        if (!admin) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, admin.password!);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1d' });

        return NextResponse.json({ success: true, token });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
