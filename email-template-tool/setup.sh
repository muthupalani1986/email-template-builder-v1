#!/bin/bash

echo "🚀 Email Template Tool Setup"
echo "============================"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18+) first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup database
echo "🗄️  Setting up database..."
echo "Please ensure PostgreSQL is running and you have created a database named 'email_templates'"
echo "Run this command to create the database:"
echo "createdb email_templates"
echo ""
echo "Then run the schema:"
echo "psql -d email_templates -f database/schema.sql"
echo ""

# Setup environment
if [ ! -f .env.local ]; then
    echo "⚙️  Creating environment file..."
    cat > .env.local << EOL
DATABASE_URL=postgresql://username:password@localhost:5432/email_templates
JWT_SECRET=super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=3001
EOL
    echo "📝 Please update .env.local with your database credentials"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the backend server: npm run dev:server"
echo "2. In another terminal, start the frontend: npm run dev"
echo "3. Visit http://localhost:3000"
echo ""
echo "Default login credentials:"
echo "Username: admin"
echo "Password: password123"