# University Email Announcement Portal
## Project Overview
A web-based content approval workflow system that replaces the manual email process
between faculty/staff and the university media team. Faculty submit announcement
requests, the media team reviews and approves or sends feedback, and once approved
the announcement is sent out to all students via email.

---

## Tech Stack
- **Frontend:** Plain HTML, CSS, JavaScript
- **Authentication:** Firebase Auth (email + password)
- **Database:** Firebase Firestore (stores all submissions + feedback)
- **File Storage:** Firebase Storage (stores uploaded documents)
- **Hosting:** Firebase Hosting (free) or GitHub Pages

---

## Users
- **Faculty / Staff:** Submits announcements, tracks status, edits after feedback, resubmits
- **Admin (Media Team):** Reviews submissions, approves, rejects, or sends written feedback

---

## Announcement Types
1. General Announcement
2. Academic Notice
3. Event Invitation
4. Urgent Notice
5. Club / Activity
6. Job / Opportunity

---

## Submission Statuses
| Status | Meaning |
|---|---|
| `pending` | Submitted, waiting for admin review |
| `needs_revision` | Admin sent feedback, faculty must edit and resubmit |
| `approved` | Accepted by admin, announcement will be sent |
| `rejected` | Not accepted, with written reason from admin |

---

## Priority Sort Logic (Admin View)
Submissions are sorted by a calculated priority based on deadline urgency AND how long they have been waiting. This is the default sort on the admin dashboard.

| Priority | Condition |
|---|---|
|  Urgent | Deadline within 2 days OR waiting 5+ days |
|  High | Deadline within 4 days OR waiting 3+ days |
|  Medium | Deadline within 1 week |
| Normal | Everything else |

Admin can toggle between:
- **Priority View** (default) — sorted by urgency
- **Submission Order** — sorted by newest first

---

## Submission Data Structure (Firestore)
Each submitted form is stored as a document in the `submissions` collection:

```json
{
  "id": "SUB-001",
  "submittedBy": "Dr. Ahmed",
  "submitterEmail": "ahmed@university.edu",
  "department": "Engineering",
  "type": "Event Invitation",
  "subject": "Annual Tech Conference 2025",
  "body": "We are pleased to invite...",
  "documentUrl": "https://firebasestorage...",
  "submittedAt": "2025-03-28T09:00:00",
  "deadline": "2025-04-01T00:00:00",
  "status": "pending",
  "feedback": "",
  "priority": null
}
```

---

## Pages (14 Total)

### Auth Pages (no login required)
| # | File | Purpose |
|---|---|---|
| 1 | `auth/login.html` | Single login page for both user types |
| 2 | `auth/forgot-password.html` | Password reset via Firebase Auth |

### Faculty / User Pages
| # | File | Purpose |
|---|---|---|
| 3 | `user/dashboard.html` | Welcome screen + choose announcement type (cards) |
| 4 | `user/new-submission.html` | Form — fill details, upload document, set deadline |
| 5 | `user/submission-success.html` | Confirmation screen after submitting |
| 6 | `user/my-submissions.html` | List of all their submissions with status badges |
| 7 | `user/submission-detail.html` | View one submission + any feedback received from admin |
| 8 | `user/edit-submission.html` | Edit and resubmit after receiving feedback |
| 9 | `user/profile.html` | Account info |

### Admin / Media Team Pages
| # | File | Purpose |
|---|---|---|
| 10 | `admin/dashboard.html` | Overview — pending count, stats, recent activity |
| 11 | `admin/all-submissions.html` | Full list with priority sort + filter by status/type |
| 12 | `admin/review-submission.html` | View full submission details + approve / feedback / reject |
| 13 | `admin/approved.html` | Log of all approved announcements |
| 14 | `admin/settings.html` | Manage announcement types, admin accounts |

---

## Folder Structure

```
university-email-portal/
│
├── index.html                          ← Redirects to login
│
├── auth/
│   ├── login.html
│   └── forgot-password.html
│
├── user/
│   ├── dashboard.html
│   ├── new-submission.html
│   ├── submission-success.html
│   ├── my-submissions.html
│   ├── submission-detail.html
│   ├── edit-submission.html
│   └── profile.html
│
├── admin/
│   ├── dashboard.html
│   ├── all-submissions.html
│   ├── review-submission.html
│   ├── approved.html
│   └── settings.html
│
├── assets/
│   ├── css/
│   │   ├── variables.css               ← Colors, fonts, spacing tokens
│   │   ├── global.css                  ← Reset, body, typography
│   │   ├── components.css              ← Buttons, cards, badges, modals, forms
│   │   ├── layout.css                  ← Navbar, sidebar, footer, grid
│   │   ├── user.css                    ← User-specific styles
│   │   ├── admin.css                   ← Admin-specific styles
│   │   └── responsive.css              ← All media queries
│   │
│   ├── js/
│   │   ├── firebase-config.js          ← Firebase project credentials + init
│   │   ├── auth.js                     ← Login, logout, register via Firebase Auth
│   │   ├── guard.js                    ← Page protection — checks role on every page
│   │   ├── submissions.js              ← Create, read, update submissions in Firestore
│   │   ├── storage.js                  ← Upload/download documents via Firebase Storage
│   │   ├── priority.js                 ← Priority score calculator + sort function
│   │   ├── admin.js                    ← Admin-only logic (approve, reject, feedback)
│   │   ├── main.js                     ← Global UI interactions
│   │   └── utils.js                    ← Shared helper functions (dates, formatting)
│   │
│   ├── images/
│   │   ├── logo/
│   │   ├── icons/
│   │   └── backgrounds/
│   │
│   └── fonts/                          ← Self-hosted fonts (optional)
│
├── data/
│   └── mock-submissions.json           ← Fake data for UI testing before Firebase
│
└── PROJECT-NOTES.md                    ← This file
```

---

## Firebase Integration Plan

### Files That Connect to Firebase
| File | What it does |
|---|---|
| `firebase-config.js` | Initializes Firebase app with your project credentials |
| `auth.js` | Uses `Firebase Auth` for login, logout, password reset, session |
| `guard.js` | Reads user role from Firestore to protect pages |
| `submissions.js` | Reads/writes to `submissions` collection in Firestore |
| `storage.js` | Uploads documents to Firebase Storage, returns download URL |

### Firestore Collections
```
/submissions          ← All submitted forms
/users                ← User profiles + roles (admin or faculty)
```

### User Role Logic (Firestore)
When a user logs in via Firebase Auth, `guard.js` reads their role from Firestore:
```
/users/{uid} → { name, email, department, role: "admin" | "faculty" }
```
- Role = `"admin"` → redirect to `/admin/dashboard.html`
- Role = `"faculty"` → redirect to `/user/dashboard.html`
- No session → redirect to `/auth/login.html`

---

## Session Build Order (One Chat Per Session)

| Session | What to Build |
|---|---|
| 1 | Folder setup + `variables.css` + `global.css` + `components.css` |
| 2 | `auth/login.html` + `auth.js` + `firebase-config.js` |
| 3 | `user/dashboard.html` (announcement type cards) |
| 4 | `user/new-submission.html` (form + file upload + deadline field) |
| 5 | `user/submission-success.html` + `user/my-submissions.html` |
| 6 | `user/submission-detail.html` + `user/edit-submission.html` |
| 7 | `admin/dashboard.html` (stats + overview) |
| 8 | `admin/all-submissions.html` (priority sort + toggle view) |
| 9 | `admin/review-submission.html` (approve / feedback / reject) |
| 10 | `admin/approved.html` + `admin/settings.html` + `user/profile.html` |
| 11 | `guard.js` + `priority.js` + `submissions.js` + `storage.js` |
| 12 | Full connect to Firebase — test all flows end to end |

---

## Context Prompt (Paste at Start of Every New Chat)

```
I'm building a University Email Announcement Portal in plain HTML, CSS, and JavaScript
with Firebase (Auth, Firestore, Storage) as the backend.

Two users:
- Faculty: submits announcements, tracks status, edits after feedback
- Admin (Media Team): reviews, approves, sends feedback, rejects

14 pages total across auth/, user/, and admin/ folders.
Submissions are sorted by priority (deadline urgency + wait time combined).
Firebase handles login, data storage, and file uploads.

Today I need help building: [PAGE NAME HERE]
```

---

## Key Design Decisions
- **Deadline field** is required on every submission so admin can prioritize
- **Priority is calculated live** from deadline + wait time — never manually set
- **Feedback is written text** from admin, not just approve/reject
- **Draft status** can be added later — for now forms are submitted immediately
- **Notification banner** on user dashboard when feedback arrives
- Admin has two views: Priority View (default) and Submission Order