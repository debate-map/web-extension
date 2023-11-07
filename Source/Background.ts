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

// bridge with this extension's popup
// ==========

globalThis.chrome.runtime.onMessage.addListener(OnReceiveMessageFromPopup);
function OnReceiveMessageFromPopup(message) {
	console.log("Received from popup:" + message);
	if (message.type == "DoSomething1") {
		console.log(`DoingSomething1... ${message.myField1}`);
	}
}
function SendMessageToPopup(message) {
	globalThis.chrome.runtime.sendMessage(message, response=> {});
}