// MongoDB initialization script
db = db.getSiblingDB('devboard');

// Create collections
db.createCollection('users');
db.createCollection('github_activities');
db.createCollection('developer_journals');
db.createCollection('ai_insights');
db.createCollection('projects');
db.createCollection('resumes');
db.createCollection('code_challenges');
db.createCollection('user_challenges');
db.createCollection('activity_stats');
db.createCollection('notifications');
db.createCollection('achievements');
db.createCollection('user_achievements');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "githubUsername": 1 }, { unique: true, sparse: true });
db.users.createIndex({ "createdAt": 1 });

db.github_activities.createIndex({ "userId": 1 });
db.github_activities.createIndex({ "createdAt": -1 });
db.github_activities.createIndex({ "type": 1 });
db.github_activities.createIndex({ "repository": 1 });

db.developer_journals.createIndex({ "userId": 1 });
db.developer_journals.createIndex({ "date": -1 });
db.developer_journals.createIndex({ "aiGenerated": 1 });

db.ai_insights.createIndex({ "userId": 1 });
db.ai_insights.createIndex({ "type": 1 });
db.ai_insights.createIndex({ "createdAt": -1 });
db.ai_insights.createIndex({ "read": 1 });

db.projects.createIndex({ "userId": 1 });
db.projects.createIndex({ "status": 1 });
db.projects.createIndex({ "technologies": 1 });
db.projects.createIndex({ "createdAt": -1 });

db.resumes.createIndex({ "userId": 1 });
db.resumes.createIndex({ "lastUpdated": -1 });

db.code_challenges.createIndex({ "difficulty": 1 });
db.code_challenges.createIndex({ "tags": 1 });
db.code_challenges.createIndex({ "languages": 1 });
db.code_challenges.createIndex({ "createdAt": -1 });

db.user_challenges.createIndex({ "userId": 1 });
db.user_challenges.createIndex({ "challengeId": 1 });
db.user_challenges.createIndex({ "status": 1 });
db.user_challenges.createIndex({ "completedAt": -1 });

db.activity_stats.createIndex({ "userId": 1 });
db.activity_stats.createIndex({ "date": -1 });

db.notifications.createIndex({ "userId": 1 });
db.notifications.createIndex({ "read": 1 });
db.notifications.createIndex({ "type": 1 });
db.notifications.createIndex({ "createdAt": -1 });

db.achievements.createIndex({ "category": 1 });
db.achievements.createIndex({ "rare": 1 });

db.user_achievements.createIndex({ "userId": 1 });
db.user_achievements.createIndex({ "achievementId": 1 });
db.user_achievements.createIndex({ "unlockedAt": -1 });

// Create a compound index for user achievements
db.user_achievements.createIndex({ "userId": 1, "achievementId": 1 }, { unique: true });

print('DevBoard database initialized with collections and indexes');
