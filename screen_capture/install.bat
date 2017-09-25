rm -rf build\*

cp -r css images js *.js *.html manifest.json build

cd build

rem java -jar ..\yuicompressor-2.4.7.jar "js/background.js" -o "js/background.min.js"

zip -r screencapture.zip -X zip *

mv --force screencapture.zip ..\

cd ..