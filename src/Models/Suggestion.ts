import mongoose, { Schema, Document } from 'mongoose';

export interface ISuggestion extends Document {
  user: mongoose.Types.ObjectId;
  message: string;
  likes: string[];
  dislikes: string[];
  comments: {
    email: string;
    text: string;
    createdAt: Date;
  }[];
  createdAt: Date;
}

const SuggestionSchema = new Schema<ISuggestion>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  likes: { type: [String], default: [] },
  dislikes: { type: [String], default: [] },
  comments: [
    {
      email: { type: String, required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

export default mongoose.models.Suggestion || mongoose.model<ISuggestion>('Suggestion', SuggestionSchema);

