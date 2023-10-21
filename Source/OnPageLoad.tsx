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
export function OnPageLoad() {
	// todo
}