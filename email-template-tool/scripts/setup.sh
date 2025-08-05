#!/bin/bash

echo "🚀 Setting up Email Template Tool..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Check if database exists
if psql -lqt | cut -d \| -f 1 | grep -qw email_templates; then
    echo "✅ Database 'email_templates' already exists"
else
    echo "📄 Creating database 'email_templates'..."
    createdb email_templates
fi

# Run schema setup
echo "🗄️  Setting up database schema..."
psql -d email_templates -f database/schema.sql

echo "📦 Installing dependencies..."
npm install

echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "Default login credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "Application will be available at: http://localhost:3000"