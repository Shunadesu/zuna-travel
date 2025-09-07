# VnBestTravel Client

A modern, responsive travel website built with React, featuring tours, transfers, blog, and comprehensive travel services.

## Features

### 🏠 **Home Page**

- Hero section with dynamic content from settings
- Featured tours and categories
- Company highlights and testimonials
- Newsletter signup

### 🗺️ **Tours**

- Browse all available tours
- Filter by category, price, duration, and location
- Search functionality
- Detailed tour pages with booking forms
- Category-based filtering

### 🚗 **Transfer Services**

- Airport and city transfers
- Professional transportation services
- Booking forms with passenger selection
- Route information and pricing

### 📝 **Blog**

- Travel articles and tips
- Category filtering
- Search functionality
- Related posts
- Author information

### 📞 **Contact**

- Contact form
- Company information from settings
- Social media links
- Business hours and location

### ℹ️ **About**

- Company story and values
- Team information
- Statistics and achievements
- Contact details

## Technology Stack

- **React 18** - Frontend framework
- **React Router DOM** - Client-side routing
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React I18next** - Internationalization
- **Heroicons** - Icon library
- **React Icons** - Additional icons

## State Management

The application uses Zustand for state management with the following stores:

- **SettingsStore** - Website settings and configuration
- **CategoryStore** - Tour categories
- **ProductStore** - Tours and transfer services

## Internationalization

Supports English and Vietnamese languages with:

- Dynamic language switching
- Localized content
- RTL support ready

## API Integration

- Fetches data from the backend API
- Caching for better performance
- Error handling and loading states
- Real-time data updates

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm start
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Environment Setup

Make sure the backend server is running on `http://localhost:5000` or update the proxy in `package.json`.

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── home/           # Home page components
│   └── layout/         # Layout components (Header, Footer)
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── pages/              # Page components
├── stores/             # Zustand stores
├── utils/              # Utility functions
├── App.js              # Main app component
├── index.js            # Entry point
└── i18n.js             # Internationalization setup
```

## Features

### Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces

### Performance

- Lazy loading of components
- Image optimization
- Efficient state management
- Caching strategies

### User Experience

- Smooth animations
- Loading states
- Error handling
- Intuitive navigation

### SEO Ready

- Meta tags
- Structured data
- Clean URLs
- Fast loading times

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
