# Deploy Client lên Vercel

## Cách 1: Deploy từ thư mục client (Khuyến nghị)

### Bước 1: Chuẩn bị

1. Tạo repository riêng cho client hoặc sử dụng thư mục client
2. Đảm bảo có file `package.json` và `src/App.js` trong thư mục client

### Bước 2: Deploy trên Vercel

1. Tạo "New Project" trên Vercel
2. Import repository từ GitHub
3. Cấu hình:
   - **Framework Preset**: Create React App
   - **Root Directory**: (để trống)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Bước 3: Environment Variables

Thêm biến môi trường:

```env
REACT_APP_API_URL=https://your-api-domain.onrender.com/api
REACT_APP_NAME=Zuna Travel
REACT_APP_VERSION=1.0.0
```

## Cách 2: Deploy từ repository chính

### Bước 1: Cấu hình Vercel

1. Tạo "New Project"
2. Import repository chính
3. Cấu hình:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

## Kiểm tra Deployment

### Truy cập website

- URL: `https://your-client-domain.vercel.app`

### Kiểm tra API calls

- Mở Developer Tools > Console
- Kiểm tra không có lỗi CORS
- Test các API calls

## Troubleshooting

### Lỗi thường gặp:

1. **Build Error**: Kiểm tra dependencies trong `package.json`
2. **API Error**: Kiểm tra `REACT_APP_API_URL` đúng
3. **CORS Error**: Đảm bảo backend đã cấu hình CORS

### Logs

- Vào Vercel Dashboard > Project > Functions > Logs
