var plugin = require("plugin"),
dnode      = require("dnode");

plugin().
use(require(__dirname + "/../../").client()).
require("dnode://user:pass@localhost:5004").
require({
	name: "test",
	plugin: function(loader) {
		return {
			hello: function() {

			}
		}
	}
}).
load(function(err, exports) {
	setInterval(function() {
		exports.hello.sayHello(function(message) {
			console.log(message)
		})
	}, 1000);
});
