# Zomato - Customer App

![Zomato](https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png)

## Overview

**Zomato Customer App** is a premium food delivery experience built with **React Native** and the **Zomato Ecosystem Monorepo**. It features a stunning UI, seamless animations with Reanimated, and robust state management via Redux Toolkit.

**Developed by:** Arsh

---

## 🚀 Features

*   **Premium UI/UX**: Glassmorphism, highly interactive animations, and a sleek dark mode.
*   **Smart Search**: Instant search for restaurants and dishes.
*   **Live Order Tracking**: Real-time updates on your food delivery.
*   **Optimized Performance**:
    *   **Lazy Loading**: Faster startup times.
    *   **FastImage**: Caching and priority loading for images.
    *   **FlashList/FlatList Optimization**: 60fps scrolling.
*   **Robust Architecture**:
    *   **Redux Toolkit**: Centralized state management.
    *   **React Navigation v7**: Native stack navigation.
    *   **TypeScript**: Type-safe development.

---

## 🛠️ Tech Stack

*   **Framework**: React Native 0.83
*   **Language**: TypeScript
*   **State Management**: Redux Toolkit + Redux Persist
*   **Navigation**: React Navigation 7
*   **Styling**: StyleSheet + Reanimated
*   **Network**: Axios + React Query (planned)
*   **Testing**: Jest + React Native Testing Library

---

## 🏁 Getting Started

### Prerequisites
*   Node.js >= 18
*   Ruby (for iOS CocoaPods)
*   JDK 17 (for Android)
*   Watchman (optional, for macOS)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/arshverma/Zomato.git
    cd Zomato/zomato-ecosystem/apps/zomato-customer-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # OR
    yarn install
    ```

3.  **Install iOS Pods (Mac only):**
    ```bash
    cd ios && pod install && cd ..
    ```

---

## 🏃‍♂️ Running the App

### 1. Start the Metro Server
This bundles your JavaScript code.
```bash
npm start
```

### 2. Run on Emulator/Device

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

---

## 🧪 Testing

Run the comprehensive test suite (Unit & Component tests):
```bash
npm test
```

---

## 📂 Project Structure

```
src/
├── components/   # Reusable UI components (RestaurantCard, Buttons, etc.)
├── navigation/   # Stack and Tab navigators
├── screens/      # Application screens (Home, Dining, Profile, etc.)
├── services/     # API clients and services
├── store/        # Redux slices and store configuration
├── types/        # TypeScript type definitions
└── utils/        # Helper functions and constants
```

---

## 🎨 Branding

*   **App Name**: Zomato By Arsh
*   **Theme**: Zomato Red & Modern Dark/Light themes.

---

Made with ❤️ by Arsh.
