# API Deployment on Render - Step by Step

## Prerequisites
- GitHub repository with project pushed
- Render account (sign up at render.com)
- SendGrid account with API key
- Production-ready environment variables

---

## Step 1: Create PostgreSQL Database on Render

1. Go to [render.com](https://render.com) dashboard
2. Click **New +** → **PostgreSQL**
3. Fill in:
   - **Name**: `task-manager-db`
   - **Database**: `task_manager`
   - **User**: `task_manager_user`
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: Latest
4. Click **Create Database**
5. **Copy the connection string** - you'll need it in the next step

---

## Step 2: Create Web Service on Render

1. Dashboard → **New +** → **Web Service**
2. Select **Connect a Repository**
3. Choose your GitHub repository
4. Fill in:
   - **Name**: `task-manager-api`
   - **Environment**: `Node`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Build Command**: 
     ```
     npm install && npm run prisma:generate -w apps/api && npm run build -w apps/api
     ```
   - **Start Command**: 
     ```
     npm start
     ```
5. Click **Create Web Service**

---

## Step 3: Add Environment Variables

In the Web Service dashboard:
1. Go to **Environment** tab
2. Add the following variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste from PostgreSQL connection string |
| `DIRECT_URL` | Same as DATABASE_URL |
| `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NODE_ENV` | `production` |
| `SENDGRID_API_KEY` | Your SendGrid API key |
| `EMAIL_FROM` | `Task Manager <your-verified-email@gmail.com>` |
| `CORS_ORIGIN` | `https://your-vercel-domain.vercel.app` |
| `PORT` | `10000` |
| `OTP_TTL_MINUTES` | `10` |
| `JWT_EXPIRES_IN` | `7d` |

---

## Step 4: Deploy

1. Click **Deploy** button
2. Wait for build to complete (2-5 minutes)
3. Check logs for errors
4. Once deployed, copy your API URL: `https://task-manager-api-xxxx.onrender.com`

---

## Step 5: Run Database Migrations

1. In Render dashboard, go to your Web Service
2. Click **Shell** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```
4. Or manually run:
   ```bash
   npm run prisma:migrate -w apps/api
   ```

---

## Step 6: Verify Deployment

Test your API with a simple curl:
```bash
curl https://your-api-url.onrender.com/auth/me
```

Or test OTP endpoint:
```bash
curl -X POST https://your-api-url.onrender.com/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all environment variables are set
- Verify Prisma schema is correct

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check if Render PostgreSQL is running
- Ensure IP whitelist allows Render (should be automatic)

### OTP Email Not Sending
- Verify `SENDGRID_API_KEY` is valid
- Check SendGrid Activity Feed for errors
- Ensure `EMAIL_FROM` is verified in SendGrid

### Port Issues
- Render automatically assigns port; make sure `PORT` env var is set
- Use `process.env.PORT` in your code (already done)

---

## Production Checklist

- [ ] Database migrated successfully
- [ ] All environment variables set
- [ ] API endpoints responding
- [ ] OTP email sending works
- [ ] JWT tokens generating correctly
- [ ] CORS configured for frontend domain
- [ ] SendGrid quota not exceeded

---

## Next Steps

1. Update mobile app `EXPO_PUBLIC_API_URL` to your deployed API URL
2. Deploy mobile app to Vercel
3. Build APK/IPA for Android/iOS
4. Submit to Play Store/App Store
