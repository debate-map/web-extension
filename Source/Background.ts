// on install
// ==========

import {TakeAndSaveScreenshot} from "./Utils/Screenshots";

chrome.runtime.onInstalled.addListener(()=>{
	// Create one test item for each context type.
	/*let contexts = ["page", "selection", "link", "editable", "image", "video", "audio"];
	for (let i = 0; i < contexts.length; i++) {
		let context = contexts[i];
		let title = "Test '" + context + "' menu item";
		chrome.contextMenus.create({
			title: title,
			contexts: [context],
			id: context
		});
	}*/
	
	// Create a parent item and two children.
	let parent = chrome.contextMenus.create({
		title: "Debate Map",
		id: "parent"
	});
	chrome.contextMenus.create({
		title: "Take screenshot (now)",
		parentId: parent,
		id: "takeScreenshot_now",
	});
	chrome.contextMenus.create({
		title: "Take screenshot (1s)",
		parentId: parent,
		id: "takeScreenshot_1s",
	});
	chrome.contextMenus.create({
		title: "Take screenshot (3s)",
		parentId: parent,
		id: "takeScreenshot_3s",
	});
	chrome.contextMenus.create({
		title: "Take screenshot (5s)",
		parentId: parent,
		id: "takeScreenshot_5s",
	});
});
chrome.contextMenus.onClicked.addListener((info, tab)=>{
	if (info.menuItemId == "takeScreenshot_now") TakeAndSaveScreenshot();
	else if (info.menuItemId == "takeScreenshot_1s") setTimeout(()=>TakeAndSaveScreenshot(), 1000);
	else if (info.menuItemId == "takeScreenshot_3s") setTimeout(()=>TakeAndSaveScreenshot(), 3000);
	else if (info.menuItemId == "takeScreenshot_5s") setTimeout(()=>TakeAndSaveScreenshot(), 5000);
});

// regular runtime
// ==========

declare var chrome;
export function Start_Background() {
}

// bridge with this extension's content/on-page-load script
// ==========

/*chrome.runtime.onConnect.addListener(function(port) {
	if (port.name === "port-from-debate-map-content-scripts") {
		port.onMessage.addListener(message=>{
			if (message.type == "DebateMap_CaptureFrame") {
				// todo
			}
		});
	}
});*/

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
	//console.log("Received message:", message);

	if (message.type == "DebateMap_CaptureFrame") {
		const {mapID, renderStartTime, currentFrameTime, currentFrameNumber} = message;
		chrome.tabs.captureVisibleTab(null, {format: "png"}, dataUri=>{
			console.log(dataUri);
			const dateStr_short = new Date(renderStartTime).toLocaleString("sv").replace(/[^0-9]/g, "-");
			chrome.downloads.download({
				url: dataUri,
				filename: `DebateMap/Renders/${dateStr_short}/${currentFrameNumber}.png`,
			}, downloadId=>{
				const message = {type: "DebateMap_CaptureFrame_done", mapID, renderStartTime, currentFrameTime, currentFrameNumber};
				console.log("Sending response:", message);
				sendResponse(message);
			});
		});
		return true;
	}
});
/*function SendMessageToPopup(message) {
	chrome.runtime.sendMessage(message, response=> {});
}*/