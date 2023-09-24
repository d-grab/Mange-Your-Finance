<h1 align="center"> Manage Your Finance Mobile App</h1>

<div align="center">
  
![Mange Your finance](https://res.cloudinary.com/dwc3fiaro/image/upload/c_fit,w_342/v1695552818/Budget-Control-App/Screenshot_20230924_093730_BudgetApp_l5pj1e.jpg)
![Login](https://res.cloudinary.com/dwc3fiaro/image/upload/c_fit,w_342/v1695552816/Budget-Control-App/Screenshot_20230924_093654_BudgetApp_zyjsix.jpg)

</div>

## Introduction
This repository contains the source code for the "Manage Your Finance" mobile application developed using React Native and Firebase. The app is designed to help young adults manage their finances better, with features like financial education, gamification, and more.

## Prerequisites
- Android Studio
- Node.js and Yarn
- Expo CLI

## Setup and Installation

### Step 1: Clone the Repository

```javscript
git clone <(https://github.com/d-grab/Mange-Your-Finance)>
cd <Repo-Name>

```

### Step 2: Install Android Studio
Download and install [Android Studio](https://developer.android.com/studio) and configure a virtual Android device using the "Virtual Device Manager".

### Step 3: Install Node.js Packages
Navigate to the project folder and run the following command to install the required Node.js packages.

```javscript
yarn install

```

> Note: It's recommended to use Yarn over npm for faster package installation.

### Step 4: Prebuild the Application
Run the prebuild command to generate Android and iOS folders for the application.

```javscript
yarn expo run

```

> Note: This may take between 10 to 15 minutes, depending on your machine's specifications.

The app should now be installed and running on your Android Virtual Machine.

## Troubleshooting
If you encounter any issues, try removing the `android` and `ios` folders and run the following command:

```bash
yarn expo prebuild
```
This command will generate the Android and iOS folders essential for the application

## License
This project is under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
