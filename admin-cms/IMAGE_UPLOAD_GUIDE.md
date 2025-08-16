# Hướng dẫn sử dụng chức năng Upload Hình ảnh

## Tổng quan

Hệ thống đã được tích hợp chức năng upload hình ảnh cho cả Categories và Products trong Admin CMS. Hình ảnh được lưu trữ trên Cloudinary và có thể được quản lý dễ dàng.

## Tính năng chính

### 1. Upload Hình ảnh

- **Drag & Drop**: Kéo thả file hình ảnh trực tiếp vào khu vực upload
- **Click to Upload**: Click vào khu vực upload để chọn file
- **Multiple Files**: Upload nhiều file cùng lúc
- **File Validation**: Kiểm tra định dạng file (PNG, JPG, GIF, WebP)
- **Size Limit**: Giới hạn 10MB per file

### 2. Quản lý Hình ảnh

- **Preview**: Xem trước hình ảnh đã upload
- **Remove**: Xóa hình ảnh không cần thiết
- **Reorder**: Hình ảnh đầu tiên sẽ là hình chính
- **Auto Delete**: Tự động xóa hình ảnh cũ khi cập nhật

### 3. Hiển thị

- **Thumbnail**: Hiển thị thumbnail trong danh sách
- **Gallery**: Xem gallery với lightbox
- **Responsive**: Tương thích với mọi thiết bị

## Cách sử dụng

### Categories

1. **Tạo Category mới**:

   - Vào `/admin/categories/create`
   - Scroll xuống phần "Category Images"
   - Upload hình ảnh bằng cách kéo thả hoặc click chọn
   - Tối đa 5 hình ảnh per category

2. **Chỉnh sửa Category**:
   - Vào `/admin/categories/{id}/edit`
   - Thêm/xóa hình ảnh trong phần "Category Images"
   - Hình ảnh cũ sẽ tự động bị xóa khi không còn sử dụng

### Products

1. **Tạo Product mới**:

   - Vào `/admin/products/create`
   - Scroll xuống phần "Product Images"
   - Upload hình ảnh (bắt buộc)
   - Tối đa 10 hình ảnh per product

2. **Chỉnh sửa Product**:
   - Vào `/admin/products/{id}/edit`
   - Quản lý hình ảnh trong phần "Product Images"
   - Hình ảnh đầu tiên sẽ là hình chính của sản phẩm

## Cấu trúc dữ liệu

### Image Object

```javascript
{
  url: "https://res.cloudinary.com/...",
  publicId: "zuna-travel/categories/...",
  originalName: "image.jpg"
}
```

### Database Schema

**Categories**:

```javascript
images: [
  {
    url: { type: String, required: true },
    publicId: String,
    alt: {
      en: String,
      vi: String,
    },
  },
];
```

**Products**:

```javascript
images: [
  {
    url: { type: String, required: true },
    publicId: String,
    alt: {
      en: String,
      vi: String,
    },
  },
];
```

## API Endpoints

### Upload Images

```
POST /api/upload/images
Content-Type: multipart/form-data

Body:
- images: File[] (multiple files)
- folder: String (optional, default: 'zuna-travel')
```

### Delete Image

```
DELETE /api/upload/image/:publicId
```

## Components

### ImageUpload

```javascript
import ImageUpload from "../components/common/ImageUpload";

<ImageUpload
  images={formData.images}
  onImagesChange={(images) => setFormData({ ...formData, images })}
  maxImages={5}
  folder="zuna-travel/categories"
  label="Category Images"
  required={false}
/>;
```

### ImageGallery

```javascript
import ImageGallery from "../components/common/ImageGallery";

<ImageGallery images={category.images} title="Category Images" />;
```

## Lưu ý quan trọng

1. **Cloudinary Configuration**: Đảm bảo đã cấu hình Cloudinary trong `server/config/cloudinary.js`

2. **Environment Variables**: Cần có các biến môi trường:

   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **File Permissions**: Đảm bảo thư mục upload có quyền ghi

4. **Storage Management**: Hình ảnh sẽ tự động bị xóa khi:

   - Xóa category/product
   - Thay thế hình ảnh cũ
   - Xóa thủ công trong form

5. **Performance**:
   - Hình ảnh được tối ưu hóa bởi Cloudinary
   - Sử dụng lazy loading cho gallery
   - Responsive images cho mobile

## Troubleshooting

### Lỗi thường gặp

1. **Upload failed**:

   - Kiểm tra kết nối internet
   - Kiểm tra Cloudinary credentials
   - Kiểm tra file size và format

2. **Images not displaying**:

   - Kiểm tra URL trong database
   - Kiểm tra Cloudinary folder structure
   - Kiểm tra CORS settings

3. **Delete failed**:
   - Kiểm tra publicId format
   - Kiểm tra Cloudinary permissions
   - Kiểm tra network connectivity

### Debug

1. **Check Network Tab**: Xem request/response trong browser dev tools
2. **Check Console**: Xem error logs trong browser console
3. **Check Server Logs**: Xem error logs trong server console

## Best Practices

1. **Image Optimization**:

   - Sử dụng WebP format khi có thể
   - Compress images trước khi upload
   - Sử dụng appropriate dimensions

2. **User Experience**:

   - Hiển thị loading state khi upload
   - Validate file types trước khi upload
   - Provide clear error messages

3. **Performance**:
   - Lazy load images
   - Use appropriate image sizes
   - Cache images when possible
