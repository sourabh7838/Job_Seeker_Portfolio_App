#### Job Seeker Portfolio

### Overview
The Job Seeker Portfolio App is a mobile application built with React Native and Expo, designed to help job seekers create a professional and interactive portfolio. The app features sections for personal information, skills, projects, testimonials, and contact details—empowering users to showcase their profiles effectively to potential employers and manage their interview processes efficiently. This project demonstrates core mobile development skills, including state management, data persistence with SQLite, dark mode theming, and a clean, responsive UI design.

### Features

1. Profile Management
   - Edit personal information, including name, title, and bio
   - Upload and manage profile picture.
  
2. Skills Management
   - Add, view, and delete skills with proficiency levels.
     
3. Projects & Experience
   - Showcase personal projects with descriptions, technologies used, and value demonstrated.
     
4. Testimonials
   - Add testimonials from references or previous employers.

5. Contact Section
   - Add email, phone, LinkedIn, GitHub, and download resume option.
     
6. Dark Mode Toggle
   - Seamlessly switch between light and dark themes.
     
7. Export Portfolio as PDF
   - Generate a PDF version of the portfolio for sharing or printing.
     
8. Data Persistence
   - Store and retrieve all user data locally using SQLite.
     
9. Interview Management
   - Create and manage interview entries with company details and position information
   - Track interview date and time with an intuitive date/time picker
   - Set interview status (Scheduled, Completed, Cancelled, Offered.

### Technology Stack

## Core Technologies
- Frontend Framework: React Native (Expo CLI)
- Programming Language: JavaScript/TypeScript
- State Management: React Context + Hooks
- Local Database: SQLite/AsyncStorage
- UI Design: Custom components with Flexbox layout + React Native Paper
- Date/Time: @react-native-community/datetimepicker
- Navigation: React Navigation v6

## Key Libraries
- @react-native-community/datetimepicker
- @react-native-sqlite
- @react-native-async-storage/async-storage
- @react-navigation/native
- @react-navigation/native-stack
- react-native-paper
- react-native-vector-icons
- expo-status-bar
- expo-constants

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/         # Screen components
├── hooks/           # Custom React hooks
├── contexts/        # React context providers
├── utils/          # Utility functions and helpers
├── services/       # Service layer (API, database, etc.)
│   └── database/   # Database related code
├── config/         # Configuration files
├── assets/         # Static assets
│   ├── images/     # Image files
│   └── icons/      # Icon files
└── App.js          # Root component

```

## Key Directories

- `src/components/`: Contains all reusable UI components
- `src/screens/`: Contains all screen-level components
- `src/hooks/`: Custom React hooks for shared logic
- `src/contexts/`: React context providers for state management
- `src/utils/`: Helper functions and utility code
- `src/services/`: Service layer implementation
- `src/config/`: Configuration files and constants
- `src/assets/`: Static assets like images and icons

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- Expo CLI
- Dart SDK
- iOS Simulator (for Mac users) or Android Emulator

### Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd interview-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your preferred platform:
- Press 'i' for iOS simulator
- Press 'a' for Android emulator
- Scan QR code with Expo Go app for physical device

## Screenshots

### Home Screen/About Me
<img width="158" alt="image" src="https://github.com/user-attachments/assets/2c871ab1-4611-43cf-b967-07cf6e28ac13" />

<img width="158" alt="image" src="https://github.com/user-attachments/assets/8c188ebd-76a8-47c4-be5e-ff9aac6d352d" />

The main entry screen that provides an overview of the app’s content. Users can navigate to different sections like About, Skills, Projects, Testimonials, and Contact through a bottom tab bar or buttons on this page. It acts as a dashboard for the entire portfolio.

### Add/Edit
<img width="158" alt="image" src="https://github.com/user-attachments/assets/a054e111-f008-4951-aef5-18c0d9c93d00" />

<img width="158" alt="image" src="https://github.com/user-attachments/assets/e6175554-57c5-4223-8480-f745bc6cecea" />

<img width="158" alt="image" src="https://github.com/user-attachments/assets/2648a738-f0db-49c5-8d21-5e87b04f2b15" />

<img width="158" alt="image" src="https://github.com/user-attachments/assets/21a12e92-4202-4817-949d-1ffce9c8bfa1" />


This screen displays the user’s basic profile, including a profile photo, name, job title, a short introduction, and key details that define the user's personal brand.

### Client/portfolio View

<img width="146" alt="image" src="https://github.com/user-attachments/assets/c7831f13-0e60-4667-af9c-d26a8bde00f2" />


<img width="146" alt="image" src="https://github.com/user-attachments/assets/7ac49a4a-7fd6-45f6-938d-ef1bd41310df" />


<img width="145" alt="image" src="https://github.com/user-attachments/assets/7284ae36-8088-44b1-9148-bc370a1b3089" />

Professional client-facing interface featuring:
• Clean, minimalist design for interview details
• Company branding and position information
• Scheduled date and time in a clear format
• Important notes and preparation materials
• Professional PDF export formatting
• Share via WhatsApp and Airdrop.

### Skills

<img width="166" alt="image" src="https://github.com/user-attachments/assets/bf2bb8b4-0a98-4955-8fd5-38862af784d3" />

Skills page shows a list of the user's skills with corresponding proficiency levels (e.g., Beginner, Intermediate, Expert). Each skill is displayed as a card with an icon and skill title.

### Projects

<img width="167" alt="image" src="https://github.com/user-attachments/assets/8240fe13-b4cb-434d-87cb-194f4975eec3" />

<img width="167" alt="image" src="https://github.com/user-attachments/assets/114967b3-1a37-4eaf-82cb-0b54f7904c72" />

This Page presents an overview of the user’s personal or professional projects. Each project card includes a project name, description, technologies used, and optionally, links to GitHub or live demos.

### Interview Details
<img width="147" alt="image" src="https://github.com/user-attachments/assets/01e9149b-1650-4b6a-8481-490339a46fb8" />

<img width="147" alt="image" src="https://github.com/user-attachments/assets/34ffbe32-4d29-4a97-b995-c718f5520326" />

<img width="147" alt="image" src="https://github.com/user-attachments/assets/2e4d5eef-09a9-47d5-a1db-bf0f1f7e8703" />

Interview Details
- Create and manage interview entries with company details and position information
- Track interview date and time with an intuitive date/time picker
- Set interview status (Scheduled, Completed, Cancelled, Offered, Rejected)
- Set reminders and notification for upcoming interviews

### Contact
<img width="147" alt="image" src="https://github.com/user-attachments/assets/dfc8948b-c630-4279-8694-77209202639d" />

This page lists contact details such as email, phone number, LinkedIn, GitHub, and an option to download the resume. Icons are used for quick access to each contact method.


## Best Practices

### Data Management
- Efficient SQLite queries
- Provider-based state management
- Regular data persistence
- PDF report generation

### Performance
- Optimized list rendering
- Efficient modal handling
- Proper memory management
- Background task optimization

### User Experience
- Intuitive navigation
- Responsive interactions
- Platform-specific adaptations
- Error handling and validation

Reference:
• React Native Documentation: https://reactnative.dev
• Expo Documentation: https://docs.expo.dev
• SQLite for React Native: https://docs.expo.dev/versions/latest/sdk/sqlite/
• React Navigation: https://reactnavigation.org/
• React Context API: https://reactjs.org/docs/context.html
• Best Practices for Mobile UI: https://material.io/design
