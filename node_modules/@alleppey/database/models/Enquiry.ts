import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnquiry extends Document {
    inquiryId?: string;
    name: string;
    email: string;
    phone: string;
    checkIn: Date;
    checkOut: Date;
    roomType: 'Standard' | 'Deluxe' | 'Sea View' | 'Houseboat' | 'Family Suite';
    message?: string;
    status: 'New' | 'Contacted' | 'Confirmed' | 'Payment Received' | 'Completed' | 'Cancelled';
    payment: {
        amount?: number;
        status: 'Pending' | 'Received';
        mode?: string;
        date?: Date;
        notes?: string;
    };
    replies: {
        subject?: string;
        content: string;
        by: string;
        date: Date;
    }[];
    createdAt: Date;
}

const EnquirySchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    roomType: {
        type: String,
        enum: ['Standard', 'Deluxe', 'Sea View', 'Houseboat', 'Family Suite'],
        required: true,
        default: 'Standard'
    },
    message: { type: String },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Confirmed', 'Payment Received', 'Completed', 'Cancelled'],
        default: 'New'
    },
    payment: {
        amount: { type: Number },
        status: { type: String, enum: ['Pending', 'Received'], default: 'Pending' },
        mode: { type: String },
        date: { type: Date },
        notes: { type: String }
    },
    replies: [{
        subject: String,
        content: String,
        by: String,
        date: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    inquiryId: { type: String, unique: true }
});

// Auto-generate Inquiry ID before saving
EnquirySchema.pre('save', async function (next) {
    if (!this.isNew || this.inquiryId) return next();

    const year = new Date().getFullYear();
    const prefix = `PGH-${year}`;

    // Find last enquiry of this year
    const lastEnquiry = await mongoose.models.Enquiry.findOne({
        inquiryId: { $regex: `^${prefix}` }
    }).sort({ inquiryId: -1 });

    let sequence = 1;
    if (lastEnquiry && lastEnquiry.inquiryId) {
        const parts = lastEnquiry.inquiryId.split('-');
        if (parts.length === 3) {
            sequence = parseInt(parts[2]) + 1;
        }
    }

    this.inquiryId = `${prefix}-${sequence.toString().padStart(4, '0')}`;
    next();
});

// Helper to avoid OverwriteModelError in serverless (Next.js)
export const Enquiry: Model<IEnquiry> = mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
