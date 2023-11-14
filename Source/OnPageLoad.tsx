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

declare var chrome;
export function OnPageLoad() {
	window.addEventListener("message", async event=>{
		// we only accept messages from ourselves
		if (event.source != window) return;
  
		if (event.data?.type == "DebateMap_CaptureFrame") {
			// just pass this message on to the background script (not reading response here, since chrome too impatient for download/response-sending; instead we listen through onConnect+onMessage listener below) [edit: nvm, false]
			//chrome.runtime.sendMessage(event.data);

			// just pass this message on to the background script
			const responseMessage = await chrome.runtime.sendMessage(event.data);
			console.log("Content-script got response from background:", responseMessage);
			// and pass back its response as-is
			window.postMessage(responseMessage, "*");
		}
  });
}

/*chrome.runtime.onConnect.addListener(function(port) {
	console.assert(port.name === "port-to-debate-map-content-script");
	port.onMessage.addListener(message=>{
		if (message.type == "DebateMap_CaptureFrame_done") {
			// just pass back its response as-is
			window.postMessage(message, "*");
		}
	});
 });*/