//import {StartDownload} from "js-vextensions";

declare var chrome;
export function TakeAndSaveScreenshot() {
	chrome.tabs.captureVisibleTab(null, {format: "png"}, dataUri=>{
		console.log(dataUri);
		const dateStr_short = new Date().toLocaleString("sv").replace(/[^0-9]/g, "-");
		//StartDownload(dataUri, `Screenshot_${dateStr_short}.png`, "", false); // doesn't work in background-script (at least, not without a lot of work)
		chrome.downloads.download({
			url: dataUri,
		});
	});
}