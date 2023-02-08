#folderdatetime=$(date +%Y_%m_%d_%H_%M_%S)
folderdatetime="target"
mkdir -p  ./"$folderdatetime"

# Packaging VolPay Channel into war
cd VolPayChannel
jar -cvf ../"$folderdatetime"/VolPayChannel.war .
cd ..

# Packaging VolPay Hub into war
cd VolPayHub
jar -cvf ../"$folderdatetime"/VolPayHub.war .
cd ..

# Packaging VolPayRest into war
cd VolPayRest
jar -cvf ../"$folderdatetime"/VolPayRest.war .
cd ..

# Packaging VolPay UI into war
cd VolPayHubUI
jar -cvf ../"$folderdatetime"/VolPayHubUI.war .
cd ..
