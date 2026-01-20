# Pre-Publish Checklist

Use this checklist before pushing your project to GitHub.

## 🔍 Find & Replace Checklist

### 1. Personal Information
- [ ] Replace `yourusername` with your GitHub username (in all files)
- [ ] Replace `Your Name` with your actual name (in LICENSE, README, package.json)
- [ ] Replace `your.email@example.com` with your email (in package.json, SECURITY.md, README)
- [ ] Update LinkedIn URL in README (optional)

### 2. Repository URLs
- [ ] Update repository URL in `backend/package.json`
- [ ] Update repository URL in `frontend/package.json`
- [ ] Update repository URL in `.github/FUNDING.yml` (if using)

### 3. Files to Update
- [ ] `LICENSE` - Add your name
- [ ] `README.md` - Update author section and links
- [ ] `backend/package.json` - Author and repository
- [ ] `frontend/package.json` - Author and repository
- [ ] `SECURITY.md` - Contact email
- [ ] `.github/FUNDING.yml` - GitHub username (optional)

## 🔒 Security Checklist

- [ ] All `.env` files are in `.gitignore`
- [ ] No API keys or secrets in code
- [ ] No hardcoded passwords
- [ ] `.env.example` files don't contain real values
- [ ] Review all files for sensitive data

## 📝 Documentation Checklist

- [ ] README.md is complete and accurate
- [ ] All links in README work
- [ ] QUICKSTART.md has correct instructions
- [ ] CONTRIBUTING.md is appropriate
- [ ] LICENSE has your name

## 🧪 Testing Checklist

- [ ] Backend builds successfully (`npm run build` in backend/)
- [ ] Frontend builds successfully (`npm run build` in frontend/)
- [ ] All tests pass (if you've added tests)
- [ ] Linting passes (`npm run lint` in both directories)
- [ ] TypeScript compiles without errors

## 📦 Git Checklist

- [ ] Initialize git repository (`git init`)
- [ ] Add all files (`git add .`)
- [ ] Create initial commit (`git commit -m "Initial commit"`)
- [ ] Create GitHub repository
- [ ] Add remote (`git remote add origin <your-repo-url>`)
- [ ] Push to GitHub (`git push -u origin main`)

## 🎨 GitHub Repository Setup

- [ ] Repository is created on GitHub
- [ ] Description is added
- [ ] Topics/tags are added
- [ ] Issues are enabled
- [ ] Actions are enabled
- [ ] Branch protection rules (optional)

## ✅ Final Verification

- [ ] Visit your GitHub repository
- [ ] README displays correctly
- [ ] All files are present
- [ ] No sensitive files are visible
- [ ] License is displayed
- [ ] CI/CD pipeline runs (check Actions tab)

## 🚀 Optional Enhancements

- [ ] Add screenshots to README
- [ ] Create a demo video
- [ ] Add badges to README
- [ ] Create first release (v1.0.0)
- [ ] Add project description on GitHub
- [ ] Set up branch protection
- [ ] Enable Dependabot alerts

## 📋 Quick Command Reference

```bash
# Find all instances of placeholder
grep -r "yourusername" .
grep -r "Your Name" .
grep -r "your.email@example.com" .

# Initialize and push (after replacements)
git init
git add .
git commit -m "Initial commit: AI Coding Mentor Platform"
git remote add origin https://github.com/YOUR_USERNAME/ai-coding-mentor.git
git branch -M main
git push -u origin main
```

## 🎯 Priority Order

1. **CRITICAL**: Replace all personal information placeholders
2. **CRITICAL**: Verify no secrets in code
3. **IMPORTANT**: Update repository URLs
4. **IMPORTANT**: Test builds
5. **NICE TO HAVE**: Add screenshots, badges, etc.

---

Once all items are checked, your project is ready to publish! 🎉

See [GITHUB_SETUP.md](./GITHUB_SETUP.md) for detailed step-by-step instructions.

