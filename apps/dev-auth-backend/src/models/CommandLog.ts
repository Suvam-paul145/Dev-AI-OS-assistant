import mongoose, { Document, Schema } from 'mongoose';

export interface ICommandLog extends Document {
    userId: string;
    command: string;
    intent: string;
    status: 'success' | 'failed' | 'pending';
    result?: any;
    executionTime?: number;
    createdAt: Date;
}

const CommandLogSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    command: { type: String, required: true },
    intent: { type: String, default: 'automation' },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
    result: { type: Schema.Types.Mixed }, // flexible structure for result data
    executionTime: { type: Number },
}, {
    timestamps: { createdAt: true, updatedAt: false } // Only createdAt
});

export default mongoose.model<ICommandLog>('CommandLog', CommandLogSchema);
