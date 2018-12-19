cd /d %~dp0
terser src\es6-shim.js src\qsa-scope.js src\svgClassList.js src\require.js src\jsex.js src\browser.js src\init.js -c hoist_vars,unsafe,comparisons --safari10 -m -o all.js