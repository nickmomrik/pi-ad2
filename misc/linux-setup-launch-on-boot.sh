#!/bin/bash

dir=$(pwd -P)
launch=$dir/dist/launch.sh

cat > $launch << EOF1
cd $dir
npm run prod
EOF1

chmod 744 $launch

launch=@$launch
echo $launch | sudo tee --append /etc/xdg/lxsession/LXDE-pi/autostart > /dev/null