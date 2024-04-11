# Getting Started
1. `npm ci` to install the dependencies
2. Create a `local.properties` file at `android` folder with the following content:
```
sdk.dir = C:\\Users\\username\\AppData\\Local\\Android\\Sdk
```
3. export unity project to `unity/builds/android` folder
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

## Option1: Development server
1. `npm start` to start the development server

## Option2: Android debug apk build
1. `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
2. `cd android`
3. `./gradlew assembleDebug`
4. `cd app/build/outputs/apk/debug`
5. `adb install .\app-debug.apk`
