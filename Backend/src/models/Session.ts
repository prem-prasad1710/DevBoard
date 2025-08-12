import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISession extends Document {
  _id: string;
  userId: Types.ObjectId;
  token: string;
  refreshToken: string;
  userAgent?: string;
  ipAddress?: string;
  isActive: boolean;
  expiresAt: Date;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userAgent: {
      type: String,
      maxlength: 500,
    },
    ipAddress: {
      type: String,
      maxlength: 45, // IPv6 support
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'sessions',
  }
);

// Index for automatic cleanup of expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for user session management
sessionSchema.index({ userId: 1, isActive: 1 });

// Pre-save middleware to update lastActivity
sessionSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.lastActivity = new Date();
  }
  next();
});

// Instance methods
sessionSchema.methods.isExpired = function(): boolean {
  return new Date() > this.expiresAt;
};

sessionSchema.methods.deactivate = function(): Promise<ISession> {
  this.isActive = false;
  return this.save();
};

// Static methods
sessionSchema.statics.findActiveByUserId = function(userId: string) {
  return this.find({ userId, isActive: true, expiresAt: { $gt: new Date() } });
};

sessionSchema.statics.deactivateUserSessions = function(userId: string) {
  return this.updateMany(
    { userId, isActive: true },
    { isActive: false }
  );
};

sessionSchema.statics.cleanupExpiredSessions = function() {
  return this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isActive: false }
    ]
  });
};

export const Session = mongoose.model<ISession>('Session', sessionSchema);

export default Session;
