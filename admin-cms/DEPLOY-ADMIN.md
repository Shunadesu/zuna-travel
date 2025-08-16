# Deploy Admin CMS lên Vercel

## Cách 1: Deploy từ thư mục admin-cms (Khuyến nghị)

### Bước 1: Chuẩn bị

1. Tạo repository riêng cho admin-cms hoặc sử dụng thư mục admin-cms
2. Đảm bảo có file `package.json` và `src/App.js` trong thư mục admin-cms

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
REACT_APP_NAME=Zuna Travel Admin
REACT_APP_VERSION=1.0.0
```

## Cách 2: Deploy từ repository chính

### Bước 1: Cấu hình Vercel

1. Tạo "New Project"
2. Import repository chính
3. Cấu hình:
   - **Framework Preset**: Create React App
   - **Root Directory**: `admin-cms`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

## Kiểm tra Deployment

### Truy cập Admin CMS

- URL: `https://your-admin-domain.vercel.app`

### Đăng nhập Admin

- Email: `admin@zunatravel.com`
- Password: `admin123`

### Kiểm tra chức năng

- Dashboard hiển thị đúng
- CRUD operations hoạt động
- Upload ảnh hoạt động

## Troubleshooting

### Lỗi thường gặp:

1. **Build Error**: Kiểm tra dependencies trong `package.json`
2. **API Error**: Kiểm tra `REACT_APP_API_URL` đúng
3. **Login Error**: Đảm bảo đã chạy seed data

### Logs

- Vào Vercel Dashboard > Project > Functions > Logs
