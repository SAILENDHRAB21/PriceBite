import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// Python GROQ service URL
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';

// Calculate dynamic pricing using GROQ AI
router.post('/calculate', async (req: Request, res: Response) => {
  try {
    const { dishes, latitude, longitude } = req.body;

    if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Dishes array is required and cannot be empty'
      });
    }

    // Call Python GROQ service
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/api/pricing/calculate`,
      {
        dishes,
        latitude: latitude || 28.6139,
        longitude: longitude || 77.2090
      },
      {
        timeout: 10000 // 10 second timeout
      }
    );

    res.json(response.data);

  } catch (error: any) {
    console.error('Pricing calculation error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'Pricing service is not available. Please start the Python service on port 5001.',
        error: 'Service connection refused'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error calculating dynamic pricing',
      error: error.message
    });
  }
});

// Health check for Python GROQ service
router.get('/health', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${PYTHON_SERVICE_URL}/api/pricing/health`, {
      timeout: 3000
    });
    res.json(response.data);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Python GROQ pricing service is not available',
      service_url: PYTHON_SERVICE_URL
    });
  }
});

export default router;
