import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';

// Layouts and Components
import AdminLayout from './components/layouts/AdminLayout';
import AuthLayout from './components/layouts/AuthLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import CategoryFormPage from './pages/categories/CategoryFormPage';
import CategoryDetailPage from './pages/categories/CategoryDetailPage';

import UsersPage from './pages/users/UsersPage';
import UserFormPage from './pages/users/UserFormPage';
import UserDetailPage from './pages/users/UserDetailPage';
import ProductsPage from './pages/products/ProductsPage';
import ProductFormPage from './pages/products/ProductFormPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import BlogsPage from './pages/blogs/BlogsPage';
import BlogFormPage from './pages/blogs/BlogFormPage';
import BlogDetailPage from './pages/blogs/BlogDetailPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import ConsultationsPage from './pages/ConsultationsPage';
import NotFoundPage from './pages/NotFoundPage';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { ApiProvider } from './contexts/ApiContext';

function App() {
  const { i18n } = useTranslation();

  // Set document language
  React.useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="App">
      <ApiProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Auth Routes */}
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route index element={<Navigate to="/auth/login" replace />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardPage />} />
                
                {/* Categories */}
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="categories/create" element={<CategoryFormPage />} />
                <Route path="categories/:id" element={<CategoryDetailPage />} />
                <Route path="categories/:id/edit" element={<CategoryFormPage />} />
                
                {/* Users */}
                <Route path="users" element={<UsersPage />} />
                <Route path="users/create" element={<UserFormPage />} />
                <Route path="users/:id" element={<UserDetailPage />} />
                <Route path="users/:id/edit" element={<UserFormPage />} />
                
                {/* Products */}
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/create" element={<ProductFormPage />} />
                <Route path="products/create/:type" element={<ProductFormPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="products/:id/edit" element={<ProductFormPage />} />
                
                {/* Blogs */}
                <Route path="blogs" element={<BlogsPage />} />
                <Route path="blogs/create" element={<BlogFormPage />} />
                <Route path="blogs/:id" element={<BlogDetailPage />} />
                <Route path="blogs/:id/edit" element={<BlogFormPage />} />
                
                {/* Settings */}
                <Route path="settings" element={<SettingsPage />} />
                
                {/* Profile */}
                <Route path="profile" element={<ProfilePage />} />
                
                {/* Bookings */}
                <Route path="bookings" element={<BookingsPage />} />
                
                {/* Consultations */}
                <Route path="consultations" element={<ConsultationsPage />} />
              </Route>

              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/admin" replace />} />
              
              {/* 404 page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ApiProvider>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
