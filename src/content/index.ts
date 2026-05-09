/// <reference types="chrome"/>

import './index.scss';

// Content script that runs on web pages
// eslint-disable-next-line no-console
console.log('{{ remrg:var project-name }} content script loaded');

// Example: Add a visual indicator to the page
function addPageIndicator() {
	const indicator = document.createElement('div');
	indicator.id = '{{ remrg:var project-name }}-indicator';
	indicator.classList.add('extension-active-indicator');

	indicator.textContent = '{{ remrg:var project-name }} Active';
	document.body.appendChild(indicator);
}

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'getPageInfo') {
		sendResponse({
			title: document.title,
			url: window.location.href,
			timestamp: Date.now(),
		});
	}

	return true; // Keep message channel open for async response
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', addPageIndicator);
}
else {
	addPageIndicator();
}
