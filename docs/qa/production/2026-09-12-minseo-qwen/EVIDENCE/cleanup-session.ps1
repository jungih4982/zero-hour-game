# End only the Metro and isolated emulator created for this batch.
$ErrorActionPreference = 'Stop'
$batchEvidence = $PSScriptRoot
$batchAdb = 'C:\Users\hjg\AppData\Local\Android\Sdk\platform-tools\adb.exe'
$batchMetro = Get-CimInstance Win32_Process -Filter 'ProcessId=16888'
$batchMetroParent = Get-CimInstance Win32_Process -Filter 'ProcessId=6800'
$batchEmulator = Get-CimInstance Win32_Process -Filter 'ProcessId=35836'
if ($batchMetro.CommandLine -notlike '*expo/bin/cli start --localhost --port 8081*' -or
    $batchMetroParent.CommandLine -notlike '*2026-09-12-minseo-qwen/EVIDENCE/metro-after.log*') {
    throw 'Metro identity changed; do not stop a different process.'
}
if ($batchEmulator.CommandLine -notlike '*C:\Dev\zero-hour-game\.expo\minseo-qwen-20260912\userdata.img*' -or
    $batchEmulator.CommandLine -notlike '*-port 5580*') {
    throw 'Emulator identity changed; preserve other devices.'
}
$batchEnvironment = [ordered]@{
    recordedAt = (Get-Date).ToString('o')
    appPackage = 'com.jungih4982.zerohourgame'
    serial = 'emulator-5580'
    display = (& $batchAdb -s emulator-5580 shell wm size | Out-String).Trim()
    density = (& $batchAdb -s emulator-5580 shell wm density | Out-String).Trim()
    fontScale = (& $batchAdb -s emulator-5580 shell settings get system font_scale | Out-String).Trim()
    appPidBeforeCleanup = (& $batchAdb -s emulator-5580 shell pidof com.jungih4982.zerohourgame | Out-String).Trim()
    apkSHA256 = (Get-FileHash -LiteralPath 'C:\Dev\zero-hour-game\android\app\build\outputs\apk\debug\app-debug.apk' -Algorithm SHA256).Hash
    metroProcess = $batchMetro | Select-Object ProcessId,ParentProcessId,CommandLine
    metroParent = $batchMetroParent | Select-Object ProcessId,ParentProcessId,CommandLine
    emulatorProcess = $batchEmulator | Select-Object ProcessId,CommandLine
    resumeSaveSHA256 = (Get-FileHash -LiteralPath "$batchEvidence\resume-final.sqlite" -Algorithm SHA256).Hash
}
$batchEnvironment | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath "$batchEvidence\android-environment-final.json" -Encoding utf8
Stop-Process -Id 16888
$batchKillResponse = (& $batchAdb -s emulator-5580 emu kill | Out-String).Trim()
$batchEmulatorProcess = Get-Process -Id 35836 -ErrorAction SilentlyContinue
if ($batchEmulatorProcess) { $batchEmulatorProcess.WaitForExit(15000) | Out-Null }
$batchCleanup = [ordered]@{
    recordedAt = (Get-Date).ToString('o')
    metroStopped = -not [bool](Get-Process -Id 16888 -ErrorAction SilentlyContinue)
    isolatedEmulatorStopped = -not [bool](Get-Process -Id 35836 -ErrorAction SilentlyContinue)
    emulatorResponse = $batchKillResponse
    devicesAfter = (& $batchAdb devices | Out-String).Trim()
    existingComfyServerStillRunning = [bool](Get-Process -Id 10412 -ErrorAction SilentlyContinue)
    userChromeAndOriginalAVD = 'Not stopped or modified during cleanup.'
    savePreserved = (Get-FileHash -LiteralPath "$batchEvidence\resume-final.sqlite" -Algorithm SHA256).Hash -eq $batchEnvironment.resumeSaveSHA256
}
$batchCleanup | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath "$batchEvidence\session-cleanup.json" -Encoding utf8
$batchCleanup | ConvertTo-Json -Depth 6
