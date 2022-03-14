#! /bin/sh

YELLOW='\033[0;93m'
NO_C="\033[0m"

pwd=$PWD

cd electron/scripts/react/
if [ ! -f "main.js.bak" ] ; then
	cp main.js main.js.bak
	echo " ${YELLOW}main.js${NO_C}  file not changed"
else
	echo " ${YELLOW}main.js${NO_C}  file changed"
fi

npm run dev

# git checkout HEAD -- electron/scripts/react/main.js
