import {SleepAsync} from "js-vextensions";

export function Start_OnPageLoad() {
	if (document.body != null) {
		OnPageLoad();
	} else {
		// wait for page to load, then proceed with initialization
		//document.addEventListener("load", ()=>OnPageLoad());
		(async()=>{
			while (true) {
				if (document.body != null) {
					OnPageLoad();
					return;
				}

				await SleepAsync(100);
			}
 		})();
	}
}

declare var browser;
//declare var chrome;

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type == "DebateMap_CaptureFrame_done") {
		// just pass back the response as-is to page
		window.postMessage(message, "*");

		return true; // is this necessary?
	}
});

export function OnPageLoad() {
	window.addEventListener("message", async event=>{
		// we only accept messages from ourselves
		if (event.source != window) return;
  
		if (event.data?.type == "DebateMap_CaptureFrame") {
			// just pass this message on to the background script (rather than read response directly here, we'll process the response within a general-purpose message-listener seen above, for higher resilience)
			browser.runtime.sendMessage(event.data);
		}
  });
}