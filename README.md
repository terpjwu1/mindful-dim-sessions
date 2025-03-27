
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/82a07da3-f0f8-439c-8335-cd87a446c373

## About this project

This is a meditation application built with React and Capacitor. The app includes features like:

- Meditation session timer with audio playback
- Screen dimming and greyscale filter for reduced eye strain
- Customizable meditation durations
- Mobile-friendly interface

Capacitor allows this web application to access native iOS and Android features like screen brightness control and color filters when installed as a mobile app.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/82a07da3-f0f8-439c-8335-cd87a446c373) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Capacitor for native mobile features

This project uses Capacitor to bridge web technologies with native mobile capabilities. Capacitor allows the web app to:

1. Access native device APIs like screen brightness control
2. Apply system-level filters like greyscale mode
3. Install as a native app on iOS and Android devices
4. Add to the home screen with a custom icon

### Building for iOS or Android

To build the app for mobile platforms:

```sh
# Install Capacitor CLI if you haven't already
npm install -g @capacitor/cli

# Build the web application
npm run build

# Sync the build with Capacitor
npx cap sync

# Open the project in Xcode (for iOS)
npx cap open ios

# Open the project in Android Studio (for Android)
npx cap open android
```

### Differences from Swift and Flutter

- **Capacitor vs. Swift**: Swift is Apple's native programming language for iOS. Using Capacitor allows you to write once in web technologies (HTML/CSS/JS) while still accessing native features through plugins. Swift development requires separate iOS-specific code.

- **Capacitor vs. Flutter**: Flutter uses Dart language and provides a complete UI toolkit to build natively compiled applications. Capacitor instead uses your existing web code and wraps it in a native container. Flutter has more consistent performance across platforms but requires learning Dart, while Capacitor leverages your existing web development skills.

Capacitor is ideal when you want to maintain a single web codebase while still providing a native mobile experience with access to device features.

**Note**: When running as a web app, native features like brightness control are simulated with CSS. These features only work with actual device APIs when installed as a native app on a physical device.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Capacitor (for native mobile features)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/82a07da3-f0f8-439c-8335-cd87a446c373) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
