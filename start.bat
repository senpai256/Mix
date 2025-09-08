@echo off
title Setup e Run Bot WhatsApp
color 0A

:: Verificar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js nao encontrado! Instalando via Chocolatey...
    choco install -y nodejs-lts
)

:: Verificar Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Git nao encontrado! Instalando via Chocolatey...
    choco install -y git
)

:: Perguntar o que fazer
:MENU
echo.
echo O que voce deseja fazer?
echo 1. Instalar dependencias e rodar o bot
echo 2. Apenas rodar o bot
echo 0. Sair
set /p escolha=Digite 1 ou 2 ou 0: 

if "%escolha%"=="0" (
    echo Saindo...
    exit /b 0
)

if "%escolha%"=="1" (
    echo Instalando dependencias com Yarn...
    yarn install
    echo Iniciando o bot do WhatsApp...
    yarn start
    goto FIM
)

if "%escolha%"=="2" (
    echo Iniciando o bot do WhatsApp...
    yarn start
    goto FIM
)

echo Opcao invalida! Tente novamente.
goto MENU

:FIM
echo.
echo O bot esta rodando. Para sair, feche esta janela ou use Ctrl+C.
pause
