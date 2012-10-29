var plugin = require("plugin"),
dnode      = require("dnode");

plugin().
use(require("../../").server({
	auth: function(credentials, callback) {
		if(credentials.user == "user" && credentials.pass == "pass") return callback();
		return callback(new Error("unauthorized"));
	}
})).
require({
	name: "hello",
	plugin: function() {
		return {
			sayHello: function(callback) {
				callback( "hello!");
			}
		}
	}
}).
load();
