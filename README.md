# VnBestTravel Tour - MERN Stack Project

Hệ thống quản lý tour du lịch được xây dựng bằng MERN Stack với Admin CMS.

## Tính năng

### Admin CMS

- Quản lý Categories (Vietnam tours, Transfer services)
- Quản lý Products thuộc các categories
- Quản lý Blog posts
- Upload hình ảnh với Cloudinary
- Đa ngôn ngữ (Tiếng Việt & English)

### Backend

- Express.js server
- MongoDB database
- JWT authentication
- Cloudinary integration
- RESTful API

### Frontend

- React.js với hooks
- TailwindCSS styling
- React Router DOM
- i18n internationalization
- Responsive design

## Cài đặt

1. Clone repository
2. Cài đặt dependencies:

```bash
npm run install-all
```

3. Tạo file `.env` trong folder `server`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Chạy toàn bộ ứng dụng:

```bash
npm run dev
```

## Cấu trúc thư mục

```
zuna-travel-tour/
├── server/          # Backend API
├── client/          # Frontend client
├── admin-cms/       # Admin dashboard
└── package.json     # Root dependencies
```

## Công nghệ sử dụng

- **Frontend**: React.js, TailwindCSS, React Router DOM, i18next
- **Backend**: Node.js, Express.js, MongoDB, JWT, Cloudinary
- **Admin**: React.js, TailwindCSS, Axios
