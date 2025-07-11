import mongoose, { Document, Schema } from 'mongoose';

export interface IGitHubActivity extends Document {
  _id: string;
  userId: string;
  type: 'commit' | 'pr' | 'issue' | 'release' | 'fork' | 'star';
  repository: string;
  repositoryUrl: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
  processed: boolean;
  score: number;
}

const GitHubActivitySchema = new Schema<IGitHubActivity>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['commit', 'pr', 'issue', 'release', 'fork', 'star'],
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
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    processed: {
      type: Boolean,
      default: false,
      index: true,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
GitHubActivitySchema.index({ userId: 1, createdAt: -1 });
GitHubActivitySchema.index({ userId: 1, type: 1, createdAt: -1 });
GitHubActivitySchema.index({ repository: 1, createdAt: -1 });
GitHubActivitySchema.index({ createdAt: -1 });

export const GitHubActivity = mongoose.model<IGitHubActivity>('GitHubActivity', GitHubActivitySchema);
