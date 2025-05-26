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
![image](https://github.com/user-attachments/assets/79fe9279-6bc4-4317-8773-97817edef76d)

![image](https://github.com/user-attachments/assets/e4f505a5-079c-48b7-825f-677227cada1a)

![image](https://github.com/user-attachments/assets/21afde56-f473-4e4f-a3b0-0c7b4d6cbf9e)

![image](https://github.com/user-attachments/assets/12be1a62-3595-4a16-b799-76249ddf32df)

This screen displays the user’s basic profile, including a profile photo, name, job title, a short introduction, and key details that define the user's personal brand.

### Client/portfolio View

![image](https://github.com/user-attachments/assets/7631376a-c104-4c62-8db8-ee5e3c19c263)

![image](https://github.com/user-attachments/assets/a2c41c43-db4e-45cb-9c2c-31af5171ee9c)

![image](https://github.com/user-attachments/assets/09dc98ca-eb47-4f3b-973e-7bb76b7509d2)

Professional client-facing interface featuring:
• Clean, minimalist design for interview details
• Company branding and position information
• Scheduled date and time in a clear format
• Important notes and preparation materials
• Professional PDF export formatting
• Share via WhatsApp and Airdrop.

### Skills

![image](https://github.com/user-attachments/assets/6ab9cdc8-bd04-48fe-8e1a-3f013651b68e)

Skills page shows a list of the user's skills with corresponding proficiency levels (e.g., Beginner, Intermediate, Expert). Each skill is displayed as a card with an icon and skill title.

### Projects

![image](https://github.com/user-attachments/assets/7554f2f2-35ba-4a33-aab1-6d91f408a878)

![image](https://github.com/user-attachments/assets/9f3798a3-e5ef-4261-ba4f-dcbe671e77c0)

This Page presents an overview of the user’s personal or professional projects. Each project card includes a project name, description, technologies used, and optionally, links to GitHub or live demos.

### Interview Details
![image](https://github.com/user-attachments/assets/68b34fe9-ca78-41a2-8294-1eca8ab0c0d5)

![image](https://github.com/user-attachments/assets/074ba7e1-9ac2-4ff7-a7c8-8a328a0439e0)

![image](https://github.com/user-attachments/assets/2bb53eb6-a0b4-4280-8861-3bb197be3869)

Interview Details
- Create and manage interview entries with company details and position information
- Track interview date and time with an intuitive date/time picker
- Set interview status (Scheduled, Completed, Cancelled, Offered, Rejected)
- Set reminders and notification for upcoming interviews

### Contact
![image](https://github.com/user-attachments/assets/506121dc-0685-4809-8c9d-72b90b1275e8)

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
