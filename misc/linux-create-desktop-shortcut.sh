#!/bin/bash

dir=$(pwd -P)
dir=${dir%\/misc}

cat > $dir/dist/launch.sh << EOF1
cd $dir
npm start prod
EOF1

cat > ~/Desktop/pi-ad2.desktop << EOF2
[Desktop Entry]
Type=Application
Name=Pi AD2
Comment=Launch Pi-AD2
Exec=$dir/dist/launch.sh
Icon=$dir/misc/timer.svg
EOF2
