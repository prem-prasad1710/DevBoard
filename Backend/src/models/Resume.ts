import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  _id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  template: 'modern' | 'classic' | 'minimal' | 'creative';
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  experience: {
    id: string;
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
    achievements: string[];
    technologies: string[];
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    gpa?: string;
    description?: string;
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
    achievements: string[];
    featured: boolean;
  }[];
  skills: {
    category: string;
    items: {
      name: string;
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    }[];
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: Date;
    expiryDate?: Date;
    credentialId?: string;
    url?: string;
  }[];
  languages: {
    name: string;
    proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    date: Date;
    type: 'award' | 'recognition' | 'publication' | 'competition' | 'other';
  }[];
  customSections: {
    id: string;
    title: string;
    content: string;
    order: number;
  }[];
  uploadedResume?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
    uploadedAt: Date;
  };
  aiGenerated: boolean;
  lastExported?: Date;
  exportCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
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
    isDefault: {
      type: Boolean,
      default: false,
    },
    template: {
      type: String,
      enum: ['modern', 'classic', 'minimal', 'creative'],
      default: 'modern',
    },
    personalInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      location: { type: String },
      website: { type: String },
      linkedin: { type: String },
      github: { type: String },
      portfolio: { type: String },
    },
    summary: {
      type: String,
      required: true,
    },
    experience: [{
      id: { type: String, required: true },
      company: { type: String, required: true },
      position: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      current: { type: Boolean, default: false },
      description: { type: String, required: true },
      achievements: [{ type: String }],
      technologies: [{ type: String }],
    }],
    education: [{
      id: { type: String, required: true },
      institution: { type: String, required: true },
      degree: { type: String, required: true },
      field: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      current: { type: Boolean, default: false },
      gpa: { type: String },
      description: { type: String },
    }],
    projects: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
      technologies: [{ type: String }],
      url: { type: String },
      github: { type: String },
      achievements: [{ type: String }],
      featured: { type: Boolean, default: false },
    }],
    skills: [{
      category: { type: String, required: true },
      items: [{
        name: { type: String, required: true },
        level: { 
          type: String, 
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
          required: true 
        },
      }],
    }],
    certifications: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      issuer: { type: String, required: true },
      date: { type: Date, required: true },
      expiryDate: { type: Date },
      credentialId: { type: String },
      url: { type: String },
    }],
    languages: [{
      name: { type: String, required: true },
      proficiency: { 
        type: String, 
        enum: ['basic', 'conversational', 'fluent', 'native'],
        required: true 
      },
    }],
    achievements: [{
      id: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      date: { type: Date, required: true },
      type: { 
        type: String, 
        enum: ['award', 'recognition', 'publication', 'competition', 'other'],
        required: true 
      },
    }],
    customSections: [{
      id: { type: String, required: true },
      title: { type: String, required: true },
      content: { type: String, required: true },
      order: { type: Number, required: true },
    }],
    uploadedResume: {
      filename: { type: String },
      originalName: { type: String },
      mimetype: { type: String },
      size: { type: Number },
      path: { type: String },
      uploadedAt: { type: Date },
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    lastExported: {
      type: Date,
    },
    exportCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
ResumeSchema.index({ userId: 1, createdAt: -1 });
ResumeSchema.index({ userId: 1, isDefault: 1 });
ResumeSchema.index({ userId: 1, template: 1 });

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
