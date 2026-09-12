// Show the title of the tab the popup was opened on.
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  document.getElementById("page").textContent = tab?.title
    ? `You're on: ${tab.title}`
    : "Open a web page to see its title here.";
});
