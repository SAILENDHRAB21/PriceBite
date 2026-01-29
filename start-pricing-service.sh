#!/bin/bash

echo "========================================"
echo "  Starting PriceBite AI Pricing System"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed"
    echo "Please install Python 3.8+ from https://python.org"
    exit 1
fi

echo "[1/3] Installing Python dependencies..."
cd server/services
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install Python packages"
    exit 1
fi

echo ""
echo "[2/3] Starting GROQ AI Pricing Service on port 5001..."
python3 groq_pricing.py &
PRICING_PID=$!

echo ""
echo "[3/3] Waiting 3 seconds for service to start..."
sleep 3

echo ""
echo "========================================"
echo "  ✓ Services Started Successfully!"
echo "========================================"
echo ""
echo "GROQ AI Service: http://localhost:5001"
echo "Node.js Server: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Process ID: $PRICING_PID"
echo "To stop: kill $PRICING_PID"
