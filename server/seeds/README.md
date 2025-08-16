# Seed Data Guide

## Tổng quan
Thư mục này chứa các file seed để tạo dữ liệu mẫu cho database.

## Files có sẵn

### 1. `completeSeed.js` - Seed đầy đủ
- **Mô tả**: Tạo dữ liệu mẫu đầy đủ với nhiều categories, products, blogs
- **Dữ liệu bao gồm**:
  - 4 categories (Hanoi, Ha Long Bay, Sapa, Airport Transfers)
  - 3 products (Hanoi Tour, Ha Long Cruise, Airport Transfer)
  - 2 blog posts
  - 1 admin user
  - Settings configuration

### 2. `quickSeed.js` - Seed nhanh
- **Mô tả**: Tạo dữ liệu cơ bản nhanh chóng
- **Dữ liệu bao gồm**:
  - 2 categories (Vietnam Tours, Transfer Services)
  - 2 products (Hanoi Tour, Airport Transfer)
  - 1 blog post
  - 1 admin user
  - Settings configuration

### 3. Các file seed cũ (có thể xóa)
- `seedData.js` - File seed cũ
- `simpleCategories.js` - Categories đơn giản
- `simpleProducts.js` - Products đơn giản
- `simpleBlogs.js` - Blogs đơn giản
- `categoriesWithSubcategories.js` - Categories với subcategories

## Cách sử dụng

### 1. Chạy seed đầy đủ
```bash
cd server
npm run seed
```

### 2. Chạy seed nhanh
```bash
cd server
npm run seed:quick
```

### 3. Chạy trực tiếp
```bash
cd server
node seeds/completeSeed.js
# hoặc
node seeds/quickSeed.js
```

## Thông tin đăng nhập

Sau khi chạy seed, bạn có thể đăng nhập với:

**Admin Account:**
- Email: `admin@zunatravel.com`
- Password: `admin123`

## Cấu trúc dữ liệu

### Categories
- **Vietnam Tours**: Các tour du lịch Việt Nam
- **Transfer Services**: Dịch vụ đưa đón

### Products
- **Tour Products**: Các tour du lịch với pricing theo người lớn/trẻ em
- **Transfer Products**: Dịch vụ đưa đón với pricing theo chuyến

### Blogs
- Bài viết về du lịch Việt Nam
- Hỗ trợ đa ngôn ngữ (EN/VI)

### Settings
- Thông tin website
- Thông tin liên hệ
- Cấu hình booking

## Lưu ý

1. **Xóa dữ liệu cũ**: Tất cả seed files sẽ xóa dữ liệu cũ trước khi tạo mới
2. **Environment Variables**: Đảm bảo `MONGODB_URI` đã được cấu hình
3. **Password**: Admin password được hash với bcrypt
4. **Multilingual**: Tất cả dữ liệu hỗ trợ tiếng Anh và tiếng Việt

## Troubleshooting

### Lỗi kết nối database
```bash
# Kiểm tra MONGODB_URI
echo $MONGODB_URI

# Hoặc tạo file .env
cp env.example .env
# Chỉnh sửa .env với MONGODB_URI thực tế
```

### Lỗi permission
```bash
# Đảm bảo có quyền write vào database
# Kiểm tra connection string có username/password đúng
```

### Lỗi validation
```bash
# Kiểm tra models có đúng schema
# Đảm bảo required fields được điền đầy đủ
```

## Tùy chỉnh dữ liệu

Để thêm/sửa dữ liệu mẫu:

1. **Thêm categories**: Chỉnh sửa `categoriesData` array
2. **Thêm products**: Chỉnh sửa `productsData` array
3. **Thêm blogs**: Chỉnh sửa `blogsData` array
4. **Sửa settings**: Chỉnh sửa `settingsData` object

## Backup dữ liệu

Trước khi chạy seed, nên backup dữ liệu hiện tại:

```bash
# Export data
mongodump --uri="your-mongodb-uri" --out=./backup

# Restore nếu cần
mongorestore --uri="your-mongodb-uri" ./backup
```
