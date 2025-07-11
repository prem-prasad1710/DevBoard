import mongoose, { Document, Schema } from 'mongoose';

export interface ICodeChallenge extends Document {
  _id: string;
  userId?: string; // Optional if challenge is for general use
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  language: string;
  timeLimit?: number; // in minutes
  memoryLimit?: number; // in MB
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  hints: string[];
  solution?: {
    code: string;
    explanation: string;
    timeComplexity: string;
    spaceComplexity: string;
  };
  testCases: {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
  }[];
  submissions: {
    userId: string;
    code: string;
    language: string;
    status: 'accepted' | 'wrong-answer' | 'time-limit' | 'memory-limit' | 'runtime-error' | 'compile-error';
    runtime?: number;
    memory?: number;
    timestamp: Date;
    score?: number;
  }[];
  stats: {
    totalSubmissions: number;
    acceptedSubmissions: number;
    acceptanceRate: number;
    averageRuntime: number;
    averageMemory: number;
  };
  source: string; // e.g., "leetcode", "hackerrank", "custom"
  sourceUrl?: string;
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CodeChallengeSchema = new Schema<ICodeChallenge>(
  {
    userId: {
      type: String,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    tags: [{
      type: String,
    }],
    language: {
      type: String,
      required: true,
      index: true,
    },
    timeLimit: {
      type: Number,
    },
    memoryLimit: {
      type: Number,
    },
    examples: [{
      input: { type: String, required: true },
      output: { type: String, required: true },
      explanation: { type: String },
    }],
    constraints: [{
      type: String,
    }],
    hints: [{
      type: String,
    }],
    solution: {
      code: { type: String },
      explanation: { type: String },
      timeComplexity: { type: String },
      spaceComplexity: { type: String },
    },
    testCases: [{
      input: { type: String, required: true },
      expectedOutput: { type: String, required: true },
      isHidden: { type: Boolean, default: false },
    }],
    submissions: [{
      userId: { type: String, required: true },
      code: { type: String, required: true },
      language: { type: String, required: true },
      status: { 
        type: String, 
        enum: ['accepted', 'wrong-answer', 'time-limit', 'memory-limit', 'runtime-error', 'compile-error'],
        required: true 
      },
      runtime: { type: Number },
      memory: { type: Number },
      timestamp: { type: Date, default: Date.now },
      score: { type: Number },
    }],
    stats: {
      totalSubmissions: { type: Number, default: 0 },
      acceptedSubmissions: { type: Number, default: 0 },
      acceptanceRate: { type: Number, default: 0 },
      averageRuntime: { type: Number, default: 0 },
      averageMemory: { type: Number, default: 0 },
    },
    source: {
      type: String,
      required: true,
    },
    sourceUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
CodeChallengeSchema.index({ difficulty: 1, category: 1, isActive: 1 });
CodeChallengeSchema.index({ tags: 1 });
CodeChallengeSchema.index({ featured: 1, isActive: 1 });
CodeChallengeSchema.index({ 'stats.acceptanceRate': 1 });

export const CodeChallenge = mongoose.model<ICodeChallenge>('CodeChallenge', CodeChallengeSchema);
