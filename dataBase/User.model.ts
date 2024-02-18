import { Document, Schema, model } from 'mongoose';

export interface DBUser extends Document {
    _id: string;
    username: string;
    password: string;
    role: string;
    boss: string | null;
}

const userSchema: Schema<DBUser> = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['administrator', 'boss', 'regular'], required: true },
    boss: { type: Schema.Types.ObjectId, ref: 'User', default: null },
});

export default model<DBUser>('User', userSchema);