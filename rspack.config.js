const path = require("path");

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
	context: __dirname,
	entry: {
		main: "./Source/Main.ts"
	},
	output: {
		filename: "main.bundle.js",
		path: path.resolve(__dirname, "Dist"),
	},
	devServer: {
		devMiddleware: {
			writeToDisk: true,
		},
		// chrome extension system doesn't seem to support websocket connection to dev-server, so disable that connection
		liveReload: false,
		hot: false,
		webSocketServer: false,
	},
	builtins: {
		html: [
			{
				template: "./index.html"
			}
		]
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset"
			}
		]
	}
};
