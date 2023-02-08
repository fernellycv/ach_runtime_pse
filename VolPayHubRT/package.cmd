set folderdatetime=target
echo %folderdatetime%
mkdir %folderdatetime%

REM Packaging VolPay Channel into war
cd VolPayChannel
jar -cvf ..\%folderdatetime%\VolPayChannel.war .
cd ..

REM Packaging VolPay Hub into war
cd VolPayHub
jar -cvf ..\%folderdatetime%\VolPayHub.war .
cd ..

REM Packaging VolPayRest into war
cd VolPayRest
jar -cvf ..\%folderdatetime%\VolPayRest.war .
cd ..

REM Packaging VolPay UI into war
cd VolPayHubUI
jar -cvf ..\%folderdatetime%\VolPayHubUI.war .
cd ..
pause