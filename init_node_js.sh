#! /bin/sh

if [ ! -d "node_modules" ] ; then
	echo "Creating node modules based on package-lock.json"
	if [ -f "package-lock.json" ] ; then
		npm ci
	else
		echo "  package-lock.json  is missing!"
	fi
else
	echo " There are node_modules/ already."
fi
