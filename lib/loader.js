var Url = require("url"),
dnode   = require("dnode"),
outcome = require("outcome"),
traverse = require("traverse"),
shoe     = require("shoe");


module.exports = function() {
	var Loader = require("plugin").BaseLoader.extend({
		"load": function(callback) {
			var hostParts = Url.parse(this.source),
			on = outcome.error(callback),
			user, pass,
			self = this,
			modules = {},
			port = hostParts.port || 5003;

			if(hostParts.auth) {
				var parts = hostParts.auth.split(":");
				user = parts[0];
				pass = parts[1];
			}

			function connect() {
				var con = createConnection();
				con.on("remote", function(remote) {
					console.log("GM")
					remote.getExports({ user: user, pass: pass }, on.error(callback).success(function(exp) {

						modules = exp;

						//treat all the modules as (fake) plugins
						Object.keys(modules).forEach(function(moduleName) {
							self._plugins.add({
								name: moduleName,
								remote: true,
								plugin: function() {
									return modules[moduleName];
								}
							});
						});
						
						callback();
					}));
				});

				con.on("end", timeout);
				con.on("error", timeout);
			}

			function createConnection() {
				return typeof window !== "undefined" ? createWebConnection() : createNodeConnection();
			}

			function createWebConnection() {
				var stream = shoe("http://" + hostParts.hostname + ":" + port + "/dnode"),
				con = dnode();
				con.pipe(stream).pipe(con);
				return con;
			}

			function createNodeConnection() {
				return dnode.connect({ host: hostParts.hostname, port: port + 1 });
			}

			function timeout(err) {

				traverse(modules).forEach(function(v) {
					if(typeof v == "function") this.update(function(cb) {
						cb(new Error("unable to connect to dnode://" + hostParts.hostname))
					});
				});
				modules = {};
				setTimeout(connect, 1000);
			}

			connect();
		}
	});

	Loader.test = function(source) {
		return (typeof source == "string") && !!source.match(/^dnode(s)?:\/\//);
	}

	return Loader;
}