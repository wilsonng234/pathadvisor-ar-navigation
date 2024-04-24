# Getting Started
1. Delete `ios/Pods` folder, `ios/Podfile.lock` file and `node_modules` folder (if applicable)
2. Follow [Unity to Android](#unity-to-android) and [Unity to iOS](#unity-to-ios) sections
3. `npm ci` to install the dependencies
4. `npx pod-install` to install pod files for iOS

## Unity to Android
1. Create a `local.properties` file at `android` folder with the following content:
```
sdk.dir = C:\\Users\\username\\AppData\\Local\\Android\\Sdk
```
2. Create an empty `unity/builds/android` folder
3. Export unity project to `unity/builds/android` folder
4. Create a `build.gradle` file at `unity/builds/android/unityLibrary/libs` with the following content:
```
configurations.maybeCreate("default")
artifacts.add("default", file('arcore_client.aar'))
artifacts.add("default", file('UnityARCore.aar'))
artifacts.add("default", file('ARPresto.aar'))
artifacts.add("default", file('unityandroidpermissions.aar'))
```
5. Replace the dependencies block of `unity/builds/android/unityLibrary/build.gradle` as the following:
```
dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])

    implementation project('libs')
    implementation project('xrmanifest.androidlib') 
}
```
6. Proceed to step 3 of [Getting Started](#getting-started)

## Unity to iOS
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
## Development server
### Android
1. `chmod 755 android/gradlew` (macOS only)
2. `npm start` to start the development server

### iOS
1. `npm start` to start the development server
2. Open `PathadvisorArNavigation.xcworkspace` in `ios` folder
3. Select `UnityFramework` in `Framework` folder in XCode
4. Change the location of framework to `/Users/{username}/Library/Developer/Xcode/DerivedData/Unity-iPhone-{buildId}/Build/Products/Debug-iphoneos/UnityFramework.framework` (Important!!)
5. Sign the project if necessary
6. Build the app by pressing the play button

## Release build
## Android
1. Follow [Generating an upload key](https://reactnative.dev/docs/signed-apk-android?package-manager=npm#setting-up-gradle-variables)
2. Follow [Setting up Gradle variables](https://reactnative.dev/docs/signed-apk-android?package-manager=npm#setting-up-gradle-variables)
3. Run `npx react-native build-android --mode=release`
4. Run `npx react-native run-android --mode="release"`

## iOS
1. Follow all the guidelines in [iOS development server](#ios) until Step 5
2. Edit Scheme and change the build configuration to 'release'
3. Build the app by pressing the play button
