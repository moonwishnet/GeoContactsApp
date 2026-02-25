@echo off
echo ========================================
echo GeoContacts+ Android APK 本地构建工具
echo ========================================

echo.
echo 检查环境...

where java >nul 2>nul
if %errorlevel% == 0 (
    java -version 2>&1 | findstr "version"
) else (
    echo [错误] 未安装 Java，请安装 JDK 17+
    echo 下载地址：https://adoptium.net/
    pause
    exit /b 1
)

where node >nul 2>nul
if %errorlevel% == 0 (
    node --version
) else (
    echo [错误] 未安装 Node.js
    pause
    exit /b 1
)

where git >nul 2>nul
if %errorlevel% == 0 (
    git --version
) else (
    echo [错误] 未安装 Git
    pause
    exit /b 1
)

echo.
echo ========================================
echo 开始构建...
echo ========================================

echo.
echo [1/4] 安装依赖...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
)

echo.
echo [2/4] 生成 Android 项目...
call npx expo prebuild --platform android --clean
if %errorlevel% neq 0 (
    echo [错误] 预构建失败
    pause
    exit /b 1
)

echo.
echo [3/4] 构建 APK...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo [错误] APK 构建失败
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo 构建成功！
echo ========================================
echo.
echo APK 位置：
dir /s /b android\app\build\outputs\apk\debug\*.apk

echo.
echo 按任意键退出...
pause >nul
