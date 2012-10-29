### Notes

- ALL dnode functions must follow the `cb(err, result)` pattern. If a host disconnects for whatever reason, all 
remote functions return an error in the first parameter.

### Usage


server.js

```javascript
var plugin = require("plugin"),
dnode      = require("dnode");

plugin().
use(require("../../").server({
	port: 9009
})).
require({
	name: "hello",
	plugin: function() {
		return {
			sayHello: function(callback) {
				callback(null, "hello!");
			}
		}
	}
}).
load();
```

client.js

```javascript
var plugin = require("plugin"),
dnode      = require("dnode");

var loader = plugin().
use(require(__dirname + "/../../").client()).
require("dnode://localhost:9009").
load(function(err, exports) {
	exports.hello.sayHello(function(err, message) {
		console.log(message);//hello!
	});
});
```


### Authentication

server.js

```javascript

plugin().
use(require("../../").server({
	auth: function(credentials, callback) {
		if(credentials.user == "user" && credentials.pass == "pass") return callback();
		callback(new Error("unauthorized"));
	}
})).
require({
	name: "hello",
	plugin: function() {
		return {
			sayHello: function(callback) {
				callback(null, "hello!");
			}
		}
	}
}).
load();
```

client.js

```javascript
var loader = plugin().
use(require(__dirname + "/../../").client()).
require("dnode://user:pass@localhost").
load(function(err, exports) {
	exports.hello.sayHello(function(err, message) {
		console.log(message);//hello!
	});
});
