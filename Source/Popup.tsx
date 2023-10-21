import {StartDownload} from "js-vextensions";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Column, Row} from "react-vcomponents";

var g = globalThis as any;
declare var chrome: any;

g.chrome.runtime.onMessage.addListener(OnReceiveMessageFromBackground);
// async needed so chrome knows we didn't forget to "send a response": https://groups.google.com/a/chromium.org/g/chromium-extensions/c/alX5FusNQMI/m/fRh9T1qlAgAJ
async function OnReceiveMessageFromBackground(message) {
	console.log("Received from background:" + message);
}
function SendMessageToBackground(message) {
	console.log("Sending to background:", message);
	g.chrome.runtime.sendMessage(message, response=> {});
}

export function Start_Popup() {
	ReactDOM.render(<Popup/>, document.getElementById("reactRoot_popup"), undefined);
}


class Popup extends React.Component<{}, {}> {
	render() {
		return (
			<Column>
				<Row>
					<button onClick={()=> {
						g.chrome.tabs.query({active: true, currentWindow: true}, tabs=>{
							//let urlStr = tabs[0].url;
							SendMessageToBackground({type: "DoSomething1", myField1: "myValue1"});
						});
					}}>
						Do Something
					</button>
					<button onClick={()=>{
						chrome.tabs.captureVisibleTab(null, {}, dataUri=>{
							console.log(dataUri);
							const dateStr_short = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
							StartDownload(dataUri, `Screenshot_${dateStr_short}.png`, "", false);
						});
					}}>Test screenshot</button>
				</Row>
			</Column>
		);
	}
}