# Pi AD2
A replacement monitor for the Schwinn Airdyne AD2, built for a Raspberry Pi. It actually can run completely fine on a Mac as well, where I'm doing all of my development.

I wrote a series of posts about the journey of creating this app. Start with [Part 1](https://nickmomrik.com/2016/11/25/building-a-better-interface-for-the-airdyne-ad2-with-a-raspberry-pi/) if you're interested.

For recent info, check out the [Pi AD2 tag](https://nickmomrik.com/tag/pi-ad2/) on my blog.

# Requirements
1. Uses [ClapDetector](https://github.com/tom-s/clap-detector), which requires `sox`. See the ClapDetector instructions for installing `sox` on Linux or Mac.
1. [Node.js](https://nodejs.org/en/download/package-manager/)

# Installation
This process sucks. Working on getting the production build to run.

1. Clone to `/home/pi/`
1. Run `cd /home/pi/pi-ad2` and then `npm install`
1. Run `cp misc/pi-ad2.desktop ~/Desktop`
1. Launch with the desktop shortcut. It may take 10+ seconds for Chromium to open, due to the build process.

# Other helpful install items

1. [Clutter](https://wiki.archlinux.org/index.php/Unclutter) hides your X mouse cursor when you do not need it.
1. [Disable screen blarking](https://www.raspberrypi.org/forums/viewtopic.php?f=91&t=57552).

# License
*Pi AD2* is licensed under [GNU General Public License v3](./LICENSE.md).
