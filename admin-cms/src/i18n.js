import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources for Admin CMS
const resources = {
  en: {
    translation: {
      // Common
      common: {
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        create: 'Create',
        update: 'Update',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        actions: 'Actions',
        status: 'Status',
        active: 'Active',
        inactive: 'Inactive',
        published: 'Published',
        draft: 'Draft',
        yes: 'Yes',
        no: 'No',
        confirm: 'Confirm',
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information',
        required: 'Required',
        optional: 'Optional',
        name: 'Name',
        description: 'Description',
        image: 'Image',
        images: 'Images',
        date: 'Date',
        time: 'Time',
        createdAt: 'Created At',
        updatedAt: 'Updated At',
        backToList: 'Back to List',
        backToUsers: 'Back to Users',
        viewDetails: 'View Details',
        previous: 'Previous',
        next: 'Next',
        showing: 'Showing',
        to: 'to',
        of: 'of',
        results: 'results',
        saving: 'Saving...'
      },

      // Navigation
      nav: {
        dashboard: 'Dashboard',
        categories: 'Categories',
        users: 'Users',
        products: 'Products',
        blogs: 'Blogs',
        settings: 'Settings',
        profile: 'Profile',
        logout: 'Logout'
      },

      // Auth
      auth: {
        login: 'Login',
        loginTitle: 'Sign in to Admin Panel',
        email: 'Email Address',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot your password?',
        loginButton: 'Sign In',
        loginSuccess: 'Login successful',
        loginError: 'Invalid email or password',
        logout: 'Logout',
        logoutConfirm: 'Are you sure you want to logout?'
      },

      // Dashboard
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome back!',
        overview: 'Overview',
        stats: {
          totalCategories: 'Total Categories',
          totalProducts: 'Total Products',
          totalBlogs: 'Total Blogs',
          activeProducts: 'Active Products',
          publishedBlogs: 'Published Blogs',
          recentActivity: 'Recent Activity'
        }
      },

      // Categories
      categories: {
        title: 'Categories',
        create: 'Create Category',
        edit: 'Edit Category',
        list: 'Categories List',
        name: 'Category Name',
        nameEn: 'Name (English)',
        nameVi: 'Name (Vietnamese)',
        descriptionEn: 'Description (English)',
        descriptionVi: 'Description (Vietnamese)',
        type: 'Category Type',
        vietnamTours: 'Vietnam Tours',
        transferServices: 'Transfer Services',
        slug: 'Slug',
        sortOrder: 'Sort Order',
        isActive: 'Is Active',
        productsCount: 'Products Count',
        createSuccess: 'Category created successfully',
        updateSuccess: 'Category updated successfully',
        deleteSuccess: 'Category deleted successfully',
        deleteConfirm: 'Are you sure you want to delete this category?',
        deleteError: 'Cannot delete category with associated products'
      },

      // Users
      users: {
        title: 'Users',
        create: 'Create User',
        createTitle: 'Create New User',
        edit: 'Edit User',
        editTitle: 'Edit User',
        list: 'Users List',
        details: 'User Details',
        name: 'Name',
        namePlaceholder: 'Enter full name',
        email: 'Email',
        emailPlaceholder: 'Enter email address',
        phone: 'Phone',
        phonePlaceholder: 'Enter phone number',
        password: 'Password',
        passwordPlaceholder: 'Enter password',
        confirmPassword: 'Confirm Password',
        confirmPasswordPlaceholder: 'Confirm password',
        passwordMinLength: 'Minimum 6 characters',
        role: 'Role',
        isActive: 'Is Active',
        active: 'Active',
        activeDescription: 'Active users can access the system',
        joinedDate: 'Joined Date',
        createdAt: 'Created At',
        updatedAt: 'Updated At',
        userId: 'User ID',
        basicInfo: 'Basic Information',
        accountInfo: 'Account Information',
        status: 'Status',
        noPhone: 'No phone number',
        notFound: 'User not found',
        notFoundDescription: 'The user you\'re looking for doesn\'t exist.',
        deleteConfirm: 'Are you sure you want to delete this user?',
        deleteSuccess: 'User deleted successfully',
        createSuccess: 'User created successfully',
        updateSuccess: 'User updated successfully',
        roles: {
          admin: 'Admin',
          user: 'User'
        },
        filters: {
          role: 'Role',
          allRoles: 'All Roles',
          status: 'Status',
          allStatus: 'All Status',
          active: 'Active',
          inactive: 'Inactive',
          limit: 'Items per page'
        },
        table: {
          user: 'User',
          email: 'Email',
          role: 'Role',
          status: 'Status',
          createdAt: 'Created At',
          actions: 'Actions',
          noPhone: 'No phone'
        }
      },

      // Products
      products: {
        title: 'Products',
        create: 'Create Product',
        edit: 'Edit Product',
        list: 'Products List',
        titleEn: 'Title (English)',
        titleVi: 'Title (Vietnamese)',
        descriptionEn: 'Description (English)',
        descriptionVi: 'Description (Vietnamese)',
        shortDescriptionEn: 'Short Description (English)',
        shortDescriptionVi: 'Short Description (Vietnamese)',
        category: 'Category',
        price: 'Price',
        adultPrice: 'Adult Price',
        childPrice: 'Child Price',
        currency: 'Currency',
        duration: 'Duration',
        days: 'Days',
        nights: 'Nights',
        location: 'Location',
        locationEn: 'Location (English)',
        locationVi: 'Location (Vietnamese)',
        highlights: 'Highlights',
        itinerary: 'Itinerary',
        included: 'What\'s Included',
        excluded: 'What\'s Not Included',
        requirements: 'Requirements',
        cancellationPolicy: 'Cancellation Policy',
        isFeatured: 'Is Featured',
        isActive: 'Is Active',
        featuredImage: 'Featured Image',
        gallery: 'Gallery',
        createSuccess: 'Product created successfully',
        updateSuccess: 'Product updated successfully',
        deleteSuccess: 'Product deleted successfully',
        deleteConfirm: 'Are you sure you want to delete this product?'
      },

      // Blogs
      blogs: {
        title: 'Blog Posts',
        create: 'Create Blog Post',
        edit: 'Edit Blog Post',
        list: 'Blog Posts List',
        titleEn: 'Title (English)',
        titleVi: 'Title (Vietnamese)',
        contentEn: 'Content (English)',
        contentVi: 'Content (Vietnamese)',
        excerptEn: 'Excerpt (English)',
        excerptVi: 'Excerpt (Vietnamese)',
        featuredImage: 'Featured Image',
        author: 'Author',
        categories: 'Categories',
        tags: 'Tags',
        isPublished: 'Is Published',
        publishedAt: 'Published At',
        isFeatured: 'Is Featured',
        views: 'Views',
        readingTime: 'Reading Time',
        relatedPosts: 'Related Posts',
        createSuccess: 'Blog post created successfully',
        updateSuccess: 'Blog post updated successfully',
        deleteSuccess: 'Blog post deleted successfully',
        deleteConfirm: 'Are you sure you want to delete this blog post?',
        categoryOptions: {
          'travel-tips': 'Travel Tips',
          'destinations': 'Destinations',
          'food-culture': 'Food & Culture',
          'news': 'News',
          'guides': 'Guides'
        }
      },

      // Image Upload
      upload: {
        dragDrop: 'Drag and drop images here, or click to select',
        selectFiles: 'Select Files',
        uploading: 'Uploading...',
        uploadSuccess: 'Image uploaded successfully',
        uploadError: 'Failed to upload image',
        deleteSuccess: 'Image deleted successfully',
        deleteError: 'Failed to delete image',
        maxSize: 'Maximum file size: 10MB',
        allowedTypes: 'Allowed types: JPG, PNG, GIF, WebP'
      },

      // Validation
      validation: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        minLength: 'Minimum length is {{min}} characters',
        maxLength: 'Maximum length is {{max}} characters',
        min: 'Minimum value is {{min}}',
        max: 'Maximum value is {{max}}',
        url: 'Please enter a valid URL',
        number: 'Please enter a valid number'
      }
    }
  },
  
  vi: {
    translation: {
      // Common
      common: {
        loading: 'Đang tải...',
        save: 'Lưu',
        cancel: 'Hủy',
        edit: 'Sửa',
        delete: 'Xóa',
        create: 'Tạo',
        update: 'Cập nhật',
        search: 'Tìm kiếm',
        filter: 'Lọc',
        sort: 'Sắp xếp',
        actions: 'Hành động',
        status: 'Trạng thái',
        active: 'Hoạt động',
        inactive: 'Không hoạt động',
        published: 'Đã xuất bản',
        draft: 'Nháp',
        yes: 'Có',
        no: 'Không',
        confirm: 'Xác nhận',
        success: 'Thành công',
        error: 'Lỗi',
        warning: 'Cảnh báo',
        info: 'Thông tin',
        required: 'Bắt buộc',
        optional: 'Tùy chọn',
        name: 'Tên',
        description: 'Mô tả',
        image: 'Hình ảnh',
        images: 'Hình ảnh',
        date: 'Ngày',
        time: 'Giờ',
        createdAt: 'Ngày tạo',
        updatedAt: 'Ngày cập nhật',
        backToList: 'Quay lại danh sách',
        backToUsers: 'Quay lại người dùng',
        viewDetails: 'Xem chi tiết',
        previous: 'Trước',
        next: 'Tiếp',
        showing: 'Hiển thị',
        to: 'đến',
        of: 'trong tổng số',
        results: 'kết quả',
        saving: 'Đang lưu...'
      },

      // Navigation
      nav: {
        dashboard: 'Bảng điều khiển',
        categories: 'Danh mục',
        users: 'Người dùng',
        products: 'Sản phẩm',
        blogs: 'Blog',
        settings: 'Cài đặt',
        profile: 'Hồ sơ',
        logout: 'Đăng xuất'
      },

      // Auth
      auth: {
        login: 'Đăng nhập',
        loginTitle: 'Đăng nhập vào bảng quản trị',
        email: 'Địa chỉ email',
        password: 'Mật khẩu',
        rememberMe: 'Ghi nhớ đăng nhập',
        forgotPassword: 'Quên mật khẩu?',
        loginButton: 'Đăng nhập',
        loginSuccess: 'Đăng nhập thành công',
        loginError: 'Email hoặc mật khẩu không đúng',
        logout: 'Đăng xuất',
        logoutConfirm: 'Bạn có chắc chắn muốn đăng xuất?'
      },

      // Dashboard
      dashboard: {
        title: 'Bảng điều khiển',
        welcome: 'Chào mừng trở lại!',
        overview: 'Tổng quan',
        stats: {
          totalCategories: 'Tổng danh mục',
          totalProducts: 'Tổng sản phẩm',
          totalBlogs: 'Tổng bài viết',
          activeProducts: 'Sản phẩm hoạt động',
          publishedBlogs: 'Bài viết đã xuất bản',
          recentActivity: 'Hoạt động gần đây'
        }
      },

      // Categories
      categories: {
        title: 'Danh mục',
        create: 'Tạo danh mục',
        edit: 'Sửa danh mục',
        list: 'Danh sách danh mục',
        name: 'Tên danh mục',
        nameEn: 'Tên (Tiếng Anh)',
        nameVi: 'Tên (Tiếng Việt)',
        descriptionEn: 'Mô tả (Tiếng Anh)',
        descriptionVi: 'Mô tả (Tiếng Việt)',
        type: 'Loại danh mục',
        vietnamTours: 'Tour Việt Nam',
        transferServices: 'Dịch vụ đưa đón',
        slug: 'Đường dẫn',
        sortOrder: 'Thứ tự sắp xếp',
        isActive: 'Hoạt động',
        productsCount: 'Số sản phẩm',
        createSuccess: 'Tạo danh mục thành công',
        updateSuccess: 'Cập nhật danh mục thành công',
        deleteSuccess: 'Xóa danh mục thành công',
        deleteConfirm: 'Bạn có chắc chắn muốn xóa danh mục này?',
        deleteError: 'Không thể xóa danh mục có sản phẩm liên quan'
      },

      // Users
      users: {
        title: 'Người dùng',
        create: 'Tạo người dùng',
        createTitle: 'Tạo người dùng mới',
        edit: 'Sửa người dùng',
        editTitle: 'Sửa người dùng',
        list: 'Danh sách người dùng',
        details: 'Chi tiết người dùng',
        name: 'Tên',
        namePlaceholder: 'Nhập họ và tên',
        email: 'Email',
        emailPlaceholder: 'Nhập địa chỉ email',
        phone: 'Số điện thoại',
        phonePlaceholder: 'Nhập số điện thoại',
        password: 'Mật khẩu',
        passwordPlaceholder: 'Nhập mật khẩu',
        confirmPassword: 'Xác nhận mật khẩu',
        confirmPasswordPlaceholder: 'Xác nhận mật khẩu',
        passwordMinLength: 'Tối thiểu 6 ký tự',
        role: 'Vai trò',
        isActive: 'Hoạt động',
        active: 'Hoạt động',
        activeDescription: 'Người dùng hoạt động có thể truy cập hệ thống',
        joinedDate: 'Ngày tham gia',
        createdAt: 'Ngày tạo',
        updatedAt: 'Ngày cập nhật',
        userId: 'ID người dùng',
        basicInfo: 'Thông tin cơ bản',
        accountInfo: 'Thông tin tài khoản',
        status: 'Trạng thái',
        noPhone: 'Không có số điện thoại',
        notFound: 'Không tìm thấy người dùng',
        notFoundDescription: 'Người dùng bạn đang tìm kiếm không tồn tại.',
        deleteConfirm: 'Bạn có chắc chắn muốn xóa người dùng này?',
        deleteSuccess: 'Xóa người dùng thành công',
        createSuccess: 'Tạo người dùng thành công',
        updateSuccess: 'Cập nhật người dùng thành công',
        roles: {
          admin: 'Quản trị viên',
          user: 'Người dùng'
        },
        filters: {
          role: 'Vai trò',
          allRoles: 'Tất cả vai trò',
          status: 'Trạng thái',
          allStatus: 'Tất cả trạng thái',
          active: 'Hoạt động',
          inactive: 'Không hoạt động',
          limit: 'Số mục mỗi trang'
        },
        table: {
          user: 'Người dùng',
          email: 'Email',
          role: 'Vai trò',
          status: 'Trạng thái',
          createdAt: 'Ngày tạo',
          actions: 'Hành động',
          noPhone: 'Không có số điện thoại'
        }
      },

      // Products
      products: {
        title: 'Sản phẩm',
        create: 'Tạo sản phẩm',
        edit: 'Sửa sản phẩm',
        list: 'Danh sách sản phẩm',
        titleEn: 'Tiêu đề (Tiếng Anh)',
        titleVi: 'Tiêu đề (Tiếng Việt)',
        descriptionEn: 'Mô tả (Tiếng Anh)',
        descriptionVi: 'Mô tả (Tiếng Việt)',
        shortDescriptionEn: 'Mô tả ngắn (Tiếng Anh)',
        shortDescriptionVi: 'Mô tả ngắn (Tiếng Việt)',
        category: 'Danh mục',
        price: 'Giá',
        adultPrice: 'Giá người lớn',
        childPrice: 'Giá trẻ em',
        currency: 'Tiền tệ',
        duration: 'Thời gian',
        days: 'Ngày',
        nights: 'Đêm',
        location: 'Địa điểm',
        locationEn: 'Địa điểm (Tiếng Anh)',
        locationVi: 'Địa điểm (Tiếng Việt)',
        highlights: 'Điểm nổi bật',
        itinerary: 'Lịch trình',
        included: 'Bao gồm',
        excluded: 'Không bao gồm',
        requirements: 'Yêu cầu',
        cancellationPolicy: 'Chính sách hủy',
        isFeatured: 'Nổi bật',
        isActive: 'Hoạt động',
        featuredImage: 'Hình đại diện',
        gallery: 'Thư viện ảnh',
        createSuccess: 'Tạo sản phẩm thành công',
        updateSuccess: 'Cập nhật sản phẩm thành công',
        deleteSuccess: 'Xóa sản phẩm thành công',
        deleteConfirm: 'Bạn có chắc chắn muốn xóa sản phẩm này?'
      },

      // Blogs
      blogs: {
        title: 'Bài viết blog',
        create: 'Tạo bài viết',
        edit: 'Sửa bài viết',
        list: 'Danh sách bài viết',
        titleEn: 'Tiêu đề (Tiếng Anh)',
        titleVi: 'Tiêu đề (Tiếng Việt)',
        contentEn: 'Nội dung (Tiếng Anh)',
        contentVi: 'Nội dung (Tiếng Việt)',
        excerptEn: 'Tóm tắt (Tiếng Anh)',
        excerptVi: 'Tóm tắt (Tiếng Việt)',
        featuredImage: 'Hình đại diện',
        author: 'Tác giả',
        categories: 'Danh mục',
        tags: 'Thẻ',
        isPublished: 'Đã xuất bản',
        publishedAt: 'Ngày xuất bản',
        isFeatured: 'Nổi bật',
        views: 'Lượt xem',
        readingTime: 'Thời gian đọc',
        relatedPosts: 'Bài viết liên quan',
        createSuccess: 'Tạo bài viết thành công',
        updateSuccess: 'Cập nhật bài viết thành công',
        deleteSuccess: 'Xóa bài viết thành công',
        deleteConfirm: 'Bạn có chắc chắn muốn xóa bài viết này?',
        categoryOptions: {
          'travel-tips': 'Mẹo du lịch',
          'destinations': 'Điểm đến',
          'food-culture': 'Ẩm thực & Văn hóa',
          'news': 'Tin tức',
          'guides': 'Hướng dẫn'
        }
      },

      // Image Upload
      upload: {
        dragDrop: 'Kéo thả hình ảnh vào đây, hoặc click để chọn',
        selectFiles: 'Chọn tệp',
        uploading: 'Đang tải lên...',
        uploadSuccess: 'Tải lên hình ảnh thành công',
        uploadError: 'Tải lên hình ảnh thất bại',
        deleteSuccess: 'Xóa hình ảnh thành công',
        deleteError: 'Xóa hình ảnh thất bại',
        maxSize: 'Kích thước tối đa: 10MB',
        allowedTypes: 'Định dạng cho phép: JPG, PNG, GIF, WebP'
      },

      // Validation
      validation: {
        required: 'Trường này là bắt buộc',
        email: 'Vui lòng nhập địa chỉ email hợp lệ',
        minLength: 'Độ dài tối thiểu là {{min}} ký tự',
        maxLength: 'Độ dài tối đa là {{max}} ký tự',
        min: 'Giá trị tối thiểu là {{min}}',
        max: 'Giá trị tối đa là {{max}}',
        url: 'Vui lòng nhập URL hợp lệ',
        number: 'Vui lòng nhập số hợp lệ'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;
