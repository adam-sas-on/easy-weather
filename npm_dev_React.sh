#! /bin/sh

pwd=$PWD

if [[ `git status -- electron/scripts/react/main.js --porcelain` ]] ; then
	# file changed
	npm run dev
else
	# file not changed
	cd electron/scripts/react/

	if [ -f "main.js.bak" ] ; then
		rm main.js.bak
	fi

	cp main.js main.js.bak
	cd $pwd
	npm run dev
fi

