### Notes

- ALL dnode functions must follow the `cb(err, result)` pattern. If a host disconnects for whatever reason, all 
remote functions return an error in the first parameter.

### Usage


server.js

```javascript
var plugin = require("plugin");

plugin().
use(require("plugin-dnode").server({
	auth: function(credentials, callback) {
		if(credentials.user == "user" && credentials.pass == "pass") return callback();
		return callback(new Error("unauthorized"));
	}
})).
require({
	name: "hello",
	plugin: function() {
		return {
			say: function(callback) {
				callback("hello!");
			}
		};
	}
}).
load();
```

client.js

```javascript
var plugin = require("plugin");

plugin().
use(require("plugin-dnode").client()).
require("dnode://user:pass@localhost:5004").
load(function(err, exports) {
	exports.hello.say(function(message) {
		console.log(message);//hello!
	})
});
```

