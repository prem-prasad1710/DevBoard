import mongoose, { Document, Schema } from 'mongoose';

export interface IAIChat extends Document {
  _id: string;
  userId: string;
  sessionId: string;
  type: 'mentor' | 'debug' | 'code-review' | 'general';
  title: string;
  messages: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: Record<string, any>;
  }[];
  context: {
    codeSnippet?: string;
    language?: string;
    framework?: string;
    errorMessage?: string;
    repository?: string;
    filePath?: string;
  };
  tags: string[];
  isBookmarked: boolean;
  rating?: number; // 1-5 stars
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AIChatSchema = new Schema<IAIChat>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['mentor', 'debug', 'code-review', 'general'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    messages: [{
      id: { type: String, required: true },
      role: { 
        type: String, 
        enum: ['user', 'assistant', 'system'],
        required: true 
      },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      metadata: { type: Schema.Types.Mixed },
    }],
    context: {
      codeSnippet: { type: String },
      language: { type: String },
      framework: { type: String },
      errorMessage: { type: String },
      repository: { type: String },
      filePath: { type: String },
    },
    tags: [{
      type: String,
    }],
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
AIChatSchema.index({ userId: 1, createdAt: -1 });
AIChatSchema.index({ userId: 1, type: 1, createdAt: -1 });
AIChatSchema.index({ userId: 1, isBookmarked: 1 });
// sessionId already has index: true in schema definition

export const AIChat = mongoose.model<IAIChat>('AIChat', AIChatSchema);
