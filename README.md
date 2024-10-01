Log Hours App

Purpose

The Log Hours App is a lightweight, mobile-friendly web application designed to track work-from-home and office hours. The primary goal is to help users monitor their daily work patterns and ensure that they meet required office time (e.g., 40% in-office work). The app leverages a simple and intuitive user interface, designed for easy logging and tracking of work hours, while remaining fully offline-capable using local storage.

Core Idea

The app provides users with a calendar-like interface to log whether they worked from home, the office, or took a day off (sick, vacation). Users can easily switch between these states, adjust hours for each day, and set recurring work patterns (e.g., always working from the office on Tuesdays). The app is a single-page application (SPA) built with Vue.js and Nuxt 3, leveraging local storage to save data locally on the user’s device, with no need for external databases.

Requirements

	•	Platform: Mobile web application, optimized for iPhone and capable of being added to the home screen.
	•	Offline Support: All data is stored locally in the browser’s storage. The app is built as a Progressive Web App (PWA) with offline support.
	•	Tech Stack:
	•	Frontend: Vue 3, Nuxt 3
	•	Hosting: Vercel for deployment
	•	Storage: Local Storage (browser) for persisting user data
	•	PWA: Fully offline-capable, installable as a mobile web app

Design Overview

	•	Single Page Application (SPA): The entire app lives on a single page with dynamically loaded components. There are no multiple pages or server-side rendering.
	•	Workday Cards: Each workday is displayed as a card with options to toggle between home, office, sick, or vacation. Users can adjust hours with a slider and set recurring work patterns.
	•	Emphasis on Simplicity: The interface uses icons and minimal text to create an intuitive, user-friendly experience. Tapping and long-press interactions provide quick control over day types and hours worked.

Key Features

	•	Day Cards: Each workday is represented as a full-width card with controls to toggle work type and adjust hours.
	•	Recurring Patterns: Users can set specific days of the week to automatically repeat work patterns (e.g., always in the office on Mondays).
	•	Icon-Based Navigation: Emojis are used to visually represent work types (e.g., 🏠 for home, 🏢 for office).
	•	Data Persistence: All data is stored locally using browser storage, ensuring that user data is available offline and is device-specific.
	•	PWA: The app can be installed on an iPhone home screen and works offline with cached assets.

Technical Requirements

	•	Nuxt 3 SPA: The app is built as a single-page application (SPA) with Nuxt 3 configured in spa mode for client-side rendering.
	•	Local Storage: Data persistence is handled using the browser’s localStorage API. All logged hours and day types are saved locally and loaded on page load.
	•	Vercel Deployment: The app is hosted and deployed via Vercel for easy updates and rapid global distribution.

Project Setup

	1.	Install dependencies: