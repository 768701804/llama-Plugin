@echo off
setlocal EnableDelayedExpansion
title llama.cpp + Plugins

:: ==========================================================
:: 配置
:: ==========================================================
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
set "HOST_DIR=%~dp0host"
set "MODEL_DIR=%ROOT%\models"
set "URL=http://127.0.0.1:8080"
set "UPSTREAM=http://127.0.0.1:8081"
set "PF=%ProgramFiles%"
set "PF86=%ProgramFiles(x86)%"
set "PLA=%LocalAppData%"

:: ==========================================================
:: 检查
:: ==========================================================
where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: 没找到 Node.js，插件宿主需要 Node.js 才能跑。
    echo   下载: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

if not exist "%ROOT%\llama-server.exe" (
    echo.
    echo ERROR: llama-server.exe not found.
    echo   %ROOT%\llama-server.exe
    echo.
    pause
    exit /b 1
)

if not exist "%HOST_DIR%\host.js" (
    echo.
    echo ERROR: host.js not found.
    echo   %HOST_DIR%\host.js
    echo.
    pause
    exit /b 1
)

if not exist "%MODEL_DIR%\*.gguf" (
    echo.
    echo ERROR: no .gguf model found in
    echo   %MODEL_DIR%
    echo.
    pause
    exit /b 1
)

:: ==========================================================
:: 已经在跑？给选项，不要默默跳过菜单
:: ==========================================================
"%SystemRoot%\System32\curl.exe" -s -f -o nul --max-time 2 "%URL%/health" >nul 2>&1
if not errorlevel 1 goto RUNNING_MENU

:: ==========================================================
:: 扫描模型
:: ==========================================================
set "COUNT=0"
for %%F in ("%MODEL_DIR%\*.gguf") do (
    set /a COUNT+=1
    set "FILE[!COUNT!]=%%~nxF"
    set "T=%%~zF"
    set "SIZE[!COUNT!]=!T:~0,-6!"
)

:MODEL_MENU
cls
echo ================================================
echo          llama.cpp   +   Plugins
echo ================================================
echo.
echo Root  : %ROOT%
echo Models: %MODEL_DIR%
echo Host  : %HOST_DIR%
echo.
echo Select Model
echo.
for /l %%I in (1,1,!COUNT!) do (
    echo    %%I. !FILE[%%I]!   ^(!SIZE[%%I]! MB^)
)
echo.
echo    0. Exit
echo.

set "SEL="
set /p "SEL=Select: "
set "SEL=%SEL: =%"
if "%SEL%"=="" goto MODEL_MENU
if "%SEL%"=="0" goto END
for /f "delims=0123456789" %%A in ("%SEL%") do goto MODEL_MENU
if %SEL% LSS 1 goto MODEL_MENU
if %SEL% GTR %COUNT% goto MODEL_MENU

set "MODEL_FILE=!FILE[%SEL%]!"

:MODE_MENU
cls
echo ================================================
echo              Reasoning Mode
echo ================================================
echo.
echo Model: %MODEL_FILE%
echo.
echo 1. Think
echo 2. No Think
echo.
echo 0. Back
echo.

set "MODE="
set /p "MODE=Select: "
set "MODE=%MODE: =%"

if "%MODE%"=="1" (
    set "THINK=1"
    set "MODE_NAME=Think"
    goto START
)
if "%MODE%"=="2" (
    set "THINK=0"
    set "MODE_NAME=No Think"
    goto START
)
if "%MODE%"=="0" goto MODEL_MENU
goto MODE_MENU

:START
cls
echo ================================================
echo                Starting Host
echo ================================================
echo.
echo Root    : %ROOT%
echo Model   : %MODEL_FILE%
echo Mode    : %MODE_NAME%
echo Listen  : %URL%
echo Upstream: %UPSTREAM%
echo.
echo 关闭这个窗口或按 Ctrl+C 就能停掉服务器。
echo.

pushd "%HOST_DIR%"
:: 宿主的自动开浏览器固定找 Chrome，先关掉；浏览器统一由本脚本用默认浏览器打开
node -e "const fs=require('fs'),Q=String.fromCharCode(34),p=process.argv[1];try{const t=fs.readFileSync(p,'utf8');const f=Q+'openBrowser'+Q+': true';if(t.indexOf(f)>=0)fs.writeFileSync(p,t.split(f).join(Q+'openBrowser'+Q+': false'));}catch(e){}" "%HOST_DIR%\host.json"

node host.js --model "models\%MODEL_FILE%" --think %THINK%
set "RC=%ERRORLEVEL%"
popd

echo.
if not "%RC%"=="0" (
    echo Host 退出，code = %RC%
    echo 具体错误看上面的输出。
    echo.
)
pause
goto END

:: ==========================================================
:: 8080 已经有东西在跑
:: ==========================================================
:RUNNING_MENU
cls
set "RUNNING_MODEL="
for /f "delims=" %%M in ('powershell -NoProfile -Command "try{(Invoke-RestMethod -Uri ('%URL%/props') -TimeoutSec 3).model_path}catch{ }" 2^>nul') do set "RUNNING_MODEL=%%M"
echo ================================================
echo            Already Running
echo ================================================
echo.
echo %URL% 上已经有服务器在跑。
if defined RUNNING_MODEL echo 当前模型: !RUNNING_MODEL!
echo.
echo   1. 打开浏览器  (默认浏览器)
echo   2. 停掉它，重新选模型
echo   0. Exit
echo.

set "RUNSEL="
set /p "RUNSEL=Select [1]: "
set "RUNSEL=%RUNSEL: =%"
if "%RUNSEL%"=="" set "RUNSEL=1"
if "%RUNSEL%"=="1" goto OPEN_ONLY
if "%RUNSEL%"=="2" goto STOP_EXISTING
if "%RUNSEL%"=="0" goto END
goto RUNNING_MENU

:OPEN_ONLY
call :OPEN_BROWSER
timeout /t 2 >nul 2>&1
goto END

:STOP_EXISTING
echo.
echo 正在停止占用 8080 / 8081 的进程...
powershell -NoProfile -Command "foreach($p in 8080,8081){ try{ Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction Stop | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } }catch{ } }"
timeout /t 2 >nul 2>&1
"%SystemRoot%\System32\curl.exe" -s -f -o nul --max-time 1 "%URL%/health" >nul 2>&1
if not errorlevel 1 (
    echo 端口还没释放，再等等...
    timeout /t 3 >nul 2>&1
)
echo 已停止，回到模型选择。
timeout /t 1 >nul 2>&1
goto MODEL_MENU

:: ==========================================================
:: 用默认浏览器打开
:: ==========================================================
:OPEN_BROWSER
echo 用默认浏览器打开: %URL%
start "" "%URL%"
exit /b 0

:END
endlocal
exit /b 0
