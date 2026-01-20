# GitHub Setup Guide

Follow these steps to publish your project to GitHub with your name.

## Step 1: Replace Placeholder Information

Before pushing to GitHub, replace all placeholder values with your actual information:

### 1. Update LICENSE
- Replace `[Your Name]` with your actual name
- Update the year if needed

### 2. Update package.json files
- **backend/package.json**: Replace `Your Name <your.email@example.com>` with your info
- **frontend/package.json**: Replace `Your Name <your.email@example.com>` with your info
- Replace `yourusername` in repository URLs with your GitHub username

### 3. Update README.md
- Replace `[Your Name](https://github.com/yourusername)` with your name and GitHub profile
- Replace `@yourusername` with your GitHub username
- Replace `your.email@example.com` with your email
- Replace `[Your LinkedIn](https://linkedin.com/in/yourprofile)` with your LinkedIn (optional)

### 4. Update SECURITY.md
- Replace `your.email@example.com` with your email

### 5. Update .github/FUNDING.yml (Optional)
- Replace `yourusername` with your GitHub username if you want to enable funding

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Repository name: `ai-coding-mentor` (or your preferred name)
4. Description: "AI-Accelerated Coding Mentor Platform - Improve your code skills with AI-powered feedback"
5. Choose Public or Private
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 3: Initialize Git and Push

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: AI Coding Mentor Platform"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/ai-coding-mentor.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Configure GitHub Repository Settings

1. Go to your repository on GitHub
2. Click "Settings" → "General"
3. Scroll to "Features" and enable:
   - ✅ Issues
   - ✅ Projects
   - ✅ Wiki (optional)
   - ✅ Discussions (optional)

4. Go to "Settings" → "Actions" → "General"
   - Enable "Allow all actions and reusable workflows"

5. Go to "Settings" → "Secrets and variables" → "Actions"
   - Add secrets if needed for CI/CD (optional for now)

## Step 5: Add Repository Topics

1. Go to your repository
2. Click the gear icon next to "About"
3. Add topics: `ai`, `code-analysis`, `nestjs`, `nextjs`, `openai`, `code-review`, `typescript`, `react`

## Step 6: Create a Release (Optional)

1. Go to "Releases" → "Create a new release"
2. Tag: `v1.0.0`
3. Title: `v1.0.0 - Initial Release`
4. Description: Copy from CHANGELOG.md
5. Click "Publish release"

## Step 7: Add Badges to README (Optional)

You can add more badges to your README. Here are some examples:

```markdown
![GitHub stars](https://img.shields.io/github/stars/yourusername/ai-coding-mentor?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/ai-coding-mentor?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/ai-coding-mentor)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/ai-coding-mentor)
```

## Step 8: Verify Everything Works

1. ✅ Check that all files are pushed
2. ✅ Verify README displays correctly
3. ✅ Test that CI/CD pipeline runs (check Actions tab)
4. ✅ Verify license is displayed
5. ✅ Check that all links work

## Step 9: Share Your Project

- Add to your portfolio
- Share on social media
- Write a blog post about it
- Submit to relevant communities

## Quick Find & Replace Commands

If you want to quickly replace all placeholders:

```bash
# Replace yourusername (use your actual GitHub username)
find . -type f -name "*.md" -o -name "*.json" -o -name "*.yml" | xargs sed -i 's/yourusername/YOUR_GITHUB_USERNAME/g'

# Replace email (use your actual email)
find . -type f -name "*.md" -o -name "*.json" -o -name "*.yml" | xargs sed -i 's/your.email@example.com/YOUR_EMAIL/g'

# Replace "Your Name" (use your actual name)
find . -type f -name "*.md" -o -name "*.json" -o -name "*.yml" | xargs sed -i 's/Your Name/YOUR_ACTUAL_NAME/g'
```

**Note**: Be careful with these commands - review the changes before committing!

## Checklist Before Publishing

- [ ] Replaced all placeholder names and emails
- [ ] Updated repository URLs in package.json files
- [ ] Updated README with your information
- [ ] Updated LICENSE with your name
- [ ] Verified .env files are in .gitignore
- [ ] Removed any sensitive data
- [ ] Tested that the project builds locally
- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Verified repository settings
- [ ] Added repository topics
- [ ] CI/CD pipeline is working

## Next Steps After Publishing

1. **Add a project description** on GitHub
2. **Create a nice README preview** with screenshots
3. **Set up branch protection** (Settings → Branches)
4. **Enable Dependabot alerts** (Settings → Security)
5. **Add a project board** for issue tracking
6. **Create a demo video** and add to README

Congratulations! Your project is now on GitHub! 🎉

