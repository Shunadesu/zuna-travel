# Deploy Commands - Quick Reference

## 🚀 Deploy Server (Render)

### Cách 1: Deploy từ thư mục server

```bash
# 1. Push code lên GitHub
git add .
git commit -m "Deploy server to Render"
git push origin main

# 2. Trên Render Dashboard:
# - Tạo Web Service mới
# - Connect với GitHub repository
# - Root Directory: (để trống)
# - Build Command: npm install
# - Start Command: npm start
```

### Cách 2: Deploy từ repository chính

```bash
# Trên Render Dashboard:
# - Root Directory: server
# - Build Command: npm install
# - Start Command: npm start
```

## 🌐 Deploy Client (Vercel)

### Cách 1: Deploy từ thư mục client

```bash
# 1. Push code lên GitHub
git add .
git commit -m "Deploy client to Vercel"
git push origin main

# 2. Trên Vercel Dashboard:
# - Tạo New Project
# - Import repository
# - Root Directory: (để trống)
# - Framework: Create React App
# - Build Command: npm run build
```

### Cách 2: Deploy từ repository chính

```bash
# Trên Vercel Dashboard:
# - Root Directory: client
# - Framework: Create React App
# - Build Command: npm run build
```

## 🔧 Deploy Admin CMS (Vercel)

### Cách 1: Deploy từ thư mục admin-cms

```bash
# 1. Push code lên GitHub
git add .
git commit -m "Deploy admin CMS to Vercel"
git push origin main

# 2. Trên Vercel Dashboard:
# - Tạo New Project
# - Import repository
# - Root Directory: (để trống)
# - Framework: Create React App
# - Build Command: npm run build
```

### Cách 2: Deploy từ repository chính

```bash
# Trên Vercel Dashboard:
# - Root Directory: admin-cms
# - Framework: Create React App
# - Build Command: npm run build
```

## ⚙️ Environment Variables

### Server (Render)

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://namp280918:zunatravel@cluster0.od0rj5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CORS_ORIGIN=https://your-client-domain.vercel.app
```

### Client (Vercel)

```env
REACT_APP_API_URL=https://zuna-travel.onrender.com/api
REACT_APP_NAME=Zuna Travel
REACT_APP_VERSION=1.0.0
```

### Admin CMS (Vercel)

```env
REACT_APP_API_URL=https://zuna-travel.onrender.com/api
REACT_APP_NAME=Zuna Travel Admin
REACT_APP_VERSION=1.0.0
```

## 🔍 Kiểm tra Deployment

### Server Health Check

```bash
curl https://your-api-domain.onrender.com/api/health
```

### Client & Admin

- Truy cập URL được cung cấp
- Kiểm tra console không có lỗi
- Test các chức năng chính

## 📋 Checklist

### Server

- [ ] Deploy thành công trên Render
- [ ] Health check trả về OK
- [ ] Environment variables đã cấu hình
- [ ] MongoDB connection hoạt động

### Client

- [ ] Deploy thành công trên Vercel
- [ ] Website load được
- [ ] API calls hoạt động
- [ ] Không có lỗi CORS

### Admin CMS

- [ ] Deploy thành công trên Vercel
- [ ] Đăng nhập được với admin account
- [ ] Dashboard hiển thị đúng
- [ ] CRUD operations hoạt động
