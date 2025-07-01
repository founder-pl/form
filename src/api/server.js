import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { calculateTaxForCountry } from '../services/taxCalculator.js';
import { getCountryData, getBusinessTypes, getTaxTreaty } from '../services/dataService.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Input validation middleware
const validateCalculateInput = (req, res, next) => {
    const { country, income, year = new Date().getFullYear(), businessType = 'services', isCitizen = false } = req.body;
    
    if (!country) {
        return res.status(400).json({ error: 'Country code is required' });
    }
    
    if (typeof income !== 'number' || income < 0) {
        return res.status(400).json({ error: 'Income must be a positive number' });
    }
    
    if (typeof year !== 'number' || year < 2000 || year > 2100) {
        return res.status(400).json({ error: 'Year must be between 2000 and 2100' });
    }
    
    req.calculationData = { country, income, year, businessType, isCitizen };
    next();
};

/**
 * Calculate tax for a given income and country
 */
app.post('/api/calculate', validateCalculateInput, async (req, res) => {
    try {
        const { country, income, year, businessType, isCitizen } = req.calculationData;
        
        // Get tax calculation using the existing service
        const taxResult = await calculateTaxForCountry(country, { 
            businessType,
            revenue: income,
            isCitizen,
            year
        });
        
        res.json({
            country,
            year,
            income,
            businessType,
            isCitizen,
            taxAmount: taxResult.tax,
            effectiveRate: parseFloat(taxResult.effectiveRate),
            currency: taxResult.currency || 'EUR',
            breakdown: {
                incomeTax: taxResult.tax,
                socialSecurity: taxResult.socialSecurity,
                benefits: taxResult.benefits,
                vat: taxResult.vat
            }
        });
    } catch (error) {
        console.error('Error calculating tax:', error);
        res.status(500).json({ 
            error: 'Failed to calculate tax',
            message: error.message 
        });
    }
});

/**
 * Get list of supported countries
 */
app.get('/api/countries', (req, res) => {
    try {
        // This would come from your data service
        const countries = [
            { code: 'PL', name: 'Poland', currency: 'PLN' },
            { code: 'DE', name: 'Germany', currency: 'EUR' },
            { code: 'US', name: 'United States', currency: 'USD' },
            { code: 'GB', name: 'United Kingdom', currency: 'GBP' }
        ];
        
        res.json(countries);
    } catch (error) {
        console.error('Error getting countries:', error);
        res.status(500).json({ error: 'Failed to get countries' });
    }
});

/**
 * Get tax treaty information between two countries
 */
app.get('/api/tax-treaty/:country1/:country2', (req, res) => {
    try {
        const { country1, country2 } = req.params;
        const treaty = getTaxTreaty(country1, country2);
        
        if (!treaty) {
            return res.status(404).json({ 
                error: 'No tax treaty found',
                message: `No tax treaty found between ${country1} and ${country2}`
            });
        }
        
        res.json(treaty);
    } catch (error) {
        console.error('Error getting tax treaty:', error);
        res.status(500).json({ error: 'Failed to get tax treaty' });
    }
});

/**
 * Get available business types
 */
app.get('/api/business-types', (req, res) => {
    try {
        const businessTypes = getBusinessTypes();
        res.json(businessTypes);
    } catch (error) {
        console.error('Error getting business types:', error);
        res.status(500).json({ error: 'Failed to get business types' });
    }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

export { app as default, server };
