/// <reference types="chrome"/>
/* eslint-disable no-console */

// Popup script for the extension popup
console.log('{{ remrg:var project-name }} popup script loaded');

// Get DOM elements
const actionBtn = document.getElementById('action-btn') as HTMLButtonElement;
const statusDiv = document.getElementById('status') as HTMLDivElement;

// Update status display
function updateStatus(message: string, isError = false) {
	console.log('Updating status:', message);

	statusDiv.textContent = message;
	statusDiv.style.color = isError ? 'red' : 'green';
	statusDiv.style.marginTop = '10px';
}

// Get current tab info
async function getCurrentTab() {
	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true,
	});
	return tab;
}

// Handle action button click
actionBtn.addEventListener('click', async () => {
	try {
		updateStatus('Processing...');

		const tab = await getCurrentTab();
		if (!tab.id) {
			throw new Error('No active tab found');
		}

		// Send message to content script
		try {
			const response = await chrome.tabs.sendMessage(tab.id, {
				action: 'getPageInfo',
			});

			if (response) {
				updateStatus(`Page: ${response.title}`);

				// Store data in extension storage
				await chrome.storage.local.set({
					lastPageInfo: response,
					lastAction: Date.now(),
				});
			}
			else {
				updateStatus('No response from content script', true);
			}
		}
		catch (messageError) {
			console.error('Message error:', messageError);

			// Content script may not be available on this page
			updateStatus('Please reload this page', true);
		}
	}
	catch (error) {
		console.error('Error:', error);
		updateStatus('Oops! An error occurred', true);
	}
});

// Load stored data on popup open
chrome.storage.local
	.get(['lastPageInfo', 'lastAction'])
	.then((data: { lastPageInfo?: { title: string }; lastAction?: number }) => {
		if (data.lastPageInfo) {
			updateStatus(`Last page: ${data.lastPageInfo.title}`);
		}
	})
	.catch((error) => {
		console.error('Error loading storage data:', error);
		updateStatus('Error loading stored data', true);
	});

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
	console.log('Popup DOM loaded');
});
