# Phân Tích Routes - VnBestTravel Tour

## Tổng Quan Hệ Thống

Dự án VnBestTravel Tour bao gồm 3 phần chính:

- **Backend API** (server/) - Node.js + Express + MongoDB
- **Frontend Client** (client/) - React cho người dùng cuối
- **Admin CMS** (admin-cms/) - React cho quản trị viên

## 1. Backend API Routes (server/routes/)

### 1.1 Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin profile (Private)
- `PUT /api/auth/profile` - Cập nhật profile (Private)
- `PUT /api/auth/change-password` - Đổi mật khẩu (Private)
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Reset mật khẩu

### 1.2 User Management Routes (`/api/users`)

- `GET /api/users` - Lấy danh sách users (Admin only)
- `GET /api/users/:id` - Lấy thông tin user theo ID (Admin only)
- `POST /api/users` - Tạo user mới (Admin only)
- `PUT /api/users/:id` - Cập nhật user (Admin only)
- `PATCH /api/users/:id/status` - Cập nhật trạng thái user (Admin only)
- `DELETE /api/users/:id` - Xóa user (Admin only)
- `GET /api/users/profile/me` - Lấy profile hiện tại (Private)
- `PUT /api/users/profile/me` - Cập nhật profile hiện tại (Private)

### 1.3 Category Routes (`/api/categories`)

- `GET /api/categories` - Lấy danh sách categories (Public)
- `GET /api/categories/slug/:slug` - Lấy category theo slug (Public)
- `GET /api/categories/hierarchy/:type` - Lấy cấu trúc phân cấp (Public)
- `GET /api/categories/:id` - Lấy category theo ID (Admin only)
- `POST /api/categories` - Tạo category mới (Admin only)
- `PUT /api/categories/:id` - Cập nhật category (Admin only)
- `DELETE /api/categories/:id` - Xóa category (Admin only)
- `GET /api/categories/:id/stats` - Thống kê category (Admin only)

### 1.4 Product Routes (`/api/products`)

- `GET /api/products` - Lấy danh sách products (Public)
- `GET /api/products/slug/:slug` - Lấy product theo slug (Public)
- `GET /api/products/:id` - Lấy product theo ID (Admin only)
- `POST /api/products` - Tạo product mới (Admin only)
- `PUT /api/products/:id` - Cập nhật product (Admin only)
- `DELETE /api/products/:id` - Xóa product (Admin only)
- `GET /api/products/featured/list` - Lấy featured products (Public)
- `GET /api/products/search/text` - Tìm kiếm products (Public)

### 1.5 Transfer Routes (`/api/transfers`)

- `GET /api/transfers` - Lấy danh sách transfer services (Public)
- `GET /api/transfers/types` - Lấy danh sách loại transfer (Public)
- `GET /api/transfers/seats` - Lấy danh sách tùy chọn ghế (Public)
- `GET /api/transfers/search` - Tìm kiếm transfer theo route (Public)
- `GET /api/transfers/slug/:slug` - Lấy transfer theo slug (Public)
- `GET /api/transfers/routes/popular` - Lấy routes phổ biến (Public)
- `POST /api/transfers` - Tạo transfer service mới (Admin only)

### 1.6 Blog Routes (`/api/blogs`)

- `GET /api/blogs` - Lấy danh sách blogs (Public)
- `GET /api/blogs/slug/:slug` - Lấy blog theo slug (Public)
- `GET /api/blogs/:id` - Lấy blog theo ID (Admin only)
- `POST /api/blogs` - Tạo blog mới (Admin only)
- `PUT /api/blogs/:id` - Cập nhật blog (Admin only)
- `DELETE /api/blogs/:id` - Xóa blog (Admin only)
- `GET /api/blogs/featured/list` - Lấy featured blogs (Public)
- `GET /api/blogs/category/:category` - Lấy blogs theo category (Public)
- `GET /api/blogs/search/text` - Tìm kiếm blogs (Public)

### 1.7 Upload Routes (`/api/upload`)

- `POST /api/upload/image` - Upload 1 ảnh (Admin only)
- `POST /api/upload/images` - Upload nhiều ảnh (Admin only)
- `DELETE /api/upload/image/:publicId` - Xóa ảnh (Admin only)
- `POST /api/upload/editor` - Upload ảnh cho editor (Admin only)
- `GET /api/upload/stats` - Thống kê upload (Admin only)

### 1.8 Settings Routes (`/api/settings`)

- `GET /api/settings` - Lấy settings (Public)
- `GET /api/settings/admin` - Lấy settings đầy đủ (Admin only)
- `PUT /api/settings` - Cập nhật settings (Admin only)
- `POST /api/settings/reset` - Reset settings về mặc định (Admin only)
- `GET /api/settings/group/:group` - Lấy settings theo nhóm (Public)

### 1.9 Booking Routes (`/api/bookings`)

- `POST /api/bookings` - Tạo booking mới (Public)
- `GET /api/bookings/my-bookings` - Lấy bookings của user (Private)
- `GET /api/bookings/:id` - Lấy booking theo ID (Private)
- `PUT /api/bookings/:id` - Cập nhật booking (Private)
- `PUT /api/bookings/:id/cancel` - Hủy booking (Private)
- `GET /api/bookings/guest/:email` - Lấy bookings của guest (Public)
- `GET /api/bookings` - Lấy tất cả bookings (Admin only)

### 1.10 Health Check

- `GET /api/health` - Kiểm tra trạng thái server

## 2. Frontend Client Routes (client/src/)

### 2.1 Public Routes

- `/` - Trang chủ (HomePage)
- `/tours` - Danh sách tours (ToursPage)
- `/tour/:slug` - Chi tiết tour (TourDetailPage)
- `/category/:slug` - Tours theo category (ToursPage)
- `/transfers` - Danh sách transfer services (TransfersPage)
- `/transfer/:slug` - Chi tiết transfer (TransferDetailPage)
- `/transfers/:slug` - Chi tiết transfer (TransferDetailPage)
- `/blog` - Danh sách blogs (BlogPage)
- `/blog/:slug` - Chi tiết blog (BlogDetailPage)
- `/about` - Giới thiệu (AboutPage)
- `/contact` - Liên hệ (ContactPage)

### 2.2 Authentication Routes

- `/login` - Đăng nhập (LoginPage)
- `/register` - Đăng ký (RegisterPage)

### 2.3 Private Routes (Yêu cầu đăng nhập)

- `/profile` - Profile người dùng (ProfilePage)
- `/bookings` - Bookings của người dùng (MyBookingsPage)

### 2.4 Error Routes

- `*` - 404 Not Found (NotFoundPage)

## 3. Admin CMS Routes (admin-cms/src/)

### 3.1 Authentication Routes

- `/auth/login` - Đăng nhập admin (LoginPage)
- `/auth/register` - Đăng ký admin (RegisterPage)

### 3.2 Admin Dashboard Routes (Yêu cầu đăng nhập admin)

- `/admin` - Dashboard chính (DashboardPage)

### 3.3 Category Management

- `/admin/categories` - Danh sách categories (CategoriesPage)
- `/admin/categories/create` - Tạo category mới (CategoryFormPage)
- `/admin/categories/:id` - Chi tiết category (CategoryDetailPage)
- `/admin/categories/:id/edit` - Chỉnh sửa category (CategoryFormPage)

### 3.4 User Management

- `/admin/users` - Danh sách users (UsersPage)
- `/admin/users/create` - Tạo user mới (UserFormPage)
- `/admin/users/:id` - Chi tiết user (UserDetailPage)
- `/admin/users/:id/edit` - Chỉnh sửa user (UserFormPage)

### 3.5 Product Management

- `/admin/products` - Danh sách products (ProductsPage)
- `/admin/products/create` - Tạo product mới (ProductFormPage)
- `/admin/products/create/:type` - Tạo product theo loại (ProductFormPage)
- `/admin/products/:id` - Chi tiết product (ProductDetailPage)
- `/admin/products/:id/edit` - Chỉnh sửa product (ProductFormPage)

### 3.6 Blog Management

- `/admin/blogs` - Danh sách blogs (BlogsPage)
- `/admin/blogs/create` - Tạo blog mới (BlogFormPage)
- `/admin/blogs/:id` - Chi tiết blog (BlogDetailPage)
- `/admin/blogs/:id/edit` - Chỉnh sửa blog (BlogFormPage)

### 3.7 System Management

- `/admin/settings` - Cài đặt hệ thống (SettingsPage)
- `/admin/profile` - Profile admin (ProfilePage)
- `/admin/bookings` - Quản lý bookings (BookingsPage)

### 3.8 Error Routes

- `/` - Redirect to `/admin`
- `*` - 404 Not Found (NotFoundPage)

## 4. Đặc Điểm Kỹ Thuật

### 4.1 Authentication & Authorization

- **JWT Token**: Sử dụng JWT cho authentication
- **Role-based Access**: Phân quyền admin/user
- **Protected Routes**: Middleware bảo vệ routes
- **Optional Auth**: Một số routes cho phép truy cập không cần đăng nhập

### 4.2 API Features

- **Validation**: Sử dụng express-validator
- **Pagination**: Hỗ trợ phân trang
- **Search**: Tìm kiếm text và filter
- **Caching**: Cache headers cho performance
- **File Upload**: Upload ảnh với Cloudinary
- **Rate Limiting**: Giới hạn request (production)

### 4.3 Frontend Features

- **React Router**: Client-side routing
- **Protected Routes**: Bảo vệ routes cần authentication
- **Layout System**: Layout riêng cho từng loại trang
- **Internationalization**: Hỗ trợ đa ngôn ngữ (i18n)
- **State Management**: Zustand cho state management

### 4.4 Security

- **CORS**: Cấu hình CORS cho multiple origins
- **Helmet**: Security headers
- **Input Validation**: Validation đầu vào
- **File Upload Security**: Kiểm tra file type và size

## 5. Database Models

### 5.1 Core Models

- **User**: Thông tin người dùng
- **Category**: Danh mục sản phẩm
- **Product**: Sản phẩm (tours/transfers)
- **Blog**: Bài viết blog
- **Booking**: Đặt tour/transfer
- **Settings**: Cài đặt hệ thống

### 5.2 Relationships

- User → Bookings (1:N)
- Category → Products (1:N)
- User → Blogs (1:N)
- Product → Bookings (1:N)

## 6. Deployment

### 6.1 Backend

- **Platform**: Render.com
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Environment**: Production/Development

### 6.2 Frontend

- **Platform**: Vercel
- **Build**: React build
- **Proxy**: API calls to backend

### 6.3 Admin CMS

- **Platform**: Vercel
- **Build**: React build
- **Proxy**: API calls to backend

## 7. API Endpoints Summary

| Method | Endpoint             | Description     | Access |
| ------ | -------------------- | --------------- | ------ |
| GET    | `/api/health`        | Health check    | Public |
| POST   | `/api/auth/login`    | Login           | Public |
| POST   | `/api/auth/register` | Register        | Public |
| GET    | `/api/products`      | List products   | Public |
| GET    | `/api/transfers`     | List transfers  | Public |
| GET    | `/api/blogs`         | List blogs      | Public |
| GET    | `/api/categories`    | List categories | Public |
| GET    | `/api/settings`      | Get settings    | Public |
| POST   | `/api/bookings`      | Create booking  | Public |
| GET    | `/api/users`         | List users      | Admin  |
| POST   | `/api/products`      | Create product  | Admin  |
| POST   | `/api/blogs`         | Create blog     | Admin  |
| PUT    | `/api/settings`      | Update settings | Admin  |

Tổng cộng: **50+ API endpoints** với đầy đủ CRUD operations cho tất cả các entities chính của hệ thống.
