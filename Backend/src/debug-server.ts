import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

console.log('Starting DevBoard Backend...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

try {
  console.log('Importing express...');
  import('express').then(() => {
    console.log('Express imported successfully');
    
    console.log('Importing database config...');
    return import('./config/database');
  }).then(() => {
    console.log('Database config imported successfully');
    
    console.log('Importing auth routes...');
    return import('./routes/auth');
  }).then(() => {
    console.log('Auth routes imported successfully');
    
    console.log('Importing user routes...');
    return import('./routes/users');
  }).then(() => {
    console.log('User routes imported successfully');
    
    console.log('All imports successful, starting main server...');
    return import('./index');
  }).catch((error) => {
    console.error('Import error:', error);
    process.exit(1);
  });
} catch (error) {
  console.error('Initial error:', error);
  process.exit(1);
}
