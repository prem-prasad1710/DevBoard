import mongoose, { Document, Schema } from 'mongoose';

export interface IDeveloperJournal extends Document {
  _id: string;
  userId: string;
  date: Date;
  title: string;
  content: string;
  mood: 'frustrated' | 'confused' | 'motivated' | 'accomplished' | 'excited' | 'tired';
  productivity: number; // 1-10 scale
  challenges: string[];
  achievements: string[];
  learnings: string[];
  goals: string[];
  technologies: string[];
  aiGenerated: boolean;
  aiPrompt?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DeveloperJournalSchema = new Schema<IDeveloperJournal>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      enum: ['frustrated', 'confused', 'motivated', 'accomplished', 'excited', 'tired'],
      index: true,
    },
    productivity: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    challenges: [{
      type: String,
    }],
    achievements: [{
      type: String,
    }],
    learnings: [{
      type: String,
    }],
    goals: [{
      type: String,
    }],
    technologies: [{
      type: String,
    }],
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    aiPrompt: {
      type: String,
    },
    tags: [{
      type: String,
    }],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
DeveloperJournalSchema.index({ userId: 1, date: -1 });
DeveloperJournalSchema.index({ userId: 1, mood: 1, date: -1 });
DeveloperJournalSchema.index({ userId: 1, tags: 1 });
DeveloperJournalSchema.index({ isPublic: 1, date: -1 });

export const DeveloperJournal = mongoose.model<IDeveloperJournal>('DeveloperJournal', DeveloperJournalSchema);
