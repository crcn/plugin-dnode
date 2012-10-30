var dnode = require("dnode"),
outcome = require("outcome"),
shoe    = require("shoe"),
http    = require("http");

exports.server = function(options) {
	if(!options) options = {};
	if(!options.port) options.port = 5003;

	return function(loader) {
		loader.on("ready", function() {

			var d = dnode({
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
			d.listen(options.port + 1);


			var sock = shoe(function(stream) {
				d.pipe(stream).pipe(d);
			});

			var server = http.createServer();
			server.listen(options.port)
			
			sock.install(server, "/dnode");
		})
	}
}

exports.client = function(options) {
	if(!options) options = {};
	return function(loader) {
		loader.loaderFactory.addLoaderClass(require("./loader")(options));
	}
}