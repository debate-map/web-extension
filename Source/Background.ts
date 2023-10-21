
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