#!/bin/bash

dir=$(pwd -P)
dir=${dir%\/misc}

cat > $dir/dist/launch.sh << EOF1
cd $dir
npm start prod
EOF1

echo '*** Edit a file... `sudo nano /etc/xdg/lxsession/LXDE-pi/autostart`, add `@$dir/dist/launch.sh`, and save.'