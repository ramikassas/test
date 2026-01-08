#!/bin/bash

# OpenDotDB - GitHub Upload Script
# هذا السكريبت لرفع المشروع إلى GitHub

echo "🚀 OpenDotDB - GitHub Upload"
echo "=============================="
echo ""

# Check if GitHub repo URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide GitHub repository URL"
    echo ""
    echo "Usage:"
    echo "  bash upload-to-github.sh <your-github-repo-url>"
    echo ""
    echo "Example:"
    echo "  bash upload-to-github.sh https://github.com/yourusername/opendotdb.git"
    echo ""
    echo "Steps to create a GitHub repository:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: opendotdb"
    echo "3. Description: Free open-source alternative to dotDB.com"
    echo "4. Make it Public"
    echo "5. Don't initialize with README"
    echo "6. Click 'Create repository'"
    echo "7. Copy the repository URL and run this script"
    echo ""
    exit 1
fi

GITHUB_REPO_URL=$1

echo "📦 Repository: $GITHUB_REPO_URL"
echo ""

# Add GitHub as remote
echo "1️⃣ Adding GitHub remote..."
git remote add github "$GITHUB_REPO_URL" 2>/dev/null || {
    echo "   Remote 'github' already exists, updating URL..."
    git remote set-url github "$GITHUB_REPO_URL"
}

# Show remotes
echo ""
echo "2️⃣ Current remotes:"
git remote -v
echo ""

# Push to main branch
echo "3️⃣ Pushing to GitHub main branch..."
git push github claude/dotdb-alternative-project-0ptH6:main --force

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "🌐 Your repository should now be available at:"
echo "   ${GITHUB_REPO_URL%.git}"
echo ""
echo "📝 Next steps:"
echo "1. Visit your GitHub repository"
echo "2. Check that all files are uploaded"
echo "3. Star ⭐ the repository"
echo "4. Share it with the community!"
echo ""
