@echo off
setlocal EnableDelayedExpansion
set "DEST=%~dp0Plugin Library"

if "%~1"=="" goto USAGE
if not exist "%DEST%\" mkdir "%DEST%"

if exist "%~1\" (
    echo 从文件夹安装: %~1
    xcopy "%~1" "%DEST%\%~nx1\" /E /I /Y >nul
    if errorlevel 1 goto FAIL
    set "TARGET=%DEST%\%~nx1"
    goto CHECK
)

if /i "%~x1"==".zip" (
    echo 解压安装: %~1
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$t=Join-Path $env:TEMP 'llamacpp_plugin_tmp'; if(Test-Path -LiteralPath $t){Remove-Item -LiteralPath $t -Recurse -Force}; Expand-Archive -LiteralPath '%~f1' -DestinationPath $t -Force; $i=@(Get-ChildItem -LiteralPath $t); if($i.Count -eq 1 -and $i[0].PSIsContainer){Copy-Item -LiteralPath $i[0].FullName -Destination '%DEST%' -Recurse -Force} else {Copy-Item -Path (Join-Path $t '*') -Destination '%DEST%' -Recurse -Force}; Remove-Item -LiteralPath $t -Recurse -Force"
    if errorlevel 1 goto FAIL
    goto DONE
)

echo 不支持的文件类型: %~1
goto USAGE

:CHECK
if not exist "%TARGET%\plugin.json" (
    echo.
    echo 警告: %TARGET% 里没有 plugin.json，插件可能不完整。
)

:DONE
echo.
echo 插件库: %DEST%
echo 安装完成。到 http://127.0.0.1:8080/__plugins/admin 点「重新扫描」即可生效。
exit /b 0

:FAIL
echo 安装失败。
exit /b 1

:USAGE
echo 用法:
echo   把插件文件夹或 zip 拖到本文件上，或
echo   安装插件.bat "D:\path\to\my-plugin"
echo.
echo 插件库目录: %DEST%
pause
exit /b 1
