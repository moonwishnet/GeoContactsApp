@echo off
chcp 65001 >nul
echo ========================================
echo GeoContacts+ SHA1 指纹获取工具
echo ========================================
echo.

set JAVA_HOME=C:\Program Files\Java\jdk-17
set KEYTOOL="%JAVA_HOME%\bin\keytool.exe"

echo 【Debug 版本 SHA1】
echo 密钥库: %USERPROFILE%\.android\debug.keystore
echo.
%KEYTOOL% -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android 2>nul | findstr "SHA1"
echo.

echo 【Release 正式版 SHA1】
echo 密钥库: %USERPROFILE%\.android\release.keystore
echo.
%KEYTOOL% -list -v -keystore "%USERPROFILE%\.android\release.keystore" -alias geocontacts -storepass geocontacts -keypass geocontacts 2>nul | findstr "SHA1"

echo.
echo ========================================
echo 使用说明：
echo ========================================
echo.
echo 1. Debug SHA1 用于开发和测试
echo    申请地址: https://console.amap.com/
echo.
echo 2. Release SHA1 用于正式发布
echo    请妥善保管 release.keystore 文件！
echo.
echo 3. 包名: com.geocontacts.plus
echo.
echo 4. 建议同时申请两个 Key：
echo    - 一个使用 Debug SHA1（开发测试）
echo    - 一个使用 Release SHA1（正式发布）
echo.
echo ========================================
echo.

pause
