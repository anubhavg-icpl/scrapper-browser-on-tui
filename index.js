'use strict'
 
const { lightpanda } = require('@lightpanda/browser');
 
const lpdopts = {
  host: '127.0.0.1',
  port: 9222,
};
 
(async () => {
  // Start Lightpanda browser in a separate process.
  const proc = await lightpanda.serve(lpdopts);
 
  // Do your magic ✨
 
  // Stop Lightpanda browser process.
  proc.stdout.destroy();
  proc.stderr.destroy();
  proc.kill();
})();
