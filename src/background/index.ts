/// <reference types="chrome"/>
/* eslint-disable no-console */

console.log('{{ remrg:var project-name }} background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener(async (details) => {
	console.log('Extension installed/updated:', details);

	// Set default storage values
	await chrome.storage.local.set({
		extensionInstalled: Date.now(),
		version: chrome.runtime.getManifest().version,
	});
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete' && tab.url) {
		console.log('Tab updated:', tab.url);

		// You can add logic here to inject content scripts or perform actions
		// when pages finish loading
	}
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	console.log('Background received message:', request);

	if (request.action === 'getExtensionInfo') {
		sendResponse({
			version: chrome.runtime.getManifest().version,
			installed: Date.now(),
		});
	}
	else if (request.action === 'openOptions') {
		await chrome.runtime.openOptionsPage();
	}

	return true;
});

// Handle context menu (optional)
// chrome.runtime.onInstalled.addListener(() => {
// 	chrome.contextMenus.create({
// 		id: 'typescript-template-action',
// 		title: '{{ remrg:var project-name }} Action',
// 		contexts: ['selection'],
// 	});
// });

// chrome.contextMenus.onClicked.addListener((info, tab) => {
// 	if (info.menuItemId === 'typescript-template-action' && tab.id) {
// 		chrome.tabs.sendMessage(tab.id, {
// 			action: 'highlightText',
// 		});
// 	}
// });
