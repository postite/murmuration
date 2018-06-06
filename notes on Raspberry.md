//best config so far 
fake kms + lower screen resolution
--disable gpu compositing = webgl enbled
marche en full screen 

c'est cool ! 



ssh pi@192.168.2.12
pi / raspberry
vncserver :1 //start vnc server
sudo shutdown -h now //shut
sudo shutdown -r now //reboot
ping raspberrypi.local// find raspi ip 

//run chromium
export DISPLAY=:0 ; chromium-browser http://192.168.1.34:3700/remote -start-fullscreen
export DISPLAY=:0 ; chromium-browser http://192.168.2.46:3700/rasp1 -start-fullscreen
export DISPLAY=:0 ; chromium-browser file:///home/pi/Documents/med/medaillon.html -start-fullscreen
export DISPLAY=:0 ; chromium-browser http://192.168.1.34:3700/test -start-fullscreen
export DISPLAY=:0 ; chromium-browser http://192.168.0.101:3700/client/1 -start-fullscreen
export DISPLAY=:0 ; chromium-browser http://192.168.0.101:3700/rasp1 -start-fullscreen

///full screen netflix
chromium-browser --user-agent="Mozilla/5.0 (X11; CrOS armv7l 6946.86.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.84 Safari/537.36" http://netflix.com 


// enable webGl
//https://www.raspberrypi.org/forums/viewtopic.php?t=191087
//https://www.raspberrypi.org/forums/viewtopic.php?t=199543
reset defaut in chrome://flags
retire --disable composite gpu in 
sudo nano /etc/chromium-browser/customizations/00-rpi-vars

//disable screensaver
# Raspbian Wheezy
You can disable this by editing /etc/kbd/config and looking for 
BLANK_TIME=30

and setting the blank time to 0 (which turns it off)
BLANK_TIME=0

//je tente ça l'autre au dessus ne fait rien.
sudo nano /etc/lightdm/lightdm.conf

2 - Add this line

xserver-command=X -s 0 dpms

