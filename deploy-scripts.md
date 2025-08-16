# Deploy Scripts và Commands

## 1. Scripts cho Local Development

### Khởi chạy toàn bộ hệ thống

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Client
cd client
npm install
npm start

# Terminal 3 - Admin CMS
cd admin-cms
npm install
npm start
```

### Build cho production

```bash
# Build client
cd client
npm run build

# Build admin-cms
cd admin-cms
npm run build
```

## 2. Deploy Commands

### Deploy Backend lên Render

```bash
# 1. Push code lên GitHub
git add .
git commit -m "Deploy backend to Render"
git push origin main

# 2. Trên Render Dashboard:
# - Tạo Web Service mới
# - Connect với GitHub repository
# - Set Root Directory: server
# - Build Command: npm install
# - Start Command: npm start
```

### Deploy Frontend lên Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy client
cd client
vercel

# 3. Deploy admin-cms
cd admin-cms
vercel
```

## 3. Environment Setup

### Backend (.env)

```bash
# Copy env.example
cp server/env.example server/.env

# Edit .env với values thực tế
nano server/.env
```

### Frontend (.env)

```bash
# Client
cp client/env.example client/.env.local

# Admin CMS
cp admin-cms/env.example admin-cms/.env.local
```

## 4. Database Setup

### MongoDB Atlas

```bash
# 1. Tạo cluster trên MongoDB Atlas
# 2. Get connection string
# 3. Add vào MONGODB_URI trong Render
```

### Seed Data

```bash
# Chạy seed data (nếu cần)
cd server
node seeds/seedData.js
```

## 5. Health Check Commands

### Local

```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend (check browser console)
# http://localhost:3000
```

### Production

```bash
# Backend health
curl https://your-api-domain.onrender.com/api/health

# Frontend
# https://your-client-domain.vercel.app
```

## 6. Troubleshooting Commands

### Check Logs

```bash
# Render logs (via dashboard)
# Vercel logs
vercel logs

# Local logs
npm run dev
```

### Check Dependencies

```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Check security vulnerabilities
npm audit
npm audit fix
```

## 7. Performance Commands

### Build Analysis

```bash
# Analyze bundle size
npm run build
npx serve -s build

# Or use webpack-bundle-analyzer
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer build/static/js/*.js
```

### Lighthouse Audit

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://your-client-domain.vercel.app
```

## 8. Git Commands

### Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Your commit message"

# Push
git push origin main

# Pull latest
git pull origin main
```

### Branch Management

```bash
# Create feature branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge feature branch
git merge feature/new-feature

# Delete branch
git branch -d feature/new-feature
```

## 9. Monitoring Commands

### Uptime Check

```bash
# Simple uptime check
curl -f https://your-api-domain.onrender.com/api/health || echo "API is down"

# With timeout
curl --max-time 10 https://your-api-domain.onrender.com/api/health
```

### Performance Check

```bash
# Check response time
time curl https://your-api-domain.onrender.com/api/health

# Check with headers
curl -I https://your-api-domain.onrender.com/api/health
```

## 10. Backup Commands

### Database Backup

```bash
# MongoDB dump (if using MongoDB Atlas, use their backup feature)
mongodump --uri="your-mongodb-uri" --out=./backup

# Restore
mongorestore --uri="your-mongodb-uri" ./backup
```

### Code Backup

```bash
# Create backup branch
git checkout -b backup/$(date +%Y%m%d)

# Push backup
git push origin backup/$(date +%Y%m%d)
```

## 11. Security Commands

### Check Dependencies

```bash
# Security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix
npm audit fix --force
```

### Environment Check

```bash
# Check if .env files are in .gitignore
grep -r ".env" .gitignore

# Check for sensitive data in code
grep -r "password\|secret\|key" src/ --exclude-dir=node_modules
```

## 12. Cleanup Commands

### Node Modules

```bash
# Remove node_modules
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install
```

### Build Files

```bash
# Clean build directories
rm -rf client/build
rm -rf admin-cms/build

# Rebuild
npm run build
```

## 13. Development Tools

### Code Quality

```bash
# ESLint check
npx eslint src/

# Prettier format
npx prettier --write src/

# Type check (if using TypeScript)
npx tsc --noEmit
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```
