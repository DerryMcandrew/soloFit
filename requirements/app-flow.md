# SoloFit: Level Up Your Life - App Flow Document (PWA with Supabase)

**Version:** 1.0
**Date:** 2025-03-28

## 1. Introduction

This document describes the key user flows within the SoloFit PWA. It outlines how users navigate the application, interact with core features, and how the frontend (React/TypeScript) communicates with the Supabase backend (Auth, Database, Edge Functions, Realtime) for data persistence, authentication, and core logic.

## 2. Conventions

- **(UI):** Represents user interaction with the Frontend Interface.
- **(Supabase Auth):** Interaction with Supabase Authentication service.
- **(Supabase DB):** Interaction with Supabase PostgreSQL database (fetching or writing data, secured by RLS).
- **(Supabase Edge Function):** Execution of serverless backend logic.
- **(Supabase Realtime):** Data synchronization using Supabase Realtime subscriptions.
- **(Browser API):** Interaction with browser capabilities (Push Notifications, Geolocation, Local Storage, Service Worker).

## 3. Key User Flows

### 3.1. First-Time User Onboarding & Sign Up

1.  **(UI)** User visits the SoloFit PWA URL.
2.  **(UI)** PWA loads initial shell (cached via Service Worker if previously visited).
3.  **(UI)** Displays Welcome/Landing screen with options: "Sign Up" or "Log In".
4.  **(UI)** User clicks "Sign Up".
5.  **(UI)** Presents sign-up options: Email/Password, Google, Apple (configured via Supabase).
    - **Email/Password Path:**
      - **(UI)** User enters Email and Password.
      - **(UI)** Submits form data.
      - **(Supabase Auth)** Frontend calls Supabase sign-up function.
      - _(Optional: Supabase Auth sends verification email)._
      - **(Supabase Auth)** On success, creates user record, returns session/user object.
    - **OAuth Path (Google/Apple):**
      - **(UI)** User clicks OAuth provider button.
      - **(Supabase Auth)** Frontend initiates Supabase OAuth flow.
      - _(Redirect)_ User redirected to OAuth provider for authentication.
      - _(Redirect)_ User authenticates with provider, grants permissions.
      - _(Redirect)_ User redirected back to SoloFit PWA.
      - **(Supabase Auth)** Frontend captures OAuth callback, Supabase verifies and returns session/user object.
6.  **(Supabase DB)** Upon successful first authentication, a trigger/function _might_ populate initial user data in the `profiles` table (linked via User ID).
7.  **(UI)** Display Welcome message.
8.  **(UI)** (Optional) Present brief fitness assessment survey.
    - **(UI)** User submits survey answers.
    - **(Supabase DB)** Frontend saves survey results to the user's `profiles` record.
9.  **(UI)** (Optional) Present Avatar selection screen.
    - **(UI)** User selects an avatar.
    - **(Supabase DB)** Frontend saves avatar choice to the user's `profiles` record.
10. **(UI)** Request necessary **(Browser API)** permissions (Notifications, maybe Geolocation if used actively).
11. **(UI)** Show brief tutorial overlay explaining the Dashboard, Daily Quests, and Leveling.
12. **(UI)** Redirect User to the main **Dashboard** view.
13. **(Browser API)** PWA prompts user "Add to Home Screen" if criteria met.

### 3.2. Existing User Login

1.  **(UI)** User opens installed PWA or visits URL.
2.  **(Frontend Logic)** Check for existing valid session (e.g., Supabase JWT in Local Storage).
    - **If Valid:** Proceed to Dashboard (Flow 3.3).
    - **If Invalid/Expired:** Proceed to Log In screen.
3.  **(UI)** Display Log In screen with options (Email/Password, Google, Apple).
4.  **(UI)** User selects method and provides credentials/chooses OAuth.
5.  **(Supabase Auth)** Frontend calls Supabase sign-in function or initiates OAuth flow.
6.  **(Supabase Auth)** On success, Supabase returns session/user object.
7.  **(Frontend Logic)** Store session securely.
8.  **(UI)** Redirect User to the main **Dashboard** view (Flow 3.3).

### 3.3. Daily Core Loop: Viewing and Completing Quests

1.  **(UI)** User is on the **Dashboard** view (logged in).
2.  **(Supabase DB)** Frontend fetches user's profile data (Level, XP, Streak) and today's assigned Daily Quests from relevant tables.
3.  **(UI)** Display Dashboard: Level/XP bar, current Streak, list of Daily Quests (e.g., "10 Push-ups", "15min Walk"). Each quest shows status (incomplete/complete).
4.  **(UI)** User selects an incomplete exercise within a Quest (e.g., clicks "Push-ups").
5.  **(UI)** Navigate to the Exercise Detail screen for Push-ups.
6.  **(Supabase DB/Storage)** Fetch exercise instructions, animation/video URL.
7.  **(UI)** Display instructions, media, timer/rep counter interface.
8.  **(UI)** User performs the exercise. User inputs reps or starts/stops timer.
9.  **(UI)** User confirms completion of this specific exercise part of the quest.
10. **(Frontend Logic)** Check if all exercises for the Daily Quest are now marked complete.
    - **If Yes (Quest Complete):**
      - **(Supabase DB / Edge Function)** Frontend sends request to mark quest complete, increment XP. Logic to handle Level Ups and update Streak counter runs (can be in DB via functions/triggers, an Edge Function for complex checks, or client-side if simple, secured by RLS).
      - **(UI)** Show success feedback (animation, sound), update XP bar, show Level Up animation if applicable. Update Dashboard view data (re-fetch or via **Supabase Realtime** subscription).
    - **If No (Quest Partially Complete):**
      - **(Supabase DB)** Update status of the individual exercise completion if needed for state persistence.
      - **(UI)** Update UI to reflect partial completion.
11. User repeats steps 4-10 for other exercises/quests.

### 3.4. Viewing Progress and History

1.  **(UI)** User navigates to the "Progress" or "History" section via main navigation.
2.  **(Supabase DB)** Frontend fetches data from `workout_logs`, `achievements`, and potentially historical user profile snapshots. Implement pagination for logs.
3.  **(UI)** Display workout history list (dates, completed quests/exercises, duration).
4.  **(UI)** Display progress charts (e.g., Levels over time, activity frequency) generated client-side from fetched data.
5.  **(UI)** Display list of unlocked achievements/titles.

### 3.5. Interacting with Social Features (Example: Leaderboard)

1.  **(UI)** User navigates to the "Community" or "Leaderboard" section.
2.  **(Supabase DB)** Frontend queries a specific leaderboard view/function (e.g., `get_xp_leaderboard()`) in Supabase. Queries respect RLS policies (user opt-outs, friend filters).
3.  **(Supabase Realtime)** _(Optional)_ Frontend subscribes to leaderboard updates for live ranking changes.
4.  **(UI)** Display ranked list of users (Avatar, Username, Level/XP/Streak). Provide filters (Global, Friends).

### 3.6. Managing Account Settings

1.  **(UI)** User navigates to the "Settings" section.
2.  **(UI)** Display various options: Edit Profile, Account (Password/Email), Notifications, Privacy, Logout, Upgrade to Pro.
3.  **Edit Profile:**
    - **(Supabase DB)** Fetch current profile data.
    - **(UI)** Display data in editable fields. User makes changes.
    - **(UI)** User saves changes.
    - **(Supabase DB)** Frontend updates the user's record in the `profiles` table. (Avatar upload uses Supabase Storage).
4.  **Change Password/Email:**
    - **(Supabase Auth)** Utilize corresponding Supabase Auth functions.
5.  **Manage Notifications:**
    - **(UI)** Display toggles for different notification types.
    - **(Supabase DB)** Frontend saves preferences to user's profile.
    - _(Separately)_ Handle **(Browser API)** push subscription registration/unregistration (see PRD FR-041 / NFR push logic).
6.  **Logout:**
    - **(Supabase Auth)** Frontend calls Supabase sign-out function.
    - **(Frontend Logic)** Clear local session data/state.
    - **(UI)** Redirect user to Log In screen.

### 3.7. Upgrading to Premium

1.  **(UI)** User clicks an "Upgrade" prompt or button (in Settings, etc.).
2.  **(UI)** Display Premium benefits and pricing.
3.  **(UI)** User selects a plan and clicks "Subscribe".
4.  **(Payment Gateway)** Frontend initiates checkout session with Payment Provider (e.g., Stripe Checkout), potentially via a call to a simple **(Supabase Edge Function)** to create the session securely.
5.  _(Redirect)_ User completes payment via Payment Provider's interface.
6.  _(Webhook)_ Payment Provider sends a success event webhook to a predefined **(Supabase Edge Function)** endpoint.
7.  **(Supabase Edge Function)**
    - Verify webhook signature for security.
    - Parse webhook payload.
    - **(Supabase DB)** Update the corresponding user's record/role or add entry to `subscriptions` table to indicate premium status.
8.  **(Frontend Logic/UI)**
    - Frontend can poll user status, use a **(Supabase Realtime)** subscription on the user's profile/subscription status, or simply require a refresh/re-login.
    - Once premium status is confirmed from **(Supabase DB)**, unlock premium features/UI elements client-side.

## 4. Error Handling & Offline Use

- **(UI)** Gracefully handle API errors (network issues, Supabase errors) with user-friendly messages.
- **(Service Worker)** Implement caching strategies for offline access to core UI, exercise library, and potentially cached user data.
- **(Frontend Logic)** Queue data mutations (e.g., quest completion) made while offline and sync them with **(Supabase DB)** upon reconnection. Provide UI feedback about offline status and pending sync actions.
