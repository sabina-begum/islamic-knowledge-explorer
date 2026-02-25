# User Management System Guide

## Overview

This guide covers the complete implementation of user management using Firebase Authentication and Firestore for the Islamic Dataset Interface app.

## Architecture

### Components

- **Firebase Authentication**: Handles user sign-up, sign-in, and session management
- **Firestore Database**: Stores user profiles, preferences, favorites, and activity
- **React Context**: Provides authentication state throughout the app
- **User Components**: Profile management, dashboard, and authentication forms

## Database Structure

### Collections

#### `users`

```typescript
{
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  lastActive: Date;
  preferences: {
    darkMode: boolean;
    language: "en" | "ar" | "ur";
    fontSize: "small" | "medium" | "large";
    highContrast: boolean;
    reducedMotion: boolean;
  };
}
```

#### `favorites`

```typescript
{
  userId: string;
  itemId: string;
  itemType: "islamic" | "quran" | "hadith";
  addedAt: Date;
}
```

#### `search_history`

```typescript
{
  userId: string;
  searchQuery: string;
  filters: FilterState;
  timestamp: Date;
}
```

#### `analytics`

```typescript
{
  userId: string;
  activity: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}
```

## Implementation Steps

### 1. Firebase Setup ✅

- [x] Firebase project configuration
- [x] Environment variables setup
- [x] Firestore security rules
- [x] Authentication service initialization

### 2. Authentication Services ✅

- [x] AuthService singleton class
- [x] User registration with email/password
- [x] User login/logout functionality
- [x] Password reset capability
- [x] Email verification
- [x] Profile updates

### 3. Firestore Services ✅

- [x] FirestoreService singleton class
- [x] User profile CRUD operations
- [x] User preferences management
- [x] Favorites management
- [x] Search history tracking
- [x] User activity analytics

### 4. React Context ✅

- [x] FirebaseContext for global state
- [x] AuthContext for authentication state
- [x] User role and permission management
- [x] Real-time listeners for data updates

### 5. User Interface Components ✅

- [x] UserProfile component for profile management
- [x] UserDashboard component for overview
- [x] LoginForm component with validation
- [x] SignupForm component with password requirements
- [x] Navigation integration

### 6. Routing and Navigation ✅

- [x] Login page route (`/login`)
- [x] Profile page route (`/profile`)
- [x] Navigation updates with user state
- [x] Protected route handling

## Usage Examples

### User Registration

```typescript
import { authService } from "../firebase/auth";

// Register a new user
const user = await authService.signUp(
  "user@example.com",
  "password123",
  "Display Name"
);
```

### User Login

```typescript
import { authService } from "../firebase/auth";

// Sign in existing user
const user = await authService.signIn("user@example.com", "password123");
```

### Profile Management

```typescript
import { firestoreService } from "../firebase/firestore";

// Update user profile
await firestoreService.updateUserProfile(userId, {
  displayName: "New Name",
  lastActive: new Date(),
});

// Update preferences
await firestoreService.updateUserPreferences(userId, {
  darkMode: true,
  language: "en",
  fontSize: "large",
});
```

### Favorites Management

```typescript
import { firestoreService } from "../firebase/firestore";

// Add to favorites
await firestoreService.addToFavorites(userId, "item-id", "islamic");

// Remove from favorites
await firestoreService.removeFromFavorites(userId, "item-id");

// Get user favorites
const favorites = await firestoreService.getUserFavorites(userId);
```

### Activity Tracking

```typescript
import { firestoreService } from "../firebase/firestore";

// Track user activity
await firestoreService.trackUserActivity(userId, "search_performed", {
  query: "prophecy",
  results: 25,
});

// Get analytics
const analytics = await firestoreService.getAnalytics(userId);
```

## Security Rules

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Favorites are user-specific
    match /favorites/{docId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    // Search history is user-specific
    match /search_history/{docId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    // Analytics are user-specific
    match /analytics/{docId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## Testing

### Manual Testing

1. **User Registration**: Visit `/login` and create a new account
2. **User Login**: Sign in with existing credentials
3. **Profile Management**: Visit `/profile` and update preferences
4. **Favorites**: Add/remove items from favorites
5. **Search History**: Perform searches and check history
6. **Logout**: Sign out and verify session termination

### Automated Testing

```typescript
// Run in browser console during development
await testFirestoreUserManagement();
```

## Error Handling

### Common Errors

- **Authentication Errors**: Invalid credentials, email not found
- **Network Errors**: Connection issues, timeout
- **Permission Errors**: Unauthorized access attempts
- **Validation Errors**: Invalid email format, weak password

### Error Recovery

- Automatic retry for network issues
- User-friendly error messages
- Graceful fallback to local storage
- Session persistence across page reloads

## Performance Optimization

### Best Practices

- **Lazy Loading**: Components loaded on demand
- **Pagination**: Large datasets loaded in chunks
- **Caching**: Frequently accessed data cached locally
- **Real-time Updates**: Efficient listeners for live data
- **Offline Support**: Local storage for offline functionality

### Monitoring

- User activity tracking
- Performance metrics
- Error logging
- Usage analytics

## Deployment

### Environment Variables

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Build and Deploy

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

## Troubleshooting

### Common Issues

#### Firebase Not Initialized

- Check environment variables
- Verify Firebase project configuration
- Ensure Firebase services are enabled

#### Authentication Errors

- Verify email/password format
- Check Firebase Auth settings
- Ensure email verification is configured

#### Firestore Permission Denied

- Review security rules
- Check user authentication state
- Verify collection/document paths

#### Performance Issues

- Implement pagination for large datasets
- Use efficient queries with indexes
- Optimize real-time listeners

## Future Enhancements

### Planned Features

- [ ] Social authentication (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Advanced user roles and permissions
- [ ] User data export/import
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] User feedback system

### Technical Improvements

- [ ] Offline-first architecture
- [ ] Advanced caching strategies
- [ ] Performance monitoring
- [ ] Automated testing suite
- [ ] CI/CD pipeline
- [ ] Security audit tools

## Support

For technical support or questions about the user management system:

- Check the Firebase documentation
- Review the security rules
- Test with the provided utilities
- Contact the development team

---

_Last updated: December 2024_
