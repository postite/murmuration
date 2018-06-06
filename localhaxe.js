// Generated by Haxe 3.3.0
if (process.version < "v4.0.0") console.warn("Module " + (typeof(module) == "undefined" ? "" : module.filename) + " requires node.js version 4.0.0 or higher");
(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var LocalHaxe = function() { };
LocalHaxe.runHaxe = function(args,env,cb) {
	var ver = process.argv.slice(2)[0];
	var haxePath = "" + __dirname + "/haxe" + ver;
	var compilerPath = "" + haxePath + "/haxe";
	var nekoPath = "" + haxePath + "/neko";
	var envSep;
	switch(js_node_Os.platform()) {
	case "darwin":
		nekoPath += "-osx";
		envSep = ":";
		break;
	case "win32":
		nekoPath += "-win";
		envSep = ";";
		compilerPath += ".exe";
		break;
	default:
		throw new js__$Boot_HaxeError("unsupported platform");
	}
	var this1 = { };
	var haxeEnv = this1;
	var _g1 = 0;
	var _g2 = Reflect.fields(process.env);
	while(_g1 < _g2.length) {
		var key = _g2[_g1];
		++_g1;
		haxeEnv[key.toUpperCase()] = process.env[key];
	}
	if(env != null) {
		var _g11 = 0;
		var _g21 = Reflect.fields(env);
		while(_g11 < _g21.length) {
			var key1 = _g21[_g11];
			++_g11;
			haxeEnv[key1] = env[key1];
		}
	}
	haxeEnv.HAXEPATH = haxePath;
	haxeEnv.HAXE_STD_PATH = "" + haxePath + "/std";
	haxeEnv.HAXELIB_PATH = "" + haxePath + "/lib";
	haxeEnv.NEKOPATH = nekoPath;
	haxeEnv.DYLD_FALLBACK_LIBRARY_PATH = nekoPath;
	haxeEnv.PATH = [haxeEnv.NEKOPATH,haxeEnv.HAXEPATH,haxeEnv.PATH].join(envSep);
	js_node_ChildProcess.spawn(compilerPath,args,{ stdio : "inherit", env : haxeEnv, cwd : __dirname}).on("exit",function(code,signal) {
		if(cb != null) {
			cb(code);
		} else {
			process.exit(code);
		}
	});
};
var Main = function() {
};
Main.main = function() {
	if(process.argv.slice(2)[1] != null) {
		LocalHaxe.runHaxe([process.argv.slice(2)[1]]);
	} else {
		LocalHaxe.runHaxe(["unbuild.hxml"]);
	}
};
var Reflect = function() { };
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
			a.push(f);
		}
		}
	}
	return a;
};
var haxe_io_Bytes = function() { };
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) {
		Error.captureStackTrace(this,js__$Boot_HaxeError);
	}
};
js__$Boot_HaxeError.wrap = function(val) {
	if((val instanceof Error)) {
		return val;
	} else {
		return new js__$Boot_HaxeError(val);
	}
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var js_node_ChildProcess = require("child_process");
var js_node_Os = require("os");
var js_node_buffer_Buffer = require("buffer").Buffer;
Main.main();
})();
