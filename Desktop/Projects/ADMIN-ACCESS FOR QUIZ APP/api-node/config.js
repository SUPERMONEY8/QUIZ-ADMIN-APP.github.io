// Configuration for Neon PostgreSQL connection
export const config = {
  // Get DATABASE_URL from environment variable (set in Vercel)
  databaseUrl: process.env.DATABASE_URL || '',
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  
  // Port for local development
  port: process.env.PORT || 3000,
};

// Validate DATABASE_URL
if (!config.databaseUrl) {
  console.warn('⚠️  DATABASE_URL not set. Please set it in Vercel Environment Variables.');
}

