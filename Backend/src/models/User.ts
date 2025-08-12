import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  githubUsername?: string;
  stackoverflowId?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  tokenVersion: number;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      dailyDigest: boolean;
      weeklyReport: boolean;
      aiNudges: boolean;
    };
    privacy: {
      publicProfile: boolean;
      showActivity: boolean;
      showStats: boolean;
    };
    integrations: {
      github: boolean;
      stackoverflow: boolean;
      reddit: boolean;
      vscode: boolean;
    };
    mobile?: {
      pushNotifications: boolean;
      biometricAuth: boolean;
      offlineMode: boolean;
      dataUsage: 'low' | 'normal' | 'high';
      autoSync: boolean;
    };
  };
  profile: {
    goals: string[];
    skills: string[];
    interests: string[];
    experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    focusAreas: string[];
    careerGoals: string[];
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): any;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Don't include in queries by default
    },
    githubUsername: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    stackoverflowId: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    website: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    lastLoginAt: {
      type: Date,
    },
    settings: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      language: {
        type: String,
        default: 'en',
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        dailyDigest: {
          type: Boolean,
          default: true,
        },
        weeklyReport: {
          type: Boolean,
          default: true,
        },
        aiNudges: {
          type: Boolean,
          default: true,
        },
      },
      privacy: {
        publicProfile: {
          type: Boolean,
          default: false,
        },
        showActivity: {
          type: Boolean,
          default: true,
        },
        showStats: {
          type: Boolean,
          default: true,
        },
      },
      integrations: {
        github: {
          type: Boolean,
          default: false,
        },
        stackoverflow: {
          type: Boolean,
          default: false,
        },
        reddit: {
          type: Boolean,
          default: false,
        },
        vscode: {
          type: Boolean,
          default: false,
        },
      },
    },
    profile: {
      goals: [{
        type: String,
        trim: true,
      }],
      skills: [{
        type: String,
        trim: true,
      }],
      interests: [{
        type: String,
        trim: true,
      }],
      experience: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner',
      },
      focusAreas: [{
        type: String,
        trim: true,
      }],
      careerGoals: [{
        type: String,
        trim: true,
      }],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete (ret as any).password;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Indexes for performance (email, username, githubUsername already have unique indexes)
userSchema.index({ createdAt: -1 });
userSchema.index({ isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Update lastLoginAt when user logs in
userSchema.pre('save', function(next) {
  if (this.isModified('lastLoginAt')) {
    this.lastLoginAt = new Date();
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate avatar URL if not provided
userSchema.pre('save', function(next) {
  if (!this.avatarUrl && this.githubUsername) {
    this.avatarUrl = `https://github.com/${this.githubUsername}.png?size=400`;
  }
  next();
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.username;
});

// Virtual for avatar with fallback
userSchema.virtual('avatar').get(function() {
  return this.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.username)}&background=random`;
});

// Static method to find by email or username
userSchema.statics.findByEmailOrUsername = function(identifier: string) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier },
    ],
  });
};

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Instance method to update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date();
  return this.save();
};

// Instance method to toggle settings
userSchema.methods.updateSettings = function(newSettings: any) {
  this.settings = { ...this.settings, ...newSettings };
  return this.save();
};

// Instance method to update profile
userSchema.methods.updateProfile = function(newProfile: any) {
  this.profile = { ...this.profile, ...newProfile };
  return this.save();
};

export const User = mongoose.model<IUser>('User', userSchema);
