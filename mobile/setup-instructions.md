
# The Truth NFT - Mobile App Setup

## React Native Setup

### Prerequisites
```bash
# Install React Native CLI
npm install -g react-native-cli

# For iOS development (macOS only)
# Install Xcode from App Store
# Install CocoaPods
sudo gem install cocoapods
```

### Initialize Mobile App
```bash
# Create React Native app
npx react-native init TruthMobileApp
cd TruthMobileApp

# Install dependencies
npm install @walletconnect/react-native @react-native-async-storage/async-storage
npm install react-native-vector-icons react-native-share
```

### Web3 Integration
```bash
# Install Web3 dependencies
npm install ethers @walletconnect/client
npm install react-native-get-random-values
```

### Platform-Specific Setup

#### iOS Setup
```bash
cd ios && pod install && cd ..
```

#### Android Setup
Add to `android/app/build.gradle`:
```gradle
dependencies {
    implementation 'com.facebook.react:react-native:+'
}
```

### Run the App
```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

## Progressive Web App (PWA) Alternative

For easier deployment, create a PWA version that works across all platforms:

### Features
- ✅ Works on all devices (iOS, Android, Desktop)
- ✅ Installable from browser
- ✅ Offline capable
- ✅ Push notifications
- ✅ Camera access for QR codes
- ✅ Share API integration

### Implementation
1. Add service worker for offline functionality
2. Include web app manifest
3. Implement Web3 wallet connections
4. Add progressive enhancement features

This approach gives you native-like experience without app store approval processes.
