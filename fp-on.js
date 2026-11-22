// Registered dynamically only while "Fingerprint protection" is on.
// Runs in the page world at document_start and switches on noise in fp-main.js.
(() => {
  const on = () => document.dispatchEvent(new CustomEvent('__trp_protect'));
  document.addEventListener('__trp_hello', on, true);
  on();
})();
