cd /d %~dp0
uglifyjs src\init.js src\svgClassList.js src\require.js --screw-ie8 -c hoist_vars,unsafe,comparisons -m -o all.js