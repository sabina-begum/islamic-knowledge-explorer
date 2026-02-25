# Firebase Setup Guide for Islamic Dataset Interface

This guide will help you set up Firebase/Firestore for your Islamic Dataset Interface application to make it fully featured with real-time data, authentication, and advanced search capabilities.

## 🚀 Quick Start

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `islamic-dataset-interface`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firebase Services

#### Authentication

1. Go to Authentication > Sign-in method
2. Enable Email/Password authentication
3. Add authorized domains for your deployment

#### Firestore Database

1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location close to your users

#### Storage (Optional)

1. Go to Storage
2. Click "Get started"
3. Choose "Start in test mode"

### 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" > Web
4. Register app with name: "Islamic Dataset Interface"
5. Copy the configuration object

### 4. Environment Variables Setup

Create a `.env.local` file in your project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_REAL_TIME_UPDATES=true
VITE_ENABLE_SEARCH_SUGGESTIONS=true
```

### 5. Deploy Firestore Security Rules

1. Install Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Login to Firebase:

```bash
firebase login
```

3. Initialize Firebase in your project:

```bash
firebase init firestore
```

4. Deploy security rules:

```bash
firebase deploy --only firestore:rules
```

## 📊 Database Structure

### Collections

#### `islamic_data`

- **Purpose**: Store Islamic prophecies and scientific discoveries
- **Access**: Public read, Admin write
- **Fields**:
  - `title` (string, required)
  - `type` (string, required)
  - `description` (string)
  - `notes` (string)
  - `fulfillmentStatus` (string)
  - `yearRevealed` (number)
  - `yearFulfilled` (number)
  - `prophecyCategory` (string)
  - `sources` (object)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)

#### `quran`

- **Purpose**: Store Quran verses with translations
- **Access**: Public read, Admin write
- **Fields**:
  - `surah_no` (number, required)
  - `surah_name_en` (string, required)
  - `surah_name_ar` (string)
  - `ayah_no_surah` (number, required)
  - `ayah_en` (string)
  - `ayah_ar` (string)
  - `place_of_revelation` (string)

#### `hadith`

- **Purpose**: Store Hadith collections
- **Access**: Public read, Admin write
- **Fields**:
  - `number` (string, required)
  - `book` (string)
  - `chapter` (string)
  - `text` (string, required)
  - `translation` (string)
  - `narrator` (string)
  - `grade` (string)
  - `createdAt` (timestamp)

#### `users`

- **Purpose**: Store user profiles
- **Access**: User can read/write own profile
- **Fields**:
  - `uid` (string, required)
  - `email` (string, required)
  - `displayName` (string)
  - `photoURL` (string)
  - `preferences` (object)
  - `favorites` (array)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)
  - `lastActive` (timestamp)

#### `favorites`

- **Purpose**: Store user favorites
- **Access**: User can read/write own favorites
- **Fields**:
  - `userId` (string, required)
  - `itemId` (string, required)
  - `itemType` (string, required)
  - `createdAt` (timestamp)

#### `search_history`

- **Purpose**: Store user search history
- **Access**: User can read/write own history
- **Fields**:
  - `userId` (string, required)
  - `searchQuery` (string, required)
  - `filters` (object)
  - `timestamp` (timestamp)

#### `analytics`

- **Purpose**: Store user activity analytics
- **Access**: Authenticated users can create, Admin can read
- **Fields**:
  - `userId` (string, required)
  - `activity` (string, required)
  - `metadata` (object)
  - `timestamp` (timestamp)

## 🔐 Security Rules

The security rules are configured in `firestore.rules` and provide:

- **Public read access** to Islamic data, Quran, and Hadith
- **Admin-only write access** to Islamic data, Quran, and Hadith
- **User-specific access** to profiles, favorites, and search history
- **Data validation** for all write operations
- **Rate limiting** to prevent abuse

## 🚀 Data Migration

### Automatic Migration

The app includes a data migration service that can automatically populate Firestore with your existing data:

```typescript
import { dataMigrationService } from "./src/firebase/migration";

// Check if migration is needed
const status = await dataMigrationService.checkMigrationStatus();

if (status.needsMigration) {
  // Perform migration with progress tracking
  const result = await dataMigrationService.performFullMigration(
    islamicData,
    quranData,
    hadithData,
    (progress) => {
      console.log(`${progress.step}: ${progress.percentage}%`);
    }
  );
}
```

### Manual Migration

If you prefer to migrate data manually:

1. **Export your existing data** to JSON format
2. **Use Firebase Console** to import data
3. **Or use Firebase Admin SDK** for programmatic import

## 🔍 Search Features

The Firebase integration provides advanced search capabilities:

### Unified Search

- Search across all data types (Islamic data, Quran, Hadith)
- Relevance scoring based on term frequency and position
- Real-time search suggestions

### Advanced Filtering

- Filter by data type, category, fulfillment status
- Date range filtering
- Source-specific filters (Surah, Hadith number, etc.)

### Search Analytics

- Track popular searches
- Store user search history
- Provide personalized recommendations

## 👥 Authentication Features

### User Management

- Email/password authentication
- User profile management
- Email verification
- Password reset functionality

### User Preferences

- Dark/light theme preference
- Language settings
- Font size preferences
- Accessibility settings

### Favorites System

- Add/remove favorites
- Real-time favorites sync
- Cross-device favorites

## 📈 Analytics & Monitoring

### User Analytics

- Track user activity
- Monitor search patterns
- Analyze popular content
- Performance metrics

### Error Tracking

- Automatic error reporting
- Performance monitoring
- User behavior analytics

## 🔧 Development Setup

### Local Development

1. **Install dependencies**:

```bash
npm install
```

2. **Set up environment variables**:

```bash
cp .env.example .env.local
# Edit .env.local with your Firebase config
```

3. **Start development server**:

```bash
npm run dev
```

### Testing Firebase Integration

1. **Test authentication**:

```typescript
import { useFirebase } from "./src/contexts/FirebaseContext";

const { signIn, signUp, currentUser } = useFirebase();
```

2. **Test data loading**:

```typescript
const { loadIslamicData, islamicData } = useFirebase();
await loadIslamicData();
```

3. **Test search**:

```typescript
const { performSearch, searchResults } = useFirebase();
await performSearch("prophecy", filters);
```

## 🚀 Deployment

### Netlify Deployment

1. **Set environment variables** in Netlify dashboard
2. **Deploy your app**:

```bash
npm run build
```

3. **Configure Firebase hosting** (optional):

```bash
firebase init hosting
firebase deploy
```

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## 🔒 Security Best Practices

### Authentication

- Enable email verification
- Implement password strength requirements
- Set up authorized domains

### Database Security

- Use security rules to control access
- Validate data on both client and server
- Implement rate limiting

### Data Protection

- Encrypt sensitive data
- Implement proper backup strategies
- Monitor for suspicious activity

## 📊 Monitoring & Maintenance

### Firebase Console

- Monitor usage and performance
- View error logs
- Manage users and data

### Analytics Dashboard

- Track user engagement
- Monitor search performance
- Analyze content popularity

### Regular Maintenance

- Review and update security rules
- Monitor database performance
- Backup data regularly
- Update dependencies

## 🆘 Troubleshooting

### Common Issues

1. **Firebase not initialized**:

   - Check environment variables
   - Verify Firebase project configuration

2. **Authentication errors**:

   - Check authorized domains
   - Verify email/password authentication is enabled

3. **Permission denied**:

   - Check Firestore security rules
   - Verify user authentication status

4. **Data not loading**:
   - Check network connectivity
   - Verify collection names and structure
   - Check security rules

### Debug Mode

Enable debug logging by setting:

```env
VITE_ENABLE_DEBUG_LOGGING=true
```

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)

## 🤝 Support

For issues or questions:

- Check the troubleshooting section above
- Review Firebase console logs
- Contact: begumsabina81193@gmail.com

---

**Note**: This setup provides a complete Firebase integration for your Islamic Dataset Interface. The system is designed to be scalable, secure, and user-friendly while maintaining the integrity of Islamic content.
