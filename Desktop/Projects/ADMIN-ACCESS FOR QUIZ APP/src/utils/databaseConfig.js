// Database Configuration - Switch between Firebase, MySQL, and PostgreSQL
// Set USE_POSTGRES to true to use PostgreSQL (Neon), false for MySQL or Firebase
// ✅ CONFIGURED FOR POSTGRESQL (NEON) - DO NOT CHANGE
export const USE_POSTGRES = true; // Set to true to use PostgreSQL (Neon)
export const USE_MYSQL = false; // Set to false (using PostgreSQL)

// Direct exports - import the appropriate module
// For PostgreSQL (Neon) - Node.js API - DEFAULT
export { quizOperations, questionOperations, resultOperations } from './postgresHelpers.js';

// To switch to MySQL (PHP API), comment the line above and uncomment below:
// export { quizOperations, questionOperations, resultOperations } from './mysqlHelpers.js';

// To switch to Firebase, comment both above and uncomment below:
// export { quizOperations, questionOperations, resultOperations } from './firebaseHelpers.js';

