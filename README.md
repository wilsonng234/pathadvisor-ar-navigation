# Getting Started
1. Delete `ios/Pods` folder, `ios/Podfile.lock` file and `node_modules` folder (if applicable)
2. Proceed to [Unity to iOS (Setup 1)](#unity-to-ios-setup-1) section
3. `npm ci` to install the dependencies
4. Create `unity/builds/ios` folder 
5. `npx pod-install` to install pod files

## Unity to Android
1. Create a `local.properties` file at `android` folder with the following content:
```
sdk.dir = C:\\Users\\username\\AppData\\Local\\Android\\Sdk
```
2. export unity project to `unity/builds/android` folder
3. Create a `build.gradle` file at `unity/builds/android/unityLibrary/libs` with the following content:
```
configurations.maybeCreate("default")
artifacts.add("default", file('arcore_client.aar'))
artifacts.add("default", file('UnityARCore.aar'))
artifacts.add("default", file('ARPresto.aar'))
artifacts.add("default", file('unityandroidpermissions.aar'))
```

4. Replace the dependencies block of `unity/builds/android/unityLibrary/build.gradle` as the following:
```
dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])

    implementation project('libs')
    implementation project('xrmanifest.androidlib') 
}
```

## Unity to iOS (Setup 1)
1. Build Unity project for ios in any folder but not inside React Native
2. Open `Unity-iPhone.xcodeproj`
3. Select Data folder, check "UnityFramework" and uncheck "Unity-iPhone"
4. Inside `Unity-iPhone/Libraries/Plugins/iOS` folder, select `NativeCallProxy.h` and change UnityFramework’s target membership from Project to Public.
5. Change the scheme to UnityFramework and sign it if applicable
6. Build it and Open `Product` folder in Xcode
7. Right click `UnityFramework` and move it to the plugin folder `unity/builds/ios`
8. Go to `unity/builds/ios/Headers`, open `UnityFramework.h`
9. Change line 4 to 
```
#import "./UnityAppController.h"
```
10. Go to `node_modules/@azesmway/react-native-unity/ios` and open `RNUnityView.h`, change line 3 and 4 to
```
#include "../../../../../unity/builds/ios/Headers/UnityFramework.h"
#include "../../../../../unity/builds/ios/Headers/NativeCallProxy.h"
```
11. Proceed to step 3 of [Getting Started](#getting-started)

# Build Option
## Option1: Development server for Android
1. `chmod 755 android/gradlew` (macOS only)
2. `npm start` to start the development server

## Option2: Development server for iOS and Unity to iOS (Setup 2)
1. `npm start` to start the development server
2. Open `PathadvisorArNavigation.xcworkspace` in `ios` folder
3. Select `UnityFramework` in `Framework` folder in XCode
4. Change the location of framework to `/Users/{username}/Library/Developer/Xcode/DerivedData/Unity-iPhone-{buildId}/Build/Products/Debug-iphoneos/UnityFramework.framework` (Important!!)
5. Sign the project if necessary
6. Build the app by pressing the play button

## Option3: Android debug apk build
1. `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
2. `cd android`
3. `./gradlew assembleDebug`
4. `cd app/build/outputs/apk/debug`
5. `adb install .\app-debug.apk`

## Option 4: iOS direct build
1. Follow all the guideline in Option 2 until Step 5
2. Edit Scheme and change the build configuration to 'release'
3. Build the app by pressing the play button
