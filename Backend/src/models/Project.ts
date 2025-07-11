import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  _id: string;
  userId: string;
  name: string;
  description: string;
  repository?: string;
  repositoryUrl?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  progress: number; // 0-100
  startDate: Date;
  endDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  technologies: string[];
  tags: string[];
  goals: string[];
  challenges: string[];
  learnings: string[];
  tasks: {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    estimatedHours?: number;
    actualHours?: number;
    createdAt: Date;
    completedAt?: Date;
  }[];
  milestones: {
    id: string;
    title: string;
    description?: string;
    targetDate: Date;
    completedDate?: Date;
    status: 'pending' | 'completed';
  }[];
  collaborators: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    repository: {
      type: String,
    },
    repositoryUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'],
      default: 'planning',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    estimatedHours: {
      type: Number,
      min: 0,
    },
    actualHours: {
      type: Number,
      min: 0,
      default: 0,
    },
    technologies: [{
      type: String,
    }],
    tags: [{
      type: String,
    }],
    goals: [{
      type: String,
    }],
    challenges: [{
      type: String,
    }],
    learnings: [{
      type: String,
    }],
    tasks: [{
      id: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String },
      status: { 
        type: String, 
        enum: ['todo', 'in-progress', 'completed'],
        default: 'todo'
      },
      priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      estimatedHours: { type: Number, min: 0 },
      actualHours: { type: Number, min: 0, default: 0 },
      createdAt: { type: Date, default: Date.now },
      completedAt: { type: Date },
    }],
    milestones: [{
      id: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String },
      targetDate: { type: Date, required: true },
      completedDate: { type: Date },
      status: { 
        type: String, 
        enum: ['pending', 'completed'],
        default: 'pending'
      },
    }],
    collaborators: [{
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
ProjectSchema.index({ userId: 1, status: 1, createdAt: -1 });
ProjectSchema.index({ userId: 1, priority: 1, createdAt: -1 });
ProjectSchema.index({ technologies: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ isPublic: 1, createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
