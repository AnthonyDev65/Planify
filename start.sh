#!/bin/sh

echo "🚀 Starting Planify..."
echo "📁 Working directory: $(pwd)"
echo "📂 Contents:"
ls -la

echo ""
echo "📦 Checking dist folder:"
ls -la dist/ || echo "❌ dist folder not found!"

echo ""
echo "📦 Checking server folder:"
ls -la server/ || echo "❌ server folder not found!"

echo ""
echo "🗄️ Checking data folder:"
ls -la data/ || echo "❌ data folder not found!"

echo ""
echo "🌍 Environment:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

echo ""
echo "🚀 Starting Node.js server..."
exec node server/index.js
