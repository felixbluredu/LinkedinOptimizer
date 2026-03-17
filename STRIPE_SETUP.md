# Stripe Integration Guide

Add payments to turn free users into paying customers. This adds a **$12/month subscription option**.

## Setup (10 minutes)

### 1. Create Stripe Account
1. Go to https://stripe.com
2. Sign up for free
3. Go to **Dashboard > Developers > API Keys**
4. Copy your **Publishable Key** and **Secret Key**

### 2. Add to Environment

In `/Desktop/linkedin-optimizer/.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRODUCT_ID=prod_...  (create product in Stripe dashboard)
```

### 3. Install Stripe

```bash
cd /Desktop/linkedin-optimizer
npm install stripe @stripe/react-js next-stripe-checkout
```

### 4. Create Product in Stripe Dashboard

1. Go to https://dashboard.stripe.com/products
2. Click **+ Add Product**
3. Name: "LinkedIn Profile Optimizer"
4. Price: $12.00 USD
5. Billing period: Monthly
6. Click **Save**
7. Copy the **Product ID** to your .env.local

### 5. Add Stripe Payment Endpoint

Create `/app/api/create-checkout/route.ts`:

```typescript
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'LinkedIn Profile Optimizer - Monthly',
            },
            unit_amount: 1200, // $12.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

### 6. Add Payment Button to UI

In `app/page.tsx`, replace the "Get Early Access" button:

```jsx
const handleStartPayment = async () => {
  const email = prompt('Enter your email:');
  if (!email) return;

  const response = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const { sessionId } = await response.json();
  window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
};

// In the CTA section:
<button
  onClick={handleStartPayment}
  className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition"
>
  Start 7-Day Free Trial
</button>
```

### 7. Verify Installation

```bash
npm run dev
# Navigate to http://localhost:3000
# Click the payment button to test
```

## That's It! 🎉

Now you have:
- ✅ Free analysis (limited)
- ✅ Paid subscription ($12/month)
- ✅ Stripe handling payments securely
- ✅ No sensitive data on your server

## Advanced: Add Database

Once you have paying customers, store them:

```bash
npm install @prisma/client
npx prisma init
```

Then you can:
- Track who paid
- Limit free tier usage
- Send email updates
- Create admin dashboard

But for MVP? **Not needed yet.** Get paying customers first, then optimize.

## Testing Payments (Sandbox Mode)

Use these test card numbers:
- **4242 4242 4242 4242** - Succeeds
- **4000 0000 0000 0002** - Declined
- Any future expiration date
- Any 3-digit CVC

## Go Live Checklist

- [ ] Create live Stripe account (switch from test mode)
- [ ] Add live API keys to production environment
- [ ] Test real payment flow
- [ ] Set up email receipts in Stripe
- [ ] Create Terms of Service page
- [ ] Create Privacy Policy page
- [ ] Deploy to Vercel

**Total time to profitable:** 1 week with good marketing.
