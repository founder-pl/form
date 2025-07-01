import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Example tax calculation endpoint
app.post('/api/calculate', (req, res) => {
    const { country, income, year } = req.body;
    
    // TODO: Replace with actual tax calculation logic
    const tax = {
        country,
        year: year || new Date().getFullYear(),
        income,
        taxAmount: income * 0.25, // Example calculation
        effectiveRate: 25 // Example rate
    };
    
    res.json(tax);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
