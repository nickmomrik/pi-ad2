# Pi AD2
A replacement monitor for the Schwinn Airdyne AD2, built for a Raspberry Pi. It actually can run completely fine on a Mac as well, where I'm doing all of my development.

I wrote a series of posts about the journey of creating this app. Start with [Part 1](https://nickmomrik.com/2016/11/25/building-a-better-interface-for-the-airdyne-ad2-with-a-raspberry-pi/) if you're interested.

For recent info, check out the [Pi AD2 tag](https://nickmomrik.com/tag/pi-ad2/) on my blog.

## Note
When using the app, take the cable out of the Airdyne monitor and use a USB sound adapter to connect it to your Raspberry Pi or Mac. [This one made by Sabrant](http://a.co/aTtDN68) works great for me on both platforms.

## Installation
1. Install [Node.js](https://nodejs.org/en/download/package-manager/)
1. Install `sox`, a sound processing program, which is used to "listen" for each rotation of the flywheel.

    ##### Linux

    ```bash
    sudo apt-get update
    sudo apt-get install sox
    ```

    ##### Mac OS X
    Install [Homebrew](http://brew.sh/) first and then sox.
    ```bash
    brew install sox
    ```
1. Change to a directory where you want to install the program (home directory works fine)

   ```bash
   cd ~
   git clone https://github.com/nickmomrik/pi-ad2.git
   ```
1. Here are some different ways to start the app:
    1. Linux only (will give you Desktop & boot options):

        ```bash
        cd pi-ad2
        ./misc/install.sh
        ```
    1. Mac or Linux (from inside the `pi-ad2` install directory)

        ```bash
        npm run prod
        ```
1. The first time you use the app, make sure to go to Settings and test it is recognizing flywheel rotations. You may need to adjust the sliders until you find a sweet spot.

## Other useful install/config items

1. [Clutter](https://wiki.archlinux.org/index.php/Unclutter) hides your X mouse cursor when you do not need it.
1. [Disable screen blanking](https://www.raspberrypi.org/forums/viewtopic.php?f=91&t=57552) so you can keep seeing the display during longer workouts.

## License
*Pi AD2* is licensed under [GNU General Public License v3](./LICENSE.md).
