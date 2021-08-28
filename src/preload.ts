// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for(const arg of window.process.argv) {
    if(arg.startsWith("hls-url=")) {
      replaceText('hls-url', arg.substr(8));
    }
  }

});
