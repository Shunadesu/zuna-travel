# Deploy Server lên Render

## Cách 1: Deploy từ thư mục server (Khuyến nghị)

### Bước 1: Chuẩn bị

1. Tạo repository riêng cho server hoặc sử dụng thư mục server
2. Đảm bảo có file `package.json` và `server.js` trong thư mục server

### Bước 2: Deploy trên Render

1. Tạo "Web Service" mới trên Render
2. Connect với repository GitHub
3. Cấu hình:
   - **Name**: `zuna-travel-api`
   - **Environment**: `Node`
   - **Root Directory**: (để trống)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Bước 3: Environment Variables

Thêm các biến môi trường:

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

## Cách 2: Deploy từ repository chính

### Bước 1: Cấu hình Render

1. Tạo "Web Service" mới
2. Connect với repository chính
3. Cấu hình:
   - **Name**: `zuna-travel-api`
   - **Environment**: `Node`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## Kiểm tra Deployment

### Health Check

```bash
curl https://your-api-domain.onrender.com/api/health
```

### Expected Response

```json
{
  "status": "OK",
  "message": "Zuna Travel API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### Lỗi thường gặp:

1. **MODULE_NOT_FOUND**: Kiểm tra `package.json` có đầy đủ dependencies
2. **MongoDB Connection**: Kiểm tra `MONGODB_URI` đúng format
3. **Port Error**: Đảm bảo `PORT=10000` trong environment variables

### Logs

- Vào Render Dashboard > Service > Logs để xem chi tiết lỗi
