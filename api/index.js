// Vercel serverless function - Simple static response
module.exports = (req, res) => {
  res.status(200).json({ 
    message: 'GenZ API - Deploy via static build only',
    timestamp: new Date().toISOString()
  });
};