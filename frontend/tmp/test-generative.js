const path = require('path');
// Load dotenv for local dev env (.env)
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

(async () => {
  try {
    // Import the helper using CommonJS require; the helper is an ES module by default
    // so we'll read the file and evaluate its function logic here to test syntax.
    const fs = require('fs');
    const helperPath = path.resolve(__dirname, '..', 'src', 'services', 'generativeApi.js');
    const code = fs.readFileSync(helperPath, 'utf8');
    console.log('Loaded helper file length:', code.length);

    // Quick syntax check by attempting to transpile using new Function (not executing module scope imports)
    // Strip import/export for the check
    const stripped = code.replace(/export\s+async\s+function/g, 'async function').replace(/export\s+\{/g, '{');
    // Attempt to create a function from the code to catch syntax errors
    new Function(stripped);
    console.log('Syntax check passed for generativeApi.js');

    // Now run the function by executing a minimal wrapper through node's vm
  const vm = require('vm');
  // Ensure URL is available in the sandbox (used by generativeApi to build backend URL)
  const { URL } = require('url');
  const sandbox = { process, console, fetch: require('node-fetch'), URL };
    vm.createContext(sandbox);
    const wrapped = `(async () => { ${stripped}; return (typeof generateContent === 'function') ? 'OK' : 'MISSING'; })()`;
    const resultPromise = vm.runInContext(wrapped, sandbox);
    const res = await resultPromise;
    console.log('generateContent function present check:', res);

    console.log('Now calling generateContent to observe error when key is missing...');
    try {
      // call it with a missing key (likely triggers error defined in helper)
      const callWrapper = `(async () => { ${stripped}; try { await generateContent({ prompt: 'test' }); return {ok:true}; } catch(e){ return {ok:false, message: e.message}; } })()`;
      const callRes = await vm.runInContext(callWrapper, sandbox);
      console.log('Call result:', callRes);
    } catch (callErr) {
      console.error('Error calling in VM:', callErr && callErr.stack ? callErr.stack : callErr);
    }
  } catch (err) {
    console.error('Test runner error:', err && err.stack ? err.stack : err);
    process.exitCode = 2;
  }
})();
