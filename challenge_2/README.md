# Interview Tracker App

## Overview
The Interview Tracker App is a modern mobile application built with React Native and Dart that helps job seekers manage their interview process effectively. It provides a clean, intuitive interface for tracking interview schedules, managing statuses, and generating PDF reports.

## Features

### 1. Interview Management
- Create and manage interview entries with detailed company information
- Track interview date, time, and location
- Set interview status (Scheduled, Completed, Cancelled)
- Add notes and feedback for each interview
- Generate PDF reports of interview details

### 2. Smart Organization
- Clean and intuitive card-based interface
- Sort and filter interviews by status
- Chronological view of upcoming and past interviews
- Local data persistence with SQLite

### 3. User Interface
- Modern, minimalist design with custom components
- Responsive Flexbox layout
- Platform-specific UI adaptations
- Smooth animations and transitions
- Modal-based forms and details view

## Technology Stack

### Core Technologies
- Frontend Framework: React Native (Expo CLI)
- Programming Language: JavaScript/TypeScript
- State Management: React Context + Hooks
- Local Database: AsyncStorage
- UI Design: Custom components with Flexbox layout + React Native Paper
- Date/Time: @react-native-community/datetimepicker
- Navigation: React Navigation v6

### Key Libraries
- @react-native-community/datetimepicker
- @react-native-async-storage/async-storage
- @react-navigation/native
- @react-navigation/native-stack
- react-native-paper
- react-native-vector-icons
- expo-status-bar
- expo-constants

## Project Structure
```
interview-tracker/
├── App.js                    # Application entry point
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── InterviewCard.js      # Interview list item
│   │   ├── InterviewForm.js      # Add/Edit interview form
│   │   ├── InterviewModal.js     # Interview details modal
│   │   └── StatusButton.js       # Status toggle button
│   ├── screens/
│   │   ├── HomeScreen.js         # Main interview list
│   │   └── DetailsScreen.js      # Interview details view
│   ├── providers/
│   │   └── InterviewProvider.js  # Interview state management
│   ├── database/
│   │   └── database.js           # SQLite setup and queries
│   ├── utils/
│   │   ├── dateUtils.js          # Date formatting helpers
│   │   └── pdfGenerator.js       # PDF generation logic
│   └── constants/
│       ├── colors.js             # Color definitions
│       └── styles.js             # Common styles
└── app.json                  # Expo configuration
```

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

## Usage Guide

### Managing Interviews
1. View all interviews on the home screen
2. Tap '+' to add a new interview
3. Fill in the interview details:
   - Company name
   - Position
   - Date and time
   - Location (optional)
   - Notes (optional)
4. Update interview status using the status buttons
5. View full details by tapping on an interview card
6. Generate PDF reports of interview details

### Interview Status Management
- Scheduled: Default status for new interviews
- Completed: For finished interviews
- Cancelled: For cancelled or postponed interviews

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

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details. 