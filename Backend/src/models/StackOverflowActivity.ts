import mongoose, { Document, Schema } from 'mongoose';

export interface IStackOverflowActivity extends Document {
  _id: string;
  userId: string;
  stackoverflowId: string;
  type: 'question' | 'answer' | 'comment' | 'badge' | 'reputation';
  title: string;
  content?: string;
  url: string;
  score: number;
  tags: string[];
  accepted: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

const StackOverflowActivitySchema = new Schema<IStackOverflowActivity>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    stackoverflowId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['question', 'answer', 'comment', 'badge', 'reputation'],
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    tags: [{
      type: String,
    }],
    accepted: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
StackOverflowActivitySchema.index({ userId: 1, createdAt: -1 });
StackOverflowActivitySchema.index({ userId: 1, type: 1, createdAt: -1 });
StackOverflowActivitySchema.index({ tags: 1 });

export const StackOverflowActivity = mongoose.model<IStackOverflowActivity>('StackOverflowActivity', StackOverflowActivitySchema);
