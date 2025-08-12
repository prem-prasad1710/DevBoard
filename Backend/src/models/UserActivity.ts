import mongoose, { Document, Schema } from 'mongoose';

export interface IUserActivity extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  activityType: 'login' | 'logout' | 'profile_update' | 'password_change' | 'api_access' | 'file_upload' | 'settings_change' | 'data_export';
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };
  timestamp: Date;
  createdAt: Date;
}

const userActivitySchema = new Schema<IUserActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    activityType: {
      type: String,
      enum: ['login', 'logout', 'profile_update', 'password_change', 'api_access', 'file_upload', 'settings_change', 'data_export'],
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      maxlength: 45,
    },
    userAgent: {
      type: String,
      maxlength: 500,
    },
    location: {
      country: { type: String, maxlength: 100 },
      city: { type: String, maxlength: 100 },
      region: { type: String, maxlength: 100 },
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'user_activities',
  }
);

// Compound indexes for efficient queries
userActivitySchema.index({ userId: 1, timestamp: -1 });
userActivitySchema.index({ userId: 1, activityType: 1, timestamp: -1 });

// TTL index to automatically delete old activities (90 days)
userActivitySchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Static methods
userActivitySchema.statics.logActivity = function(
  userId: string,
  activityType: string,
  description: string,
  metadata?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
) {
  return this.create({
    userId,
    activityType,
    description,
    metadata,
    ipAddress,
    userAgent,
  });
};

userActivitySchema.statics.getUserActivities = function(
  userId: string,
  limit: number = 50,
  skip: number = 0
) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

userActivitySchema.statics.getActivityStats = function(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$activityType',
        count: { $sum: 1 },
        lastActivity: { $max: '$timestamp' }
      }
    }
  ]);
};

export const UserActivity = mongoose.model<IUserActivity>('UserActivity', userActivitySchema);

export default UserActivity;
