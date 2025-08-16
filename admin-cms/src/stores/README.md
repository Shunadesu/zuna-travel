# Zustand Stores for Admin CMS

## Overview

This directory contains Zustand stores for managing API state and caching in the Admin CMS. The stores provide:

- **Caching**: Automatic caching with configurable expiry time (default: 5 minutes)
- **Loading States**: Centralized loading state management
- **Error Handling**: Consistent error handling across components
- **Optimistic Updates**: Immediate UI updates with automatic rollback on errors

## Available Stores

### 1. CategoryStore (`categoryStore.js`)

Manages categories data with the following features:

- `fetchCategories(forceRefresh?)`: Fetch all categories with caching
- `fetchCategory(id)`: Fetch single category
- `createCategory(data)`: Create new category
- `updateCategory(id, data)`: Update existing category
- `deleteCategory(id)`: Delete category
- `clearCache()`: Clear cached data
- `reset()`: Reset store to initial state

### 2. ProductStore (`productStore.js`)

Manages products data with similar features to CategoryStore plus:

- `fetchFeaturedProducts(limit)`: Fetch featured products

### 3. BlogStore (`blogStore.js`)

Manages blogs data with similar features to CategoryStore plus:

- `fetchFeaturedBlogs(limit)`: Fetch featured blogs

### 4. DashboardStore (`dashboardStore.js`)

Manages dashboard data and statistics:

- `fetchDashboardData(forceRefresh?)`: Fetch all dashboard data with caching
- `stats`: Object containing total counts for categories, products, blogs, users
- `recentActivities`: Array of recent activities generated from data
- `featuredProducts`: Array of featured products
- `featuredBlogs`: Array of featured blogs

### 5. SettingsStore (`settingsStore.js`)

Manages website settings and configuration:

- `fetchSettings(forceRefresh?)`: Fetch all settings with caching
- `updateSettings(data)`: Update settings
- `resetSettings()`: Reset settings to defaults
- `fetchSettingGroup(group)`: Fetch specific setting group
- `settings`: Object containing all website settings

## Usage Examples

### Basic Usage in Component

```jsx
import useCategoryStore from "../stores/categoryStore";

const CategoriesPage = () => {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    deleteCategory,
    clearError,
  } = useCategoryStore();

  useEffect(() => {
    fetchCategories(); // Uses cache if available
  }, [fetchCategories]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchCategories} />;

  return (
    <div>
      {categories.map((category) => (
        <div key={category._id}>{category.name.en}</div>
      ))}
    </div>
  );
};
```

### Force Refresh

```jsx
const handleRefresh = () => {
  fetchCategories(true); // Force refresh, bypass cache
};
```

### Form Submission

```jsx
const CategoryForm = () => {
  const { createCategory, updateCategory } = useCategoryStore();

  const handleSubmit = async (formData) => {
    try {
      if (isEditing) {
        await updateCategory(id, formData);
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData);
        toast.success("Category created successfully");
      }
      navigate("/admin/categories");
    } catch (error) {
      toast.error("Failed to save category");
    }
  };
};
```

### Dashboard Usage

```jsx
const DashboardPage = () => {
  const {
    stats,
    recentActivities,
    featuredProducts,
    featuredBlogs,
    loading,
    error,
    fetchDashboardData,
    clearError,
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchDashboardData} />;

  return (
    <div>
      <div className="stats-grid">
        <StatCard name="Categories" value={stats.totalCategories} />
        <StatCard name="Products" value={stats.totalProducts} />
        <StatCard name="Blogs" value={stats.totalBlogs} />
        <StatCard name="Users" value={stats.totalUsers} />
      </div>

      <div className="activities">
        {recentActivities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};
```

## Cache Management

### Cache Expiry

- Default cache expiry: 5 minutes
- Cache is automatically invalidated when data is updated/deleted
- Manual cache clearing available via `clearCache()`

### Cache Strategy

- **Read**: Returns cached data if available and not expired
- **Write**: Updates cache immediately after successful API call
- **Delete**: Removes item from cache immediately
- **Error**: Cache remains unchanged on error

## Error Handling

All stores provide consistent error handling:

- Errors are stored in the `error` state
- Errors are automatically cleared when new actions are performed
- Components can listen to error state and display appropriate messages

## Best Practices

1. **Always handle loading states**: Check `loading` before rendering data
2. **Handle errors gracefully**: Use error state to show user-friendly messages
3. **Use cache effectively**: Don't force refresh unless necessary
4. **Clear errors**: Call `clearError()` after displaying error messages
5. **Reset on logout**: Call `reset()` when user logs out to clear sensitive data

## Performance Benefits

- **Reduced API calls**: Caching prevents unnecessary requests
- **Faster UI updates**: Optimistic updates provide immediate feedback
- **Better UX**: Loading and error states improve user experience
- **Consistent state**: Centralized state management prevents inconsistencies
