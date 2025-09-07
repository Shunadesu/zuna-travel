# Seed Scripts

Các script để tạo dữ liệu mẫu cho VnBestTravel Tour.

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

### 3. Tạo Transfer Services

```bash
# Tạo danh mục và dịch vụ transfer (tự động)
node seeds/runTransferSeed.js

# Hoặc tạo riêng lẻ
node seeds/createTransferCategories.js
node seeds/transferServices.js

# Tạo các dịch vụ transfer đơn giản (dựa trên hình ảnh thực tế)
node seeds/simpleTransferServices.js
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

### `createTransferCategories.js`

- Tạo 8 danh mục transfer services chính
- Bao gồm: Halong Bay Transfer, Hanoi Sapa Train, Ha Giang Transfer, Airport Transfer, Sapa Transfer, Ninh Binh Transfer, Cat Ba Transfer, All-in-One Package
- Cấu hình vehicle type, seats, region cho từng danh mục
- SEO metadata đầy đủ

### `transferServices.js`

- Tạo 8 dịch vụ transfer chính dựa trên hình ảnh
- Bao gồm: Halong Bay, Hanoi Sapa Train, Ha Giang, Airport Transfer, Sapa, Ninh Binh, Cat Ba, All-in-One Package
- Dữ liệu song ngữ (English/Vietnamese)
- Pricing và duration phù hợp

### `runTransferSeed.js`

- Script helper chạy cả categories và services
- Tự động tạo categories trước, sau đó tạo services
- Báo cáo chi tiết quá trình seeding

### `simpleTransferServices.js`

- Tạo 12 dịch vụ transfer đơn giản dựa trên hình ảnh thực tế
- Bao gồm: Hanoi Airport Sapa Bus, Hanoi Sapa Sleeping Bus, Airport Transfer, Private Car, Cat Ba Bus, Halong Bay Limousine, Sapa Limousine Van, Cat Ba Limousine Van, Express Sleeping Bus, Ninh Binh Private Car, Ha Giang Motorbike Tour, All-in-One Package
- Dữ liệu đơn giản: pricing, duration, includes, excludes, highlights
- Thông tin thực tế: ratings, reviews
- SEO metadata cơ bản
- Không có lỗi validation

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

4. **Chạy script tạo transfer categories (tùy chọn)**

   ```bash
   # Tạo danh mục cho transfer services
   node seeds/createTransferCategories.js
   ```

5. **Chạy script tạo transfer services (tùy chọn)**

   ```bash
   # Chạy trực tiếp (cần categories trước)
   node seeds/transferServices.js

   # Hoặc sử dụng script helper (tự động tạo categories trước)
   node seeds/runTransferSeed.js
   ```

6. **Kiểm tra kết quả**
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
