# Seed Scripts

Các script để tạo dữ liệu mẫu cho Zuna Travel Tour.

## Các Scripts Có Sẵn

### 1. Tạo Admin User

```bash
# Tạo admin đơn giản
npm run seed:admin

# Tạo admin với thông tin chi tiết
npm run seed:admin:detailed
```

**Thông tin đăng nhập Admin:**

- Email: `admin@gmail.com`
- Password: `admin123`
- Role: `admin`

### 2. Tạo Dữ Liệu Hoàn Chỉnh

```bash
# Tạo tất cả dữ liệu mẫu (categories, products, blogs, settings)
npm run seed:complete

# Tạo dữ liệu nhanh (ít dữ liệu hơn)
npm run seed:quick
```

## Chi Tiết Các Scripts

### `createAdmin.js`

- Tạo admin user cơ bản
- Email: admin@gmail.com
- Password: admin123
- Role: admin

### `createAdminDetailed.js`

- Tạo admin user với thông tin chi tiết
- Bao gồm avatar, preferences, addresses
- Thông tin đầy đủ cho admin panel

### `completeSeed.js`

- Tạo categories với subcategories
- Tạo products (tours và transfers)
- Tạo blogs
- Tạo settings
- Dữ liệu đầy đủ cho website

### `quickSeed.js`

- Tạo dữ liệu cơ bản
- Ít products và blogs hơn
- Phù hợp cho testing

### `transferServices.js`

- Tạo 8 dịch vụ transfer chính dựa trên hình ảnh
- Bao gồm: Halong Bay, Hanoi Sapa Train, Ha Giang, Airport Transfer, Sapa, Ninh Binh, Cat Ba, All-in-One Package
- Dữ liệu song ngữ (English/Vietnamese)
- Pricing và duration phù hợp

## Cách Sử Dụng

1. **Đảm bảo MongoDB đã được kết nối**

   - Kiểm tra file `.env` có `MONGODB_URI` đúng

2. **Chạy script tạo admin trước**

   ```bash
   npm run seed:admin
   ```

3. **Chạy script tạo dữ liệu**

   ```bash
   npm run seed:complete
   ```

4. **Chạy script tạo transfer services (tùy chọn)**

   ```bash
   # Chạy trực tiếp
   node seeds/transferServices.js
   
   # Hoặc sử dụng script helper
   node seeds/runTransferSeed.js
   ```

4. **Kiểm tra kết quả**
   - Admin có thể đăng nhập vào admin panel
   - Website có dữ liệu để hiển thị

## Lưu Ý

- Các scripts sẽ kiểm tra dữ liệu đã tồn tại trước khi tạo
- Nếu admin đã tồn tại, script sẽ hiển thị thông tin admin hiện tại
- Dữ liệu được tạo với `isActive: true` để hiển thị trên website
- Các images sử dụng Unsplash URLs cho demo

## Troubleshooting

### Lỗi kết nối MongoDB

- Kiểm tra `MONGODB_URI` trong file `.env`
- Đảm bảo MongoDB đang chạy

### Lỗi duplicate key

- Script sẽ hiển thị thông báo nếu dữ liệu đã tồn tại
- Không cần lo lắng, đây là hành vi bình thường

### Lỗi validation

- Kiểm tra các trường required trong models
- Đảm bảo dữ liệu đúng format
