#!/bin/bash

dir=$(pwd -P)
launch=$dir/dist/launch.sh

cat > $launch << EOF1
cd $dir
npm run prod
EOF1

chmod 744 $launch

cat > ~/Desktop/pi-ad2.desktop << EOF2
[Desktop Entry]
Type=Application
Name=Pi AD2
Comment=Launch Pi-AD2
Exec=$launch
Icon=$dir/misc/timer.svg
EOF2