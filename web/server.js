const express = require('express');
const path = require('path');
const RateLimit = require('express-rate-limit');
const app = express();
const port = process.env.PORT || 5000;

// Trust proxy for Replit hosting environment
app.set('trust proxy', true);

// Set up rate limiter: maximum of 100 requests per 15 minutes per IP
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Apply rate limiter to all requests
app.use(limiter);

// Enable CORS and JSON parsing
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(express.json());

// Serve static files from the web directory first (highest priority)
app.use(express.static(__dirname));
// Then serve from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Serve contract artifacts specifically
app.use('/contract-artifacts.js', express.static(path.join(__dirname, '..', 'contract-artifacts.js')));


// API Routes
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Tax calculation endpoint
app.post('/api/calculate-nft-tax', async (req, res) => {
  try {
    const { amount, customerAddress } = req.body;
    // Mock tax calculation for now - integrate with Stripe Tax later
    const taxAmount = amount * 0.065; // 6.5% Florida sales tax
    res.json({
      success: true,
      taxAmount: taxAmount,
      totalAmount: amount + taxAmount,
      calculationId: 'calc_' + Date.now()
    });
  } catch (error) {
    console.error('Tax calculation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tax transaction recording endpoint
app.post('/api/create-tax-transaction', async (req, res) => {
  try {
    const { calculationId, transactionId, saleType } = req.body;
    console.log('Tax transaction recorded:', { calculationId, transactionId, saleType });
    res.json({ success: true, message: 'Tax transaction recorded' });
  } catch (error) {
    console.error('Tax transaction recording error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Catch-all for serving the main HTML file for client-side routing
// This should be the last route defined
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});