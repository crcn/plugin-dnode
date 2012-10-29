var dnode = require("dnode"),
outcome = require("outcome");

exports.server = function(options) {
	if(!options) options = {};
	if(!options.port) options.port = 5004;

	return function(loader) {
		loader.on("loaded", function() {
			var server = dnode({
				getExports: function(credentials, callback) {

					function onAuthSuccess() {
						callback(null, loader.exports);
					}
					if(options.auth) {
						options.auth(credentials, outcome.error(callback).success(onAuthSuccess));
					} else {
						onAuthSuccess();
					}

				}
			});
			server.listen(options.port);
		})
	}
}

exports.client = function(options) {
	if(!options) options = {};
	return function(loader) {
		loader.loaderFactory.addLoaderClass(require("./loader")(options));
	}
}