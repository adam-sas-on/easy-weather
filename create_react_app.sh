#! /bin/sh

BOLD_WHITE='\033[1;37m'
YELLOW='\033[0;93m'
NO_C="\033[0m"

echo "  Creating React with webPack."
echo "Errors may occur. If that happens, try"
echo "${BOLD_WHITE}npm audit fix${NO_C}  or  ${BOLD_WHITE}npm audit fix --force${NO_C}"
echo ""
echo " Press ${BOLD_WHITE}[ENTER]${NO_C} to start..."
sed -n q < /dev/tty

if [ -d "src" ] ; then
	cd src/
	if [ ! -f "index.js" ] ; then
		touch index.js
	fi
	cd ../
fi

npm i webpack webpack-cli -D

if [ ! -f "webpack.config.js" ] ; then
	echo " Create  ${YELLOW}webpack.config.js${NO_C} file"
	touch webpack.config.js
fi

npm i react react-dom
npm i @babel/core @babel/preset-env @babel/preset-react babel-loader -D

echo " Create if not exists ${BOLD_WHITE}.babelrc${NO_C}"
echo "add or update in ${BOLD_WHITE}.babelrc${NO_C}:"
echo "    ${BOLD_WHITE}\"presets\": [\"@babel/preset-env\", \"@babel/preset-react\"]${NO_C}"

npm i css-loader style-loader --save-dev

npm i react-router-dom --save-dev
