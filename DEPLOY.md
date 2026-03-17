# Deploy to Production - Step by Step

Get your SaaS live in 30 minutes.

## Prerequisites
- GitHub account (free: github.com)
- Vercel account (free: vercel.com)
- Groq API key (FREE, no credit card: https://console.groq.com)
- Custom domain (optional, but recommended: $15/year)

## Step 1: Push to GitHub (5 min)

```bash
cd /Desktop/abcx

# Initialize git
git init
git add .
git commit -m "Initial commit: LinkedIn Profile Optimizer MVP"

# Create repo on https://github.com/new
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/linkedin-optimizer.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel (5 min)

Visit: https://vercel.com/new

1. Click "Import Git Repository"
2. Paste your GitHub URL
3. Select the `linkedin-optimizer` repo
4. Click "Import"
5. Under "Environment Variables", add:
   - Key: `GROQ_API_KEY`
   - Value: `gsk_...` (your FREE key from https://console.groq.com - no credit card needed!)
6. Click "Deploy"

Wait 2-3 minutes...

**You're live!** 🎉

Your URL will be: `https://your-username-linkedin-optimizer.vercel.app`

## Step 3: Buy Custom Domain (Optional but Recommended)

Vercel makes this easy:

1. In Vercel dashboard, click your project
2. Go to "Settings" → "Domains"
3. Click "Add Domain"
4. Type: `linkedinoptimizer.com` or similar
5. Buy through Vercel ($15/year)
6. Wait 24-48 hours for DNS propagation

Now your URL is: `https://linkedinoptimizer.com` ✨

## Step 4: Add Stripe for Payments (10 min)

See `STRIPE_SETUP.md` for full details, but quick version:

```bash
# In your local project
npm install stripe @stripe/react-js

# Create .env.production on Vercel dashboard:
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

Add the payment endpoint and button (see STRIPE_SETUP.md).

Push to GitHub:
```bash
git add .
git commit -m "Add Stripe payments"
git push
```

Vercel auto-redeploys. Done!

## Step 5: Monitor & Improve

### Watch these
- Vercel Analytics (free): See who's visiting
- Stripe Dashboard: View payments
- Google Search Console: Track organic traffic

### Add these soon
- Email collection (Mailchimp: free)
- Analytics (Plausible: $9/month or free self-hosted)
- Feedback form (Typeform: free)

## Troubleshooting

### "API Key Error"
- Make sure `GROQ_API_KEY` is in Vercel environment variables
- Not in .env.local (that's local only)
- Restart deployment after adding
- Get free key at: https://console.groq.com

### "Stripe not working"
- Use test keys first (they start with `pk_test_`)
- Check you created the POST endpoint
- Use test card: `4242 4242 4242 4242`

### "Domain not working"
- DNS takes 24-48 hours
- Check Vercel dashboard for status
- Try clearing browser cache

## What You Should Have Now

```
Live URL:              https://your-domain.com
GitHub repo:           github.com/you/linkedin-optimizer
Stripe account:        dashboard.stripe.com
Vercel dashboard:      vercel.com/dashboard
Analytics:             (optional)
Custom domain:         (optional)
```

## Next: Tell People It Exists

See `MARKETING.md` for how to get your first customers.

---

**You're officially in business!** 🚀

Next milestone: Your first paying customer.
