// on install
// ==========

import {DataURItoBlob, TakeAndSaveScreenshot} from "./Utils/Screenshots";

declare var browser;
//declare var chrome;

browser.runtime.onInstalled.addListener(()=>{
	// Create one test item for each context type.
	/*let contexts = ["page", "selection", "link", "editable", "image", "video", "audio"];
	for (let i = 0; i < contexts.length; i++) {
		let context = contexts[i];
		let title = "Test '" + context + "' menu item";
		browser.contextMenus.create({
			title: title,
			contexts: [context],
			id: context
		});
	}*/
	
	// Create a parent item and two children.
	let parent = browser.contextMenus.create({
		title: "Debate Map",
		id: "parent"
	});
	browser.contextMenus.create({
		title: "Take screenshot (now)",
		parentId: parent,
		id: "takeScreenshot_now",
	});
	browser.contextMenus.create({
		title: "Take screenshot (1s)",
		parentId: parent,
		id: "takeScreenshot_1s",
	});
	browser.contextMenus.create({
		title: "Take screenshot (3s)",
		parentId: parent,
		id: "takeScreenshot_3s",
	});
	browser.contextMenus.create({
		title: "Take screenshot (5s)",
		parentId: parent,
		id: "takeScreenshot_5s",
	});
	browser.contextMenus.create({
		title: "Request extra perms",
		parentId: parent,
		id: "requestExtraPerms",
	});
});
browser.contextMenus.onClicked.addListener((info, tab)=>{
	if (info.menuItemId == "takeScreenshot_now") TakeAndSaveScreenshot();
	else if (info.menuItemId == "takeScreenshot_1s") setTimeout(()=>TakeAndSaveScreenshot(), 1000);
	else if (info.menuItemId == "takeScreenshot_3s") setTimeout(()=>TakeAndSaveScreenshot(), 3000);
	else if (info.menuItemId == "takeScreenshot_5s") setTimeout(()=>TakeAndSaveScreenshot(), 5000);
	else if (info.menuItemId == "requestExtraPerms") {
		// needed for screenshot capture in firefox
		browser.permissions.request({origins: ["<all_urls>"]});
	}
});

// regular runtime
// ==========

export function Start_Background() {
}

// bridge with this extension's content/on-page-load script
// ==========

/*const portsFromContentScripts = [] as any[];
browser.runtime.onConnect.addListener(function(port) {
	if (port.name === "port-from-debate-map-content-scripts") {
		portsFromContentScripts.push(port); // required to keep port alive
		port.onMessage.addListener(message=>{
			if (message.type == "DebateMap_CaptureFrame") {
				const {mapID, renderStartTime, currentFrameTime, currentFrameNumber} = message;
				browser.tabs.captureVisibleTab(null, {format: "png"}, dataUri=>{
					console.log(dataUri);
					const dateStr_short = new Date(renderStartTime).toLocaleString("sv").replace(/[^0-9]/g, "-");
					browser.downloads.download({
						//url: dataUri,
						url: URL.createObjectURL(DataURItoBlob(dataUri)), // firefox requires that we use a blob
						filename: `DebateMap/Renders/${dateStr_short}/${currentFrameNumber}.png`,
					}, downloadId=>{
						const message = {type: "DebateMap_CaptureFrame_done", mapID, renderStartTime, currentFrameTime, currentFrameNumber};
						console.log("Sending response:", message);
						//sendResponse(message);
						port.postMessage(message);
					});
				});
			}
		});
	}
});*/

browser.runtime.onMessage.addListener((message, sender, sendResponse)=>{
	//console.log("Received message:", message);

	if (message.type == "DebateMap_CaptureFrame") {
		const {mapID, renderStartTime, currentFrameTime, currentFrameNumber} = message;
		browser.tabs.captureVisibleTab(null, {format: "png"}, dataUri=>{
			console.log(dataUri);
			const dateStr_short = new Date(renderStartTime).toLocaleString("sv").replace(/[^0-9]/g, "-");
			
			// to stitch these frames into a video, run an ffmpeg command like this (can remove the `-vf [...]` part if height is multiple of 2)
			// ffmpeg -r 60 -i %d.png -c:v libx264 -r 60 -pix_fmt yuv420p -qp 0 -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" output.mp4
			
			browser.downloads.download({
				//url: dataUri,
				url: URL.createObjectURL(DataURItoBlob(dataUri)), // firefox requires that we use a blob
				filename: `DebateMap/Renders/${dateStr_short}/${currentFrameNumber}.png`,
			}, downloadId=>{
				const message = {type: "DebateMap_CaptureFrame_done", mapID, renderStartTime, currentFrameTime, currentFrameNumber};
				console.log("Sending response:", message);
				//sendResponse(message);
				//port.postMessage(message);
				browser.tabs.sendMessage(sender.tab.id, message);
			});
		});
	}
});