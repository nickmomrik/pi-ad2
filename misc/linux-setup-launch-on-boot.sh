#!/bin/bash

dir=$(pwd -P)
launch=$dir/dist/launch.sh

cat > $launch << EOF1
cd $dir
npm run prod
EOF1

chmod 744 $launch

pre='@lxterminal -e '
echo $pre$launch | tee --append ~/.config/lxsession/LXDE-pi/autostart > /dev/null