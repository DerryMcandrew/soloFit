# Product Requirements Document: SoloFit: Level Up Your Life (Supabase Edition)

**Version:** 1.3 (Supabase Backend)
**Date:** 2025-03-28
**Author:** AI Assistant (based on user request)

---

## 1. Introduction & Goals

### 1.1 Purpose

SoloFit motivates sedentary individuals, especially anime/gaming fans and those new to fitness, to build and stick to an exercise routine using fun, game-like mechanics inspired by leveling-up stories. It is designed as a Progressive Web App (PWA) powered by **Supabase** for the backend.

### 1.2 Goals

- Increase user physical activity levels from baseline.
- Achieve high user engagement rates (daily/weekly active users).
- Foster long-term retention through compelling progression and community.
- Offer a simple starting point for fitness beginners.
- Create a distinct brand identity in the fitness app market.
- Build a sustainable business through optional premium features, leveraging Supabase for data and auth.

### 1.3 Success Metrics

- Daily Active Users (DAU) / Monthly Active Users (MAU) tracked via analytics.
- Average time spent in app per session.
- Percentage of users completing Daily Quests (tracked in Supabase DB).
- User retention rate (Day 1, 7, 30) based on Supabase Auth user activity.
- Rate of users upgrading to Premium (tracked via user profile data in DB).
- User feedback/surveys on activity increase.
- PWA "Add to Home Screen" installation rate.
- Supabase query performance and API response times.

---

## 2. Target Audience

### 2.1 Primary

- Individuals seeking self-improvement and structure (including NEETs).
- Fans of anime, manga (action/leveling genres), and RPGs.
- Fitness beginners or those restarting after a break.
- Typically aged 16-35.

### 2.2 Secondary

- Gamers wanting RPG elements in their fitness tracker.
- Users seeking a more motivating fitness app alternative.
- Users preferring web-based apps and comfortable with cloud-synced data.

### 2.3 Key Traits

Comfortable with tech/web, motivated by clear goals & rewards, may appreciate online community, potentially budget-aware, often need help starting/maintaining routines.

---

## 3. Assumptions & Constraints

### 3.1 Assumptions

- Users have a device with a modern web browser supporting core PWA features.
- Users have internet access for initial load, auth, and real-time data sync via Supabase.
- Users grasp basic game concepts like XP and levels.

### 3.2 Constraints

- Frontend: Built as a **Progressive Web App (PWA)** using **React and TypeScript**.
- Backend: Utilizes **Supabase** as the Backend-as-a-Service (BaaS).
  - **Database:** Supabase PostgreSQL for all application data (users, quests, progress, logs, etc.).
  - **Authentication:** Supabase Auth for user sign-up, login (Email/Pass, OAuth via Google/Apple supported by Supabase), and session management.
  - **Realtime:** Leverage Supabase Realtime Subscriptions for features needing immediate updates (e.g., leaderboards, potentially live feedback during workouts if designed).
  - **Serverless Functions:** Supabase Edge Functions (Deno-based TypeScript) for complex backend logic, secure operations, or triggering external services (e.g., push notifications).
  - **Storage:** Supabase Storage for user-uploaded content (e.g., avatar images) or potentially exercise media assets.
- Initial focus: Bodyweight exercises & basic cardio, tracked primarily when the app is **active in the foreground**.
- Must follow data privacy laws (like GDPR).
- **PWA Limitations:** Retains limitations on native background activity tracking and direct health platform integration (Apple Health/Google Fit).
- **Reliance on Supabase:** App functionality and scalability depend on Supabase services and plan limits. Development requires understanding Supabase concepts (Postgres, RLS, Edge Functions).
- Initial development constrained by budget/time.

---

## 4. Features

### 4.1 Getting Started

- **FR-001:** Easy sign-up/login via **Supabase Auth** (Email/Password, plus Google/Apple OAuth configured through Supabase).
- **FR-002:** Quick, themed intro to the "Level Up" concept.
- **FR-003:** Optional brief activity survey (results stored in user profile in Supabase DB).
- **FR-004:** Basic anime-style avatar selection (default options; custom uploads could use Supabase Storage).
- **FR-005:** Clear requests for needed browser permissions (Notifications, potentially Geolocation).

### 4.2 The Core Game Loop

- **FR-010:** **Daily Quests:** Logic for assigning daily quests might reside in **Supabase Edge Functions** triggered daily, or be generated client-side based on user level/data fetched from Supabase DB. Quest data stored in Postgres.
- **FR-011:** **XP & Leveling:** Quest completion updates user XP/Level in the Supabase **PostgreSQL** database. Use transactions for atomic updates.
- **FR-012 (Revised):** **Level-Based Progression & Unlocks:** Rules for level unlocks defined either client-side (reading user level from DB) or via Edge Function logic. Unlocked status potentially stored in user profile data. Rewards may include:
  - Access to new exercises (data in Postgres, client filters based on level).
  - Minor boosts (flags/data in user profile).
  - Exclusive cosmetic items (pointers/flags in user profile; assets potentially in Supabase Storage).
  - New Achievements/Titles (stored in an 'achievements' table linked to user).
- **FR-014:** **Workout Tracking:** Client-side interface; workout results (reps, duration, completion status) saved to a 'workout_logs' table in Supabase DB. Use **Supabase Realtime** for immediate feedback if desired (e.g., progress bar updates).
- **FR-015:** **Exercise Library:** Exercise details stored in Supabase DB. Text/media potentially fetched from DB or Supabase Storage, cached client-side via Service Worker.
- **FR-016:** **Streaks:** Streak counter stored in user profile (Supabase DB), updated upon daily quest completion (potentially via Edge Function or client-side logic secured by RLS).
- **FR-017:** **Penalty:** Logic for streak reset/XP setback handled client-side upon checking quest status from DB, or via a scheduled/triggered Edge Function.
- **FR-018:** **Achievements/Titles:** Data stored in relevant tables in Supabase DB, linked to the user ID. Query efficiently using indexes.

### 4.3 Progress & Personalization

- **FR-020:** **Adaptive Difficulty:** Logic resides client-side (based on fetched data) or in Edge Functions to determine appropriate quest parameters based on user data in Supabase DB.
- **FR-021:** **Workout Log:** All logs stored in Supabase DB, fetched and displayed client-side. Implement pagination for history view.
- **FR-022:** **Progress Overview:** Charts generated client-side based on aggregated data queried from Supabase DB. Optimize queries.
- **FR-023 (Premium):** **Custom Goals:** Custom routines/goals stored in Supabase DB, associated with the user. Logic requires checking premium status (see MON-002).

### 4.4 Social & Community (Optional Participation)

- **FR-030:** **User Profile:** Data fetched from the 'profiles' table (or similar) in Supabase DB. **Crucially dependent on correct Row Level Security (RLS) policies** to control visibility.
- **FR-031:** **Leaderboards:** Can be implemented using Postgres Views or Functions for efficient ranking queries. **Supabase Realtime** ideal for live leaderboard updates. RLS ensures users can opt-out.
- **FR-032:** **Friends:** 'Friendships' table in Supabase DB (e.g., user_id, friend_id, status). Requires careful RLS setup for privacy.
- **FR-034 (Future):** Activity Feed potentially built using Realtime subscriptions on relevant table changes (e.g., level ups, achievements earned), filtered by friendship status.

### 4.5 Account & Settings

- **FR-040:** Account management leverages **Supabase Auth** functionalities (update email/password). User profile data updated directly in Supabase DB.
- **FR-041:** **Notification Preferences:** User preference stored in Supabase DB. Push Notifications implementation requires:
  - Frontend registration using Browser Push API.
  - Storing subscription object securely (e.g., associated with user in DB).
  - **Supabase Edge Function** triggered by events (e.g., quest reminder time) to call an **external push notification service** (like OneSignal, Pushwoosh, FCM via API key etc.) with the stored subscription details. **Supabase itself does not provide push message delivery.**
- **FR-042:** Privacy controls (flags in user profile in Supabase DB) enforced using **Row Level Security (RLS)** policies.
- **FR-043:** Data sync across devices is handled inherently by fetching/subscribing to data from Supabase.
- **FR-044:** Access to Help, Support, Legal info (can be static content or links).
- **FR-045 (PWA Revised):** **Health Platform Data (Manual / Limited):** No change due to PWA; data export (if implemented) would query Supabase DB and generate file client-side.

---

## 5. Design & User Experience (UX)

_(Largely unchanged from v1.2 - Focus remains on frontend)_

- **DUX-001:** Clean, anime-inspired visual style. Responsive across devices.
- **DUX-002:** "Leveling up" theme integrated into UI elements.
- **DUX-003:** Simple, intuitive PWA navigation.
- **DUX-004:** Positive feedback; leverage **Supabase Realtime** for immediate visual confirmation where appropriate.
- **DUX-005:** Accessible design.
- **DUX-006:** Fast, smooth frontend performance; optimize Supabase queries.

---

## 6. Monetization (Freemium Model)

### 6.1 Free Tier

- Core features usable, backed by Supabase. Potential limits based on Supabase free tier usage (e.g., data storage, function executions) need monitoring.
- May include unobtrusive ads.

### 6.2 Premium Tier (Subscription - e.g., "SoloFit PRO")

- Requires integration with a payment provider (e.g., Stripe).
- **Supabase Edge Functions** needed to securely handle payment webhook events (e.g., `checkout.session.completed`) to update user's subscription status/role in the Supabase DB.
- Premium status/role stored in user profile or a dedicated 'subscriptions' table in Supabase DB.
- Frontend logic and **Supabase Row Level Security (RLS) / Database Functions** check this status to unlock premium features (`FR-023`, expanded library access, ad removal, etc.).

### 6.3 Fair Play

Premium enhances experience but doesn't buy core fitness advantages.

---

## 7. Non-Functional Requirements

- **NFR-001:** **Performance:** Optimize frontend rendering and **Supabase database queries** (use indexes, efficient query patterns). Monitor Edge Function execution times. PWA Lighthouse scores are key.
- **NFR-002:** **Scalability:** Relies on **Supabase's managed infrastructure scaling**. Choose appropriate Supabase plan based on expected load. Monitor resource usage within Supabase dashboard.
- **NFR-003:** **Reliability:** High availability relies on **Supabase uptime/SLA**. Supabase handles database backups. Implement graceful error handling in frontend for API/network issues.
- **NFR-004 (Supabase Revised):** **Security:**
  - Utilize **Supabase Auth** securely (JWT handling).
  - Implement strict **Row Level Security (RLS)** policies on **all** relevant PostgreSQL tables to prevent unauthorized data access. This is CRITICAL.
  - Securely manage Supabase API keys (use `anon` key safely on client, `service_role` key ONLY in secure backend environments like Edge Functions).
  - Protect Edge Functions (e.g., validate inputs, check auth context).
  - Use HTTPS (handled by Supabase).
- **NFR-005 (PWA Revised):** **Platform Compatibility:** PWA compatibility on modern browsers.
- **NFR-006 (PWA Revised):** **Offline Capability:** Implement robust client-side caching using **Service Workers**. Supabase SDK does **not** provide automatic offline data synchronization like Firestore; **manual sync logic** is required on reconnection (queueing mutations, re-fetching data).
- **NFR-007 (New - PWA):** **Installability:** Provide Web App Manifest for PWA installation.

---

## 8. Future Considerations (Post-MVP / V2.0+)

- Leverage **Supabase Realtime** more extensively for collaborative features.
- Explore **Supabase Storage** for more user-generated content.
- Utilize **Postgres extensions** within Supabase (e.g., `pgvector` for potential future AI/recommendation features) via Edge Functions.
- Integrate more third-party services via **Supabase Edge Functions**.
- Implement robust monitoring and alerting using Supabase logs and external tools.
