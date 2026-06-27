# Vercel Deployment Guide

## 🚀 Deploying Your 3D Portfolio to Vercel

### Prerequisites
- GitHub account
- Vercel account (free)
- Gmail account for email notifications

### Step 1: Prepare Your Gmail for Email Service

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Save this password (you'll need it for Vercel)

### Step 2: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - 3D Portfolio"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/3d-portfolio.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure Environment Variables**:
   - `EMAIL_USER`: `advaysharma248@gmail.com`
   - `EMAIL_PASS`: Your Gmail App Password (from Step 1)
5. **Deploy!**

### Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Fill out the contact form
3. Check your email (`advaysharma248@gmail.com`) for notifications
4. The sender should receive an auto-reply

### Environment Variables in Vercel Dashboard

In your Vercel project settings, add these environment variables:

```
EMAIL_USER = advaysharma248@gmail.com
EMAIL_PASS = your_gmail_app_password_here
```

### Features After Deployment

✅ **Contact Form**: Sends emails to your Gmail  
✅ **Auto-Reply**: Senders get confirmation emails  
✅ **3D Animations**: All Three.js features work  
✅ **Game Mode**: Interactive character game  
✅ **Responsive Design**: Works on all devices  
✅ **Fast Loading**: Optimized for Vercel  

### Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

### Monitoring

- Check Vercel dashboard for deployment status
- Monitor function logs for email delivery
- Use Vercel Analytics for visitor insights

## 🎉 You're Live!

Your 3D portfolio is now live and ready to receive contact form submissions!
