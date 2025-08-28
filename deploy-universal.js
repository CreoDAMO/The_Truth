
// Universal Deployment Configuration
// Works with Replit, Vercel, Railway, Render, AWS, Digital Ocean, etc.

const deploymentConfigs = {
  replit: {
    buildCommand: "npm run compile",
    startCommand: "node server.js",
    port: process.env.PORT || 5000,
    host: "0.0.0.0",
    environment: "REPLIT_DEPLOYMENT"
  },
  
  vercel: {
    buildCommand: "npm run compile && npm run generate-metadata",
    startCommand: "node server.js",
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
    environment: "VERCEL"
  },
  
  railway: {
    buildCommand: "npm install && npm run compile",
    startCommand: "node server.js", 
    port: process.env.PORT || 8080,
    host: "0.0.0.0",
    environment: "RAILWAY_ENVIRONMENT"
  },
  
  render: {
    buildCommand: "npm install && npm run compile",
    startCommand: "node server.js",
    port: process.env.PORT || 10000,
    host: "0.0.0.0", 
    environment: "RENDER"
  },
  
  heroku: {
    buildCommand: "npm install && npm run compile",
    startCommand: "node server.js",
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
    environment: "HEROKU"
  },
  
  aws: {
    buildCommand: "npm install && npm run compile",
    startCommand: "node server.js",
    port: process.env.PORT || 80,
    host: "0.0.0.0",
    environment: "AWS_EXECUTION_ENV"
  },
  
  digitalocean: {
    buildCommand: "npm install && npm run compile", 
    startCommand: "node server.js",
    port: process.env.PORT || 8080,
    host: "0.0.0.0",
    environment: "DIGITAL_OCEAN"
  }
};

// Auto-detect deployment environment
function detectEnvironment() {
  if (process.env.REPLIT_DEPLOYMENT) return 'replit';
  if (process.env.VERCEL) return 'vercel';
  if (process.env.RAILWAY_ENVIRONMENT) return 'railway';
  if (process.env.RENDER) return 'render';
  if (process.env.DYNO) return 'heroku';
  if (process.env.AWS_EXECUTION_ENV) return 'aws';
  if (process.env.DIGITAL_OCEAN) return 'digitalocean';
  return 'local';
}

// Get current deployment config
function getDeploymentConfig() {
  const env = detectEnvironment();
  const config = deploymentConfigs[env] || deploymentConfigs.replit;
  
  return {
    ...config,
    environment: env,
    baseUrl: process.env.BASE_URL || `http://localhost:${config.port}`,
    isDevelopment: env === 'local',
    isProduction: env !== 'local'
  };
}

module.exports = {
  deploymentConfigs,
  detectEnvironment,
  getDeploymentConfig
};
