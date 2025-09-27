# CBlog

A blog platform for CSE students, built with **Next.js**, **shadcn/ui**, **TailwindCSS** and **MongoDB**.  
The platform allows students to write articles, share them with peers and maintain a controlled student-only environment.

---

## Tech Stack
- **Frontend**: Next.js (App Router), shadcn/ui, TailwindCSS
- **Backend**: Next.js API routes
- **Database**: MongoDB (Atlas)
- **Auth**: NextAuth.js (JWT/session-based)
- **Storage**: LocalStorage (for bookmarks, MVP)
- **Sharing**: Open Graph meta tags, QR codes

---

## Roles
- **Admin (max 2)**
  - Full access: manage moderators, site-wide settings, analytics
- **Moderator (max 10)**
  - Approve/reject account requests
  - Review flagged content
  - Approve first-time posts from new users
- **User (students)**
  - Request account
  - Write & publish articles (after approval)
  - Bookmark (localStorage MVP), like, comment (optional)

---

## Account Flow
1. Student fills out **account request form** (name, roll number, email, batch).
2. Request stored in `Requests` collection with `status = pending`.
3. Moderator/Admin reviews request:
   - Approve → create account in `Users` collection + send email with login details.
   - Reject → mark rejected, notify student.
4. User logs in → always lands on `/profile`.

---

## Writing & Publishing
- **Editor**: TipTap (HTML + JSON storage)
- New users → first articles go into moderator review.
- Trusted users → articles auto-publish.
- Articles organized by **categories** and **tags**.

---

## Searching & Organization
- **Categories**: fixed set (Career, Research, Tutorials, Events, Fun, etc.)
- **Tags**: free-form, user-defined
- **Search**: MongoDB text index on `title`, `summary`, and `bodyText`
- Filters: by tag, category, author, date

---

## Views & Leaderboards
- View counting:
  - Basic MVP: increment counter on load (dedupe with localStorage)
  - Future: Redis for unique views/session-based tracking
- Leaderboards:
  - Trending articles (7 days)
  - Top authors (total views across articles)

---

## Bookmarks
- **MVP**: LocalStorage (`bookmarks[]`)
- **Future**: Sync to server for cross-device support

---

## Sharing
- **Open Graph meta tags** for articles → rich previews on social media
- **QR Codes** for:
  - Each article
  - Each user profile
- Implemented via client-side QR generator (`qrcode.react`)

