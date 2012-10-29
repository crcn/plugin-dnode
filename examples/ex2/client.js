var plugin = require("plugin"),
dnode      = require("dnode");

var loader = plugin().
use(require(__dirname + "/../../").client()).
require("dnode://localhost").
require({
	name: "test",
	plugin: function(loader) {
		return {
			hello: function() {

			}
		}
	}
});

loader.load(function(err, exports) {
	setInterval(function() {
		exports.hello.sayHello(function(message) {
			console.log(message)
		})
	}, 1000);
});
