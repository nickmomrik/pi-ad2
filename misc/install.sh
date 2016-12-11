#!/bin/bash

dir=$(pwd -P)
launch=$dir/dist/launch.sh

cat > $launch << EOF1
cd $dir
npm run prod
EOF1

chmod 744 $launch


echo "Would you like a shortcut on the Desktop?"
select yn in "Yes" "No"; do
    case $yn in
        No )
            break;;
        Yes )
            cat > ~/Desktop/pi-ad2.desktop << EOF2
[Desktop Entry]
Type=Application
Name=Pi AD2
Comment=Launch Pi-AD2
Exec=lxterminal -e $launch
Icon=$dir/misc/timer.svg
EOF2
            break;;
    esac
done

pre='@lxterminal -e '
echo "Would you like the app to launch on boot?"
select yn in "Yes" "No"; do
    case $yn in
        No )
            break;;
        Yes )
            echo $pre$launch | tee --append ~/.config/lxsession/LXDE-pi/autostart > /dev/null
            break;;
    esac
done
