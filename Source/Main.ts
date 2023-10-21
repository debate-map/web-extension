enum ContextType {
	Background,
	OnPageLoad,
	Popup
}
let context: ContextType;
//if (window.location.href.startsWith("chrome-extension://")) {
if (globalThis.window == null) {
	context = ContextType.Background;
} else if (globalThis.document?.getElementById("reactRoot_popup")) {
	context = ContextType.Popup;
} else {
	context = ContextType.OnPageLoad;
}
//console.log("Context: " + ContextType[context]);

// use require, for faster startup (saves ~50ms, from on-page-load startup-time -- probably because it doesn't use react)
if (context == ContextType.Background) {
	require("./Background").Start_Background();
} else if (context == ContextType.OnPageLoad) {
	require("./OnPageLoad").Start_OnPageLoad();
} else {
	require("./Popup").Start_Popup();
}