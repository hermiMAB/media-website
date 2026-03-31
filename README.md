# University Email Announcement Portal ✉️

A complete web-based content approval workflow system replacing manual email processes between faculty/staff and the university media team.

---

## 🎯 What's Been Built

### Foundation & Infrastructure ✓
- **CSS Framework** - Complete design system with variables, components, layout, and responsive design
- **JavaScript Core** - Firebase integration, authentication, submissions, storage, priority calculation, utilities
- **Directory Structure** - Organized folders for assets, pages, and configuration

### Authentication Pages ✓
- **Login Page** (`auth/login.html`) - Email/password login with validation
- **Forgot Password** (`auth/forgot-password.html`) - Password reset via Firebase Auth

### User Pages (Faculty/Staff) ✓
- **Dashboard** (`user/dashboard.html`) - Welcome screen with announcement type cards and quick stats
- **New Submission** (`user/new-submission.html`) - Form to create announcements with file upload
- **My Submissions** (`user/my-submissions.html`) - List all submissions with filtering and status tracking

### Admin Pages ✓
- **Admin Dashboard** (`admin/dashboard.html`) - Overview with priority sorting and quick actions

### JavaScript Modules ✓
1. **firebase-config.js** - Firebase initialization and auth state management
2. **auth.js** - Login, register, logout, password reset, profile management
3. **guard.js** - Page protection and access control by role
4. **submissions.js** - CRUD operations for announcements
5. **storage.js** - File upload/download with progress tracking
6. **priority.js** - Priority calculation engine and sorting
7. **utils.js** - Helpers for dates, validation, DOM, local storage

### CSS Files ✓
- **variables.css** - Design tokens, colors, spacing, typography
- **global.css** - CSS reset and base typography
- **components.css** - Buttons, badges, cards, forms, alerts, modals
- **layout.css** - Navigation, sidebar, grids, tables
- **responsive.css** - Mobile-first media queries

---

## 🚀 Setup & Getting Started

### Prerequisites
- Firebase account (free tier works)
- Modern web browser
- Text editor or IDE

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "University Announcement Portal"
4. Skip analytics (or enable if you want)
5. Wait for project creation

### Step 2: Enable Firebase Services

In Firebase Console:

**Authentication:**
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**

**Firestore Database:**
1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **test mode** (you can secure later)
4. Choose region

**Storage:**
1. Go to **Cloud Storage**
2. Click **Create bucket**
3. Accept defaults

### Step 3: Configure Your App (Safe Local Setup)

1. Go to Project Settings (⚙️ icon)
2. Under "Your apps", click **Add app** → **Web**
3. Copy the config object that looks like:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "1:your-app-id:web:your-app-id"
};
```

### Step 4: Create Local Runtime Config (Do Not Commit Secrets)

1. Copy the example file:

```bash
cp assets/js/firebase-runtime-config.example.json assets/js/firebase-runtime-config.json
```

2. Open `assets/js/firebase-runtime-config.json`
3. Paste your Firebase values into that file
4. Keep using `firebase-config.js` as-is (it now loads runtime config automatically)

Important:
- `assets/js/firebase-runtime-config.json` is gitignored
- never paste real keys into tracked files
- only commit `firebase-runtime-config.example.json` with placeholder values

### Step 5: If a Key Was Exposed, Rotate It Immediately

1. Go to Google Cloud Console -> APIs & Services -> Credentials
2. Find the leaked key and **Regenerate key** (or create a new one, then disable old key)
3. Add **Application restrictions**:
   - HTTP referrers (web sites)
   - allow only your local/dev/prod domains
4. Add **API restrictions**:
   - allow only Firebase APIs your app uses
5. Check billing and API usage for unexpected traffic

### Step 6: Set Up Demo Users

Create test users in Firebase Console:

1. **Faculty User:**
   - Email: `faculty@university.edu`
   - Password: `password123`

2. **Admin User:**
   - Email: `admin@university.edu`
   - Password: `password123`

Then add these to Firestore in a `users` collection:

**Document: faculty@university.edu**
```json
{
  "name": "Dr. Faculty Member",
  "email": "faculty@university.edu",
  "department": "Engineering",
  "role": "faculty"
}
```

**Document: admin@university.edu**
```json
{
  "name": "Admin Media Team",
  "email": "admin@university.edu",
  "department": "Communications",
  "role": "admin"
}
```

---

## 📋 Pages Remaining to Build

### User Pages (Priority: HIGH)
- [ ] `user/submission-success.html` - Confirmation after submission
- [ ] `user/submission-detail.html` - View single submission with feedback
- [ ] `user/edit-submission.html` - Edit and resubmit after revision request
- [ ] `user/profile.html` - Account settings and profile management

### Admin Pages (Priority: HIGH)
- [ ] `admin/all-submissions.html` - Full list with advanced filtering
- [ ] `admin/review-submission.html` - Review form with approve/reject/feedback
- [ ] `admin/approved.html` - Log of approved announcements
- [ ] `admin/settings.html` - Manage types, users, and settings

### User Styles (Optional)
- [ ] `assets/css/user.css` - User-specific styles
- [ ] `assets/css/admin.css` - Admin-specific styles

---

## 🏗️ Project Structure

```
university-email-portal/
├── index.html
├── project.md (original requirements)
├── 
├── auth/
│   ├── login.html ✓
│   └── forgot-password.html ✓
│
├── user/ (User/Faculty Pages)
│   ├── dashboard.html ✓
│   ├── new-submission.html ✓
│   ├── my-submissions.html ✓
│   ├── submission-success.html (TODO)
│   ├── submission-detail.html (TODO)
│   ├── edit-submission.html (TODO)
│   └── profile.html (TODO)
│
├── admin/ (Admin/Media Team Pages)
│   ├── dashboard.html ✓
│   ├── all-submissions.html (TODO)
│   ├── review-submission.html (TODO)
│   ├── approved.html (TODO)
│   └── settings.html (TODO)
│
├── assets/
│   ├── css/
│   │   ├── variables.css ✓
│   │   ├── global.css ✓
│   │   ├── components.css ✓
│   │   ├── layout.css ✓
│   │   ├── responsive.css ✓
│   │   ├── user.css (TODO)
│   │   └── admin.css (TODO)
│   │
│   ├── js/
│   │   ├── firebase-config.js ✓
│   │   ├── auth.js ✓
│   │   ├── guard.js ✓
│   │   ├── submissions.js ✓
│   │   ├── storage.js ✓
│   │   ├── priority.js ✓
│   │   ├── utils.js ✓
│   │   ├── admin.js (TODO)
│   │   └── main.js (TODO)
│   │
│   ├── images/
│   │   ├── logo/
│   │   ├── icons/
│   │   └── backgrounds/
│   │
│   └── fonts/ (optional)
│
└── data/
    └── mock-submissions.json (TODO)
```

---

## Security Notes

- Firebase Web API keys are public-facing identifiers, but still must be protected with restrictions.
- Use strict Firebase Security Rules for Firestore/Storage.
- Never store service account keys or admin credentials in frontend code.
- Keep sensitive runtime config in local ignored files or secure environment configuration.

---

## 🔐 Security & Firestore Rules

**When you're ready for production**, set up these Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read their own profile
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Everyone can create submissions, but only their own
    match /submissions/{document=**} {
      allow create: if request.auth != null;
      allow read: if request.auth.uid == resource.data.submitterId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow update, delete: if request.auth.uid == resource.data.submitterId || 
                               get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 🎨 Design System

### Colors
- **Primary:** `#1e40af` (Deep Blue)
- **Success:** `#16a34a` (Green)
- **Warning:** `#f59e0b` (Amber)
- **Danger:** `#dc2626` (Red)

### Typography
- **Font Family:** System stack (-apple-system, Segoe UI, etc.)
- **Base Size:** 16px
- **Weights:** 300, 400, 500, 600, 700

### Spacing Units
- Base unit: 8px
- Scale: `--spacing-xs` (4px) to `--spacing-3xl` (64px)

---

## 🔄 Data Flow

### Submitting an Announcement
1. Faculty fills form on `new-submission.html`
2. Form calls `createSubmission()` → Firestore
3. File uploads to Firebase Storage
4. Submission created with `status: pending`
5. Redirect to success page

### Admin Reviews
1. Admin views submissions on `admin/dashboard.html`
2. Priority auto-calculated based on deadline & wait time
3. Admin clicks "Review" → `review-submission.html`
4. Can **Approve**, **Request Revision**, or **Reject**
5. Submission status updated in Firestore

### Faculty Revises
1. Faculty sees feedback on `submission-detail.html`
2. Clicks "Edit" → `edit-submission.html`
3. Updates form and resubmits
4. Status changed back to `pending`

---

## Key Functions Reference

### Authentication
```javascript
await loginUser(email, password)
await registerUser(email, password, userData)
await logoutUser()
await sendPasswordResetEmail(email)
await updateUserProfile(updates)
```

### Submissions
```javascript
await createSubmission(submissionData)
await getSubmission(submissionId)
await getAllSubmissions(filters)
await getUserSubmissions()
await updateSubmission(submissionId, updates)
await approveSubmission(submissionId)
await rejectSubmission(submissionId, reason)
await requestRevision(submissionId, feedback)
```

### Storage
```javascript
await uploadDocument(file, submissionId)
await uploadDocumentWithProgress(file, submissionId, onProgress)
await deleteDocument(fileUrl)
await downloadDocument(fileUrl, fileName)
```

### Priority
```javascript
calculatePriority(submission) // Returns {priority, score}
sortByPriority(submissions)
sortBySubmissionOrder(submissions)
getSubmissionStats()
```

### Utilities
```javascript
formatDate(dateString)
formatDateTime(dateString)
formatTimeAgo(dateString)
formatFileSize(bytes)
isValidEmail(email)
showNotification(message, type, duration)
```

---

## Testing Locally

1. **First build:** Run locally with `python -m http.server 8000` or similar
2. **Navigate:** `http://localhost:8000/auth/login.html`
3. **Login:** With demo credentials above
4. **Test submission flow**
5. **Test admin review flow**

---

## Next Steps

1. **Complete remaining pages** (8 pages left)
2. **Add CSS polish** (`user.css`, `admin.css`)
3. **Set up main.js** for global interactions
4. **Create mock data** for testing without Firebase
5. **Add email notifications** (Firebase Cloud Functions)
6. **Deploy to Firebase Hosting** (one command: `firebase deploy`)
7. **Set production security rules**
8. **Add custom domain**

---

## Deployment

### To Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init

# Deploy
firebase deploy
```

Your app will be live at `https://your-project.firebaseapp.com`

---

## Support

Refer back to `project.md` for full feature specifications. Each page has inline comments explaining the functionality.

---

## Built with
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Hosting:** Firebase Hosting (free)
- **Design:** Custom CSS system with design tokens

---

**Status:** In Progress (9/14 pages complete, 64% done)

Last updated: 2026-03-31
