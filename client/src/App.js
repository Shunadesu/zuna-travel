import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './stores';

// Layouts
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import TransfersPage from './pages/TransfersPage';
import TransferDetailPage from './pages/TransferDetailPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Context Providers
import { ApiProvider } from './contexts/ApiContext';

function App() {
  const { i18n } = useTranslation();
  const { initializeAuth } = useAuthStore();

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Set document language
  React.useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="App">
      <ApiProvider>
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              
              {/* Tours routes */}
              <Route path="tours" element={<ToursPage />} />
              <Route path="tour/:slug" element={<TourDetailPage />} />
              
              {/* Category routes */}
              <Route path="category/:slug" element={<ToursPage />} />
              
              {/* Transfer routes */}
              <Route path="transfers" element={<TransfersPage />} />
              <Route path="transfer/:slug" element={<TransferDetailPage />} />
              <Route path="transfers/:slug" element={<TransferDetailPage />} />
              
              {/* Blog routes */}
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogDetailPage />} />
              
              {/* Auth routes */}
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="bookings" element={<MyBookingsPage />} />
              
              {/* Other pages */}
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              
              {/* 404 page */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </ApiProvider>
    </div>
  );
}

export default App;
