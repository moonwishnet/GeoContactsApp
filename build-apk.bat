@echo off
echo ========================================
echo GeoContacts+ Android APK Build Tool
echo ========================================

set JAVA_HOME=C:\Program Files\Java\jdk-17
set ANDROID_HOME=C:\Users\Administrator\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%

echo.
echo Environment:
echo JAVA_HOME: %JAVA_HOME%
echo ANDROID_HOME: %ANDROID_HOME%

echo.
echo ========================================
echo Starting build...
echo ========================================

cd /d %~dp0

echo.
echo [1/2] Cleaning...
cd android
call gradlew.bat clean

echo.
echo [2/2] Building APK (this may take several minutes)...
call gradlew.bat assembleDebug

if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo BUILD SUCCESS!
    echo ========================================
    echo.
    echo APK location:
    dir /s /b app\build\outputs\apk\debug\*.apk
) else (
    echo.
    echo ========================================
    echo BUILD FAILED
    echo ========================================
    echo.
    echo Try using GitHub Actions or Expo Go instead
)

cd ..
pause
