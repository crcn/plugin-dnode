var plugin = require("plugin"),
dnode      = require("dnode");

plugin().
use(require("../../").server()).
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
