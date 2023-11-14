//import {StartDownload} from "js-vextensions";

declare var browser;

export function TakeAndSaveScreenshot() {
	browser.tabs.captureVisibleTab(null, {format: "png"}, dataUri=>{
		console.log(dataUri);

		//const blob = await (await fetch(dataUri)).blob(); // this works, but don't like the forced async/await
		const blob = DataURItoBlob(dataUri);

		const dateStr_short = new Date().toLocaleString("sv").replace(/[^0-9]/g, "-");
		//StartDownload(dataUri, `Screenshot_${dateStr_short}.png`, "", false); // doesn't work in background-script (at least, not without a lot of work)
		browser.downloads.download({
			//url: dataUri,
			//url: URL.createObjectURL(new Blob([dataUri], {type: "application/octet-stream"})), // firefox requires that we use a blob
			//url: URL.createObjectURL(new Blob([dataUri], {type: "image/png"})),
			//url: URL.createObjectURL(new Blob([dataUri.replace("data:image/png;base64,", "")], {type: "image/png;base64,"})), // firefox requires that we use a blob
			url: URL.createObjectURL(blob), // firefox requires that we use a blob
			filename: "Screenshot.png",
		});
	});
}

export function DataURItoBlob(dataURI: string) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	const byteString = atob(dataURI.split(',')[1]);
 
	// separate out the mime component
	const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
 
	// write the bytes of the string to an ArrayBuffer
	const ab = new ArrayBuffer(byteString.length);
 
	// create a view into the buffer
	const ia = new Uint8Array(ab);
 
	// set the bytes of the buffer to the correct values
	for (let i = 0; i < byteString.length; i++) {
		 ia[i] = byteString.charCodeAt(i);
	}
 
	// write the ArrayBuffer to a blob, and you're done
	const blob = new Blob([ab], {type: mimeString});
	return blob;
 }