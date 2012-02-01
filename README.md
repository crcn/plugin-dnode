
### Usage

```javascript
var pluginLoader = require('haba').loader();

pluginLoader.require('haba.dnode').
require('dnode+https://localhost:9090').
init();
```

## DNode Setup


### DNode server

server.js:

```javascript
var dnode = require('dnode');

require('haba').loader().
require(__dirname + '/server/plugins').
init(function() {
	dnode(haba.plugin('dnode')).listen(5050);
});
```

server/plugins/hello.server.js:

```javascript
exports.plugin = function() {
	return {
		sayHello: function(callback) {
			callback('Hello World!');
		}
	}
}
```

### DNode client

client.js:

```javascript
require('haba')().
require('dnode+http://localhost:5050').
require(__dirname + '/client/plugins').
init();
```


client/plugins/hello.client.js:

```javascript
exports.require = 'hello.server';

exports.plugin = function() {
	var haba = this;
	
	return {
		init: function() {
			haba.plugin(exports.require).sayHello(message) {
				console.log(message);//Hello World!
			}
		}
	}
}
```