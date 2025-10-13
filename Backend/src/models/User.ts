import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  githubUsername?: string;
  stackoverflowId?: string;
  leetcodeUsername?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  skills?: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    portfolio?: string;
    blog?: string;
  };
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  onboardingCompleted: boolean;
  tokenVersion: number;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  emailVerificationToken?: string | null;
  emailVerificationExpires?: Date | null;
  lastLoginAt?: Date;
  lastActiveAt?: Date;
  loginCount: number;
  createdAt: Date;
  updatedAt: Date;
  
  // User preferences and settings
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    notifications: {
      email: boolean;
      push: boolean;
      browser: boolean;
      sms: boolean;
      dailyDigest: boolean;
      weeklyReport: boolean;
      aiNudges: boolean;
      achievements: boolean;
      reminders: boolean;
    };
    privacy: {
      publicProfile: boolean;
      showActivity: boolean;
      showStats: boolean;
      showContributions: boolean;
      allowMessages: boolean;
      searchEngineIndexing: boolean;
    };
    integrations: {
      github: {
        enabled: boolean;
        username?: string;
        accessToken?: string;
        lastSync?: Date;
      };
      stackoverflow: {
        enabled: boolean;
        userId?: string;
        accessToken?: string;
        lastSync?: Date;
      };
      leetcode: {
        enabled: boolean;
        username?: string;
        lastSync?: Date;
      };
      reddit: {
        enabled: boolean;
        username?: string;
        accessToken?: string;
      };
      vscode: {
        enabled: boolean;
        syncSettings: boolean;
      };
    };
    dashboard: {
      layout: 'default' | 'compact' | 'minimal';
      widgets: string[];
      refreshInterval: number;
    };
    coding: {
      preferredLanguages: string[];
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      focusAreas: string[];
      dailyGoal: number;
    };
  };

  // User statistics and progress
  stats: {
    totalActivities: number;
    totalCommits: number;
    totalPullRequests: number;
    totalIssues: number;
    totalRepositories: number;
    codeLines: number;
    problemsSolved: number;
    streakDays: number;
    lastStreakUpdate: Date;
    activityScore: number;
    rankingPosition?: number;
  };

  // Subscription and billing
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'past_due' | 'trialing';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };

  // OAuth tokens (encrypted)
  oauthTokens?: {
    github?: {
      accessToken: string;
      refreshToken?: string;
      expiresAt?: Date;
    };
    stackoverflow?: {
      accessToken: string;
      expiresAt?: Date;
    };
    google?: {
      accessToken: string;
      refreshToken?: string;
      expiresAt?: Date;
    };
  };

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
  generateEmailVerificationToken(): string;
  updateLastActivity(): Promise<void>;
  incrementLoginCount(): Promise<void>;
  updateStreak(): Promise<void>;
  toJSON(): any;
}

interface UserModel extends mongoose.Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findActiveUsers(): Promise<IUser[]>;
  getLeaderboard(limit?: number): Promise<IUser[]>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include in queries by default
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    githubUsername: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      maxlength: [39, 'GitHub username cannot exceed 39 characters'],
    },
    stackoverflowId: {
      type: String,
      trim: true,
      maxlength: [20, 'Stack Overflow ID cannot exceed 20 characters'],
    },
    leetcodeUsername: {
      type: String,
      trim: true,
      maxlength: [50, 'LeetCode username cannot exceed 50 characters'],
    },
    avatarUrl: {
      type: String,
      trim: true,
      maxlength: [500, 'Avatar URL cannot exceed 500 characters'],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    website: {
      type: String,
      trim: true,
      maxlength: [200, 'Website URL cannot exceed 200 characters'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    jobTitle: {
      type: String,
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    skills: [{
      type: String,
      trim: true,
      maxlength: [50, 'Skill name cannot exceed 50 characters'],
    }],
    socialLinks: {
      twitter: {
        type: String,
        trim: true,
        maxlength: [200, 'Twitter URL cannot exceed 200 characters'],
      },
      linkedin: {
        type: String,
        trim: true,
        maxlength: [200, 'LinkedIn URL cannot exceed 200 characters'],
      },
      portfolio: {
        type: String,
        trim: true,
        maxlength: [200, 'Portfolio URL cannot exceed 200 characters'],
      },
      blog: {
        type: String,
        trim: true,
        maxlength: [200, 'Blog URL cannot exceed 200 characters'],
      },
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
    onboardingCompleted: {
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
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    lastLoginAt: {
      type: Date,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    loginCount: {
      type: Number,
      default: 0,
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
      timezone: {
        type: String,
        default: 'UTC',
      },
      dateFormat: {
        type: String,
        default: 'MM/DD/YYYY',
      },
      timeFormat: {
        type: String,
        enum: ['12h', '24h'],
        default: '12h',
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
        browser: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: false,
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
        achievements: {
          type: Boolean,
          default: true,
        },
        reminders: {
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
        showContributions: {
          type: Boolean,
          default: true,
        },
        allowMessages: {
          type: Boolean,
          default: true,
        },
        searchEngineIndexing: {
          type: Boolean,
          default: true,
        },
      },
      integrations: {
        github: {
          enabled: {
            type: Boolean,
            default: false,
          },
          username: String,
          accessToken: {
            type: String,
            select: false,
          },
          lastSync: Date,
        },
        stackoverflow: {
          enabled: {
            type: Boolean,
            default: false,
          },
          userId: String,
          accessToken: {
            type: String,
            select: false,
          },
          lastSync: Date,
        },
        leetcode: {
          enabled: {
            type: Boolean,
            default: false,
          },
          username: String,
          lastSync: Date,
        },
        reddit: {
          enabled: {
            type: Boolean,
            default: false,
          },
          username: String,
          accessToken: {
            type: String,
            select: false,
          },
        },
        vscode: {
          enabled: {
            type: Boolean,
            default: false,
          },
          syncSettings: {
            type: Boolean,
            default: false,
          },
        },
      },
      dashboard: {
        layout: {
          type: String,
          enum: ['default', 'compact', 'minimal'],
          default: 'default',
        },
        widgets: [{
          type: String,
        }],
        refreshInterval: {
          type: Number,
          default: 300000, // 5 minutes
        },
      },
      coding: {
        preferredLanguages: [{
          type: String,
        }],
        difficulty: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced'],
          default: 'beginner',
        },
        focusAreas: [{
          type: String,
        }],
        dailyGoal: {
          type: Number,
          default: 1,
        },
      },
    },
    stats: {
      totalActivities: {
        type: Number,
        default: 0,
      },
      totalCommits: {
        type: Number,
        default: 0,
      },
      totalPullRequests: {
        type: Number,
        default: 0,
      },
      totalIssues: {
        type: Number,
        default: 0,
      },
      totalRepositories: {
        type: Number,
        default: 0,
      },
      codeLines: {
        type: Number,
        default: 0,
      },
      problemsSolved: {
        type: Number,
        default: 0,
      },
      streakDays: {
        type: Number,
        default: 0,
      },
      lastStreakUpdate: {
        type: Date,
        default: Date.now,
      },
      activityScore: {
        type: Number,
        default: 0,
      },
      rankingPosition: Number,
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free',
      },
      status: {
        type: String,
        enum: ['active', 'cancelled', 'past_due', 'trialing'],
        default: 'active',
      },
      currentPeriodStart: Date,
      currentPeriodEnd: Date,
      cancelAtPeriodEnd: {
        type: Boolean,
        default: false,
      },
      stripeCustomerId: {
        type: String,
        select: false,
      },
      stripeSubscriptionId: {
        type: String,
        select: false,
      },
    },
    oauthTokens: {
      github: {
        accessToken: {
          type: String,
          select: false,
        },
        refreshToken: {
          type: String,
          select: false,
        },
        expiresAt: Date,
      },
      stackoverflow: {
        accessToken: {
          type: String,
          select: false,
        },
        expiresAt: Date,
      },
      google: {
        accessToken: {
          type: String,
          select: false,
        },
        refreshToken: {
          type: String,
          select: false,
        },
        expiresAt: Date,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.emailVerificationToken;
        delete ret.emailVerificationExpires;
        delete ret.tokenVersion;
        delete ret.oauthTokens;
        return ret;
      },
    },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ githubUsername: 1 }, { sparse: true });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastActiveAt: -1 });
userSchema.index({ 'stats.activityScore': -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Pre-save middleware to update lastActiveAt
userSchema.pre('save', function(next) {
  if (this.isNew || this.isModified()) {
    this.lastActiveAt = new Date();
  }
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.generatePasswordResetToken = function(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return resetToken;
};

userSchema.methods.generateEmailVerificationToken = function(): string {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return verificationToken;
};

userSchema.methods.updateLastActivity = async function(): Promise<void> {
  this.lastActiveAt = new Date();
  await this.save({ validateBeforeSave: false });
};

userSchema.methods.incrementLoginCount = async function(): Promise<void> {
  this.loginCount += 1;
  this.lastLoginAt = new Date();
  await this.save({ validateBeforeSave: false });
};

userSchema.methods.updateStreak = async function(): Promise<void> {
  const today = new Date();
  const lastUpdate = new Date(this.stats.lastStreakUpdate);
  
  // Check if it's a new day
  if (today.toDateString() !== lastUpdate.toDateString()) {
    const daysDiff = Math.floor((today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day - increment streak
      this.stats.streakDays += 1;
    } else if (daysDiff > 1) {
      // Streak broken - reset
      this.stats.streakDays = 1;
    }
    
    this.stats.lastStreakUpdate = today;
    await this.save({ validateBeforeSave: false });
  }
};

// Static methods
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByUsername = function(username: string) {
  return this.findOne({ username });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

userSchema.statics.getLeaderboard = function(limit: number = 10) {
  return this.find({ isActive: true })
    .sort({ 'stats.activityScore': -1 })
    .limit(limit)
    .select('username avatarUrl stats.activityScore stats.totalCommits stats.problemsSolved');
};

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
export default User;
