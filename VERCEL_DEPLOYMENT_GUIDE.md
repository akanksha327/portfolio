# 🚀 Vercel Deployment Guide for 3D Portfolio

## ✅ Prerequisites Completed
- ✅ Git repository initialized
- ✅ All files committed
- ✅ Contact form working locally
- ✅ Email service configured

## 📋 Step-by-Step Deployment

### 1. Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click "New repository"
3. Name it: `3d-portfolio` (or any name you prefer)
4. Make it **Public** (required for free Vercel)
5. **Don't** initialize with README (we already have files)
6. Click "Create repository"

### 2. Push to GitHub
Run these commands in your terminal:

```bash
# Add GitHub as remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/3d-portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project
5. Click "Deploy"

### 4. Configure Environment Variables
**IMPORTANT:** After deployment, you MUST add environment variables:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add these variables:

```
EMAIL_USER = advaysharma2489@gmail.com
EMAIL_PASS = nhep lifv wint heyw
```

4. Click "Save"
5. Go to "Deployments" tab
6. Click "Redeploy" on the latest deployment

## 🎯 Your Live Portfolio Features

### ✅ What Will Work on Vercel:
- **3D Animations** - All Three.js features
- **Interactive Character** - Click 5 times for game mode
- **Contact Form** - Sends emails to you
- **Auto-Reply** - Senders get confirmation emails
- **Responsive Design** - Works on all devices
- **Fast Loading** - Optimized for production

### 📧 Email System:
- **You receive:** Contact form submissions at advaysharma2489@gmail.com
- **Senders receive:** Auto-reply confirmation emails
- **Professional templates** with your branding

## 🔧 Troubleshooting

### If Contact Form Doesn't Work:
1. Check environment variables are set correctly
2. Verify Gmail App Password is correct
3. Check Vercel function logs for errors

### If 3D Animations Don't Load:
1. Check browser console for errors
2. Ensure all dependencies are installed
3. Verify Three.js components are client-side rendered

## 🌐 After Deployment

Your portfolio will be live at:
`https://your-project-name.vercel.app`

### Test Everything:
1. ✅ 3D character interactions
2. ✅ Game mode (click character 5 times)
3. ✅ Contact form submission
4. ✅ Email notifications
5. ✅ Responsive design

## 🎉 You're Live!

Your 3D portfolio is now live and ready to receive contact form submissions!

### Next Steps:
- Share your portfolio URL
- Test the contact form
- Check your email for submissions
- Customize domain (optional)

---

**Need Help?** Check the Vercel dashboard for deployment logs and function logs.

