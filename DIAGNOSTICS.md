# 🔍 Diagnostic Checklist - Debug Your Issues

## Step 1: Verify Backend is Running (CRITICAL)

### Check if backend has the latest code:

```bash
# In your Node terminal, run:
# Stop current server (Ctrl+C)
# Then restart:
npm run server
```

**You should see in the logs:**

```
✅ Connected to MongoDB
🍪 Seeded X default categories
Server running on port 5000
```

---

## Step 2: Check Backend Health

Open in browser or Postman:

```
GET http://localhost:5000/api/health
```

**Expected Response:**

```json
{
  "status": "OK",
  "message": "Daksha Food Artisan API is healthy 🍪",
  "timestamp": "2026-04-01T..."
}
```

---

## Step 3: Verify Cloudinary Images are Working

1. Upload a test product with images
2. Open DevTools → Network tab
3. Look for image requests
4. Images should come from `https://res.cloudinary.com/dwhos58gy/...`
5. **NOT** from `localhost:3857` or `localhost:7070`

---

## Step 4: Test Razorpay Payment Flow

### Check if Razorpay SDK loads:

```javascript
// Open DevTools Console and run:
console.log(
  window.Razorpay ? "✅ Razorpay SDK loaded" : "❌ Razorpay SDK NOT loaded",
);
```

### Check if payment order is created:

1. Go to Cart page
2. Add items to cart
3. Click "Checkout"
4. Open Network tab
5. Look for POST to `/api/payments/razorpay-order`
6. Check Response - should get back a Razorpay order with `id`, `amount`, `currency`

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "order_XXXXXXX",
    "amount": 50000,
    "currency": "INR"
  }
}
```

---

## Step 5: Check Recent Errors

### In Browser Console:

- Look for red errors (not warnings)
- Should NOT see: `ERR_CONNECTION_REFUSED`
- Should NOT see: `localhost:3857`

### In Backend Console:

- Look for 🔴 red error messages
- Should see ✅ for successful requests

---

## Step 6: If Payment Still Fails

Check these possibilities:

### A. Test Mode Mismatch

- Razorpay is in **TEST** mode
- Your payment amount might be too small
- Test mode usually requires amounts > ₹1

### B. Signature Verification Issue

Run this check in backend logs:

```bash
# Look for these messages:
🔍 Verifying payment: Order=xxx, PaymentId=pay_xxx
✅ Signature verified for payment pay_xxx  # ← This MUST appear
🎉 Order fulfilled: DFA-2024-00045
```

### C. Backend Not Updated

- Code changes require server restart
- Old code doesn't have the new payment verification logic
- **ACTION:** Stop and restart your backend

---

## Quick Fixes to Try Now

### 1. Hard Restart Backend

```bash
# Kill the server
Ctrl+C in Node terminal

# Clear any cached modules
npm cache clean --force

# Restart
npm run server
```

### 2. Clear Browser Cache

```bash
# In DevTools (F12):
# Ctrl+Shift+Delete → Clear ALL → Clear data
```

### 3. Test with Minimal Payment

- Try paying just ₹1 (100 paise minimum in test mode)
- Don't use large amounts in TEST mode

---

## Reporting Issues

If problems persist, share:

**From Backend Logs:**

```
What messages do you see when you:
1. Start the server?
2. Load the home page?
3. Attempt to checkout?
```

**From Browser Console:**

```
Any red errors? Copy the first error message:
```

**From Network Tab:**

```
For /api/payments/razorpay-order request:
- Status code? (should be 200)
- Response body? (should have order_id)
```

---

## Testing Razorpay in Test Mode

**Valid Test Cards:**

```
Visa:           4111 1111 1111 1111
Amount:         Any
Expiry:         Any future date (e.g., 12/30)
OTP:            Any 6-digit number (e.g., 123456)
CVV:            Any 3-digit number (e.g., 123)
```

---

**Run this checklist and let me know which step fails. I'll help you fix it! 🚀**
