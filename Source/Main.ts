enum ContextType {
	Background,
	OnPageLoad,
	Popup
}
let context: ContextType;
const pageURL: string|undefined|null = globalThis.window?.location?.href;
if (globalThis.window == null || pageURL?.startsWith("chrome-extension://") || pageURL?.startsWith("moz-extension://")) {
	context = ContextType.Background;
} else if (globalThis.document?.getElementById("reactRoot_popup")) {
	context = ContextType.Popup;
} else {
	context = ContextType.OnPageLoad;
}
console.log("Context: " + ContextType[context]);

// use require, for faster startup (saves ~50ms, from on-page-load startup-time -- probably because it doesn't use react)
if (context == ContextType.Background) {
	require("./Background").Start_Background();
} else if (context == ContextType.OnPageLoad) {
	require("./OnPageLoad").Start_OnPageLoad();
} else {
	require("./Popup").Start_Popup();
}