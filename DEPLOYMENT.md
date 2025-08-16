# Hướng dẫn Deploy Zuna Travel Tour

## Tổng quan

Dự án này được deploy trên:

- **Backend (API)**: Render.com
- **Frontend (Client)**: Vercel.com
- **Admin CMS**: Vercel.com

## 1. Deploy Backend trên Render

### Bước 1: Chuẩn bị

1. Tạo tài khoản trên [Render.com](https://render.com)
2. Tạo MongoDB database (có thể dùng MongoDB Atlas)
3. Tạo Cloudinary account để upload ảnh

### Bước 2: Deploy

1. Fork hoặc push code lên GitHub
2. Trên Render, tạo "Web Service" mới
3. Connect với repository GitHub
4. Cấu hình như sau:
   - **Name**: `zuna-travel-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Bước 3: Cấu hình Environment Variables

Thêm các biến môi trường sau trong Render:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zuna-travel
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CORS_ORIGIN=https://your-client-domain.vercel.app
```

### Bước 4: Deploy

Click "Create Web Service" và đợi deploy hoàn tất.

## 2. Deploy Frontend Client trên Vercel

### Bước 1: Chuẩn bị

1. Tạo tài khoản trên [Vercel.com](https://vercel.com)
2. Cài đặt Vercel CLI: `npm i -g vercel`

### Bước 2: Deploy

1. Push code lên GitHub
2. Trên Vercel, click "New Project"
3. Import repository từ GitHub
4. Cấu hình như sau:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Bước 3: Cấu hình Environment Variables

Thêm biến môi trường:

```env
REACT_APP_API_URL=https://your-api-domain.onrender.com/api
REACT_APP_NAME=Zuna Travel
REACT_APP_VERSION=1.0.0
```

### Bước 4: Deploy

Click "Deploy" và đợi hoàn tất.

## 3. Deploy Admin CMS trên Vercel

### Bước 1: Deploy

1. Tạo project mới trên Vercel
2. Import cùng repository
3. Cấu hình như sau:
   - **Framework Preset**: Create React App
   - **Root Directory**: `admin-cms`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Bước 2: Cấu hình Environment Variables

Thêm biến môi trường:

```env
REACT_APP_API_URL=https://your-api-domain.onrender.com/api
REACT_APP_NAME=Zuna Travel Admin
REACT_APP_VERSION=1.0.0
```

### Bước 3: Deploy

Click "Deploy" và đợi hoàn tất.

## 4. Cấu hình CORS

Sau khi deploy backend, cập nhật CORS_ORIGIN trong Render với domain của client:

```env
CORS_ORIGIN=https://your-client-domain.vercel.app
```

## 5. Kiểm tra Deployment

### Backend Health Check

```bash
curl https://your-api-domain.onrender.com/api/health
```

### Frontend

- Truy cập: `https://your-client-domain.vercel.app`
- Kiểm tra API calls trong browser console

### Admin CMS

- Truy cập: `https://your-admin-domain.vercel.app`
- Đăng nhập với tài khoản admin

## 6. Troubleshooting

### Lỗi thường gặp:

1. **CORS Error**: Kiểm tra CORS_ORIGIN trong backend
2. **API không hoạt động**: Kiểm tra environment variables
3. **Build fail**: Kiểm tra dependencies và build commands
4. **Database connection**: Kiểm tra MONGODB_URI

### Logs:

- Render: Dashboard > Service > Logs
- Vercel: Dashboard > Project > Functions > Logs

## 7. Monitoring

### Render:

- Uptime monitoring
- Log monitoring
- Performance metrics

### Vercel:

- Analytics
- Performance monitoring
- Error tracking

## 8. Custom Domain (Tùy chọn)

### Vercel:

1. Vào Project Settings
2. Domains > Add Domain
3. Cấu hình DNS records

### Render:

1. Vào Service Settings
2. Custom Domains > Add Domain
3. Cấu hình DNS records

## 9. Environment Variables Checklist

### Backend (Render):

- [ ] NODE_ENV=production
- [ ] PORT=10000
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] JWT_EXPIRES_IN
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET
- [ ] CORS_ORIGIN

### Frontend (Vercel):

- [ ] REACT_APP_API_URL
- [ ] REACT_APP_NAME
- [ ] REACT_APP_VERSION

### Admin CMS (Vercel):

- [ ] REACT_APP_API_URL
- [ ] REACT_APP_NAME
- [ ] REACT_APP_VERSION
