#!/bin/bash

echo "🚀 LinkedIn Profile Optimizer - Quick Start"
echo "==========================================="
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Setup environment
if [ ! -f .env.local ]; then
    echo "Creating .env.local..."
    cp .env.local.example .env.local
fi

echo ""
echo "⚙️  Next steps:"
echo "1. Add your ANTHROPIC_API_KEY to .env.local"
echo "   Get a free key at: https://console.anthropic.com"
echo ""
echo "2. Run the dev server:"
echo "   npm run dev"
echo ""
echo "3. Open: http://localhost:3000"
echo ""
echo "4. Test it out!"
echo ""
echo "📖 For Stripe payments setup, see: STRIPE_SETUP.md"
echo ""
