import mongoose, { Document, Schema } from 'mongoose';

export interface IOpenIssue extends Document {
  _id: string;
  userId?: string; // Optional if issue is for general recommendation
  repository: string;
  repositoryUrl: string;
  issueNumber: number;
  title: string;
  description: string;
  labels: string[];
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string; // e.g., "2-4 hours"
  goodFirstIssue: boolean;
  helpWanted: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastChecked: Date;
  isActive: boolean;
  author: string;
  assignees: string[];
  comments: number;
  reactions: {
    thumbsUp: number;
    thumbsDown: number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
  };
  matchScore?: number; // For user-specific recommendations
  matchReasons?: string[]; // Why this issue was recommended
}

const OpenIssueSchema = new Schema<IOpenIssue>(
  {
    userId: {
      type: String,
      index: true,
    },
    repository: {
      type: String,
      required: true,
      index: true,
    },
    repositoryUrl: {
      type: String,
      required: true,
    },
    issueNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    labels: [{
      type: String,
    }],
    language: {
      type: String,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
      index: true,
    },
    estimatedTime: {
      type: String,
      required: true,
    },
    goodFirstIssue: {
      type: Boolean,
      default: false,
      index: true,
    },
    helpWanted: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastChecked: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    author: {
      type: String,
      required: true,
    },
    assignees: [{
      type: String,
    }],
    comments: {
      type: Number,
      default: 0,
    },
    reactions: {
      thumbsUp: { type: Number, default: 0 },
      thumbsDown: { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
      hooray: { type: Number, default: 0 },
      confused: { type: Number, default: 0 },
      heart: { type: Number, default: 0 },
      rocket: { type: Number, default: 0 },
      eyes: { type: Number, default: 0 },
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    matchReasons: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Compound index for repository and issue number (unique constraint)
OpenIssueSchema.index({ repository: 1, issueNumber: 1 }, { unique: true });

// Indexes for efficient queries
OpenIssueSchema.index({ userId: 1, matchScore: -1 });
OpenIssueSchema.index({ language: 1, difficulty: 1, isActive: 1 });
OpenIssueSchema.index({ goodFirstIssue: 1, isActive: 1 });
OpenIssueSchema.index({ helpWanted: 1, isActive: 1 });
OpenIssueSchema.index({ labels: 1 });

export const OpenIssue = mongoose.model<IOpenIssue>('OpenIssue', OpenIssueSchema);
