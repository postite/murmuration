(function (console, $global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var DateTools = function() { };
DateTools.__name__ = ["DateTools"];
DateTools.getMonthDays = function(d) {
	var month = d.getMonth();
	var year = d.getFullYear();
	if(month != 1) return DateTools.DAYS_OF_MONTH[month];
	var isB = year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
	if(isB) return 29; else return 28;
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
	,matchedPos: function() {
		if(this.r.m == null) throw new js__$Boot_HaxeError("No string matched");
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) len = -1;
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0?s:HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) this.r.s = s;
			return b;
		} else {
			var b1 = this.match(len < 0?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len));
			if(b1) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b1;
		}
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,map: function(s,f) {
		var offset = 0;
		var buf = new StringBuf();
		do {
			if(offset >= s.length) break; else if(!this.matchSub(s,offset)) {
				buf.add(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf.add(HxOverrides.substr(s,offset,p.pos - offset));
			buf.add(f(this));
			if(p.len == 0) {
				buf.add(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else offset = p.pos + p.len;
		} while(this.r.global);
		if(!this.r.global && offset > 0 && offset < s.length) buf.add(HxOverrides.substr(s,offset,null));
		return buf.b;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = ["Lambda"];
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
var List = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	h: null
	,length: null
	,iterator: function() {
		return new _$List_ListIterator(this.h);
	}
	,__class__: List
};
var _$List_ListIterator = function(head) {
	this.head = head;
	this.val = null;
};
_$List_ListIterator.__name__ = ["_List","ListIterator"];
_$List_ListIterator.prototype = {
	head: null
	,val: null
	,hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		this.val = this.head[0];
		this.head = this.head[1];
		return this.val;
	}
	,__class__: _$List_ListIterator
};
Math.__name__ = ["Math"];
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && v.__enum__ == null || t == "function" && (v.__name__ || v.__ename__) != null;
};
Reflect.isEnumValue = function(v) {
	return v != null && v.__enum__ != null;
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
var Std = function() { };
Std.__name__ = ["Std"];
Std.instance = function(value,c) {
	if((value instanceof c)) return value; else return null;
};
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	b: null
	,add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.rpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = s + c;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
};
var ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null; else return js_Boot.getClass(o);
};
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
};
Type.getSuperClass = function(c) {
	return c.__super__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw new js__$Boot_HaxeError("Too many arguments");
	}
	return null;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = js_Boot.getClass(v);
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var boidz_Boid = function(x,y,v,d) {
	if(v == null) v = 0.0;
	if(null == d) d = 0.0;
	this.x = x;
	this.y = y;
	this.v = v;
	this.d = d;
	this.peopleImage = new murmur_PeopleImage().render();
};
boidz_Boid.__name__ = ["boidz","Boid"];
boidz_Boid.prototype = {
	x: null
	,y: null
	,v: null
	,d: null
	,peopleImage: null
	,__class__: boidz_Boid
};
var boidz_Display = function(render) {
	this.renderEngine = render;
	this.renderables = new haxe_ds_ObjectMap();
};
boidz_Display.__name__ = ["boidz","Display"];
boidz_Display.prototype = {
	renderables: null
	,renderEngine: null
	,addRenderable: function(renderable) {
		this.renderables.set(renderable,true);
	}
	,removeRenderable: function(renderable) {
		this.renderables.remove(renderable);
	}
	,render: function() {
		this.renderEngine.clear();
		var $it0 = this.renderables.keys();
		while( $it0.hasNext() ) {
			var renderable = $it0.next();
			if(renderable.enabled) {
				this.renderEngine.beforeEach();
				renderable.render(this.renderEngine);
				this.renderEngine.afterEach();
			}
		}
	}
	,__class__: boidz_Display
};
var boidz_Flock = function() {
	this.step = 0.05;
	this.x = this.y = 0;
	this.v = 0;
	this.d = 0;
	this.boids = [];
	this.rules = [];
};
boidz_Flock.__name__ = ["boidz","Flock"];
boidz_Flock.prototype = {
	boids: null
	,rules: null
	,x: null
	,y: null
	,v: null
	,d: null
	,step: null
	,addRule: function(rule) {
		this.rules.push(rule);
	}
	,update: function() {
		this.setFlockAverages();
		var _g = 0;
		var _g1 = this.rules;
		while(_g < _g1.length) {
			var rule = _g1[_g];
			++_g;
			if(!rule.enabled) continue;
			if(!rule.before()) continue;
			var _g2 = 0;
			var _g3 = this.boids;
			while(_g2 < _g3.length) {
				var boid = _g3[_g2];
				++_g2;
				rule.modify(boid);
			}
		}
		var _g4 = 0;
		var _g11 = this.boids;
		while(_g4 < _g11.length) {
			var boid1 = _g11[_g4];
			++_g4;
			boid1.x += boid1.v * Math.cos(boid1.d * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerRadian);
			boid1.y += boid1.v * Math.sin(boid1.d * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerRadian);
		}
	}
	,setFlockAverages: function() {
		this.x = this.y = 0;
		this.v = 0;
		this.d = 0;
		var _g = 0;
		var _g1 = this.boids;
		while(_g < _g1.length) {
			var boid = _g1[_g];
			++_g;
			this.x += boid.x;
			this.y += boid.y;
			this.v += boid.v;
			this.d = this.d + boid.d;
		}
		var l = this.boids.length;
		this.x = this.x / l;
		this.y = this.y / l;
		this.v = this.v / l;
		this.d = this.d / l;
	}
	,__class__: boidz_Flock
};
var boidz_IFlockRule = function() { };
boidz_IFlockRule.__name__ = ["boidz","IFlockRule"];
boidz_IFlockRule.prototype = {
	enabled: null
	,before: null
	,modify: null
	,__class__: boidz_IFlockRule
};
var boidz_IRender = function() { };
boidz_IRender.__name__ = ["boidz","IRender"];
boidz_IRender.prototype = {
	clear: null
	,beforeEach: null
	,afterEach: null
	,__class__: boidz_IRender
};
var boidz_IRenderable = function() { };
boidz_IRenderable.__name__ = ["boidz","IRenderable"];
boidz_IRenderable.prototype = {
	enabled: null
	,render: null
	,__class__: boidz_IRenderable
};
var boidz_render_canvas_CanvasBoundaries = function(boundaries) {
	this.color = "#BBBBBB";
	this.enabled = true;
	this.boundaries = boundaries;
};
boidz_render_canvas_CanvasBoundaries.__name__ = ["boidz","render","canvas","CanvasBoundaries"];
boidz_render_canvas_CanvasBoundaries.__interfaces__ = [boidz_IRenderable];
boidz_render_canvas_CanvasBoundaries.prototype = {
	boundaries: null
	,enabled: null
	,color: null
	,render: function(render) {
		var ctx = render.ctx;
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.setLineDash([2,2]);
		ctx.moveTo(Math.round(this.boundaries.minx + this.boundaries.offset) + 0.5,Math.round(this.boundaries.miny + this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.maxx - this.boundaries.offset) + 0.5,Math.round(this.boundaries.miny + this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.maxx - this.boundaries.offset) + 0.5,Math.round(this.boundaries.maxy - this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.minx + this.boundaries.offset) + 0.5,Math.round(this.boundaries.maxy - this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.minx + this.boundaries.offset) + 0.5,Math.round(this.boundaries.miny + this.boundaries.offset) + 0.5);
		ctx.stroke();
	}
	,__class__: boidz_render_canvas_CanvasBoundaries
};
var boidz_render_canvas_CanvasIndividualWaypoints = function(waypoints) {
	this.enabled = true;
	this.waypoints = waypoints;
};
boidz_render_canvas_CanvasIndividualWaypoints.__name__ = ["boidz","render","canvas","CanvasIndividualWaypoints"];
boidz_render_canvas_CanvasIndividualWaypoints.__interfaces__ = [boidz_IRenderable];
boidz_render_canvas_CanvasIndividualWaypoints.prototype = {
	waypoints: null
	,enabled: null
	,render: function(render) {
		var ctx = render.ctx;
		ctx.lineWidth = 1;
		ctx.setLineDash([2]);
		ctx.fillStyle = "rgba(0,0,0,0.2)";
		var _g1 = this.waypoints.current;
		var _g = this.waypoints.goals.length;
		while(_g1 < _g) {
			var i = _g1++;
			var goal = this.waypoints.goals[i];
			ctx.strokeStyle = "#CCCCCC";
			if(i > this.waypoints.current) {
				ctx.lineTo(goal.x,goal.y);
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.strokeStyle = "";
			ctx.arc(goal.x,goal.y,this.waypoints.radius,0,2 * Math.PI,false);
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(goal.x,goal.y);
		}
	}
	,__class__: boidz_render_canvas_CanvasIndividualWaypoints
};
var boidz_render_canvas_CanvasRender = function(canvas) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d",null);
	this.ctx.save();
};
boidz_render_canvas_CanvasRender.__name__ = ["boidz","render","canvas","CanvasRender"];
boidz_render_canvas_CanvasRender.__interfaces__ = [boidz_IRender];
boidz_render_canvas_CanvasRender.prototype = {
	canvas: null
	,ctx: null
	,clear: function() {
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	}
	,beforeEach: function() {
		this.ctx.save();
	}
	,afterEach: function() {
		this.ctx.restore();
	}
	,__class__: boidz_render_canvas_CanvasRender
};
var boidz_render_canvas_ZoneBounds = function(boundaries) {
	this.color = "#BBBBBB";
	this.enabled = true;
	this.boundaries = boundaries;
	this.minx = boundaries.minx;
	this.miny = boundaries.miny;
	this.maxx = boundaries.maxx;
	this.maxy = boundaries.maxy;
};
boidz_render_canvas_ZoneBounds.__name__ = ["boidz","render","canvas","ZoneBounds"];
boidz_render_canvas_ZoneBounds.__interfaces__ = [boidz_IRenderable];
boidz_render_canvas_ZoneBounds.prototype = {
	boundaries: null
	,minx: null
	,maxx: null
	,miny: null
	,maxy: null
	,enabled: null
	,color: null
	,render: function(render) {
		var ctx = render.ctx;
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.setLineDash([2,2]);
		ctx.moveTo(Math.round(this.boundaries.minx + this.boundaries.offset) + 0.5,Math.round(this.boundaries.miny + this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.maxx - this.boundaries.offset) + 0.5,Math.round(this.boundaries.miny + this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.maxx - this.boundaries.offset) + 0.5,Math.round(this.boundaries.maxy - this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.minx + this.boundaries.offset) + 0.5,Math.round(this.boundaries.maxy - this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.minx + this.boundaries.offset) + 0.5,Math.round(this.boundaries.miny + this.boundaries.offset) + 0.5);
		ctx.stroke();
	}
	,__class__: boidz_render_canvas_ZoneBounds
};
var boidz_rules_AvoidCollisions = function(flock,radius,maxSteer) {
	if(radius == null) radius = 5;
	this.proportional = false;
	this.enabled = true;
	if(null == maxSteer) maxSteer = 10.0;
	this.flock = flock;
	this.set_radius(radius);
	this.maxSteer = maxSteer;
	this.a = { x : 0.0, y : 0.0};
};
boidz_rules_AvoidCollisions.__name__ = ["boidz","rules","AvoidCollisions"];
boidz_rules_AvoidCollisions.__interfaces__ = [boidz_IFlockRule];
boidz_rules_AvoidCollisions.prototype = {
	radius: null
	,flock: null
	,enabled: null
	,proportional: null
	,maxSteer: null
	,squareRadius: null
	,a: null
	,before: function() {
		return true;
	}
	,modify: function(b) {
		var dx = 0.0;
		var dy = 0.0;
		var count = 0;
		this.a.x = this.a.y = 0.0;
		var _g = 0;
		var _g1 = this.flock.boids;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			if(n == b) continue;
			dx = b.x - n.x;
			dy = b.y - n.y;
			if(dx * dx + dy * dy > this.squareRadius) continue;
			this.a.x += n.x;
			this.a.y += n.y;
			count++;
		}
		if(count == 0) return;
		this.a.x /= count;
		this.a.y /= count;
		if(this.proportional) {
			var dist = Math.sqrt((this.a.x - b.x) * (this.a.x - b.x) + (this.a.y - b.y) * (this.a.y - b.y));
			var that;
			var this1;
			var this2 = boidz_util_Steer.away(b,this.a,this.maxSteer);
			var that2 = this.get_radius() - dist;
			this1 = this2 * that2;
			var that1 = this.get_radius();
			that = this1 / that1;
			b.d = b.d + that;
		} else {
			var that3 = boidz_util_Steer.away(b,this.a,this.maxSteer);
			b.d = b.d + that3;
		}
	}
	,get_radius: function() {
		return this.radius;
	}
	,set_radius: function(r) {
		this.radius = r;
		this.squareRadius = r * r;
		return r;
	}
	,__class__: boidz_rules_AvoidCollisions
};
var boidz_rules_IndividualWaypoints = function(flock,radius,maxSteer) {
	if(radius == null) radius = 10;
	this.current = 0;
	this.enabled = true;
	if(null == maxSteer) maxSteer = 15.0;
	this.flock = flock;
	this.radius = radius;
	this.goals = [];
	this.onStep = function(coords) {
	};
	this.onBoidStep = function(b,coords1) {
	};
	this.set_maxSteer(maxSteer);
	this.goalRule = new boidz_rules_SteerTowardGoal(0,0,maxSteer);
	this.map = new haxe_ds_ObjectMap();
};
boidz_rules_IndividualWaypoints.__name__ = ["boidz","rules","IndividualWaypoints"];
boidz_rules_IndividualWaypoints.__interfaces__ = [boidz_IFlockRule];
boidz_rules_IndividualWaypoints.prototype = {
	goals: null
	,enabled: null
	,radius: null
	,onStep: null
	,onBoidStep: null
	,flock: null
	,maxSteer: null
	,goalRule: null
	,map: null
	,current: null
	,addGoal: function(x,y) {
		this.goals.push({ x : x, y : y});
	}
	,before: function() {
		if(this.goals.length == 0) return false;
		var counter = 0;
		var _g = 0;
		var _g1 = this.flock.boids;
		while(_g < _g1.length) {
			var boid = _g1[_g];
			++_g;
			var pos = this.map.h[boid.__id__];
			if(null == pos) {
				pos = this.current;
				this.map.set(boid,pos);
				counter++;
			} else if(pos == this.current) counter++;
			var p = this.goals[pos];
			if(null == p) continue;
			var dx = p.x - boid.x;
			var dy = p.y - boid.y;
			if(dx * dx + dy * dy <= this.radius * this.radius) {
				this.onBoidStep(boid,p);
				if(pos == this.current) counter--;
				pos += 1;
				this.map.set(boid,pos);
			}
		}
		if(counter == 0) this.current++;
		return this.goals.length > 0;
	}
	,modify: function(b) {
		var pos = this.map.h[b.__id__];
		if(pos < this.goals.length) {
			var p = this.goals[pos];
			this.goalRule.x = p.x;
			this.goalRule.y = p.y;
			this.goalRule.modify(b);
		}
	}
	,updateGoalRuleForBoid: function(b) {
		this.goalRule.x = 100;
		this.goalRule.y = 200;
	}
	,get_maxSteer: function() {
		return this.maxSteer;
	}
	,set_maxSteer: function(v) {
		if(null != this.goalRule) this.goalRule.maxSteer = v;
		return this.maxSteer = v;
	}
	,__class__: boidz_rules_IndividualWaypoints
};
var boidz_rules_RespectBoundaries = function(minx,maxx,miny,maxy,offset,maxSteer) {
	if(offset == null) offset = 0.0;
	this.enabled = true;
	if(null == maxSteer) maxSteer = 10;
	this.minx = minx;
	this.maxx = maxx;
	this.miny = miny;
	this.maxy = maxy;
	this.offset = offset;
	this.maxSteer = maxSteer;
};
boidz_rules_RespectBoundaries.__name__ = ["boidz","rules","RespectBoundaries"];
boidz_rules_RespectBoundaries.__interfaces__ = [boidz_IFlockRule];
boidz_rules_RespectBoundaries.prototype = {
	minx: null
	,maxx: null
	,miny: null
	,maxy: null
	,offset: null
	,enabled: null
	,maxSteer: null
	,before: function() {
		return true;
	}
	,modify: function(b) {
		if(b.x < this.minx + this.offset && boidz_util_Steer.facingLeft(b.d) || b.x > this.maxx - this.offset && boidz_util_Steer.facingRight(b.d)) b.d = b.d + this.maxSteer * (b.d < 0?-1:1);
		if(b.y < this.miny + this.offset && boidz_util_Steer.facingUp(b.d) || b.y > this.maxy - this.offset && boidz_util_Steer.facingDown(b.d)) b.d = b.d + this.maxSteer * (b.d < 0?-1:1);
	}
	,__class__: boidz_rules_RespectBoundaries
};
var boidz_rules_SteerTowardGoal = function(x,y,maxSteer) {
	this.enabled = true;
	if(null == maxSteer) maxSteer = 5.0;
	this.x = x;
	this.y = y;
	this.maxSteer = maxSteer;
};
boidz_rules_SteerTowardGoal.__name__ = ["boidz","rules","SteerTowardGoal"];
boidz_rules_SteerTowardGoal.__interfaces__ = [boidz_IFlockRule];
boidz_rules_SteerTowardGoal.prototype = {
	x: null
	,y: null
	,maxSteer: null
	,enabled: null
	,before: function() {
		return true;
	}
	,modify: function(b) {
		var that = boidz_util_Steer.toward(b,this,this.maxSteer);
		b.d = b.d + that;
	}
	,__class__: boidz_rules_SteerTowardGoal
};
var boidz_rules_SteerTowardZone = function(flock,zone,maxSteer) {
	this.no = false;
	this.run = true;
	this.go = true;
	this.count = 0;
	this.done = new haxe_ds_ObjectMap();
	this.points = [];
	this.map = new haxe_ds_ObjectMap();
	this.enabled = true;
	if(null == maxSteer) maxSteer = 10;
	this.flock = flock;
	this.zone = zone;
	var _g = 0;
	var _g1 = flock.boids;
	while(_g < _g1.length) {
		var b = _g1[_g];
		++_g;
		var p = { x : zone.minx + Math.random() * zone.maxx, y : zone.miny + Math.random() * zone.maxy};
		this.points.push(p);
		this.map.set(b,p);
	}
};
boidz_rules_SteerTowardZone.__name__ = ["boidz","rules","SteerTowardZone"];
boidz_rules_SteerTowardZone.__interfaces__ = [boidz_IFlockRule];
boidz_rules_SteerTowardZone.prototype = {
	flock: null
	,goal: null
	,enabled: null
	,maxSteer: null
	,zone: null
	,map: null
	,points: null
	,before: function() {
		return true;
	}
	,done: null
	,count: null
	,go: null
	,run: null
	,no: null
	,modify: function(b) {
		if(this.no) return;
		if(this.count > 10) this.doit();
		if(this.go) {
			var that = boidz_util_Steer.toward(b,this.map.h[b.__id__],this.maxSteer);
			b.d = b.d + that;
		}
		if(!this.done.h[b.__id__]) {
			if(Math.round(b.y) == Math.round(this.map.h[b.__id__].y) && Math.round(b.x) == Math.round(this.map.h[b.__id__].x)) {
				this.done.set(b,true);
				this.count++;
				b.v = 0;
			}
		} else {
		}
	}
	,doit: function() {
		this.no = true;
	}
	,gof: function(b) {
		var _g = this;
		var t = haxe_Timer.delay(function() {
			_g.run = false;
		},3000);
	}
	,__class__: boidz_rules_SteerTowardZone
};
var boidz_util_Steer = function() { };
boidz_util_Steer.__name__ = ["boidz","util","Steer"];
boidz_util_Steer.away = function(a,b,max) {
	var px = a.x - b.x;
	var py = a.y - b.y;
	var d = thx_unit_angle__$Degree_Degree_$Impl_$.normalizeDirection((function($this) {
		var $r;
		var this1;
		{
			var this2;
			{
				var value = Math.atan2(py,px);
				this2 = value;
			}
			this1 = this2 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerDegree;
		}
		$r = this1 - a.d;
		return $r;
	}(this)));
	if(null != max) {
		var this3;
		var this4;
		{
			var value1 = Math.abs(d);
			this4 = value1;
		}
		{
			var value2 = thx_Floats.min(this4,max);
			this3 = value2;
		}
		d = this3 * (d < 0?-1:1);
	}
	return d;
};
boidz_util_Steer.toward = function(a,b,max) {
	var px = b.x - a.x;
	var py = b.y - a.y;
	var d = thx_unit_angle__$Degree_Degree_$Impl_$.normalizeDirection((function($this) {
		var $r;
		var this1;
		{
			var this2;
			{
				var value = Math.atan2(py,px);
				this2 = value;
			}
			this1 = this2 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerDegree;
		}
		$r = this1 - a.d;
		return $r;
	}(this)));
	if(null != max) {
		var this3;
		var this4;
		{
			var value1 = Math.abs(d);
			this4 = value1;
		}
		{
			var value2 = thx_Floats.min(this4,max);
			this3 = value2;
		}
		d = this3 * (d < 0?-1:1);
	}
	return d;
};
boidz_util_Steer.converge = function(src,dst,max) {
	var delta = dst - src;
	if(Math.abs(delta) > max) return (delta < 0?-1:1) * max; else return delta;
};
boidz_util_Steer.facingRight = function(d) {
	d = thx_unit_angle__$Degree_Degree_$Impl_$.normalize(d);
	return d >= 270 || d < 90;
};
boidz_util_Steer.facingLeft = function(d) {
	d = thx_unit_angle__$Degree_Degree_$Impl_$.normalize(d);
	return d < 270 && d >= 90;
};
boidz_util_Steer.facingUp = function(d) {
	d = thx_unit_angle__$Degree_Degree_$Impl_$.normalize(d);
	return d >= 180;
};
boidz_util_Steer.facingDown = function(d) {
	d = thx_unit_angle__$Degree_Degree_$Impl_$.normalize(d);
	return d < 180;
};
var crowded_Crowd = function() {
	var service = new crowded_CrowdService();
	service.getSimpleList();
};
crowded_Crowd.__name__ = ["crowded","Crowd"];
crowded_Crowd.prototype = {
	__class__: crowded_Crowd
};
var crowded_CrowdService = function() {
};
crowded_CrowdService.__name__ = ["crowded","CrowdService"];
crowded_CrowdService.prototype = {
	getSimpleList: function() {
		var req = haxe_Http.requestUrl(crowded_CrowdService.server + "/dynamicQuery");
		return JSON.parse(req);
	}
	,__class__: crowded_CrowdService
};
var haxe_StackItem = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe_StackItem.CFunction = ["CFunction",0];
haxe_StackItem.CFunction.toString = $estr;
haxe_StackItem.CFunction.__enum__ = haxe_StackItem;
haxe_StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
var haxe_CallStack = function() { };
haxe_CallStack.__name__ = ["haxe","CallStack"];
haxe_CallStack.getStack = function(e) {
	if(e == null) return [];
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			if(haxe_CallStack.wrapCallSite != null) site = haxe_CallStack.wrapCallSite(site);
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe_StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe_StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe_CallStack.makeStack(e.stack);
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe_CallStack.callStack = function() {
	try {
		throw new Error();
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		var a = haxe_CallStack.getStack(e);
		a.shift();
		return a;
	}
};
haxe_CallStack.exceptionStack = function() {
	return haxe_CallStack.getStack(haxe_CallStack.lastException);
};
haxe_CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe_CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe_CallStack.itemToString = function(b,s) {
	switch(s[1]) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = s[2];
		b.b += "module ";
		if(m == null) b.b += "null"; else b.b += "" + m;
		break;
	case 2:
		var line = s[4];
		var file = s[3];
		var s1 = s[2];
		if(s1 != null) {
			haxe_CallStack.itemToString(b,s1);
			b.b += " (";
		}
		if(file == null) b.b += "null"; else b.b += "" + file;
		b.b += " line ";
		if(line == null) b.b += "null"; else b.b += "" + line;
		if(s1 != null) b.b += ")";
		break;
	case 3:
		var meth = s[3];
		var cname = s[2];
		if(cname == null) b.b += "null"; else b.b += "" + cname;
		b.b += ".";
		if(meth == null) b.b += "null"; else b.b += "" + meth;
		break;
	case 4:
		var n = s[2];
		b.b += "local function #";
		if(n == null) b.b += "null"; else b.b += "" + n;
		break;
	}
};
haxe_CallStack.makeStack = function(s) {
	if(s == null) return []; else if(typeof(s) == "string") {
		var stack = s.split("\n");
		if(stack[0] == "Error") stack.shift();
		var m = [];
		var rie10 = new EReg("^   at ([A-Za-z0-9_. ]+) \\(([^)]+):([0-9]+):([0-9]+)\\)$","");
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			if(rie10.match(line)) {
				var path = rie10.matched(1).split(".");
				var meth = path.pop();
				var file = rie10.matched(2);
				var line1 = Std.parseInt(rie10.matched(3));
				m.push(haxe_StackItem.FilePos(meth == "Anonymous function"?haxe_StackItem.LocalFunction():meth == "Global code"?null:haxe_StackItem.Method(path.join("."),meth),file,line1));
			} else m.push(haxe_StackItem.Module(StringTools.trim(line)));
		}
		return m;
	} else return s;
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = ["haxe","IMap"];
haxe_IMap.prototype = {
	get: null
	,set: null
	,exists: null
	,remove: null
	,keys: null
	,iterator: null
	,__class__: haxe_IMap
};
var haxe_Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
haxe_Http.__name__ = ["haxe","Http"];
haxe_Http.requestUrl = function(url) {
	var h = new haxe_Http(url);
	h.async = false;
	var r = null;
	h.onData = function(d) {
		r = d;
	};
	h.onError = function(e) {
		throw new js__$Boot_HaxeError(e);
	};
	h.request(false);
	return r;
};
haxe_Http.prototype = {
	url: null
	,responseData: null
	,async: null
	,postData: null
	,headers: null
	,params: null
	,req: null
	,request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js_Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				haxe_CallStack.lastException = e;
				if (e instanceof js__$Boot_HaxeError) e = e.val;
				s = null;
			}
			if(s != null) {
				var protocol = window.location.protocol.toLowerCase();
				var rlocalProtocol = new EReg("^(?:about|app|app-storage|.+-extension|file|res|widget):$","");
				var isLocal = rlocalProtocol.match(protocol);
				if(isLocal) if(r.responseText != null) s = 200; else s = 404;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var _g_head = this.params.h;
			var _g_val = null;
			while(_g_head != null) {
				var p;
				p = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			haxe_CallStack.lastException = e1;
			if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var _g_head1 = this.headers.h;
		var _g_val1 = null;
		while(_g_head1 != null) {
			var h1;
			h1 = (function($this) {
				var $r;
				_g_val1 = _g_head1[0];
				_g_head1 = _g_head1[1];
				$r = _g_val1;
				return $r;
			}(this));
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,__class__: haxe_Http
};
var haxe__$Int32_Int32_$Impl_$ = {};
haxe__$Int32_Int32_$Impl_$.__name__ = ["haxe","_Int32","Int32_Impl_"];
haxe__$Int32_Int32_$Impl_$.mul = function(a,b) {
	return a * (b & 65535) + (a * (b >>> 16) << 16 | 0) | 0;
};
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
haxe__$Int64__$_$_$Int64.__name__ = ["haxe","_Int64","___Int64"];
haxe__$Int64__$_$_$Int64.prototype = {
	high: null
	,low: null
	,__class__: haxe__$Int64__$_$_$Int64
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = ["haxe","Timer"];
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	id: null
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_Utf8 = function() { };
haxe_Utf8.__name__ = ["haxe","Utf8"];
haxe_Utf8.compare = function(a,b) {
	if(a > b) return 1; else if(a == b) return 0; else return -1;
};
haxe_Utf8.sub = function(s,pos,len) {
	return HxOverrides.substr(s,pos,len);
};
var haxe_crypto_Base64 = function() { };
haxe_crypto_Base64.__name__ = ["haxe","crypto","Base64"];
var haxe_ds_BalancedTree = function() {
};
haxe_ds_BalancedTree.__name__ = ["haxe","ds","BalancedTree"];
haxe_ds_BalancedTree.prototype = {
	root: null
	,set: function(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	,get: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) return node.value;
			if(c < 0) node = node.left; else node = node.right;
		}
		return null;
	}
	,remove: function(key) {
		try {
			this.root = this.removeLoop(key,this.root);
			return true;
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			if( js_Boot.__instanceof(e,String) ) {
				return false;
			} else throw(e);
		}
	}
	,exists: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) return true; else if(c < 0) node = node.left; else node = node.right;
		}
		return false;
	}
	,iterator: function() {
		var ret = [];
		this.iteratorLoop(this.root,ret);
		return HxOverrides.iter(ret);
	}
	,keys: function() {
		var ret = [];
		this.keysLoop(this.root,ret);
		return HxOverrides.iter(ret);
	}
	,setLoop: function(k,v,node) {
		if(node == null) return new haxe_ds_TreeNode(null,k,v,null);
		var c = this.compare(k,node.key);
		if(c == 0) return new haxe_ds_TreeNode(node.left,k,v,node.right,node == null?0:node._height); else if(c < 0) {
			var nl = this.setLoop(k,v,node.left);
			return this.balance(nl,node.key,node.value,node.right);
		} else {
			var nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	,removeLoop: function(k,node) {
		if(node == null) throw new js__$Boot_HaxeError("Not_found");
		var c = this.compare(k,node.key);
		if(c == 0) return this.merge(node.left,node.right); else if(c < 0) return this.balance(this.removeLoop(k,node.left),node.key,node.value,node.right); else return this.balance(node.left,node.key,node.value,this.removeLoop(k,node.right));
	}
	,iteratorLoop: function(node,acc) {
		if(node != null) {
			this.iteratorLoop(node.left,acc);
			acc.push(node.value);
			this.iteratorLoop(node.right,acc);
		}
	}
	,keysLoop: function(node,acc) {
		if(node != null) {
			this.keysLoop(node.left,acc);
			acc.push(node.key);
			this.keysLoop(node.right,acc);
		}
	}
	,merge: function(t1,t2) {
		if(t1 == null) return t2;
		if(t2 == null) return t1;
		var t = this.minBinding(t2);
		return this.balance(t1,t.key,t.value,this.removeMinBinding(t2));
	}
	,minBinding: function(t) {
		if(t == null) throw new js__$Boot_HaxeError("Not_found"); else if(t.left == null) return t; else return this.minBinding(t.left);
	}
	,removeMinBinding: function(t) {
		if(t.left == null) return t.right; else return this.balance(this.removeMinBinding(t.left),t.key,t.value,t.right);
	}
	,balance: function(l,k,v,r) {
		var hl;
		if(l == null) hl = 0; else hl = l._height;
		var hr;
		if(r == null) hr = 0; else hr = r._height;
		if(hl > hr + 2) {
			if((function($this) {
				var $r;
				var _this = l.left;
				$r = _this == null?0:_this._height;
				return $r;
			}(this)) >= (function($this) {
				var $r;
				var _this1 = l.right;
				$r = _this1 == null?0:_this1._height;
				return $r;
			}(this))) return new haxe_ds_TreeNode(l.left,l.key,l.value,new haxe_ds_TreeNode(l.right,k,v,r)); else return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe_ds_TreeNode(l.right.right,k,v,r));
		} else if(hr > hl + 2) {
			if((function($this) {
				var $r;
				var _this2 = r.right;
				$r = _this2 == null?0:_this2._height;
				return $r;
			}(this)) > (function($this) {
				var $r;
				var _this3 = r.left;
				$r = _this3 == null?0:_this3._height;
				return $r;
			}(this))) return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left),r.key,r.value,r.right); else return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe_ds_TreeNode(r.left.right,r.key,r.value,r.right));
		} else return new haxe_ds_TreeNode(l,k,v,r,(hl > hr?hl:hr) + 1);
	}
	,compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	,__class__: haxe_ds_BalancedTree
};
var haxe_ds_TreeNode = function(l,k,v,r,h) {
	if(h == null) h = -1;
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) this._height = ((function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this._height;
		return $r;
	}(this)) > (function($this) {
		var $r;
		var _this1 = $this.right;
		$r = _this1 == null?0:_this1._height;
		return $r;
	}(this))?(function($this) {
		var $r;
		var _this2 = $this.left;
		$r = _this2 == null?0:_this2._height;
		return $r;
	}(this)):(function($this) {
		var $r;
		var _this3 = $this.right;
		$r = _this3 == null?0:_this3._height;
		return $r;
	}(this))) + 1; else this._height = h;
};
haxe_ds_TreeNode.__name__ = ["haxe","ds","TreeNode"];
haxe_ds_TreeNode.prototype = {
	left: null
	,right: null
	,key: null
	,value: null
	,_height: null
	,__class__: haxe_ds_TreeNode
};
var haxe_ds_EnumValueMap = function() {
	haxe_ds_BalancedTree.call(this);
};
haxe_ds_EnumValueMap.__name__ = ["haxe","ds","EnumValueMap"];
haxe_ds_EnumValueMap.__interfaces__ = [haxe_IMap];
haxe_ds_EnumValueMap.__super__ = haxe_ds_BalancedTree;
haxe_ds_EnumValueMap.prototype = $extend(haxe_ds_BalancedTree.prototype,{
	compare: function(k1,k2) {
		var d = k1[1] - k2[1];
		if(d != 0) return d;
		var p1 = k1.slice(2);
		var p2 = k2.slice(2);
		if(p1.length == 0 && p2.length == 0) return 0;
		return this.compareArgs(p1,p2);
	}
	,compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) return ld;
		var _g1 = 0;
		var _g = a1.length;
		while(_g1 < _g) {
			var i = _g1++;
			var d = this.compareArg(a1[i],a2[i]);
			if(d != 0) return d;
		}
		return 0;
	}
	,compareArg: function(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) return this.compare(v1,v2); else if((v1 instanceof Array) && v1.__enum__ == null && ((v2 instanceof Array) && v2.__enum__ == null)) return this.compareArgs(v1,v2); else return Reflect.compare(v1,v2);
	}
	,__class__: haxe_ds_EnumValueMap
});
var haxe_ds_IntMap = function() {
	this.h = { };
};
haxe_ds_IntMap.__name__ = ["haxe","ds","IntMap"];
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe_ds_ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
haxe_ds_ObjectMap.prototype = {
	h: null
	,set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe_ds_ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,exists: function(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	,remove: function(key) {
		var id = key.__id__;
		if(this.h.__keys__[id] == null) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i.__id__];
		}};
	}
	,__class__: haxe_ds_ObjectMap
};
var haxe_ds_Option = { __ename__ : ["haxe","ds","Option"], __constructs__ : ["Some","None"] };
haxe_ds_Option.Some = function(v) { var $x = ["Some",0,v]; $x.__enum__ = haxe_ds_Option; $x.toString = $estr; return $x; };
haxe_ds_Option.None = ["None",1];
haxe_ds_Option.None.toString = $estr;
haxe_ds_Option.None.__enum__ = haxe_ds_Option;
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
haxe_ds__$StringMap_StringMapIterator.__name__ = ["haxe","ds","_StringMap","StringMapIterator"];
haxe_ds__$StringMap_StringMapIterator.prototype = {
	map: null
	,keys: null
	,index: null
	,count: null
	,hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: haxe_ds__$StringMap_StringMapIterator
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	h: null
	,rh: null
	,set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,iterator: function() {
		return new haxe_ds__$StringMap_StringMapIterator(this,this.arrayKeys());
	}
	,__class__: haxe_ds_StringMap
};
var haxe_io_Error = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
var haxe_io_FPHelper = function() { };
haxe_io_FPHelper.__name__ = ["haxe","io","FPHelper"];
haxe_io_FPHelper.i32ToFloat = function(i) {
	var sign = 1 - (i >>> 31 << 1);
	var exp = i >>> 23 & 255;
	var sig = i & 8388607;
	if(sig == 0 && exp == 0) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp - 127);
};
haxe_io_FPHelper.floatToI32 = function(f) {
	if(f == 0) return 0;
	var af;
	if(f < 0) af = -f; else af = f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) exp = -127; else if(exp > 128) exp = 128;
	var sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608) & 8388607;
	return (f < 0?-2147483648:0) | exp + 127 << 23 | sig;
};
haxe_io_FPHelper.i64ToDouble = function(low,high) {
	var sign = 1 - (high >>> 31 << 1);
	var exp = (high >> 20 & 2047) - 1023;
	var sig = (high & 1048575) * 4294967296. + (low >>> 31) * 2147483648. + (low & 2147483647);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
haxe_io_FPHelper.doubleToI64 = function(v) {
	var i64 = haxe_io_FPHelper.i64tmp;
	if(v == 0) {
		i64.low = 0;
		i64.high = 0;
	} else {
		var av;
		if(v < 0) av = -v; else av = v;
		var exp = Math.floor(Math.log(av) / 0.6931471805599453);
		var sig;
		var v1 = (av / Math.pow(2,exp) - 1) * 4503599627370496.;
		sig = Math.round(v1);
		var sig_l = sig | 0;
		var sig_h = sig / 4294967296.0 | 0;
		i64.low = sig_l;
		i64.high = (v < 0?-2147483648:0) | exp + 1023 << 20 | sig_h;
	}
	return i64;
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	val: null
	,__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = ["js","Boot"];
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_Browser = function() { };
js_Browser.__name__ = ["js","Browser"];
js_Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw new js__$Boot_HaxeError("Unable to create XMLHttpRequest object.");
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
js_html_compat_ArrayBuffer.__name__ = ["js","html","compat","ArrayBuffer"];
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null?null:end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	byteLength: null
	,a: null
	,slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_DataView = function(buffer,byteOffset,byteLength) {
	this.buf = buffer;
	if(byteOffset == null) this.offset = 0; else this.offset = byteOffset;
	if(byteLength == null) this.length = buffer.byteLength - this.offset; else this.length = byteLength;
	if(this.offset < 0 || this.length < 0 || this.offset + this.length > buffer.byteLength) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
};
js_html_compat_DataView.__name__ = ["js","html","compat","DataView"];
js_html_compat_DataView.prototype = {
	buf: null
	,offset: null
	,length: null
	,getInt8: function(byteOffset) {
		var v = this.buf.a[this.offset + byteOffset];
		if(v >= 128) return v - 256; else return v;
	}
	,getUint8: function(byteOffset) {
		return this.buf.a[this.offset + byteOffset];
	}
	,getInt16: function(byteOffset,littleEndian) {
		var v = this.getUint16(byteOffset,littleEndian);
		if(v >= 32768) return v - 65536; else return v;
	}
	,getUint16: function(byteOffset,littleEndian) {
		if(littleEndian) return this.buf.a[this.offset + byteOffset] | this.buf.a[this.offset + byteOffset + 1] << 8; else return this.buf.a[this.offset + byteOffset] << 8 | this.buf.a[this.offset + byteOffset + 1];
	}
	,getInt32: function(byteOffset,littleEndian) {
		var p = this.offset + byteOffset;
		var a = this.buf.a[p++];
		var b = this.buf.a[p++];
		var c = this.buf.a[p++];
		var d = this.buf.a[p++];
		if(littleEndian) return a | b << 8 | c << 16 | d << 24; else return d | c << 8 | b << 16 | a << 24;
	}
	,getUint32: function(byteOffset,littleEndian) {
		var v = this.getInt32(byteOffset,littleEndian);
		if(v < 0) return v + 4294967296.; else return v;
	}
	,getFloat32: function(byteOffset,littleEndian) {
		return haxe_io_FPHelper.i32ToFloat(this.getInt32(byteOffset,littleEndian));
	}
	,getFloat64: function(byteOffset,littleEndian) {
		var a = this.getInt32(byteOffset,littleEndian);
		var b = this.getInt32(byteOffset + 4,littleEndian);
		return haxe_io_FPHelper.i64ToDouble(littleEndian?a:b,littleEndian?b:a);
	}
	,setInt8: function(byteOffset,value) {
		if(value < 0) this.buf.a[byteOffset + this.offset] = value + 128 & 255; else this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setUint8: function(byteOffset,value) {
		this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setInt16: function(byteOffset,value,littleEndian) {
		this.setUint16(byteOffset,value < 0?value + 65536:value,littleEndian);
	}
	,setUint16: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
		} else {
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p] = value & 255;
		}
	}
	,setInt32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,value,littleEndian);
	}
	,setUint32: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p++] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >>> 24;
		} else {
			this.buf.a[p++] = value >>> 24;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value & 255;
		}
	}
	,setFloat32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,haxe_io_FPHelper.floatToI32(value),littleEndian);
	}
	,setFloat64: function(byteOffset,value,littleEndian) {
		var i64 = haxe_io_FPHelper.doubleToI64(value);
		if(littleEndian) {
			this.setUint32(byteOffset,i64.low);
			this.setUint32(byteOffset,i64.high);
		} else {
			this.setUint32(byteOffset,i64.high);
			this.setUint32(byteOffset,i64.low);
		}
	}
	,__class__: js_html_compat_DataView
};
var js_html_compat_Uint8Array = function() { };
js_html_compat_Uint8Array.__name__ = ["js","html","compat","Uint8Array"];
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g = 0;
		while(_g < arg1) {
			var i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset;
		if(offset == 0) arr = buffer.a; else arr = buffer.a.slice(offset,offset + length);
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	var t = this;
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw new js__$Boot_HaxeError("TODO");
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var t = this;
	var a = js_html_compat_Uint8Array._new(t.slice(start,end));
	a.byteOffset = start;
	return a;
};
var msignal_Signal = function(valueClasses) {
	if(valueClasses == null) valueClasses = [];
	this.valueClasses = valueClasses;
	this.slots = msignal_SlotList.NIL;
	this.priorityBased = false;
};
msignal_Signal.__name__ = ["msignal","Signal"];
msignal_Signal.prototype = {
	valueClasses: null
	,numListeners: null
	,slots: null
	,priorityBased: null
	,add: function(listener) {
		return this.registerListener(listener);
	}
	,addOnce: function(listener) {
		return this.registerListener(listener,true);
	}
	,addWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,false,priority);
	}
	,addOnceWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,true,priority);
	}
	,remove: function(listener) {
		var slot = this.slots.find(listener);
		if(slot == null) return null;
		this.slots = this.slots.filterNot(listener);
		return slot;
	}
	,removeAll: function() {
		this.slots = msignal_SlotList.NIL;
	}
	,registerListener: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		if(this.registrationPossible(listener,once)) {
			var newSlot = this.createSlot(listener,once,priority);
			if(!this.priorityBased && priority != 0) this.priorityBased = true;
			if(!this.priorityBased && priority == 0) this.slots = this.slots.prepend(newSlot); else this.slots = this.slots.insertWithPriority(newSlot);
			return newSlot;
		}
		return this.slots.find(listener);
	}
	,registrationPossible: function(listener,once) {
		if(!this.slots.nonEmpty) return true;
		var existingSlot = this.slots.find(listener);
		if(existingSlot == null) return true;
		if(existingSlot.once != once) throw new js__$Boot_HaxeError("You cannot addOnce() then add() the same listener without removing the relationship first.");
		return false;
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return null;
	}
	,get_numListeners: function() {
		return this.slots.get_length();
	}
	,__class__: msignal_Signal
};
var msignal_Signal0 = function() {
	msignal_Signal.call(this);
};
msignal_Signal0.__name__ = ["msignal","Signal0"];
msignal_Signal0.__super__ = msignal_Signal;
msignal_Signal0.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function() {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute();
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot0(this,listener,once,priority);
	}
	,__class__: msignal_Signal0
});
var msignal_Signal1 = function(type) {
	msignal_Signal.call(this,[type]);
};
msignal_Signal1.__name__ = ["msignal","Signal1"];
msignal_Signal1.__super__ = msignal_Signal;
msignal_Signal1.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function(value) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot1(this,listener,once,priority);
	}
	,__class__: msignal_Signal1
});
var msignal_Signal2 = function(type1,type2) {
	msignal_Signal.call(this,[type1,type2]);
};
msignal_Signal2.__name__ = ["msignal","Signal2"];
msignal_Signal2.__super__ = msignal_Signal;
msignal_Signal2.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function(value1,value2) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value1,value2);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot2(this,listener,once,priority);
	}
	,__class__: msignal_Signal2
});
var msignal_Slot = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	this.signal = signal;
	this.set_listener(listener);
	this.once = once;
	this.priority = priority;
	this.enabled = true;
};
msignal_Slot.__name__ = ["msignal","Slot"];
msignal_Slot.prototype = {
	listener: null
	,once: null
	,priority: null
	,enabled: null
	,signal: null
	,remove: function() {
		this.signal.remove(this.listener);
	}
	,set_listener: function(value) {
		if(value == null) throw new js__$Boot_HaxeError("listener cannot be null");
		return this.listener = value;
	}
	,__class__: msignal_Slot
};
var msignal_Slot0 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot0.__name__ = ["msignal","Slot0"];
msignal_Slot0.__super__ = msignal_Slot;
msignal_Slot0.prototype = $extend(msignal_Slot.prototype,{
	execute: function() {
		if(!this.enabled) return;
		if(this.once) this.remove();
		this.listener();
	}
	,__class__: msignal_Slot0
});
var msignal_Slot1 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot1.__name__ = ["msignal","Slot1"];
msignal_Slot1.__super__ = msignal_Slot;
msignal_Slot1.prototype = $extend(msignal_Slot.prototype,{
	param: null
	,execute: function(value1) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param != null) value1 = this.param;
		this.listener(value1);
	}
	,__class__: msignal_Slot1
});
var msignal_Slot2 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot2.__name__ = ["msignal","Slot2"];
msignal_Slot2.__super__ = msignal_Slot;
msignal_Slot2.prototype = $extend(msignal_Slot.prototype,{
	param1: null
	,param2: null
	,execute: function(value1,value2) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param1 != null) value1 = this.param1;
		if(this.param2 != null) value2 = this.param2;
		this.listener(value1,value2);
	}
	,__class__: msignal_Slot2
});
var msignal_SlotList = function(head,tail) {
	this.nonEmpty = false;
	if(head == null && tail == null) {
		if(msignal_SlotList.NIL != null) throw new js__$Boot_HaxeError("Parameters head and tail are null. Use the NIL element instead.");
		this.nonEmpty = false;
	} else if(head == null) throw new js__$Boot_HaxeError("Parameter head cannot be null."); else {
		this.head = head;
		if(tail == null) this.tail = msignal_SlotList.NIL; else this.tail = tail;
		this.nonEmpty = true;
	}
};
msignal_SlotList.__name__ = ["msignal","SlotList"];
msignal_SlotList.prototype = {
	head: null
	,tail: null
	,nonEmpty: null
	,length: null
	,get_length: function() {
		if(!this.nonEmpty) return 0;
		if(this.tail == msignal_SlotList.NIL) return 1;
		var result = 0;
		var p = this;
		while(p.nonEmpty) {
			++result;
			p = p.tail;
		}
		return result;
	}
	,prepend: function(slot) {
		return new msignal_SlotList(slot,this);
	}
	,append: function(slot) {
		if(slot == null) return this;
		if(!this.nonEmpty) return new msignal_SlotList(slot);
		if(this.tail == msignal_SlotList.NIL) return new msignal_SlotList(slot).prepend(this.head);
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal_SlotList(slot);
		return wholeClone;
	}
	,insertWithPriority: function(slot) {
		if(!this.nonEmpty) return new msignal_SlotList(slot);
		var priority = slot.priority;
		if(priority >= this.head.priority) return this.prepend(slot);
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(priority > current.head.priority) {
				subClone.tail = current.prepend(slot);
				return wholeClone;
			}
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal_SlotList(slot);
		return wholeClone;
	}
	,filterNot: function(listener) {
		if(!this.nonEmpty || listener == null) return this;
		if(Reflect.compareMethods(this.head.listener,listener)) return this.tail;
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(Reflect.compareMethods(current.head.listener,listener)) {
				subClone.tail = current.tail;
				return wholeClone;
			}
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		return this;
	}
	,contains: function(listener) {
		if(!this.nonEmpty) return false;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return true;
			p = p.tail;
		}
		return false;
	}
	,find: function(listener) {
		if(!this.nonEmpty) return null;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return p.head;
			p = p.tail;
		}
		return null;
	}
	,__class__: msignal_SlotList
};
var murmur_Canvas = function() { };
murmur_Canvas.__name__ = ["murmur","Canvas"];
murmur_Canvas.pause = function() {
	murmur_Canvas.velocityfunc(murmur_Canvas.paused);
	if(murmur_Canvas.paused == 0) murmur_Canvas.paused = 1; else murmur_Canvas.paused = 0;
};
murmur_Canvas.spaceKeydown = function(callback) {
	murmur_Canvas.document.addEventListener("keydown",function(e) {
		if(e.keyCode == 13) callback();
	},false);
};
murmur_Canvas.timed = function() {
	window.location.reload();
};
murmur_Canvas.main = function() {
	murmur_Canvas.spaceKeydown(murmur_Canvas.pause);
	var DS = murmur_DoneSignal.getInstance();
	DS.add(murmur_Canvas.timed);
	haxe_Timer.delay(murmur_Canvas.timed,60000);
	var flock = new boidz_Flock();
	var canvas = murmur_Canvas.getCanvas();
	var render = new boidz_render_canvas_CanvasRender(canvas);
	var display = new boidz_Display(render);
	var avoidCollisions = new boidz_rules_AvoidCollisions(flock,3,25);
	var respectBoundaries = new boidz_rules_RespectBoundaries(-300,murmur_Canvas.width + 300,-300,murmur_Canvas.height + 300,50,25);
	var waypoints = new boidz_rules_IndividualWaypoints(flock,10);
	var velocity = murmur_Canvas._velocity;
	murmur_Canvas.addBoids(flock,murmur_Canvas._numPeople,velocity,respectBoundaries.offset);
	var canvasBoundaries = new boidz_render_canvas_CanvasBoundaries(respectBoundaries);
	var canvasWaypoints = new boidz_render_canvas_CanvasIndividualWaypoints(waypoints);
	var canvasFlock = new murmur_People(flock);
	var zoneBounds = new boidz_render_canvas_ZoneBounds(new boidz_rules_RespectBoundaries(20 + Math.random() * 800,30 + Math.random() * 600,30 + Math.random() * 300,40 + Math.random() * 600,50,25));
	var zone = new boidz_rules_SteerTowardZone(flock,zoneBounds);
	flock.addRule(zone);
	display.addRenderable(canvasFlock);
	var benchmarks = [];
	var frames = [];
	var renderings = [];
	var residue = 0.0;
	var step = flock.step * 1000;
	var execution = null;
	var rendering = null;
	var frameRate = null;
	var start = performance.now();
	thx_Timer.frame(function(delta) {
		delta += residue;
		while(delta - step >= 0) {
			var time = performance.now();
			flock.update();
			benchmarks.splice(1,10);
			benchmarks.push(performance.now() - time);
			delta -= step;
		}
		residue = delta;
		var before = performance.now();
		display.render();
		renderings.splice(1,10);
		renderings.push(performance.now() - before);
		var n = performance.now();
		frames.splice(1,10);
		frames.push(n - start);
		start = n;
	});
	thx_Timer.repeat(function() {
		var average = thx_Floats.roundTo(thx_ArrayFloats.average(benchmarks),2);
		var min = thx_Floats.roundTo(thx_ArrayFloats.min(benchmarks),2);
		var max = thx_Floats.roundTo(thx_ArrayFloats.max(benchmarks),2);
		execution.set("" + average + " (" + min + " -> " + max + ")");
		average = thx_Floats.roundTo(thx_ArrayFloats.average(renderings),1);
		min = thx_Floats.roundTo(thx_ArrayFloats.min(renderings),1);
		max = thx_Floats.roundTo(thx_ArrayFloats.max(renderings),1);
		rendering.set("" + average + " (" + min + " -> " + max + ")");
		min = thx_Floats.roundTo(1000 / thx_ArrayFloats.min(frames),1);
		max = thx_Floats.roundTo(1000 / thx_ArrayFloats.max(frames),1);
		frameRate.set("" + average + "/s (" + min + " -> " + max + ")");
	},2000);
	canvas.addEventListener("click",function(e) {
		waypoints.addGoal(e.clientX,e.clientY);
	},false);
	new crowded_Crowd();
};
murmur_Canvas.getCanvas = function() {
	var canvas;
	var _this = window.document;
	canvas = _this.createElement("canvas");
	canvas.width = murmur_Canvas.width;
	canvas.height = murmur_Canvas.height;
	window.document.body.appendChild(canvas);
	return canvas;
};
murmur_Canvas.addBoids = function(flock,howMany,velocity,offset) {
	var w = Math.min(murmur_Canvas.width,murmur_Canvas.height);
	var _g = 0;
	while(_g < howMany) {
		var i = _g++;
		var b = new boidz_Boid(offset + (murmur_Canvas.width - offset * 2) * Math.random(),offset + (murmur_Canvas.height - offset * 2) * Math.random(),velocity,(function($this) {
			var $r;
			var value = Math.random() * 360;
			$r = value;
			return $r;
		}(this)));
		flock.boids.push(b);
	}
};
var murmur_DoneSignal = function() {
	msignal_Signal0.call(this);
};
murmur_DoneSignal.__name__ = ["murmur","DoneSignal"];
murmur_DoneSignal.getInstance = function() {
	if(murmur_DoneSignal.instance != null) return murmur_DoneSignal.instance;
	return murmur_DoneSignal.instance = new murmur_DoneSignal();
};
murmur_DoneSignal.__super__ = msignal_Signal0;
murmur_DoneSignal.prototype = $extend(msignal_Signal0.prototype,{
	__class__: murmur_DoneSignal
});
var murmur_MurmurTools = function() {
};
murmur_MurmurTools.__name__ = ["murmur","MurmurTools"];
murmur_MurmurTools.toggleFullScreen = function() {
	
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
  ;
};
murmur_MurmurTools.prototype = {
	__class__: murmur_MurmurTools
};
var murmur_People = function(flock,boidColor,crownColor,trailColor) {
	this.pos = 0;
	this.trailLength = 20;
	this.renderTrail = true;
	this.renderCentroid = true;
	this.enabled = true;
	if(null == boidColor) this.boidColor = "#000000"; else this.boidColor = thx_color__$Rgba_Rgba_$Impl_$.toString(boidColor);
	if(null == crownColor) this.crownColor = "rgba(255,255,255,100)"; else this.crownColor = thx_color__$Rgba_Rgba_$Impl_$.toString(crownColor);
	if(null == trailColor) this.trailColor = thx_color__$Rgba_Rgba_$Impl_$.toString(thx_color__$Rgb_Rgb_$Impl_$.withAlpha(thx_color__$Rgb_Rgb_$Impl_$.fromString(this.boidColor),20)); else this.trailColor = thx_color__$Rgba_Rgba_$Impl_$.toString(trailColor);
	this.flock = flock;
	this.map = new haxe_ds_ObjectMap();
};
murmur_People.__name__ = ["murmur","People"];
murmur_People.__interfaces__ = [boidz_IRenderable];
murmur_People.prototype = {
	flock: null
	,enabled: null
	,renderCentroid: null
	,renderTrail: null
	,trailLength: null
	,boidColor: null
	,crownColor: null
	,trailColor: null
	,map: null
	,getTrail: function(b) {
		var c = this.map.h[b.__id__];
		if(c == null) {
			var _g = [];
			var _g2 = 0;
			var _g1 = this.trailLength;
			while(_g2 < _g1) {
				var i = _g2++;
				_g.push({ x : b.x, y : b.y});
			}
			c = _g;
			this.map.set(b,c);
		}
		while(c.length < this.trailLength) c.push({ x : b.x, y : b.y});
		if(c.length > this.trailLength) c.splice(this.trailLength,c.length - this.trailLength);
		c[this.pos].x = b.x;
		c[this.pos].y = b.y;
		return c;
	}
	,pos: null
	,render: function(render) {
		var ctx = render.ctx;
		ctx.imageSmoothingEnabled = true;
		if(this.renderTrail) {
			this.pos++;
			if(this.pos >= this.trailLength) this.pos = 0;
			ctx.beginPath();
			ctx.strokeStyle = this.trailColor;
			var c;
			var s = this.pos + 1;
			if(s == this.trailLength) s = 0;
			var _g = 0;
			var _g1 = this.flock.boids;
			while(_g < _g1.length) {
				var b = _g1[_g];
				++_g;
				c = this.getTrail(b);
				if(c.length < 2) continue;
				ctx.moveTo(c[s].x,c[s].y);
				var _g3 = s;
				var _g2 = this.trailLength;
				while(_g3 < _g2) {
					var i = _g3++;
					ctx.lineTo(c[i].x,c[i].y);
				}
				if(s != 0) {
					var _g31 = 0;
					var _g21 = this.pos;
					while(_g31 < _g21) {
						var i1 = _g31++;
						ctx.lineTo(c[i1].x,c[i1].y);
					}
				}
			}
			ctx.stroke();
		}
		this.flock.boids.sort(function(a,b1) {
			return Reflect.compare(a.y,b1.y);
		});
		var _g4 = 0;
		var _g11 = this.flock.boids;
		while(_g4 < _g11.length) {
			var b2 = _g11[_g4];
			++_g4;
			var im = b2.peopleImage;
			var yFactor = b2.y / ctx.canvas.height + 0.3;
			var opacity = yFactor;
			ctx.globalAlpha = opacity;
			var wratio = im.width / im.height;
			var newH = 300 * yFactor;
			var newW = newH * wratio;
			ctx.drawImage(im,b2.x - newW / 2,b2.y - newH / 2,newW,newH);
		}
		if(this.renderCentroid) {
			ctx.beginPath();
			ctx.fillStyle = "#cc3300";
			ctx.arc(this.flock.x,this.flock.y,4,0,2 * Math.PI,false);
			ctx.fill();
		}
	}
	,__class__: murmur_People
};
var murmur_PeopleImage = function() {
	murmur_PeopleImage.count = Math.round(Math.random() * 400);
	this.path = "people/people" + murmur_PeopleImage.count + ".png";
	this.render();
};
murmur_PeopleImage.__name__ = ["murmur","PeopleImage"];
murmur_PeopleImage.prototype = {
	path: null
	,render: function() {
		var img = new Image();
		img.src = this.path;
		img.onload = function(e) {
			var i = e.target;
		};
		return img;
	}
	,__class__: murmur_PeopleImage
};
var thx_Arrays = function() { };
thx_Arrays.__name__ = ["thx","Arrays"];
thx_Arrays.append = function(array,element) {
	array.push(element);
	return array;
};
thx_Arrays.appendIf = function(array,cond,element) {
	if(cond) array.push(element);
	return array;
};
thx_Arrays.applyIndexes = function(array,indexes,incrementDuplicates) {
	if(incrementDuplicates == null) incrementDuplicates = false;
	if(indexes.length != array.length) throw new thx_Error("`Arrays.applyIndexes` can only be applied to two arrays with the same length",null,{ fileName : "Arrays.hx", lineNumber : 53, className : "thx.Arrays", methodName : "applyIndexes"});
	var result = [];
	if(incrementDuplicates) {
		var usedIndexes = thx__$Set_Set_$Impl_$.createInt();
		var _g1 = 0;
		var _g = array.length;
		while(_g1 < _g) {
			var i = _g1++;
			var index = indexes[i];
			while(usedIndexes.h.hasOwnProperty(index)) index++;
			thx__$Set_Set_$Impl_$.add(usedIndexes,index);
			result[index] = array[i];
		}
	} else {
		var _g11 = 0;
		var _g2 = array.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			result[indexes[i1]] = array[i1];
		}
	}
	return result;
};
thx_Arrays.monoid = function() {
	return { zero : [], append : function(a,b) {
		return a.concat(b);
	}};
};
thx_Arrays.after = function(array,element) {
	return array.slice(thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(array,element) + 1);
};
thx_Arrays.atIndex = function(array,i) {
	if(i >= 0 && i < array.length) return haxe_ds_Option.Some(array[i]); else return haxe_ds_Option.None;
};
thx_Arrays.getOption = function(array,i) {
	return thx_Options.ofValue(array[i]);
};
thx_Arrays.each = function(arr,effect) {
	var $it0 = HxOverrides.iter(arr);
	while( $it0.hasNext() ) {
		var element = $it0.next();
		effect(element);
	}
};
thx_Arrays.eachi = function(arr,effect) {
	var _g1 = 0;
	var _g = arr.length;
	while(_g1 < _g) {
		var i = _g1++;
		effect(arr[i],i);
	}
};
thx_Arrays.all = function(arr,predicate) {
	var $it0 = HxOverrides.iter(arr);
	while( $it0.hasNext() ) {
		var element = $it0.next();
		if(!predicate(element)) return false;
	}
	return true;
};
thx_Arrays.any = function(arr,predicate) {
	var $it0 = HxOverrides.iter(arr);
	while( $it0.hasNext() ) {
		var element = $it0.next();
		if(predicate(element)) return true;
	}
	return false;
};
thx_Arrays.at = function(arr,indexes) {
	return indexes.map(function(i) {
		return arr[i];
	});
};
thx_Arrays.before = function(array,element) {
	return array.slice(0,thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(array,element));
};
thx_Arrays.commonsFromStart = function(self,other,equality) {
	if(null == equality) equality = thx_Functions.equality;
	var count = 0;
	var _g = 0;
	var _g1 = thx_Arrays.zip(self,other);
	while(_g < _g1.length) {
		var pair = _g1[_g];
		++_g;
		if(equality(pair._0,pair._1)) count++; else break;
	}
	return self.slice(0,count);
};
thx_Arrays.compact = function(arr) {
	return arr.filter(function(v) {
		return null != v;
	});
};
thx_Arrays.compare = function(a,b) {
	var v;
	if((v = a.length - b.length) != 0) return v;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if((v = thx_Dynamics.compare(a[i],b[i])) != 0) return v;
	}
	return 0;
};
thx_Arrays.contains = function(array,element,eq) {
	if(null == eq) return thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(array,element) >= 0; else {
		var _g1 = 0;
		var _g = array.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(eq(array[i],element)) return true;
		}
		return false;
	}
};
thx_Arrays.containsAll = function(array,elements,eq) {
	var $it0 = $iterator(elements)();
	while( $it0.hasNext() ) {
		var el = $it0.next();
		if(!thx_Arrays.contains(array,el,eq)) return false;
	}
	return true;
};
thx_Arrays.containsAny = function(array,elements,eq) {
	var $it0 = $iterator(elements)();
	while( $it0.hasNext() ) {
		var el = $it0.next();
		if(thx_Arrays.contains(array,el,eq)) return true;
	}
	return false;
};
thx_Arrays.create = function(length,fillWith) {
	var arr;
	if(length > 0) arr = new Array(length); else arr = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		arr[i] = fillWith;
	}
	return arr;
};
thx_Arrays.cross = function(a,b) {
	var r = [];
	var $it0 = HxOverrides.iter(a);
	while( $it0.hasNext() ) {
		var va = $it0.next();
		var $it1 = HxOverrides.iter(b);
		while( $it1.hasNext() ) {
			var vb = $it1.next();
			r.push([va,vb]);
		}
	}
	return r;
};
thx_Arrays.crossMulti = function(array) {
	var acopy = array.slice();
	var result = acopy.shift().map(function(v) {
		return [v];
	});
	while(acopy.length > 0) {
		var array1 = acopy.shift();
		var tresult = result;
		result = [];
		var $it0 = HxOverrides.iter(array1);
		while( $it0.hasNext() ) {
			var v1 = $it0.next();
			var _g = 0;
			while(_g < tresult.length) {
				var ar = tresult[_g];
				++_g;
				var t = ar.slice();
				t.push(v1);
				result.push(t);
			}
		}
	}
	return result;
};
thx_Arrays.distinct = function(array,predicate) {
	var result = [];
	if(array.length <= 1) return array.slice();
	if(null == predicate) predicate = thx_Functions.equality;
	var $it0 = HxOverrides.iter(array);
	while( $it0.hasNext() ) {
		var v = $it0.next();
		var v1 = [v];
		var keep = !thx_Arrays.any(result,(function(v1) {
			return function(r) {
				return predicate(r,v1[0]);
			};
		})(v1));
		if(keep) result.push(v1[0]);
	}
	return result;
};
thx_Arrays.eachPair = function(array,callback) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		var _g3 = i;
		var _g2 = array.length;
		while(_g3 < _g2) {
			var j = _g3++;
			if(!callback(array[i],array[j])) return;
		}
	}
};
thx_Arrays.equals = function(a,b,equality) {
	if(a == null || b == null || a.length != b.length) return false;
	if(null == equality) equality = thx_Functions.equality;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(!equality(a[i],b[i])) return false;
	}
	return true;
};
thx_Arrays.extract = function(a,predicate) {
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(predicate(a[i])) return a.splice(i,1)[0];
	}
	return null;
};
thx_Arrays.filterNull = function(a) {
	var arr = [];
	var $it0 = HxOverrides.iter(a);
	while( $it0.hasNext() ) {
		var v = $it0.next();
		if(null != v) arr.push(v);
	}
	return arr;
};
thx_Arrays.filterOption = function(a) {
	return thx_Arrays.reduce(a,function(acc,maybeV) {
		switch(maybeV[1]) {
		case 0:
			var v = maybeV[2];
			acc.push(v);
			break;
		case 1:
			break;
		}
		return acc;
	},[]);
};
thx_Arrays.find = function(array,predicate) {
	var $it0 = HxOverrides.iter(array);
	while( $it0.hasNext() ) {
		var element = $it0.next();
		if(predicate(element)) return element;
	}
	return null;
};
thx_Arrays.findi = function(array,predicate) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(predicate(array[i],i)) return array[i];
	}
	return null;
};
thx_Arrays.findiOption = function(array,predicate) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(predicate(array[i],i)) return haxe_ds_Option.Some(array[i]);
	}
	return haxe_ds_Option.None;
};
thx_Arrays.findOption = function(array,predicate) {
	var $it0 = HxOverrides.iter(array);
	while( $it0.hasNext() ) {
		var element = $it0.next();
		if(predicate(element)) return haxe_ds_Option.Some(element);
	}
	return haxe_ds_Option.None;
};
thx_Arrays.findIndex = function(array,predicate) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(predicate(array[i])) return i;
	}
	return -1;
};
thx_Arrays.findLast = function(array,predicate) {
	var len = array.length;
	var j;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		j = len - i - 1;
		if(predicate(array[j])) return array[j];
	}
	return null;
};
thx_Arrays.first = function(array) {
	return array[0];
};
thx_Arrays.flatMap = function(array,callback) {
	return thx_Arrays.flatten(array.map(callback));
};
thx_Arrays.flatten = function(array) {
	return Array.prototype.concat.apply([],array);
};
thx_Arrays.from = function(array,element) {
	return array.slice(thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(array,element));
};
thx_Arrays.groupByAppend = function(arr,resolver,map) {
	var _g1 = 0;
	var _g = arr.length;
	while(_g1 < _g) {
		var i = _g1++;
		var v = arr[i];
		var key = resolver(v);
		var acc = map.get(key);
		if(null == acc) map.set(key,[v]); else acc.push(v);
	}
	return map;
};
thx_Arrays.spanByIndex = function(arr,spanKey) {
	var acc = [];
	var cur = null;
	var j = -1;
	var _g1 = 0;
	var _g = arr.length;
	while(_g1 < _g) {
		var i = _g1++;
		var k = spanKey(i);
		if(k == null) throw new thx_Error("spanKey function returned null for index " + i,null,{ fileName : "Arrays.hx", lineNumber : 567, className : "thx.Arrays", methodName : "spanByIndex"});
		if(cur == k) acc[j].push(arr[i]); else {
			cur = k;
			j++;
			acc.push([arr[i]]);
		}
	}
	return acc;
};
thx_Arrays.hasElements = function(array) {
	return null != array && array.length > 0;
};
thx_Arrays.head = function(array) {
	return array[0];
};
thx_Arrays.ifEmpty = function(array,alt) {
	if(null != array && 0 != array.length) return array; else return alt;
};
thx_Arrays.initial = function(array) {
	return array.slice(0,array.length - 1);
};
thx_Arrays.intersperse = function(array,value) {
	return thx_Arrays.reducei(array,function(acc,v,i) {
		acc[i * 2] = v;
		return acc;
	},thx_Arrays.create(array.length * 2 - 1,value));
};
thx_Arrays.isEmpty = function(array) {
	return null == array || array.length == 0;
};
thx_Arrays.last = function(array) {
	return array[array.length - 1];
};
thx_Arrays.mapi = function(array,callback) {
	return array.map(callback);
};
thx_Arrays.mapRight = function(array,callback) {
	var i = array.length;
	var result = [];
	while(--i >= 0) result.push(callback(array[i]));
	return result;
};
thx_Arrays.order = function(array,sort) {
	var n = array.slice();
	n.sort(sort);
	return n;
};
thx_Arrays.pull = function(array,toRemove,equality) {
	var $it0 = HxOverrides.iter(toRemove);
	while( $it0.hasNext() ) {
		var element = $it0.next();
		thx_Arrays.removeAll(array,element,equality);
	}
};
thx_Arrays.pushIf = function(array,condition,value) {
	if(condition) array.push(value);
	return array;
};
thx_Arrays.rank = function(array,compare,incrementDuplicates) {
	if(incrementDuplicates == null) incrementDuplicates = true;
	var arr = array.map(function(v,i) {
		return { _0 : v, _1 : i};
	});
	arr.sort(function(a,b) {
		return compare(a._0,b._0);
	});
	if(incrementDuplicates) {
		var usedIndexes = thx__$Set_Set_$Impl_$.createInt();
		return thx_Arrays.reducei(arr,function(acc,x,i1) {
			var index;
			if(i1 > 0 && compare(arr[i1 - 1]._0,x._0) == 0) index = acc[arr[i1 - 1]._1]; else index = i1;
			while(usedIndexes.h.hasOwnProperty(index)) index++;
			thx__$Set_Set_$Impl_$.add(usedIndexes,index);
			acc[x._1] = index;
			return acc;
		},[]);
	} else return thx_Arrays.reducei(arr,function(acc1,x1,i2) {
		if(i2 > 0 && compare(arr[i2 - 1]._0,x1._0) == 0) acc1[x1._1] = acc1[arr[i2 - 1]._1]; else acc1[x1._1] = i2;
		return acc1;
	},[]);
};
thx_Arrays.reduce = function(array,f,initial) {
	var $it0 = HxOverrides.iter(array);
	while( $it0.hasNext() ) {
		var v = $it0.next();
		initial = f(initial,v);
	}
	return initial;
};
thx_Arrays.foldLeft = function(array,init,f) {
	return thx_Arrays.reduce(array,f,init);
};
thx_Arrays.foldLeftEither = function(array,init,f) {
	var acc = thx_Either.Right(init);
	var $it0 = HxOverrides.iter(array);
	while( $it0.hasNext() ) {
		var a = $it0.next();
		switch(acc[1]) {
		case 0:
			var error = acc[2];
			return acc;
		case 1:
			var b = acc[2];
			acc = f(b,a);
			break;
		}
	}
	return acc;
};
thx_Arrays.foldMap = function(array,f,m) {
	return thx_Arrays.foldLeft(array.map(f),thx__$Monoid_Monoid_$Impl_$.get_zero(m),(function(_e) {
		return function(a0,a1) {
			return thx__$Monoid_Monoid_$Impl_$.append(_e,a0,a1);
		};
	})(m));
};
thx_Arrays.fold = function(array,m) {
	return thx_Arrays.foldMap(array,thx_Functions.identity,m);
};
thx_Arrays.nel = function(array) {
	return thx__$Nel_Nel_$Impl_$.fromArray(array);
};
thx_Arrays.foldS = function(array,s) {
	return thx_Options.map(thx_Arrays.nel(array),function(x) {
		return thx__$Nel_Nel_$Impl_$.fold(x,s);
	});
};
thx_Arrays.resize = function(array,length,fill) {
	while(array.length < length) array.push(fill);
	array.splice(length,array.length - length);
	return array;
};
thx_Arrays.reducei = function(array,f,initial) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		initial = f(initial,array[i],i);
	}
	return initial;
};
thx_Arrays.reduceRight = function(array,f,initial) {
	var i = array.length;
	while(--i >= 0) initial = f(initial,array[i]);
	return initial;
};
thx_Arrays.removeAll = function(array,element,equality) {
	if(null == equality) equality = thx_Functions.equality;
	var i = array.length;
	while(--i >= 0) if(equality(array[i],element)) array.splice(i,1);
};
thx_Arrays.rest = function(array) {
	return array.slice(1);
};
thx_Arrays.reversed = function(array) {
	var result = array.slice();
	result.reverse();
	return result;
};
thx_Arrays.sample = function(array,n) {
	n = thx_Ints.min(n,array.length);
	var copy = array.slice();
	var result = [];
	var _g = 0;
	while(_g < n) {
		var i = _g++;
		result.push(copy.splice(Std.random(copy.length),1)[0]);
	}
	return result;
};
thx_Arrays.sampleOne = function(array) {
	var index = Std.random(array.length);
	return array[index];
};
thx_Arrays.string = function(arr) {
	var strings = arr.map(thx_Dynamics.string);
	return "[" + strings.join(", ") + "]";
};
thx_Arrays.shuffle = function(a) {
	var t = thx_Ints.range(a.length);
	var array = [];
	while(t.length > 0) {
		var pos = Std.random(t.length);
		var index = t[pos];
		t.splice(pos,1);
		array.push(a[index]);
	}
	return array;
};
thx_Arrays.split = function(array,parts) {
	var len = Math.ceil(array.length / parts);
	return thx_Arrays.splitBy(array,len);
};
thx_Arrays.splitBy = function(array,len) {
	var res = [];
	len = thx_Ints.min(len,array.length);
	var _g1 = 0;
	var _g = Math.ceil(array.length / len);
	while(_g1 < _g) {
		var p = _g1++;
		res.push(array.slice(p * len,(p + 1) * len));
	}
	return res;
};
thx_Arrays.splitByPad = function(arr,len,pad) {
	var res = thx_Arrays.splitBy(arr,len);
	while(res[res.length - 1].length < len) res[res.length - 1].push(pad);
	return res;
};
thx_Arrays.tail = function(array) {
	return array.slice(1);
};
thx_Arrays.take = function(arr,n) {
	return arr.slice(0,n);
};
thx_Arrays.takeLast = function(arr,n) {
	return arr.slice(arr.length - n);
};
thx_Arrays.traverseOption = function(arr,f) {
	return thx_Arrays.reduce(arr,function(acc,t) {
		return thx_Options.ap(f(t),thx_Options.map(acc,function(ux) {
			return function(u) {
				ux.push(u);
				return ux;
			};
		}));
	},haxe_ds_Option.Some([]));
};
thx_Arrays.traverseValidation = function(arr,f,s) {
	return thx_Arrays.reduce(arr,function(acc,t) {
		return thx__$Validation_Validation_$Impl_$.ap(f(t),thx__$Validation_Validation_$Impl_$.ap(acc,thx_Either.Right(function(ux) {
			return function(u) {
				ux.push(u);
				return ux;
			};
		}),function(e1,e2) {
			throw new js__$Boot_HaxeError("Unreachable");
		}),s);
	},thx_Either.Right([]));
};
thx_Arrays.traverseValidationIndexed = function(arr,f,s) {
	return thx_Arrays.reducei(arr,function(acc,t,i) {
		return thx__$Validation_Validation_$Impl_$.ap(f(t,i),thx__$Validation_Validation_$Impl_$.ap(acc,thx_Either.Right(function(ux) {
			return function(u) {
				ux.push(u);
				return ux;
			};
		}),function(e1,e2) {
			throw new js__$Boot_HaxeError("Unreachable");
		}),s);
	},thx_Either.Right([]));
};
thx_Arrays.rotate = function(arr) {
	var result = [];
	var _g1 = 0;
	var _g = arr[0].length;
	while(_g1 < _g) {
		var i = _g1++;
		var row = [];
		result.push(row);
		var _g3 = 0;
		var _g2 = arr.length;
		while(_g3 < _g2) {
			var j = _g3++;
			row.push(arr[j][i]);
		}
	}
	return result;
};
thx_Arrays.sliding2 = function(arr,f) {
	if(arr.length < 2) return []; else {
		var result = [];
		var _g1 = 0;
		var _g = arr.length - 1;
		while(_g1 < _g) {
			var i = _g1++;
			result.push(f(arr[i],arr[i + 1]));
		}
		return result;
	}
};
thx_Arrays.unzip = function(array) {
	var a1 = [];
	var a2 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
	});
	return { _0 : a1, _1 : a2};
};
thx_Arrays.unzip3 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
	});
	return { _0 : a1, _1 : a2, _2 : a3};
};
thx_Arrays.unzip4 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var a4 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
		a4.push(t._3);
	});
	return { _0 : a1, _1 : a2, _2 : a3, _3 : a4};
};
thx_Arrays.unzip5 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var a4 = [];
	var a5 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
		a4.push(t._3);
		a5.push(t._4);
	});
	return { _0 : a1, _1 : a2, _2 : a3, _3 : a4, _4 : a5};
};
thx_Arrays.zip = function(array1,array2) {
	var length = thx_Ints.min(array1.length,array2.length);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i]});
	}
	return array;
};
thx_Arrays.zip3 = function(array1,array2,array3) {
	var length = thx_ArrayInts.min([array1.length,array2.length,array3.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i]});
	}
	return array;
};
thx_Arrays.zip4 = function(array1,array2,array3,array4) {
	var length = thx_ArrayInts.min([array1.length,array2.length,array3.length,array4.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i], _3 : array4[i]});
	}
	return array;
};
thx_Arrays.zip5 = function(array1,array2,array3,array4,array5) {
	var length = thx_ArrayInts.min([array1.length,array2.length,array3.length,array4.length,array5.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i], _3 : array4[i], _4 : array5[i]});
	}
	return array;
};
thx_Arrays.zipAp = function(ax,fx) {
	var result = [];
	var _g1 = 0;
	var _g = thx_Ints.min(ax.length,fx.length);
	while(_g1 < _g) {
		var i = _g1++;
		result.push(fx[i](ax[i]));
	}
	return result;
};
thx_Arrays.zip2Ap = function(f,ax,bx) {
	return thx_Arrays.zipAp(bx,ax.map(thx_Functions2.curry(f)));
};
thx_Arrays.zip3Ap = function(f,ax,bx,cx) {
	return thx_Arrays.zipAp(cx,thx_Arrays.zip2Ap(thx_Functions3.curry(f),ax,bx));
};
thx_Arrays.zip4Ap = function(f,ax,bx,cx,dx) {
	return thx_Arrays.zipAp(dx,thx_Arrays.zip3Ap(thx_Functions4.curry(f),ax,bx,cx));
};
thx_Arrays.zip5Ap = function(f,ax,bx,cx,dx,ex) {
	return thx_Arrays.zipAp(ex,thx_Arrays.zip4Ap(thx_Functions5.curry(f),ax,bx,cx,dx));
};
thx_Arrays.withPrepend = function(arr,el) {
	return [el].concat(arr);
};
thx_Arrays["with"] = function(arr,el) {
	return arr.concat([el]);
};
thx_Arrays.withSlice = function(arr,other,start,length) {
	if(length == null) length = 0;
	return arr.slice(0,start).concat(other).concat(arr.slice(start + length));
};
thx_Arrays.withInsert = function(arr,el,pos) {
	return arr.slice(0,pos).concat([el]).concat(arr.slice(pos));
};
thx_Arrays.maxBy = function(arr,ord) {
	if(arr.length == 0) return haxe_ds_Option.None; else return haxe_ds_Option.Some(thx_Arrays.reduce(arr,(function(_e) {
		return function(a0,a1) {
			return thx__$Ord_Ord_$Impl_$.max(_e,a0,a1);
		};
	})(ord),arr[0]));
};
thx_Arrays.minBy = function(arr,ord) {
	if(arr.length == 0) return haxe_ds_Option.None; else return haxe_ds_Option.Some(thx_Arrays.reduce(arr,(function(_e) {
		return function(a0,a1) {
			return thx__$Ord_Ord_$Impl_$.min(_e,a0,a1);
		};
	})(ord),arr[0]));
};
thx_Arrays.toMap = function(arr,keyOrder) {
	var m = thx_fp_MapImpl.Tip;
	var collisions = [];
	var _g1 = 0;
	var _g = arr.length;
	while(_g1 < _g) {
		var i = _g1++;
		var tuple = arr[i];
		if(thx_Options.isNone(thx_fp__$Map_Map_$Impl_$.lookup(m,tuple._0,keyOrder))) m = thx_fp__$Map_Map_$Impl_$.insert(m,tuple._0,tuple._1,keyOrder); else collisions.push(tuple._0);
	}
	return thx_Options.toFailure(thx__$Nel_Nel_$Impl_$.fromArray(collisions),m);
};
var thx_ArrayFloats = function() { };
thx_ArrayFloats.__name__ = ["thx","ArrayFloats"];
thx_ArrayFloats.average = function(arr) {
	return thx_ArrayFloats.sum(arr) / arr.length;
};
thx_ArrayFloats.compact = function(arr) {
	return arr.filter(function(v) {
		return null != v && isFinite(v);
	});
};
thx_ArrayFloats.max = function(arr) {
	return thx_Options.get(thx_Arrays.maxBy(arr,thx_Floats.order));
};
thx_ArrayFloats.min = function(arr) {
	return thx_Options.get(thx_Arrays.minBy(arr,thx_Floats.order));
};
thx_ArrayFloats.resize = function(array,length,fill) {
	if(fill == null) fill = 0.0;
	while(array.length < length) array.push(fill);
	array.splice(length,array.length - length);
	return array;
};
thx_ArrayFloats.standardDeviation = function(array) {
	if(array.length < 2) return 0.0;
	var mean = thx_ArrayFloats.average(array);
	var variance = thx_Arrays.reduce(array,function(acc,val) {
		return acc + Math.pow(val - mean,2);
	},0) / (array.length - 1);
	return Math.sqrt(variance);
};
thx_ArrayFloats.sum = function(arr) {
	return thx_Arrays.reduce(arr,function(tot,v) {
		return tot + v;
	},0.0);
};
var thx_ArrayInts = function() { };
thx_ArrayInts.__name__ = ["thx","ArrayInts"];
thx_ArrayInts.average = function(arr) {
	return thx_ArrayInts.sum(arr) / arr.length;
};
thx_ArrayInts.max = function(arr) {
	return thx_Options.get(thx_Arrays.maxBy(arr,thx_Ints.order));
};
thx_ArrayInts.min = function(arr) {
	return thx_Options.get(thx_Arrays.minBy(arr,thx_Ints.order));
};
thx_ArrayInts.resize = function(array,length,fill) {
	if(fill == null) fill = 0;
	while(array.length < length) array.push(fill);
	array.splice(length,array.length - length);
	return array;
};
thx_ArrayInts.sum = function(arr) {
	return thx_Arrays.reduce(arr,function(tot,v) {
		return tot + v;
	},0);
};
var thx_ArrayStrings = function() { };
thx_ArrayStrings.__name__ = ["thx","ArrayStrings"];
thx_ArrayStrings.compact = function(arr) {
	return arr.filter(function(v) {
		return !thx_Strings.isEmpty(v);
	});
};
thx_ArrayStrings.max = function(arr) {
	return thx_Options.getOrElse(thx_Arrays.maxBy(arr,thx_Strings.order),null);
};
thx_ArrayStrings.min = function(arr) {
	return thx_Options.getOrElse(thx_Arrays.minBy(arr,thx_Strings.order),null);
};
var thx_Bools = function() { };
thx_Bools.__name__ = ["thx","Bools"];
thx_Bools.compare = function(a,b) {
	if(a == b) return 0; else if(a) return -1; else return 1;
};
thx_Bools.toInt = function(v) {
	if(v) return 1; else return 0;
};
thx_Bools.canParse = function(v) {
	var _g = v.toLowerCase();
	if(_g == null) return true; else switch(_g) {
	case "true":case "false":case "0":case "1":case "on":case "off":
		return true;
	default:
		return false;
	}
};
thx_Bools.parse = function(v) {
	var _g = v.toLowerCase();
	var v1 = _g;
	if(_g == null) return false; else switch(_g) {
	case "true":case "1":case "on":
		return true;
	case "false":case "0":case "off":
		return false;
	default:
		throw new js__$Boot_HaxeError("unable to parse \"" + v1 + "\"");
	}
};
thx_Bools.xor = function(a,b) {
	return a != b;
};
thx_Bools.option = function(cond,a) {
	if(cond) return haxe_ds_Option.Some(a); else return haxe_ds_Option.None;
};
var thx_Dates = function() { };
thx_Dates.__name__ = ["thx","Dates"];
thx_Dates.compare = function(a,b) {
	return thx_Floats.compare(a.getTime(),b.getTime());
};
thx_Dates.create = function(year,month,day,hour,minute,second) {
	if(second == null) second = 0;
	if(minute == null) minute = 0;
	if(hour == null) hour = 0;
	if(day == null) day = 1;
	if(month == null) month = 0;
	minute += Math.floor(second / 60);
	second = second % 60;
	if(second < 0) second += 60;
	hour += Math.floor(minute / 60);
	minute = minute % 60;
	if(minute < 0) minute += 60;
	day += Math.floor(hour / 24);
	hour = hour % 24;
	if(hour < 0) hour += 24;
	if(day == 0) {
		month -= 1;
		if(month < 0) {
			month = 11;
			year -= 1;
		}
		day = thx_Dates.daysInMonth(year,month);
	}
	year += Math.floor(month / 12);
	month = month % 12;
	if(month < 0) month += 12;
	var days = thx_Dates.daysInMonth(year,month);
	while(day > days) {
		if(day > days) {
			day -= days;
			month++;
		}
		if(month > 11) {
			month -= 12;
			year++;
		}
		days = thx_Dates.daysInMonth(year,month);
	}
	return new Date(year,month,day,hour,minute,second);
};
thx_Dates.daysRange = function(start,end) {
	if(thx_Dates.compare(end,start) < 0) return [];
	var days = [];
	while(!thx_Dates.sameDay(start,end)) {
		days.push(start);
		start = thx_Dates.jump(start,thx_TimePeriod.Day,1);
	}
	days.push(end);
	return days;
};
thx_Dates.equals = function(self,other) {
	return self.getTime() == other.getTime();
};
thx_Dates.nearEquals = function(self,other,units,period) {
	if(units == null) units = 1;
	if(null == period) period = thx_TimePeriod.Second;
	if(units < 0) units = -units;
	var min = thx_Dates.jump(self,period,-units);
	var max = thx_Dates.jump(self,period,units);
	return thx_Dates.compare(min,other) <= 0 && thx_Dates.compare(max,other) >= 0;
};
thx_Dates.greater = function(self,other) {
	return thx_Dates.compare(self,other) > 0;
};
thx_Dates.more = function(self,other) {
	return thx_Dates.compare(self,other) > 0;
};
thx_Dates.less = function(self,other) {
	return thx_Dates.compare(self,other) < 0;
};
thx_Dates.greaterEquals = function(self,other) {
	return thx_Dates.compare(self,other) >= 0;
};
thx_Dates.moreEqual = function(self,other) {
	return thx_Dates.compare(self,other) >= 0;
};
thx_Dates.lessEquals = function(self,other) {
	return thx_Dates.compare(self,other) <= 0;
};
thx_Dates.lessEqual = function(self,other) {
	return thx_Dates.compare(self,other) <= 0;
};
thx_Dates.isLeapYear = function(year) {
	if(year % 4 != 0) return false;
	if(year % 100 == 0) return year % 400 == 0;
	return true;
};
thx_Dates.isInLeapYear = function(d) {
	return thx_Dates.isLeapYear(d.getFullYear());
};
thx_Dates.daysInMonth = function(year,month) {
	switch(month) {
	case 0:case 2:case 4:case 6:case 7:case 9:case 11:
		return 31;
	case 3:case 5:case 8:case 10:
		return 30;
	case 1:
		if(thx_Dates.isLeapYear(year)) return 29; else return 28;
		break;
	default:
		throw new js__$Boot_HaxeError("Invalid month \"" + month + "\".  Month should be a number, Jan=0, Dec=11");
	}
};
thx_Dates.numDaysInMonth = function(month,year) {
	return thx_Dates.daysInMonth(year,month);
};
thx_Dates.daysInThisMonth = function(d) {
	return thx_Dates.daysInMonth(d.getFullYear(),d.getMonth());
};
thx_Dates.numDaysInThisMonth = function(d) {
	return thx_Dates.daysInThisMonth(d);
};
thx_Dates.sameYear = function(self,other) {
	return self.getFullYear() == other.getFullYear();
};
thx_Dates.sameMonth = function(self,other) {
	return thx_Dates.sameYear(self,other) && self.getMonth() == other.getMonth();
};
thx_Dates.sameDay = function(self,other) {
	return thx_Dates.sameMonth(self,other) && self.getDate() == other.getDate();
};
thx_Dates.sameHour = function(self,other) {
	return thx_Dates.sameDay(self,other) && self.getHours() == other.getHours();
};
thx_Dates.sameMinute = function(self,other) {
	return thx_Dates.sameHour(self,other) && self.getMinutes() == other.getMinutes();
};
thx_Dates.snapNext = function(date,period) {
	{
		var this1 = thx__$Timestamp_Timestamp_$Impl_$.snapNext(date.getTime(),period);
		var d = new Date();
		d.setTime(this1);
		return d;
	}
};
thx_Dates.snapPrev = function(date,period) {
	{
		var this1 = thx__$Timestamp_Timestamp_$Impl_$.snapPrev(date.getTime(),period);
		var d = new Date();
		d.setTime(this1);
		return d;
	}
};
thx_Dates.snapTo = function(date,period) {
	{
		var this1 = thx__$Timestamp_Timestamp_$Impl_$.snapTo(date.getTime(),period);
		var d = new Date();
		d.setTime(this1);
		return d;
	}
};
thx_Dates.jump = function(date,period,amount) {
	var sec = date.getSeconds();
	var min = date.getMinutes();
	var hour = date.getHours();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();
	switch(period[1]) {
	case 0:
		sec += amount;
		break;
	case 1:
		min += amount;
		break;
	case 2:
		hour += amount;
		break;
	case 3:
		day += amount;
		break;
	case 4:
		day += amount * 7;
		break;
	case 5:
		month += amount;
		break;
	case 6:
		year += amount;
		break;
	}
	return thx_Dates.create(year,month,day,hour,min,sec);
};
thx_Dates.max = function(self,other) {
	if(self.getTime() > other.getTime()) return self; else return other;
};
thx_Dates.min = function(self,other) {
	if(self.getTime() < other.getTime()) return self; else return other;
};
thx_Dates.snapToWeekDay = function(date,day,firstDayOfWk) {
	if(firstDayOfWk == null) firstDayOfWk = 0;
	var d = date.getDay();
	var s = day;
	if(s < firstDayOfWk) s = s + 7;
	if(d < firstDayOfWk) d = d + 7;
	return thx_Dates.jump(date,thx_TimePeriod.Day,s - d);
};
thx_Dates.snapNextWeekDay = function(date,day) {
	var d = date.getDay();
	var s = day;
	if(s < d) s = s + 7;
	return thx_Dates.jump(date,thx_TimePeriod.Day,s - d);
};
thx_Dates.snapPrevWeekDay = function(date,day) {
	var d = date.getDay();
	var s = day;
	if(s > d) s = s - 7;
	return thx_Dates.jump(date,thx_TimePeriod.Day,s - d);
};
thx_Dates.prevYear = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Year,-1);
};
thx_Dates.nextYear = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Year,1);
};
thx_Dates.prevMonth = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Month,-1);
};
thx_Dates.nextMonth = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Month,1);
};
thx_Dates.prevWeek = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Week,-1);
};
thx_Dates.nextWeek = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Week,1);
};
thx_Dates.prevDay = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Day,-1);
};
thx_Dates.nextDay = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Day,1);
};
thx_Dates.prevHour = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Hour,-1);
};
thx_Dates.nextHour = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Hour,1);
};
thx_Dates.prevMinute = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Minute,-1);
};
thx_Dates.nextMinute = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Minute,1);
};
thx_Dates.prevSecond = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Second,-1);
};
thx_Dates.nextSecond = function(d) {
	return thx_Dates.jump(d,thx_TimePeriod.Second,1);
};
thx_Dates.withYear = function(date,year) {
	return thx_Dates.create(year,date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
};
thx_Dates.withMonth = function(date,month) {
	return thx_Dates.create(date.getFullYear(),month,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
};
thx_Dates.withDay = function(date,day) {
	return thx_Dates.create(date.getFullYear(),date.getMonth(),day,date.getHours(),date.getMinutes(),date.getSeconds());
};
thx_Dates.withHour = function(date,hour) {
	return thx_Dates.create(date.getFullYear(),date.getMonth(),date.getDate(),hour,date.getMinutes(),date.getSeconds());
};
thx_Dates.withMinute = function(date,minute) {
	return thx_Dates.create(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),minute,date.getSeconds());
};
thx_Dates.withSecond = function(date,second) {
	return thx_Dates.create(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),second);
};
thx_Dates.parseDate = function(s) {
	try {
		return thx_Either.Right(HxOverrides.strDate(s));
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return thx_Either.Left("" + s + " could not be parsed to a valid Date value.");
	}
};
var thx_Dynamics = function() { };
thx_Dynamics.__name__ = ["thx","Dynamics"];
thx_Dynamics.equals = function(a,b) {
	if(!thx_Types.sameType(a,b)) return false;
	if(a == b) return true;
	{
		var _g = Type["typeof"](a);
		switch(_g[1]) {
		case 2:case 0:case 1:case 3:
			return false;
		case 5:
			return Reflect.compareMethods(a,b);
		case 6:
			var c = _g[2];
			var ca = Type.getClassName(c);
			var cb = Type.getClassName(b == null?null:js_Boot.getClass(b));
			if(ca != cb) return false;
			if(typeof(a) == "string") return false;
			if((a instanceof Array) && a.__enum__ == null) {
				var aa = a;
				var ab = b;
				if(aa.length != ab.length) return false;
				var _g2 = 0;
				var _g1 = aa.length;
				while(_g2 < _g1) {
					var i = _g2++;
					if(!thx_Dynamics.equals(aa[i],ab[i])) return false;
				}
				return true;
			}
			if(js_Boot.__instanceof(a,Date)) return a.getTime() == b.getTime();
			if(js_Boot.__instanceof(a,haxe_IMap)) {
				var ha = a;
				var hb = b;
				var ka = thx_Iterators.toArray(ha.keys());
				var kb = thx_Iterators.toArray(hb.keys());
				if(ka.length != kb.length) return false;
				var _g11 = 0;
				while(_g11 < ka.length) {
					var key = ka[_g11];
					++_g11;
					if(!hb.exists(key) || !thx_Dynamics.equals(ha.get(key),hb.get(key))) return false;
				}
				return true;
			}
			var t = false;
			if((t = thx_Iterators.isIterator(a)) || thx_Iterables.isIterable(a)) {
				var va;
				if(t) va = thx_Iterators.toArray(a); else va = thx_Iterators.toArray($iterator(a)());
				var vb;
				if(t) vb = thx_Iterators.toArray(b); else vb = thx_Iterators.toArray($iterator(b)());
				if(va.length != vb.length) return false;
				var _g21 = 0;
				var _g12 = va.length;
				while(_g21 < _g12) {
					var i1 = _g21++;
					if(!thx_Dynamics.equals(va[i1],vb[i1])) return false;
				}
				return true;
			}
			var f = null;
			if(Object.prototype.hasOwnProperty.call(a,"equals") && Reflect.isFunction(f = Reflect.field(a,"equals"))) return f.apply(a,[b]);
			var fields = Type.getInstanceFields(a == null?null:js_Boot.getClass(a));
			var _g13 = 0;
			while(_g13 < fields.length) {
				var field = fields[_g13];
				++_g13;
				var va1 = Reflect.field(a,field);
				if(Reflect.isFunction(va1)) continue;
				var vb1 = Reflect.field(b,field);
				if(!thx_Dynamics.equals(va1,vb1)) return false;
			}
			return true;
		case 7:
			var e = _g[2];
			var ea = Type.getEnumName(e);
			var teb = Type.getEnum(b);
			var eb = Type.getEnumName(teb);
			if(ea != eb) return false;
			if(a[1] != b[1]) return false;
			var pa = a.slice(2);
			var pb = b.slice(2);
			var _g22 = 0;
			var _g14 = pa.length;
			while(_g22 < _g14) {
				var i2 = _g22++;
				if(!thx_Dynamics.equals(pa[i2],pb[i2])) return false;
			}
			return true;
		case 4:
			var fa = Reflect.fields(a);
			var fb = Reflect.fields(b);
			var _g15 = 0;
			while(_g15 < fa.length) {
				var field1 = fa[_g15];
				++_g15;
				HxOverrides.remove(fb,field1);
				if(!Object.prototype.hasOwnProperty.call(b,field1)) return false;
				var va2 = Reflect.field(a,field1);
				if(Reflect.isFunction(va2)) continue;
				var vb2 = Reflect.field(b,field1);
				if(!thx_Dynamics.equals(va2,vb2)) return false;
			}
			if(fb.length > 0) return false;
			var t1 = false;
			if((t1 = thx_Iterators.isIterator(a)) || thx_Iterables.isIterable(a)) {
				if(t1 && !thx_Iterators.isIterator(b)) return false;
				if(!t1 && !thx_Iterables.isIterable(b)) return false;
				var aa1;
				if(t1) aa1 = thx_Iterators.toArray(a); else aa1 = thx_Iterators.toArray($iterator(a)());
				var ab1;
				if(t1) ab1 = thx_Iterators.toArray(b); else ab1 = thx_Iterators.toArray($iterator(b)());
				if(aa1.length != ab1.length) return false;
				var _g23 = 0;
				var _g16 = aa1.length;
				while(_g23 < _g16) {
					var i3 = _g23++;
					if(!thx_Dynamics.equals(aa1[i3],ab1[i3])) return false;
				}
				return true;
			}
			return true;
		case 8:
			throw new js__$Boot_HaxeError("Unable to compare two unknown types");
			break;
		}
	}
	throw new thx_Error("Unable to compare values: " + Std.string(a) + " and " + Std.string(b),null,{ fileName : "Dynamics.hx", lineNumber : 153, className : "thx.Dynamics", methodName : "equals"});
};
thx_Dynamics.clone = function(v,cloneInstances) {
	if(cloneInstances == null) cloneInstances = false;
	{
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 0:
			return null;
		case 1:case 2:case 3:case 7:case 8:case 5:
			return v;
		case 4:
			return thx_Objects.copyTo(v,{ });
		case 6:
			var c = _g[2];
			var name = Type.getClassName(c);
			switch(name) {
			case "Array":
				return v.map(function(v1) {
					return thx_Dynamics.clone(v1,cloneInstances);
				});
			case "String":case "Date":
				return v;
			default:
				if(cloneInstances) {
					var o = Type.createEmptyInstance(c);
					var _g1 = 0;
					var _g2 = Type.getInstanceFields(c);
					while(_g1 < _g2.length) {
						var field = _g2[_g1];
						++_g1;
						Reflect.setField(o,field,thx_Dynamics.clone(Reflect.field(v,field),cloneInstances));
					}
					return o;
				} else return v;
			}
			break;
		}
	}
};
thx_Dynamics.compare = function(a,b) {
	if(null == a && null == b) return 0;
	if(null == a) return -1;
	if(null == b) return 1;
	if(!thx_Types.sameType(a,b)) return thx_Strings.compare(thx_Types.valueTypeToString(a),thx_Types.valueTypeToString(b));
	{
		var _g = Type["typeof"](a);
		switch(_g[1]) {
		case 1:
			return thx_Ints.compare(a,b);
		case 2:
			return thx_Floats.compare(a,b);
		case 3:
			return thx_Bools.compare(a,b);
		case 4:
			return thx_Objects.compare(a,b);
		case 6:
			var c = _g[2];
			var name = Type.getClassName(c);
			switch(name) {
			case "Array":
				return thx_Arrays.compare(a,b);
			case "String":
				return thx_Strings.compare(a,b);
			case "Date":
				return thx_Dates.compare(a,b);
			default:
				if(Object.prototype.hasOwnProperty.call(a,"compare")) return Reflect.callMethod(a,Reflect.field(a,"compare"),[b]); else return haxe_Utf8.compare(Std.string(a),Std.string(b));
			}
			break;
		case 7:
			var e = _g[2];
			return thx_Enums.compare(a,b);
		default:
			return 0;
		}
	}
};
thx_Dynamics.string = function(v) {
	{
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 0:
			return "null";
		case 1:case 2:case 3:
			return "" + Std.string(v);
		case 4:
			return thx_Objects.string(v);
		case 6:
			var c = _g[2];
			var _g1 = Type.getClassName(c);
			switch(_g1) {
			case "Array":
				return thx_Arrays.string(v);
			case "String":
				return v;
			case "Date":
				return HxOverrides.dateStr(v);
			default:
				if(js_Boot.__instanceof(v,haxe_IMap)) return thx_Maps.string(v); else return Std.string(v);
			}
			break;
		case 7:
			var e = _g[2];
			return thx_Enums.string(v);
		case 8:
			return "<unknown>";
		case 5:
			return "<function>";
		}
	}
};
var thx_DynamicsT = function() { };
thx_DynamicsT.__name__ = ["thx","DynamicsT"];
thx_DynamicsT.isEmpty = function(o) {
	return Reflect.fields(o).length == 0;
};
thx_DynamicsT.exists = function(o,name) {
	return Object.prototype.hasOwnProperty.call(o,name);
};
thx_DynamicsT.fields = function(o) {
	return Reflect.fields(o);
};
thx_DynamicsT.merge = function(to,from,replacef) {
	if(null == replacef) replacef = function(field,oldv,newv) {
		return newv;
	};
	var _g = 0;
	var _g1 = Reflect.fields(from);
	while(_g < _g1.length) {
		var field1 = _g1[_g];
		++_g;
		var newv1 = Reflect.field(from,field1);
		if(Object.prototype.hasOwnProperty.call(to,field1)) Reflect.setField(to,field1,replacef(field1,Reflect.field(to,field1),newv1)); else to[field1] = newv1;
	}
	return to;
};
thx_DynamicsT.size = function(o) {
	return Reflect.fields(o).length;
};
thx_DynamicsT.values = function(o) {
	return Reflect.fields(o).map(function(key) {
		return Reflect.field(o,key);
	});
};
thx_DynamicsT.tuples = function(o) {
	return Reflect.fields(o).map(function(key) {
		var _1 = Reflect.field(o,key);
		return { _0 : key, _1 : _1};
	});
};
var thx_Either = { __ename__ : ["thx","Either"], __constructs__ : ["Left","Right"] };
thx_Either.Left = function(value) { var $x = ["Left",0,value]; $x.__enum__ = thx_Either; $x.toString = $estr; return $x; };
thx_Either.Right = function(value) { var $x = ["Right",1,value]; $x.__enum__ = thx_Either; $x.toString = $estr; return $x; };
var thx_Eithers = function() { };
thx_Eithers.__name__ = ["thx","Eithers"];
thx_Eithers.isLeft = function(either) {
	switch(either[1]) {
	case 0:
		return true;
	case 1:
		return false;
	}
};
thx_Eithers.isRight = function(either) {
	switch(either[1]) {
	case 0:
		return false;
	case 1:
		return true;
	}
};
thx_Eithers.toLeft = function(either) {
	switch(either[1]) {
	case 0:
		var v = either[2];
		return haxe_ds_Option.Some(v);
	case 1:
		return haxe_ds_Option.None;
	}
};
thx_Eithers.toRight = function(either) {
	switch(either[1]) {
	case 0:
		return haxe_ds_Option.None;
	case 1:
		var v = either[2];
		return haxe_ds_Option.Some(v);
	}
};
thx_Eithers.toLeftUnsafe = function(either) {
	switch(either[1]) {
	case 0:
		var v = either[2];
		return v;
	case 1:
		return null;
	}
};
thx_Eithers.toRightUnsafe = function(either) {
	switch(either[1]) {
	case 0:
		return null;
	case 1:
		var v = either[2];
		return v;
	}
};
thx_Eithers.map = function(either,f) {
	switch(either[1]) {
	case 0:
		var v = either[2];
		return thx_Either.Left(v);
	case 1:
		var v1 = either[2];
		return thx_Either.Right(f(v1));
	}
};
thx_Eithers.flatMap = function(either,f) {
	switch(either[1]) {
	case 0:
		var v = either[2];
		return thx_Either.Left(v);
	case 1:
		var v1 = either[2];
		return f(v1);
	}
};
thx_Eithers.leftMap = function(either,f) {
	switch(either[1]) {
	case 0:
		var v = either[2];
		return thx_Either.Left(f(v));
	case 1:
		var v1 = either[2];
		return thx_Either.Right(v1);
	}
};
thx_Eithers.orThrow = function(either,message) {
	switch(either[1]) {
	case 0:
		var v = either[2];
		throw new thx_Error("" + message + ": " + Std.string(v),null,{ fileName : "Eithers.hx", lineNumber : 93, className : "thx.Eithers", methodName : "orThrow"});
		break;
	case 1:
		var v1 = either[2];
		return v1;
	}
};
thx_Eithers.toVNel = function(either) {
	switch(either[1]) {
	case 0:
		var e = either[2];
		return thx_Either.Left(thx__$Nel_Nel_$Impl_$.pure(e));
	case 1:
		var v = either[2];
		return thx_Either.Right(v);
	}
};
thx_Eithers.cata = function(either,l,r) {
	switch(either[1]) {
	case 0:
		var l0 = either[2];
		return l(l0);
	case 1:
		var r0 = either[2];
		return r(r0);
	}
};
var thx_Enums = function() { };
thx_Enums.__name__ = ["thx","Enums"];
thx_Enums.string = function(e) {
	var cons = e[0];
	var params = [];
	var _g = 0;
	var _g1 = e.slice(2);
	while(_g < _g1.length) {
		var param = _g1[_g];
		++_g;
		params.push(thx_Dynamics.string(param));
	}
	return cons + (params.length == 0?"":"(" + params.join(", ") + ")");
};
thx_Enums.compare = function(a,b) {
	var v = a[1] - b[1];
	if(v != 0) return v;
	return thx_Arrays.compare(a.slice(2),b.slice(2));
};
thx_Enums.sameConstructor = function(a,b) {
	return a[1] == b[1];
};
thx_Enums.min = function(a,b) {
	if(thx_Enums.compare(a,b) < 0) return a; else return b;
};
thx_Enums.max = function(a,b) {
	if(thx_Enums.compare(a,b) > 0) return a; else return b;
};
var thx_Error = function(message,stack,pos) {
	Error.call(this,message);
	this.message = message;
	if(null == stack) {
		try {
			stack = haxe_CallStack.exceptionStack();
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			stack = [];
		}
		if(stack.length == 0) try {
			stack = haxe_CallStack.callStack();
		} catch( e1 ) {
			haxe_CallStack.lastException = e1;
			if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
			stack = [];
		}
	}
	this.stackItems = stack;
	this.pos = pos;
};
thx_Error.__name__ = ["thx","Error"];
thx_Error.fromDynamic = function(err,pos) {
	if(js_Boot.__instanceof(err,thx_Error)) return err;
	return new thx_error_ErrorWrapper("" + Std.string(err),err,null,pos);
};
thx_Error.__super__ = Error;
thx_Error.prototype = $extend(Error.prototype,{
	pos: null
	,stackItems: null
	,toString: function() {
		return this.message + "\nfrom: " + this.getPosition() + "\n\n" + this.stackToString();
	}
	,getPosition: function() {
		return this.pos.className + "." + this.pos.methodName + "() at " + this.pos.lineNumber;
	}
	,stackToString: function() {
		return haxe_CallStack.toString(this.stackItems);
	}
	,__class__: thx_Error
});
var thx__$Ord_Ord_$Impl_$ = {};
thx__$Ord_Ord_$Impl_$.__name__ = ["thx","_Ord","Ord_Impl_"];
thx__$Ord_Ord_$Impl_$.order = function(this1,a0,a1) {
	return this1(a0,a1);
};
thx__$Ord_Ord_$Impl_$.max = function(this1,a0,a1) {
	var _g = this1(a0,a1);
	switch(_g[1]) {
	case 0:case 2:
		return a1;
	case 1:
		return a0;
	}
};
thx__$Ord_Ord_$Impl_$.min = function(this1,a0,a1) {
	var _g = this1(a0,a1);
	switch(_g[1]) {
	case 0:case 2:
		return a0;
	case 1:
		return a1;
	}
};
thx__$Ord_Ord_$Impl_$.equal = function(this1,a0,a1) {
	return this1(a0,a1) == thx_OrderingImpl.EQ;
};
thx__$Ord_Ord_$Impl_$.contramap = function(this1,f) {
	return function(b0,b1) {
		return this1(f(b0),f(b1));
	};
};
thx__$Ord_Ord_$Impl_$.inverse = function(this1) {
	return function(a0,a1) {
		return this1(a1,a0);
	};
};
thx__$Ord_Ord_$Impl_$.intComparison = function(this1,a0,a1) {
	var _g = this1(a0,a1);
	switch(_g[1]) {
	case 0:
		return -1;
	case 2:
		return 0;
	case 1:
		return 1;
	}
};
thx__$Ord_Ord_$Impl_$.fromIntComparison = function(f) {
	return function(a,b) {
		return thx__$Ord_Ordering_$Impl_$.fromInt(f(a,b));
	};
};
thx__$Ord_Ord_$Impl_$.forComparable = function() {
	return function(a,b) {
		return thx__$Ord_Ordering_$Impl_$.fromInt(a.compareTo(b));
	};
};
thx__$Ord_Ord_$Impl_$.forComparableOrd = function() {
	return function(a,b) {
		return a.compareTo(b);
	};
};
var thx__$Ord_Ordering_$Impl_$ = {};
thx__$Ord_Ordering_$Impl_$.__name__ = ["thx","_Ord","Ordering_Impl_"];
thx__$Ord_Ordering_$Impl_$.fromInt = function(value) {
	if(value < 0) return thx_OrderingImpl.LT; else if(value > 0) return thx_OrderingImpl.GT; else return thx_OrderingImpl.EQ;
};
thx__$Ord_Ordering_$Impl_$.fromFloat = function(value) {
	if(value < 0) return thx_OrderingImpl.LT; else if(value > 0) return thx_OrderingImpl.GT; else return thx_OrderingImpl.EQ;
};
thx__$Ord_Ordering_$Impl_$.toInt = function(this1) {
	switch(this1[1]) {
	case 0:
		return -1;
	case 1:
		return 1;
	case 2:
		return 0;
	}
};
var thx_OrderingImpl = { __ename__ : ["thx","OrderingImpl"], __constructs__ : ["LT","GT","EQ"] };
thx_OrderingImpl.LT = ["LT",0];
thx_OrderingImpl.LT.toString = $estr;
thx_OrderingImpl.LT.__enum__ = thx_OrderingImpl;
thx_OrderingImpl.GT = ["GT",1];
thx_OrderingImpl.GT.toString = $estr;
thx_OrderingImpl.GT.__enum__ = thx_OrderingImpl;
thx_OrderingImpl.EQ = ["EQ",2];
thx_OrderingImpl.EQ.toString = $estr;
thx_OrderingImpl.EQ.__enum__ = thx_OrderingImpl;
var thx_Floats = function() { };
thx_Floats.__name__ = ["thx","Floats"];
thx_Floats.angleDifference = function(a,b,turn) {
	if(turn == null) turn = 360.0;
	var r = (b - a) % turn;
	if(r < 0) r += turn;
	if(r > turn / 2) r -= turn;
	return r;
};
thx_Floats.ceilTo = function(f,decimals) {
	var p = Math.pow(10,decimals);
	return Math.ceil(f * p) / p;
};
thx_Floats.canParse = function(s) {
	return thx_Floats.pattern_parse.match(s);
};
thx_Floats.clamp = function(v,min,max) {
	if(v < min) return min; else if(v > max) return max; else return v;
};
thx_Floats.clampSym = function(v,max) {
	return thx_Floats.clamp(v,-max,max);
};
thx_Floats.compare = function(a,b) {
	if(a < b) return -1; else if(a > b) return 1; else return 0;
};
thx_Floats.floorTo = function(f,decimals) {
	var p = Math.pow(10,decimals);
	return Math.floor(f * p) / p;
};
thx_Floats.interpolate = function(f,a,b) {
	return (b - a) * f + a;
};
thx_Floats.interpolateAngle = function(f,a,b,turn) {
	if(turn == null) turn = 360;
	return thx_Floats.wrapCircular(thx_Floats.interpolate(f,a,a + thx_Floats.angleDifference(a,b,turn)),turn);
};
thx_Floats.interpolateAngleWidest = function(f,a,b,turn) {
	if(turn == null) turn = 360;
	return thx_Floats.wrapCircular(thx_Floats.interpolateAngle(f,a,b,turn) - turn / 2,turn);
};
thx_Floats.interpolateAngleCW = function(f,a,b,turn) {
	if(turn == null) turn = 360;
	a = thx_Floats.wrapCircular(a,turn);
	b = thx_Floats.wrapCircular(b,turn);
	if(b < a) b += turn;
	return thx_Floats.wrapCircular(thx_Floats.interpolate(f,a,b),turn);
};
thx_Floats.interpolateAngleCCW = function(f,a,b,turn) {
	if(turn == null) turn = 360;
	a = thx_Floats.wrapCircular(a,turn);
	b = thx_Floats.wrapCircular(b,turn);
	if(b > a) b -= turn;
	return thx_Floats.wrapCircular(thx_Floats.interpolate(f,a,b),turn);
};
thx_Floats.max = function(a,b) {
	if(a > b) return a; else return b;
};
thx_Floats.min = function(a,b) {
	if(a < b) return a; else return b;
};
thx_Floats.nearEquals = function(a,b,tollerance) {
	if(tollerance == null) tollerance = 1e-9;
	if(isFinite(a)) return Math.abs(a - b) <= tollerance;
	if(isNaN(a)) return isNaN(b);
	if(isNaN(b)) return false;
	if(!isFinite(b)) return a > 0 == b > 0;
	return false;
};
thx_Floats.nearEqualAngles = function(a,b,turn,tollerance) {
	if(tollerance == null) tollerance = 1e-9;
	if(turn == null) turn = 360.0;
	return Math.abs(thx_Floats.angleDifference(a,b,turn)) <= tollerance;
};
thx_Floats.nearZero = function(n,tollerance) {
	if(tollerance == null) tollerance = 1e-9;
	return Math.abs(n) <= tollerance;
};
thx_Floats.normalize = function(v) {
	if(v < 0) return 0; else if(v > 1) return 1; else return v;
};
thx_Floats.parse = function(s) {
	if(s.substring(0,1) == "+") s = s.substring(1);
	return parseFloat(s);
};
thx_Floats.root = function(base,index) {
	return Math.pow(base,1 / index);
};
thx_Floats.roundTo = function(f,decimals) {
	var p = Math.pow(10,decimals);
	return Math.round(f * p) / p;
};
thx_Floats.sign = function(value) {
	if(value < 0) return -1; else return 1;
};
thx_Floats.toString = function(v) {
	return "" + v;
};
thx_Floats.toFloat = function(s) {
	return thx_Floats.parse(s);
};
thx_Floats.trunc = function(value) {
	if(value < 0.0) return Math.ceil(value); else return Math.floor(value);
};
thx_Floats.ftrunc = function(value) {
	if(value < 0.0) return Math.ceil(value); else return Math.floor(value);
};
thx_Floats.wrap = function(v,min,max) {
	var range = max - min + 1;
	if(v < min) v += range * ((min - v) / range + 1);
	return min + (v - min) % range;
};
thx_Floats.wrapCircular = function(v,max) {
	v = v % max;
	if(v < 0) v += max;
	return v;
};
var thx_Functions0 = function() { };
thx_Functions0.__name__ = ["thx","Functions0"];
thx_Functions0.after = function(callback,n) {
	return function() {
		if(--n == 0) callback();
	};
};
thx_Functions0.join = function(fa,fb) {
	return function() {
		fa();
		fb();
	};
};
thx_Functions0.once = function(f) {
	return function() {
		var t = f;
		f = thx_Functions.noop;
		t();
	};
};
thx_Functions0.negate = function(callback) {
	return function() {
		return !callback();
	};
};
thx_Functions0.times = function(n,callback) {
	return function() {
		return thx_Ints.range(n).map(function(_) {
			return callback();
		});
	};
};
thx_Functions0.timesi = function(n,callback) {
	return function() {
		return thx_Ints.range(n).map(function(i) {
			return callback(i);
		});
	};
};
var thx_Functions1 = function() { };
thx_Functions1.__name__ = ["thx","Functions1"];
thx_Functions1.compose = function(fa,fb) {
	return function(v) {
		return fa(fb(v));
	};
};
thx_Functions1.map = function(fab,fbc) {
	return function(a) {
		return fbc(fab(a));
	};
};
thx_Functions1.contramap = function(fbc,fab) {
	return function(a) {
		return fbc(fab(a));
	};
};
thx_Functions1.join = function(fa,fb) {
	return function(v) {
		fa(v);
		fb(v);
	};
};
thx_Functions1.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v) {
		return "" + Std.string(v);
	};
	var map = new haxe_ds_StringMap();
	return function(v1) {
		var key = resolver(v1);
		if(__map_reserved[key] != null?map.existsReserved(key):map.h.hasOwnProperty(key)) return __map_reserved[key] != null?map.getReserved(key):map.h[key];
		var result = callback(v1);
		if(__map_reserved[key] != null) map.setReserved(key,result); else map.h[key] = result;
		return result;
	};
};
thx_Functions1.negate = function(callback) {
	return function(v) {
		return !callback(v);
	};
};
thx_Functions1.noop = function(_) {
};
thx_Functions1.times = function(n,callback) {
	return function(value) {
		return thx_Ints.range(n).map(function(_) {
			return callback(value);
		});
	};
};
thx_Functions1.timesi = function(n,callback) {
	return function(value) {
		return thx_Ints.range(n).map(function(i) {
			return callback(value,i);
		});
	};
};
thx_Functions1.swapArguments = function(callback) {
	return function(a2,a1) {
		return callback(a1,a2);
	};
};
var thx_Functions2 = function() { };
thx_Functions2.__name__ = ["thx","Functions2"];
thx_Functions2.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v1,v2) {
		return "" + Std.string(v1) + ":" + Std.string(v2);
	};
	var map = new haxe_ds_StringMap();
	return function(v11,v21) {
		var key = resolver(v11,v21);
		if(__map_reserved[key] != null?map.existsReserved(key):map.h.hasOwnProperty(key)) return __map_reserved[key] != null?map.getReserved(key):map.h[key];
		var result = callback(v11,v21);
		if(__map_reserved[key] != null) map.setReserved(key,result); else map.h[key] = result;
		return result;
	};
};
thx_Functions2.curry = function(f) {
	return function(a) {
		return function(b) {
			return f(a,b);
		};
	};
};
thx_Functions2.negate = function(callback) {
	return function(v1,v2) {
		return !callback(v1,v2);
	};
};
var thx_Functions3 = function() { };
thx_Functions3.__name__ = ["thx","Functions3"];
thx_Functions3.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v1,v2,v3) {
		return "" + Std.string(v1) + ":" + Std.string(v2) + ":" + Std.string(v3);
	};
	var map = new haxe_ds_StringMap();
	return function(v11,v21,v31) {
		var key = resolver(v11,v21,v31);
		if(__map_reserved[key] != null?map.existsReserved(key):map.h.hasOwnProperty(key)) return __map_reserved[key] != null?map.getReserved(key):map.h[key];
		var result = callback(v11,v21,v31);
		if(__map_reserved[key] != null) map.setReserved(key,result); else map.h[key] = result;
		return result;
	};
};
thx_Functions3.negate = function(callback) {
	return function(v1,v2,v3) {
		return !callback(v1,v2,v3);
	};
};
thx_Functions3.curry = function(f) {
	return function(a,b) {
		return function(c) {
			return f(a,b,c);
		};
	};
};
var thx_Functions4 = function() { };
thx_Functions4.__name__ = ["thx","Functions4"];
thx_Functions4.curry = function(f) {
	return function(a,b,c) {
		return function(d) {
			return f(a,b,c,d);
		};
	};
};
var thx_Functions5 = function() { };
thx_Functions5.__name__ = ["thx","Functions5"];
thx_Functions5.curry = function(f) {
	return function(a,b,c,d) {
		return function(e) {
			return f(a,b,c,d,e);
		};
	};
};
var thx_Functions6 = function() { };
thx_Functions6.__name__ = ["thx","Functions6"];
thx_Functions6.curry = function(f) {
	return function(a,b,c,d,e) {
		return function(f0) {
			return f(a,b,c,d,e,f0);
		};
	};
};
var thx_Functions7 = function() { };
thx_Functions7.__name__ = ["thx","Functions7"];
thx_Functions7.curry = function(f) {
	return function(a,b,c,d,e,f0) {
		return function(g) {
			return f(a,b,c,d,e,f0,g);
		};
	};
};
var thx_Functions8 = function() { };
thx_Functions8.__name__ = ["thx","Functions8"];
thx_Functions8.curry = function(f) {
	return function(a,b,c,d,e,f0,g) {
		return function(h) {
			return f(a,b,c,d,e,f0,g,h);
		};
	};
};
var thx_Functions9 = function() { };
thx_Functions9.__name__ = ["thx","Functions9"];
thx_Functions9.curry = function(f) {
	return function(a,b,c,d,e,f0,g,h) {
		return function(i) {
			return f(a,b,c,d,e,f0,g,h,i);
		};
	};
};
var thx__$Functions_Reader_$Impl_$ = {};
thx__$Functions_Reader_$Impl_$.__name__ = ["thx","_Functions","Reader_Impl_"];
thx__$Functions_Reader_$Impl_$.flatMap = function(this1,f) {
	return function(a) {
		return (f(this1(a)))(a);
	};
};
var thx_Functions = function() { };
thx_Functions.__name__ = ["thx","Functions"];
thx_Functions.equality = function(a,b) {
	return a == b;
};
thx_Functions.identity = function(value) {
	return value;
};
thx_Functions.noop = function() {
};
var thx_Ints = function() { };
thx_Ints.__name__ = ["thx","Ints"];
thx_Ints.abs = function(v) {
	if(v < 0) return -v; else return v;
};
thx_Ints.canParse = function(s) {
	return thx_Ints.pattern_parse.match(s);
};
thx_Ints.clamp = function(v,min,max) {
	if(v < min) return min; else if(v > max) return max; else return v;
};
thx_Ints.clampSym = function(v,max) {
	return thx_Ints.clamp(v,-max,max);
};
thx_Ints.compare = function(a,b) {
	return a - b;
};
thx_Ints.gcd = function(m,n) {
	if(m < 0) m = -m; else m = m;
	if(n < 0) n = -n; else n = n;
	if(n == 0) return m;
	return thx_Ints.gcd(n,m % n);
};
thx_Ints.interpolate = function(f,a,b) {
	return Math.round(a + (b - a) * f);
};
thx_Ints.isEven = function(v) {
	return v % 2 == 0;
};
thx_Ints.isOdd = function(v) {
	return v % 2 != 0;
};
thx_Ints.lpad = function(v,pad,len) {
	if(pad == null) pad = "0";
	var neg = false;
	if(v < 0) {
		neg = true;
		v = -v;
	}
	return (neg?"-":"") + StringTools.lpad("" + v,pad,len);
};
thx_Ints.lcm = function(m,n) {
	if(m < 0) m = -m; else m = m;
	if(n < 0) n = -n; else n = n;
	if(n == 0) return m;
	return m * Std["int"](n / thx_Ints.gcd(m,n));
};
thx_Ints.rpad = function(v,pad,len) {
	if(pad == null) pad = "0";
	return StringTools.rpad("" + v,pad,len);
};
thx_Ints.max = function(a,b) {
	if(a > b) return a; else return b;
};
thx_Ints.min = function(a,b) {
	if(a < b) return a; else return b;
};
thx_Ints.parse = function(s,base) {
	if(null == base) {
		if(s.substring(0,2) == "0x") base = 16; else base = 10;
	}
	var v = parseInt(s,base);
	if(isNaN(v)) return null; else return v;
};
thx_Ints.random = function(min,max) {
	if(min == null) min = 0;
	return Std.random(max + 1) + min;
};
thx_Ints.range = function(start,stop,step) {
	if(step == null) step = 1;
	if(null == stop) {
		stop = start;
		start = 0;
	}
	if((stop - start) / step == Infinity) throw new js__$Boot_HaxeError("infinite range");
	var range = [];
	var i = -1;
	var j;
	if(step < 0) while((j = start + step * ++i) > stop) range.push(j); else while((j = start + step * ++i) < stop) range.push(j);
	return range;
};
thx_Ints.rangeIter = function(start,stop,step) {
	if(step == null) step = 1;
	return new thx_RangeIterator(start,stop,step);
};
thx_Ints.toString = function(value,base) {
	return value.toString(base);
};
thx_Ints.toBase = function(value,base) {
	return value.toString(base);
};
thx_Ints.toBool = function(v) {
	return v != 0;
};
thx_Ints.toInt = function(s,base) {
	return thx_Ints.parse(s,base);
};
thx_Ints.sign = function(value) {
	if(value < 0) return -1; else return 1;
};
thx_Ints.wrapCircular = function(v,max) {
	v = v % max;
	if(v < 0) v += max;
	return v;
};
var thx_RangeIterator = function(start,stop,step) {
	if(step == null) step = 1;
	this.current = start;
	this.stop = stop;
	this.step = step;
};
thx_RangeIterator.__name__ = ["thx","RangeIterator"];
thx_RangeIterator.prototype = {
	current: null
	,stop: null
	,step: null
	,hasNext: function() {
		return this.stop == null || this.step >= 0 && this.current < this.stop || this.step < 0 && this.current > this.stop;
	}
	,next: function() {
		var result = this.current;
		this.current += this.step;
		return result;
	}
	,__class__: thx_RangeIterator
};
var thx_Iterables = function() { };
thx_Iterables.__name__ = ["thx","Iterables"];
thx_Iterables.all = function(it,predicate) {
	return thx_Iterators.all($iterator(it)(),predicate);
};
thx_Iterables.any = function(it,predicate) {
	return thx_Iterators.any($iterator(it)(),predicate);
};
thx_Iterables.eachPair = function(it,handler) {
	thx_Iterators.eachPair($iterator(it)(),handler);
	return;
};
thx_Iterables.equals = function(a,b,equality) {
	return thx_Iterators.equals($iterator(a)(),$iterator(b)(),equality);
};
thx_Iterables.filter = function(it,predicate) {
	return thx_Iterators.filter($iterator(it)(),predicate);
};
thx_Iterables.find = function(it,predicate) {
	return thx_Iterators.find($iterator(it)(),predicate);
};
thx_Iterables.findOption = function(it,predicate) {
	return thx_Options.ofValue(thx_Iterators.find($iterator(it)(),predicate));
};
thx_Iterables.first = function(it) {
	return thx_Iterators.first($iterator(it)());
};
thx_Iterables.get = function(it,index) {
	return thx_Iterators.get($iterator(it)(),index);
};
thx_Iterables.getOption = function(it,index) {
	return thx_Options.ofValue(thx_Iterators.get($iterator(it)(),index));
};
thx_Iterables.last = function(it) {
	return thx_Iterators.last($iterator(it)());
};
thx_Iterables.hasElements = function(it) {
	return thx_Iterators.hasElements($iterator(it)());
};
thx_Iterables.indexOf = function(it,element) {
	return thx_Iterators.indexOf($iterator(it)(),element);
};
thx_Iterables.isEmpty = function(it) {
	return thx_Iterators.isEmpty($iterator(it)());
};
thx_Iterables.isIterable = function(v) {
	var fields;
	if(Reflect.isObject(v) && null == Type.getClass(v)) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"iterator")) return false;
	return Reflect.isFunction(Reflect.field(v,"iterator"));
};
thx_Iterables.map = function(it,f) {
	return thx_Iterators.map($iterator(it)(),f);
};
thx_Iterables.fmap = function(it,f) {
	return { iterator : function() {
		return thx_Iterators.fmap($iterator(it)(),f);
	}};
};
thx_Iterables.mapi = function(it,f) {
	return thx_Iterators.mapi($iterator(it)(),f);
};
thx_Iterables.fmapi = function(it,f) {
	return { iterator : function() {
		return thx_Iterators.fmapi($iterator(it)(),f);
	}};
};
thx_Iterables.order = function(it,sort) {
	return thx_Iterators.order($iterator(it)(),sort);
};
thx_Iterables.reduce = function(it,callback,initial) {
	return thx_Iterators.reduce($iterator(it)(),callback,initial);
};
thx_Iterables.reducei = function(it,callback,initial) {
	return thx_Iterators.reducei($iterator(it)(),callback,initial);
};
thx_Iterables.toArray = function(it) {
	return thx_Iterators.toArray($iterator(it)());
};
thx_Iterables.minBy = function(it,f,ord) {
	var found = haxe_ds_Option.None;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var a = $it0.next();
		var a1 = [a];
		if(thx_Options.any(found,(function(a1) {
			return function(a0) {
				return ord(f(a0),f(a1[0])) == thx_OrderingImpl.LT;
			};
		})(a1))) found = found; else found = haxe_ds_Option.Some(a1[0]);
	}
	return found;
};
thx_Iterables.maxBy = function(it,f,ord) {
	return thx_Iterables.minBy(it,f,thx__$Ord_Ord_$Impl_$.inverse(ord));
};
thx_Iterables.min = function(it,ord) {
	return thx_Iterables.minBy(it,thx_Functions.identity,ord);
};
thx_Iterables.max = function(it,ord) {
	return thx_Iterables.min(it,thx__$Ord_Ord_$Impl_$.inverse(ord));
};
thx_Iterables.extremaBy = function(it,f,ord) {
	var found = haxe_ds_Option.None;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var a = $it0.next();
		switch(found[1]) {
		case 1:
			found = haxe_ds_Option.Some({ _0 : a, _1 : a});
			break;
		case 0:
			var t = found[2];
			if(ord(f(a),f(t._0)) == thx_OrderingImpl.LT) found = haxe_ds_Option.Some({ _0 : a, _1 : t._1}); else {
				var t1 = found[2];
				if(ord(f(a),f(t1._1)) == thx_OrderingImpl.GT) found = haxe_ds_Option.Some({ _0 : t1._0, _1 : a}); else found = found;
			}
			break;
		default:
			found = found;
		}
	}
	return found;
};
thx_Iterables.extrema = function(it,ord) {
	return thx_Iterables.extremaBy(it,thx_Functions.identity,ord);
};
thx_Iterables.unzip = function(it) {
	return thx_Iterators.unzip($iterator(it)());
};
thx_Iterables.unzip3 = function(it) {
	return thx_Iterators.unzip3($iterator(it)());
};
thx_Iterables.unzip4 = function(it) {
	return thx_Iterators.unzip4($iterator(it)());
};
thx_Iterables.unzip5 = function(it) {
	return thx_Iterators.unzip5($iterator(it)());
};
thx_Iterables.zip = function(it1,it2) {
	return thx_Iterators.zip($iterator(it1)(),$iterator(it2)());
};
thx_Iterables.zip3 = function(it1,it2,it3) {
	return thx_Iterators.zip3($iterator(it1)(),$iterator(it2)(),$iterator(it3)());
};
thx_Iterables.zip4 = function(it1,it2,it3,it4) {
	return thx_Iterators.zip4($iterator(it1)(),$iterator(it2)(),$iterator(it3)(),$iterator(it4)());
};
thx_Iterables.zip5 = function(it1,it2,it3,it4,it5) {
	return thx_Iterators.zip5($iterator(it1)(),$iterator(it2)(),$iterator(it3)(),$iterator(it4)(),$iterator(it5)());
};
var thx_Iterators = function() { };
thx_Iterators.__name__ = ["thx","Iterators"];
thx_Iterators.all = function(it,predicate) {
	while( it.hasNext() ) {
		var element = it.next();
		if(!predicate(element)) return false;
	}
	return true;
};
thx_Iterators.any = function(it,predicate) {
	while( it.hasNext() ) {
		var element = it.next();
		if(predicate(element)) return true;
	}
	return false;
};
thx_Iterators.equals = function(a,b,equality) {
	if(null == equality) equality = thx_Functions.equality;
	var ae;
	var be;
	var an;
	var bn;
	while(true) {
		an = a.hasNext();
		bn = b.hasNext();
		if(!an && !bn) return true;
		if(!an || !bn) return false;
		if(!equality(a.next(),b.next())) return false;
	}
};
thx_Iterators.get = function(it,index) {
	var pos = 0;
	while( it.hasNext() ) {
		var i = it.next();
		if(pos++ == index) return i;
	}
	return null;
};
thx_Iterators.getOption = function(it,index) {
	return thx_Options.ofValue(thx_Iterators.get(it,index));
};
thx_Iterators.eachPair = function(it,handler) {
	thx_Arrays.eachPair(thx_Iterators.toArray(it),handler);
};
thx_Iterators.filter = function(it,predicate) {
	return thx_Iterators.reduce(it,function(acc,element) {
		if(predicate(element)) acc.push(element);
		return acc;
	},[]);
};
thx_Iterators.find = function(it,f) {
	while( it.hasNext() ) {
		var element = it.next();
		if(f(element)) return element;
	}
	return null;
};
thx_Iterators.findOption = function(it,f) {
	return thx_Options.ofValue(thx_Iterators.find(it,f));
};
thx_Iterators.first = function(it) {
	if(it.hasNext()) return it.next(); else return null;
};
thx_Iterators.hasElements = function(it) {
	return it.hasNext();
};
thx_Iterators.indexOf = function(it,element) {
	var pos = 0;
	while( it.hasNext() ) {
		var v = it.next();
		if(element == v) return pos;
		pos++;
	}
	return -1;
};
thx_Iterators.isEmpty = function(it) {
	return !it.hasNext();
};
thx_Iterators.isIterator = function(v) {
	var fields;
	if(Reflect.isObject(v) && null == Type.getClass(v)) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"next") || !Lambda.has(fields,"hasNext")) return false;
	return Reflect.isFunction(Reflect.field(v,"next")) && Reflect.isFunction(Reflect.field(v,"hasNext"));
};
thx_Iterators.last = function(it) {
	var buf = null;
	while(it.hasNext()) buf = it.next();
	return buf;
};
thx_Iterators.forEach = function(it,proc) {
	while(it.hasNext()) proc(it.next());
};
thx_Iterators.map = function(it,f) {
	var acc = [];
	while( it.hasNext() ) {
		var v = it.next();
		acc.push(f(v));
	}
	return acc;
};
thx_Iterators.fmap = function(it,f) {
	return new thx_MapIterator(it,f);
};
thx_Iterators.mapi = function(it,f) {
	var acc = [];
	var i = 0;
	while( it.hasNext() ) {
		var v = it.next();
		acc.push(f(v,i++));
	}
	return acc;
};
thx_Iterators.fmapi = function(it,f) {
	return new thx_MapIIterator(it,f);
};
thx_Iterators.order = function(it,sort) {
	var n = thx_Iterators.toArray(it);
	n.sort(sort);
	return n;
};
thx_Iterators.reduce = function(it,callback,initial) {
	var result = initial;
	while(it.hasNext()) result = callback(result,it.next());
	return result;
};
thx_Iterators.reducei = function(it,callback,initial) {
	thx_Iterators.mapi(it,function(v,i) {
		initial = callback(initial,v,i);
	});
	return initial;
};
thx_Iterators.foldLeft = function(it,zero,f) {
	return thx_Iterators.reduce(it,f,zero);
};
thx_Iterators.foldMap = function(it,f,m) {
	return thx_Iterators.foldLeft(thx_Iterators.fmap(it,f),thx__$Monoid_Monoid_$Impl_$.get_zero(m),(function(_e) {
		return function(a0,a1) {
			return thx__$Monoid_Monoid_$Impl_$.append(_e,a0,a1);
		};
	})(m));
};
thx_Iterators.toArray = function(it) {
	var elements = [];
	while( it.hasNext() ) {
		var element = it.next();
		elements.push(element);
	}
	return elements;
};
thx_Iterators.unzip = function(it) {
	var a1 = [];
	var a2 = [];
	thx_Iterators.forEach(it,function(t) {
		a1.push(t._0);
		a2.push(t._1);
	});
	return { _0 : a1, _1 : a2};
};
thx_Iterators.unzip3 = function(it) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	thx_Iterators.forEach(it,function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
	});
	return { _0 : a1, _1 : a2, _2 : a3};
};
thx_Iterators.unzip4 = function(it) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var a4 = [];
	thx_Iterators.forEach(it,function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
		a4.push(t._3);
	});
	return { _0 : a1, _1 : a2, _2 : a3, _3 : a4};
};
thx_Iterators.unzip5 = function(it) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var a4 = [];
	var a5 = [];
	thx_Iterators.forEach(it,function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
		a4.push(t._3);
		a5.push(t._4);
	});
	return { _0 : a1, _1 : a2, _2 : a3, _3 : a4, _4 : a5};
};
thx_Iterators.zip = function(it1,it2) {
	var array = [];
	while(it1.hasNext() && it2.hasNext()) array.push((function($this) {
		var $r;
		var _0 = it1.next();
		var _1 = it2.next();
		$r = { _0 : _0, _1 : _1};
		return $r;
	}(this)));
	return array;
};
thx_Iterators.zip3 = function(it1,it2,it3) {
	var array = [];
	while(it1.hasNext() && it2.hasNext() && it3.hasNext()) array.push((function($this) {
		var $r;
		var _0 = it1.next();
		var _1 = it2.next();
		var _2 = it3.next();
		$r = { _0 : _0, _1 : _1, _2 : _2};
		return $r;
	}(this)));
	return array;
};
thx_Iterators.zip4 = function(it1,it2,it3,it4) {
	var array = [];
	while(it1.hasNext() && it2.hasNext() && it3.hasNext() && it4.hasNext()) array.push((function($this) {
		var $r;
		var _0 = it1.next();
		var _1 = it2.next();
		var _2 = it3.next();
		var _3 = it4.next();
		$r = { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
		return $r;
	}(this)));
	return array;
};
thx_Iterators.zip5 = function(it1,it2,it3,it4,it5) {
	var array = [];
	while(it1.hasNext() && it2.hasNext() && it3.hasNext() && it4.hasNext() && it5.hasNext()) array.push((function($this) {
		var $r;
		var _0 = it1.next();
		var _1 = it2.next();
		var _2 = it3.next();
		var _3 = it4.next();
		var _4 = it5.next();
		$r = { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4};
		return $r;
	}(this)));
	return array;
};
var thx_MapIterator = function(base,f) {
	this.base = base;
	this.f = f;
};
thx_MapIterator.__name__ = ["thx","MapIterator"];
thx_MapIterator.prototype = {
	base: null
	,f: null
	,next: function() {
		return this.f(this.base.next());
	}
	,hasNext: function() {
		return this.base.hasNext();
	}
	,__class__: thx_MapIterator
};
var thx_MapIIterator = function(base,f) {
	this.i = 0;
	this.base = base;
	this.f = f;
};
thx_MapIIterator.__name__ = ["thx","MapIIterator"];
thx_MapIIterator.prototype = {
	base: null
	,f: null
	,i: null
	,next: function() {
		var result = this.f(this.base.next(),this.i);
		this.i++;
		return result;
	}
	,hasNext: function() {
		return this.base.hasNext();
	}
	,__class__: thx_MapIIterator
};
var thx_Maps = function() { };
thx_Maps.__name__ = ["thx","Maps"];
thx_Maps.copyTo = function(src,dst) {
	var $it0 = src.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		dst.set(key,src.get(key));
	}
	return dst;
};
thx_Maps.tuples = function(map) {
	return thx_Iterators.map(map.keys(),function(key) {
		var _1 = map.get(key);
		return { _0 : key, _1 : _1};
	});
};
thx_Maps.mapValues = function(map,f,acc) {
	return thx_Maps.reduce(map,function(m,t) {
		var value = f(t._1);
		m.set(t._0,value);
		return m;
	},acc);
};
thx_Maps.reduce = function(map,f,acc) {
	return thx_Arrays.reduce(thx_Maps.tuples(map),f,acc);
};
thx_Maps.values = function(map) {
	return thx_Iterators.map(map.keys(),function(key) {
		return map.get(key);
	});
};
thx_Maps.getOption = function(map,key) {
	return thx_Options.ofValue(map.get(key));
};
thx_Maps.toObject = function(map) {
	return thx_Arrays.reduce(thx_Maps.tuples(map),function(o,t) {
		o[t._0] = t._1;
		return o;
	},{ });
};
thx_Maps.getAlt = function(map,key,alt) {
	var v = map.get(key);
	if(null == v) return alt; else return v;
};
thx_Maps.isMap = function(v) {
	return js_Boot.__instanceof(v,haxe_IMap);
};
thx_Maps.string = function(m) {
	return "[" + thx_Maps.tuples(m).map(function(t) {
		return thx_Dynamics.string(t._0) + " => " + thx_Dynamics.string(t._1);
	}).join(", ") + "]";
};
thx_Maps.merge = function(dest,sources) {
	return thx_Arrays.reduce(sources,function(result,source) {
		return thx_Iterators.reduce(source.keys(),function(result1,key) {
			result1.set(key,source.get(key));
			return result1;
		},result);
	},dest);
};
var thx__$Monoid_Monoid_$Impl_$ = {};
thx__$Monoid_Monoid_$Impl_$.__name__ = ["thx","_Monoid","Monoid_Impl_"];
thx__$Monoid_Monoid_$Impl_$.get_semigroup = function(this1) {
	return this1.append;
};
thx__$Monoid_Monoid_$Impl_$.get_zero = function(this1) {
	return this1.zero;
};
thx__$Monoid_Monoid_$Impl_$.append = function(this1,a0,a1) {
	return this1.append(a0,a1);
};
var thx__$Nel_Nel_$Impl_$ = {};
thx__$Nel_Nel_$Impl_$.__name__ = ["thx","_Nel","Nel_Impl_"];
thx__$Nel_Nel_$Impl_$.nel = function(hd,tl) {
	{
		var _g = thx__$Nel_Nel_$Impl_$.fromArray(tl);
		switch(_g[1]) {
		case 0:
			var nel = _g[2];
			return thx__$Nel_Nel_$Impl_$.cons(hd,nel);
		case 1:
			return thx__$Nel_Nel_$Impl_$.pure(hd);
		}
	}
};
thx__$Nel_Nel_$Impl_$.pure = function(a) {
	return thx_NonEmptyList.Single(a);
};
thx__$Nel_Nel_$Impl_$.cons = function(a,nl) {
	return thx_NonEmptyList.ConsNel(a,nl);
};
thx__$Nel_Nel_$Impl_$.fromArray = function(arr) {
	if(arr.length == 0) return haxe_ds_Option.None; else {
		var res = thx_NonEmptyList.Single(arr[arr.length - 1]);
		var $it0 = thx_Ints.rangeIter(arr.length - 2,-1,-1);
		while( $it0.hasNext() ) {
			var i = $it0.next();
			res = thx_NonEmptyList.ConsNel(arr[i],res);
		}
		return haxe_ds_Option.Some(res);
	}
};
thx__$Nel_Nel_$Impl_$.map = function(this1,f) {
	return thx__$Nel_Nel_$Impl_$.flatMap(this1,thx_Functions1.compose(thx__$Nel_Nel_$Impl_$.pure,f));
};
thx__$Nel_Nel_$Impl_$.flatMap = function(this1,f) {
	switch(this1[1]) {
	case 0:
		var x = this1[2];
		return f(x);
	case 1:
		var xs = this1[3];
		var x1 = this1[2];
		return thx__$Nel_Nel_$Impl_$.append(f(x1),thx__$Nel_Nel_$Impl_$.flatMap(xs,f));
	}
};
thx__$Nel_Nel_$Impl_$.fold = function(this1,s) {
	switch(this1[1]) {
	case 0:
		var x = this1[2];
		return x;
	case 1:
		var xs = this1[3];
		var x1 = this1[2];
		return (thx__$Semigroup_Semigroup_$Impl_$.get_append(s))(x1,thx__$Nel_Nel_$Impl_$.fold(xs,s));
	}
};
thx__$Nel_Nel_$Impl_$.append = function(this1,nel) {
	switch(this1[1]) {
	case 0:
		var x = this1[2];
		return thx_NonEmptyList.ConsNel(x,nel);
	case 1:
		var xs = this1[3];
		var x1 = this1[2];
		return thx_NonEmptyList.ConsNel(x1,thx__$Nel_Nel_$Impl_$.append(xs,nel));
	}
};
thx__$Nel_Nel_$Impl_$.toArray = function(this1) {
	var go;
	var go1 = null;
	go1 = function(acc,xs) {
		switch(xs[1]) {
		case 0:
			var x = xs[2];
			return thx_Arrays.append(acc,x);
		case 1:
			var xs1 = xs[3];
			var x1 = xs[2];
			return go1(thx_Arrays.append(acc,x1),xs1);
		}
	};
	go = go1;
	return thx_Arrays.reversed(go([],this1));
};
thx__$Nel_Nel_$Impl_$.semigroup = function() {
	return function(nl,nr) {
		return thx__$Nel_Nel_$Impl_$.append(nl,nr);
	};
};
var thx_NonEmptyList = { __ename__ : ["thx","NonEmptyList"], __constructs__ : ["Single","ConsNel"] };
thx_NonEmptyList.Single = function(x) { var $x = ["Single",0,x]; $x.__enum__ = thx_NonEmptyList; $x.toString = $estr; return $x; };
thx_NonEmptyList.ConsNel = function(x,xs) { var $x = ["ConsNel",1,x,xs]; $x.__enum__ = thx_NonEmptyList; $x.toString = $estr; return $x; };
var thx_Nil = { __ename__ : ["thx","Nil"], __constructs__ : ["nil"] };
thx_Nil.nil = ["nil",0];
thx_Nil.nil.toString = $estr;
thx_Nil.nil.__enum__ = thx_Nil;
var thx_Objects = function() { };
thx_Objects.__name__ = ["thx","Objects"];
thx_Objects.compare = function(a,b) {
	var v;
	var fields;
	if((v = thx_Arrays.compare(fields = Reflect.fields(a),Reflect.fields(b))) != 0) return v;
	var _g = 0;
	while(_g < fields.length) {
		var field = fields[_g];
		++_g;
		if((v = thx_Dynamics.compare(Reflect.field(a,field),Reflect.field(b,field))) != 0) return v;
	}
	return 0;
};
thx_Objects.isEmpty = function(o) {
	return Reflect.fields(o).length == 0;
};
thx_Objects.exists = function(o,name) {
	return Object.prototype.hasOwnProperty.call(o,name);
};
thx_Objects.fields = function(o) {
	return Reflect.fields(o);
};
thx_Objects.combine = function(first,second) {
	var to = { };
	var _g = 0;
	var _g1 = Reflect.fields(first);
	while(_g < _g1.length) {
		var field = _g1[_g];
		++_g;
		Reflect.setField(to,field,Reflect.field(first,field));
	}
	var _g2 = 0;
	var _g11 = Reflect.fields(second);
	while(_g2 < _g11.length) {
		var field1 = _g11[_g2];
		++_g2;
		Reflect.setField(to,field1,Reflect.field(second,field1));
	}
	return to;
};
thx_Objects.assign = function(to,from,replacef) {
	if(null == replacef) replacef = function(field,oldv,newv) {
		return newv;
	};
	var _g = 0;
	var _g1 = Reflect.fields(from);
	while(_g < _g1.length) {
		var field1 = _g1[_g];
		++_g;
		var newv1 = Reflect.field(from,field1);
		if(Object.prototype.hasOwnProperty.call(to,field1)) Reflect.setField(to,field1,replacef(field1,Reflect.field(to,field1),newv1)); else to[field1] = newv1;
	}
	return to;
};
thx_Objects.copyTo = function(src,dst,cloneInstances) {
	if(cloneInstances == null) cloneInstances = false;
	var _g = 0;
	var _g1 = Reflect.fields(src);
	while(_g < _g1.length) {
		var field = _g1[_g];
		++_g;
		var sv = thx_Dynamics.clone(Reflect.field(src,field),cloneInstances);
		var dv = Reflect.field(dst,field);
		if(Reflect.isObject(sv) && null == Type.getClass(sv) && (Reflect.isObject(dv) && null == Type.getClass(dv))) thx_Objects.copyTo(sv,dv); else dst[field] = sv;
	}
	return dst;
};
thx_Objects.clone = function(src,cloneInstances) {
	if(cloneInstances == null) cloneInstances = false;
	return thx_Dynamics.clone(src,cloneInstances);
};
thx_Objects.toMap = function(o) {
	return thx_Arrays.reduce(thx_Objects.tuples(o),function(map,t) {
		var value = t._1;
		map.set(t._0,value);
		return map;
	},new haxe_ds_StringMap());
};
thx_Objects.size = function(o) {
	return Reflect.fields(o).length;
};
thx_Objects.string = function(o) {
	return "{" + Reflect.fields(o).map(function(key) {
		var v = Reflect.field(o,key);
		var s;
		if(typeof(v) == "string") s = thx_Strings.quote(v); else s = thx_Dynamics.string(v);
		return "" + key + " : " + s;
	}).join(", ") + "}";
};
thx_Objects.stringImpl = function(o,cache) {
};
thx_Objects.values = function(o) {
	return Reflect.fields(o).map(function(key) {
		return Reflect.field(o,key);
	});
};
thx_Objects.tuples = function(o) {
	return Reflect.fields(o).map(function(key) {
		var _1 = Reflect.field(o,key);
		return { _0 : key, _1 : _1};
	});
};
thx_Objects.hasPath = function(o,path) {
	var paths = path.split(".");
	var current = o;
	var _g = 0;
	while(_g < paths.length) {
		var currentPath = paths[_g];
		++_g;
		if(thx_Strings.DIGITS.match(currentPath)) {
			var index = Std.parseInt(currentPath);
			var arr = Std.instance(current,Array);
			if(null == arr || arr.length <= index) return false;
			current = arr[index];
		} else if(Object.prototype.hasOwnProperty.call(current,currentPath)) current = Reflect.field(current,currentPath); else return false;
	}
	return true;
};
thx_Objects.hasPathValue = function(o,path) {
	return thx_Objects.getPath(o,path) != null;
};
thx_Objects.getPath = function(o,path) {
	var paths = path.split(".");
	var current = o;
	var _g = 0;
	while(_g < paths.length) {
		var currentPath = paths[_g];
		++_g;
		if(thx_Strings.DIGITS.match(currentPath)) {
			var index = Std.parseInt(currentPath);
			var arr = Std.instance(current,Array);
			if(null == arr) return null;
			current = arr[index];
		} else if(Object.prototype.hasOwnProperty.call(current,currentPath)) current = Reflect.field(current,currentPath); else return null;
	}
	return current;
};
thx_Objects.getPathOption = function(o,path) {
	return thx_Options.ofValue(thx_Objects.getPath(o,path));
};
thx_Objects.getPathOr = function(o,path,alt) {
	var paths = path.split(".");
	var current = o;
	var _g = 0;
	while(_g < paths.length) {
		var currentPath = paths[_g];
		++_g;
		if(thx_Strings.DIGITS.match(currentPath)) {
			var index = Std.parseInt(currentPath);
			var arr = Std.instance(current,Array);
			if(null == arr) return null;
			current = arr[index];
		} else if(Object.prototype.hasOwnProperty.call(current,currentPath)) current = Reflect.field(current,currentPath); else return alt;
	}
	return current;
};
thx_Objects.setPath = function(o,path,val) {
	var paths = path.split(".");
	var current = o;
	var _g1 = 0;
	var _g = paths.length - 1;
	while(_g1 < _g) {
		var i = _g1++;
		var currentPath = paths[i];
		var nextPath = paths[i + 1];
		if(thx_Strings.DIGITS.match(currentPath) || currentPath == "*") {
			var index;
			if(currentPath == "*") index = current.length; else index = Std.parseInt(currentPath);
			if(current[index] == null) {
				if(thx_Strings.DIGITS.match(nextPath) || nextPath == "*") current[index] = []; else current[index] = { };
			}
			current = current[index];
		} else {
			if(!Object.prototype.hasOwnProperty.call(current,currentPath)) {
				if(thx_Strings.DIGITS.match(nextPath) || nextPath == "*") current[currentPath] = []; else current[currentPath] = { };
			}
			current = Reflect.field(current,currentPath);
		}
	}
	var p = paths[paths.length - 1];
	if(thx_Strings.DIGITS.match(p)) {
		var index1 = Std.parseInt(p);
		current[index1] = val;
	} else if(p == "*") current.push(val); else current[p] = val;
	return o;
};
thx_Objects.removePath = function(o,path) {
	var paths = path.split(".");
	var target = paths.pop();
	try {
		var sub = thx_Arrays.reduce(paths,function(existing,nextPath) {
			if(nextPath == "*") return existing.pop(); else if(thx_Strings.DIGITS.match(nextPath)) {
				var current = existing;
				var index = Std.parseInt(nextPath);
				return current[index];
			} else return Reflect.field(existing,nextPath);
		},o);
		if(null != sub) Reflect.deleteField(sub,target);
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
	}
	return o;
};
var thx_Options = function() { };
thx_Options.__name__ = ["thx","Options"];
thx_Options.ofValue = function(value) {
	if(null == value) return haxe_ds_Option.None; else return haxe_ds_Option.Some(value);
};
thx_Options.maybe = function(value) {
	if(null == value) return haxe_ds_Option.None; else return haxe_ds_Option.Some(value);
};
thx_Options.equals = function(a,b,eq) {
	switch(a[1]) {
	case 1:
		switch(b[1]) {
		case 1:
			return true;
		default:
			return false;
		}
		break;
	case 0:
		switch(b[1]) {
		case 0:
			var a1 = a[2];
			var b1 = b[2];
			if(null == eq) eq = function(a2,b2) {
				return a2 == b2;
			};
			return eq(a1,b1);
		default:
			return false;
		}
		break;
	}
};
thx_Options.equalsValue = function(a,b,eq) {
	return thx_Options.equals(a,null == b?haxe_ds_Option.None:haxe_ds_Option.Some(b),eq);
};
thx_Options.map = function(option,callback) {
	switch(option[1]) {
	case 1:
		return haxe_ds_Option.None;
	case 0:
		var v = option[2];
		return haxe_ds_Option.Some(callback(v));
	}
};
thx_Options.ap = function(option,fopt) {
	switch(option[1]) {
	case 1:
		return haxe_ds_Option.None;
	case 0:
		var v = option[2];
		return thx_Options.map(fopt,function(f) {
			return f(v);
		});
	}
};
thx_Options.flatMap = function(option,callback) {
	switch(option[1]) {
	case 1:
		return haxe_ds_Option.None;
	case 0:
		var v = option[2];
		return callback(v);
	}
};
thx_Options.join = function(option) {
	switch(option[1]) {
	case 1:
		return haxe_ds_Option.None;
	case 0:
		var v = option[2];
		return v;
	}
};
thx_Options.cata = function(option,ifNone,f) {
	switch(option[1]) {
	case 1:
		return ifNone;
	case 0:
		var v = option[2];
		return f(v);
	}
};
thx_Options.foldLeft = function(option,b,f) {
	switch(option[1]) {
	case 1:
		return b;
	case 0:
		var v = option[2];
		return f(b,v);
	}
};
thx_Options.foldMap = function(option,f,m) {
	return thx_Options.foldLeft(thx_Options.map(option,f),thx__$Monoid_Monoid_$Impl_$.get_zero(m),(function(_e) {
		return function(a0,a1) {
			return thx__$Monoid_Monoid_$Impl_$.append(_e,a0,a1);
		};
	})(m));
};
thx_Options.filter = function(option,f) {
	switch(option[1]) {
	case 0:
		var v = option[2];
		if(f(v)) return option; else return haxe_ds_Option.None;
		break;
	default:
		return haxe_ds_Option.None;
	}
};
thx_Options.toArray = function(option) {
	switch(option[1]) {
	case 1:
		return [];
	case 0:
		var v = option[2];
		return [v];
	}
};
thx_Options.toBool = function(option) {
	switch(option[1]) {
	case 1:
		return false;
	case 0:
		return true;
	}
};
thx_Options.isNone = function(option) {
	return !thx_Options.toBool(option);
};
thx_Options.toOption = function(value) {
	if(null == value) return haxe_ds_Option.None; else return haxe_ds_Option.Some(value);
};
thx_Options.get = function(option) {
	switch(option[1]) {
	case 1:
		return null;
	case 0:
		var v = option[2];
		return v;
	}
};
thx_Options.getOrElse = function(option,alt) {
	switch(option[1]) {
	case 1:
		return alt;
	case 0:
		var v = option[2];
		return v;
	}
};
thx_Options.orElse = function(option,alt) {
	switch(option[1]) {
	case 1:
		return alt;
	case 0:
		return option;
	}
};
thx_Options.all = function(option,f) {
	switch(option[1]) {
	case 1:
		return true;
	case 0:
		var v = option[2];
		return f(v);
	}
};
thx_Options.any = function(option,f) {
	switch(option[1]) {
	case 1:
		return false;
	case 0:
		var v = option[2];
		return f(v);
	}
};
thx_Options.traverseValidation = function(option,f) {
	switch(option[1]) {
	case 0:
		var v = option[2];
		var this1 = f(v);
		return thx__$Validation_Validation_$Impl_$.ap(this1,thx_Either.Right(function(v1) {
			return haxe_ds_Option.Some(v1);
		}),function(e1,e2) {
			throw new js__$Boot_HaxeError("Unreachable");
		});
	case 1:
		return thx_Either.Right(haxe_ds_Option.None);
	}
};
thx_Options.toSuccess = function(option,error) {
	switch(option[1]) {
	case 1:
		return thx_Either.Left(error);
	case 0:
		var v = option[2];
		return thx_Either.Right(v);
	}
};
thx_Options.toSuccessNel = function(option,error) {
	switch(option[1]) {
	case 1:
		return thx_Either.Left(thx__$Nel_Nel_$Impl_$.pure(error));
	case 0:
		var v = option[2];
		return thx_Either.Right(v);
	}
};
thx_Options.toFailure = function(error,value) {
	switch(error[1]) {
	case 1:
		return thx_Either.Right(value);
	case 0:
		var e = error[2];
		return thx_Either.Left(e);
	}
};
thx_Options.toFailureNel = function(error,value) {
	switch(error[1]) {
	case 1:
		return thx_Either.Right(value);
	case 0:
		var e = error[2];
		return thx_Either.Left(thx__$Nel_Nel_$Impl_$.pure(e));
	}
};
thx_Options.ap2 = function(f,v1,v2) {
	return thx_Options.ap(v2,thx_Options.map(v1,thx_Functions2.curry(f)));
};
thx_Options.ap3 = function(f,v1,v2,v3) {
	return thx_Options.ap(v3,thx_Options.ap2(thx_Functions3.curry(f),v1,v2));
};
thx_Options.ap4 = function(f,v1,v2,v3,v4) {
	return thx_Options.ap(v4,thx_Options.ap3(thx_Functions4.curry(f),v1,v2,v3));
};
thx_Options.ap5 = function(f,v1,v2,v3,v4,v5) {
	return thx_Options.ap(v5,thx_Options.ap4(thx_Functions5.curry(f),v1,v2,v3,v4));
};
thx_Options.ap6 = function(f,v1,v2,v3,v4,v5,v6) {
	return thx_Options.ap(v6,thx_Options.ap5(thx_Functions6.curry(f),v1,v2,v3,v4,v5));
};
thx_Options.ap7 = function(f,v1,v2,v3,v4,v5,v6,v7) {
	return thx_Options.ap(v7,thx_Options.ap6(thx_Functions7.curry(f),v1,v2,v3,v4,v5,v6));
};
thx_Options.ap8 = function(f,v1,v2,v3,v4,v5,v6,v7,v8) {
	return thx_Options.ap(v8,thx_Options.ap7(thx_Functions8.curry(f),v1,v2,v3,v4,v5,v6,v7));
};
var thx_Orderings = function() { };
thx_Orderings.__name__ = ["thx","Orderings"];
thx_Orderings.negate = function(o) {
	switch(o[1]) {
	case 0:
		return thx_OrderingImpl.GT;
	case 2:
		return thx_OrderingImpl.EQ;
	case 1:
		return thx_OrderingImpl.LT;
	}
};
var thx__$ReadonlyArray_ReadonlyArray_$Impl_$ = {};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.__name__ = ["thx","_ReadonlyArray","ReadonlyArray_Impl_"];
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.empty = function() {
	return [];
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.flatten = function(array) {
	return Array.prototype.concat.apply([],array);
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf = function(this1,el,eq) {
	if(null == eq) eq = thx_Functions.equality;
	var _g1 = 0;
	var _g = this1.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(eq(el,this1[i])) return i;
	}
	return -1;
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.lastIndexOf = function(this1,el,eq) {
	if(null == eq) eq = thx_Functions.equality;
	var len = this1.length;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		if(eq(el,this1[len - i - 1])) return i;
	}
	return -1;
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.get = function(this1,index) {
	return this1[index];
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.head = function(this1) {
	return this1[0];
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.tail = function(this1) {
	return this1.slice(1);
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.reduce = function(this1,arr,f,initial) {
	var _g = 0;
	while(_g < arr.length) {
		var v = arr[_g];
		++_g;
		initial = f(initial,v);
	}
	return initial;
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.reducei = function(array,f,initial) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		initial = f(initial,array[i],i);
	}
	return initial;
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.reverse = function(this1) {
	var arr = this1.slice();
	arr.reverse();
	return arr;
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.toArray = function(this1) {
	return this1.slice();
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.unsafe = function(this1) {
	return this1;
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.concat = function(this1,that) {
	return this1.concat(that);
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.insertAt = function(this1,pos,el) {
	return this1.slice(0,pos).concat([el]).concat(this1.slice(pos));
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.insertAfter = function(this1,ref,el,eq) {
	var pos = thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(this1,ref,eq);
	if(pos < 0) pos = this1.length - 1;
	var pos1 = pos + 1;
	return this1.slice(0,pos1).concat([el]).concat(this1.slice(pos1));
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.insertBefore = function(this1,ref,el,eq) {
	var pos = thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(this1,ref,eq);
	return this1.slice(0,pos).concat([el]).concat(this1.slice(pos));
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.replace = function(this1,ref,el,eq) {
	var pos = thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(this1,ref,eq);
	if(pos < 0) throw new thx_Error("unable to find reference element",null,{ fileName : "ReadonlyArray.hx", lineNumber : 91, className : "thx._ReadonlyArray.ReadonlyArray_Impl_", methodName : "replace"});
	return this1.slice(0,pos).concat([el]).concat(this1.slice(pos + 1));
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.replaceAt = function(this1,pos,el) {
	return this1.slice(0,pos).concat([el]).concat(this1.slice(pos + 1));
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.remove = function(this1,el,eq) {
	var pos = thx__$ReadonlyArray_ReadonlyArray_$Impl_$.indexOf(this1,el,eq);
	return this1.slice(0,pos).concat(this1.slice(pos + 1));
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.removeAt = function(this1,pos) {
	return this1.slice(0,pos).concat(this1.slice(pos + 1));
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.prepend = function(this1,el) {
	return [el].concat(this1);
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.append = function(this1,el) {
	return this1.concat([el]);
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.unshift = function(this1,el) {
	return [el].concat(this1);
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.shift = function(this1) {
	if(this1.length == 0) return { _0 : null, _1 : this1};
	var value = this1[0];
	var array = this1.slice(0,0).concat(this1.slice(1));
	return { _0 : value, _1 : array};
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.push = function(this1,el) {
	return this1.concat([el]);
};
thx__$ReadonlyArray_ReadonlyArray_$Impl_$.pop = function(this1) {
	if(this1.length == 0) return { _0 : null, _1 : this1};
	var value = this1[this1.length - 1];
	var array;
	var pos = this1.length - 1;
	array = this1.slice(0,pos).concat(this1.slice(pos + 1));
	return { _0 : value, _1 : array};
};
var thx__$Semigroup_Semigroup_$Impl_$ = {};
thx__$Semigroup_Semigroup_$Impl_$.__name__ = ["thx","_Semigroup","Semigroup_Impl_"];
thx__$Semigroup_Semigroup_$Impl_$.get_append = function(this1) {
	return this1;
};
var thx__$Set_Set_$Impl_$ = {};
thx__$Set_Set_$Impl_$.__name__ = ["thx","_Set","Set_Impl_"];
thx__$Set_Set_$Impl_$.createString = function(it) {
	var map = new haxe_ds_StringMap();
	var set = map;
	if(null != it) thx__$Set_Set_$Impl_$.pushMany(set,it);
	return set;
};
thx__$Set_Set_$Impl_$.createInt = function(it) {
	var map = new haxe_ds_IntMap();
	var set = map;
	if(null != it) thx__$Set_Set_$Impl_$.pushMany(set,it);
	return set;
};
thx__$Set_Set_$Impl_$.createObject = function(it) {
	var map = new haxe_ds_ObjectMap();
	var set = map;
	if(null != it) thx__$Set_Set_$Impl_$.pushMany(set,it);
	return set;
};
thx__$Set_Set_$Impl_$.createEnum = function(arr) {
	var map = new haxe_ds_EnumValueMap();
	var set = map;
	if(null != arr) thx__$Set_Set_$Impl_$.pushMany(set,arr);
	return set;
};
thx__$Set_Set_$Impl_$._new = function(map) {
	return map;
};
thx__$Set_Set_$Impl_$.add = function(this1,v) {
	if(this1.exists(v)) return false; else {
		this1.set(v,true);
		return true;
	}
};
thx__$Set_Set_$Impl_$.copy = function(this1) {
	var inst = thx__$Set_Set_$Impl_$.empty(this1);
	var $it0 = this1.keys();
	while( $it0.hasNext() ) {
		var k = $it0.next();
		inst.set(k,true);
	}
	return inst;
};
thx__$Set_Set_$Impl_$.empty = function(this1) {
	var inst = Type.createInstance(this1 == null?null:js_Boot.getClass(this1),[]);
	return inst;
};
thx__$Set_Set_$Impl_$.difference = function(this1,set) {
	var result = thx__$Set_Set_$Impl_$.copy(this1);
	var $it0 = $iterator(thx__$Set_Set_$Impl_$)(set);
	while( $it0.hasNext() ) {
		var item = $it0.next();
		result.remove(item);
	}
	return result;
};
thx__$Set_Set_$Impl_$.filter = function(this1,predicate) {
	return thx__$Set_Set_$Impl_$.reduce(this1,function(acc,v) {
		if(predicate(v)) thx__$Set_Set_$Impl_$.add(acc,v);
		return acc;
	},thx__$Set_Set_$Impl_$.empty(this1));
};
thx__$Set_Set_$Impl_$.map = function(this1,f) {
	return thx__$Set_Set_$Impl_$.reduce(this1,function(acc,v) {
		acc.push(f(v));
		return acc;
	},[]);
};
thx__$Set_Set_$Impl_$.exists = function(this1,v) {
	return this1.exists(v);
};
thx__$Set_Set_$Impl_$.remove = function(this1,v) {
	return this1.remove(v);
};
thx__$Set_Set_$Impl_$.intersection = function(this1,set) {
	var result = thx__$Set_Set_$Impl_$.empty(this1);
	var $it0 = $iterator(thx__$Set_Set_$Impl_$)(this1);
	while( $it0.hasNext() ) {
		var item = $it0.next();
		if(set.exists(item)) result.set(item,true);
	}
	return result;
};
thx__$Set_Set_$Impl_$.push = function(this1,v) {
	this1.set(v,true);
};
thx__$Set_Set_$Impl_$.pushMany = function(this1,values) {
	var $it0 = $iterator(values)();
	while( $it0.hasNext() ) {
		var value = $it0.next();
		this1.set(value,true);
	}
};
thx__$Set_Set_$Impl_$.reduce = function(this1,handler,acc) {
	var $it0 = $iterator(thx__$Set_Set_$Impl_$)(this1);
	while( $it0.hasNext() ) {
		var v = $it0.next();
		acc = handler(acc,v);
	}
	return acc;
};
thx__$Set_Set_$Impl_$.iterator = function(this1) {
	return this1.keys();
};
thx__$Set_Set_$Impl_$.union = function(this1,set) {
	var newset = thx__$Set_Set_$Impl_$.copy(this1);
	thx__$Set_Set_$Impl_$.pushMany(newset,thx__$Set_Set_$Impl_$.toArray(set));
	return newset;
};
thx__$Set_Set_$Impl_$.toArray = function(this1) {
	var arr = [];
	var $it0 = this1.keys();
	while( $it0.hasNext() ) {
		var k = $it0.next();
		arr.push(k);
	}
	return arr;
};
thx__$Set_Set_$Impl_$.toString = function(this1) {
	return "{" + thx__$Set_Set_$Impl_$.toArray(this1).join(", ") + "}";
};
thx__$Set_Set_$Impl_$.get_length = function(this1) {
	var l = 0;
	var $it0 = this1.iterator();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		++l;
	}
	return l;
};
var thx_Strings = function() { };
thx_Strings.__name__ = ["thx","Strings"];
thx_Strings.after = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return ""; else return value.substring(pos + searchFor.length);
};
thx_Strings.afterLast = function(value,searchFor) {
	var pos = value.lastIndexOf(searchFor);
	if(pos < 0) return ""; else return value.substring(pos + searchFor.length);
};
thx_Strings.capitalize = function(s) {
	return HxOverrides.substr(s,0,1).toUpperCase() + HxOverrides.substr(s,1,s.length - 1);
};
thx_Strings.capitalizeWords = function(value,whiteSpaceOnly) {
	if(whiteSpaceOnly == null) whiteSpaceOnly = false;
	if(whiteSpaceOnly) return thx_Strings.UCWORDSWS.map(HxOverrides.substr(value,0,1).toUpperCase() + HxOverrides.substr(value,1,value.length - 1),thx_Strings.upperMatch); else return thx_Strings.UCWORDS.map(HxOverrides.substr(value,0,1).toUpperCase() + HxOverrides.substr(value,1,value.length - 1),thx_Strings.upperMatch);
};
thx_Strings.canonicalizeNewlines = function(value) {
	return thx_Strings.CANONICALIZE_LINES.replace(value,"\n");
};
thx_Strings.caseInsensitiveCompare = function(a,b) {
	if(null == a && null == b) return 0;
	if(null == a) return -1; else if(null == b) return 1;
	return thx_Strings.compare(a.toLowerCase(),b.toLowerCase());
};
thx_Strings.caseInsensitiveEndsWith = function(s,end) {
	return StringTools.endsWith(s.toLowerCase(),end.toLowerCase());
};
thx_Strings.caseInsensitiveEndsWithAny = function(s,values) {
	return thx_Strings.endsWithAny(s.toLowerCase(),values.map(function(v) {
		return v.toLowerCase();
	}));
};
thx_Strings.caseInsensitiveStartsWith = function(s,start) {
	return StringTools.startsWith(s.toLowerCase(),start.toLowerCase());
};
thx_Strings.caseInsensitiveStartsWithAny = function(s,values) {
	return thx_Strings.startsWithAny(s.toLowerCase(),values.map(function(v) {
		return v.toLowerCase();
	}));
};
thx_Strings.collapse = function(value) {
	return thx_Strings.WSG.replace(StringTools.trim(value)," ");
};
thx_Strings.compare = function(a,b) {
	return haxe_Utf8.compare(a,b);
};
thx_Strings.caseInsensitiveContains = function(s,test) {
	return s.toLowerCase().indexOf(test.toLowerCase()) >= 0;
};
thx_Strings.contains = function(s,test) {
	return s.indexOf(test) >= 0;
};
thx_Strings.count = function(s,test) {
	return s.split(test).length - 1;
};
thx_Strings.caseInsensitiveContainsAny = function(s,tests) {
	return thx_Arrays.any(tests,(function(f,s1) {
		return function(a1) {
			return f(s1,a1);
		};
	})(thx_Strings.caseInsensitiveContains,s));
};
thx_Strings.containsAny = function(s,tests) {
	return thx_Arrays.any(tests,(function(f,s1) {
		return function(a1) {
			return f(s1,a1);
		};
	})(thx_Strings.contains,s));
};
thx_Strings.dasherize = function(s) {
	return StringTools.replace(s,"_","-");
};
thx_Strings.diffAt = function(a,b) {
	var min = thx_Ints.min(a.length,b.length);
	var _g = 0;
	while(_g < min) {
		var i = _g++;
		if(a.substring(i,i + 1) != b.substring(i,i + 1)) return i;
	}
	return min;
};
thx_Strings.ellipsis = function(s,maxlen,symbol) {
	if(symbol == null) symbol = "…";
	if(maxlen == null) maxlen = 20;
	var sl = s.length;
	var symboll = symbol.length;
	if(sl > maxlen) {
		if(maxlen < symboll) return HxOverrides.substr(symbol,symboll - maxlen,maxlen); else return HxOverrides.substr(s,0,maxlen - symboll) + symbol;
	} else return s;
};
thx_Strings.ellipsisMiddle = function(s,maxlen,symbol) {
	if(symbol == null) symbol = "…";
	if(maxlen == null) maxlen = 20;
	var sl = s.length;
	var symboll = symbol.length;
	if(sl > maxlen) {
		if(maxlen <= symboll) return thx_Strings.ellipsis(s,maxlen,symbol);
		var hll = Math.ceil((maxlen - symboll) / 2);
		var hlr = Math.floor((maxlen - symboll) / 2);
		return HxOverrides.substr(s,0,hll) + symbol + HxOverrides.substr(s,sl - hlr,hlr);
	} else return s;
};
thx_Strings.endsWithAny = function(s,values) {
	return thx_Iterables.any(values,function(end) {
		return StringTools.endsWith(s,end);
	});
};
thx_Strings.filter = function(s,predicate) {
	return s.split("").filter(predicate).join("");
};
thx_Strings.filterCharcode = function(s,predicate) {
	var codes = thx_Strings.toCharcodes(s).filter(predicate);
	return codes.map(function(i) {
		return String.fromCharCode(i);
	}).join("");
};
thx_Strings.from = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return ""; else return value.substring(pos);
};
thx_Strings.hashCode = function(value) {
	var code = 0;
	var _g1 = 0;
	var _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = HxOverrides.cca(value,i);
		code = (function($this) {
			var $r;
			var a = haxe__$Int32_Int32_$Impl_$.mul(thx_Strings.HASCODE_MUL,code);
			$r = a + c | 0;
			return $r;
		}(this)) % thx_Strings.HASCODE_MAX;
	}
	return code;
};
thx_Strings.hasContent = function(value) {
	return value != null && value.length > 0;
};
thx_Strings.humanize = function(s) {
	return StringTools.replace(thx_Strings.underscore(s),"_"," ");
};
thx_Strings.isAlpha = function(s) {
	return s.length > 0 && !thx_Strings.IS_ALPHA.match(s);
};
thx_Strings.isAlphaNum = function(value) {
	return thx_Strings.ALPHANUM.match(value);
};
thx_Strings.isBreakingWhitespace = function(value) {
	return !thx_Strings.IS_BREAKINGWHITESPACE.match(value);
};
thx_Strings.isLowerCase = function(value) {
	return value.toLowerCase() == value;
};
thx_Strings.isUpperCase = function(value) {
	return value.toUpperCase() == value;
};
thx_Strings.ifEmpty = function(value,alt) {
	if(null != value && "" != value) return value; else return alt;
};
thx_Strings.isDigitsOnly = function(value) {
	return thx_Strings.DIGITS.match(value);
};
thx_Strings.isEmpty = function(value) {
	return value == null || value == "";
};
thx_Strings.lowerCaseFirst = function(value) {
	return value.substring(0,1).toLowerCase() + value.substring(1);
};
thx_Strings.random = function(value,length) {
	if(length == null) length = 1;
	return haxe_Utf8.sub(value,Math.floor((value.length - length + 1) * Math.random()),length);
};
thx_Strings.randomSequence = function(seed,length) {
	return thx_Ints.range(0,length).map(function(_) {
		return thx_Strings.random(seed);
	}).join("");
};
thx_Strings.randomSequence64 = function(length) {
	return thx_Strings.randomSequence(haxe_crypto_Base64.CHARS,length);
};
thx_Strings.iterator = function(s) {
	var _this = s.split("");
	return HxOverrides.iter(_this);
};
thx_Strings.map = function(value,callback) {
	return value.split("").map(callback);
};
thx_Strings.remove = function(value,toremove) {
	return StringTools.replace(value,toremove,"");
};
thx_Strings.removeAfter = function(value,toremove) {
	if(StringTools.endsWith(value,toremove)) return value.substring(0,value.length - toremove.length); else return value;
};
thx_Strings.removeAt = function(value,index,length) {
	return value.substring(0,index) + value.substring(index + length);
};
thx_Strings.removeBefore = function(value,toremove) {
	if(StringTools.startsWith(value,toremove)) return value.substring(toremove.length); else return value;
};
thx_Strings.removeOne = function(value,toremove) {
	var pos = value.indexOf(toremove);
	if(pos < 0) return value;
	return value.substring(0,pos) + value.substring(pos + toremove.length);
};
thx_Strings.repeat = function(s,times) {
	return ((function($this) {
		var $r;
		var _g = [];
		{
			var _g1 = 0;
			while(_g1 < times) {
				var i = _g1++;
				_g.push(s);
			}
		}
		$r = _g;
		return $r;
	}(this))).join("");
};
thx_Strings.reverse = function(s) {
	var arr = s.split("");
	arr.reverse();
	return arr.join("");
};
thx_Strings.quote = function(s) {
	if(s.indexOf("\"") < 0) return "\"" + s + "\""; else if(s.indexOf("'") < 0) return "'" + s + "'"; else return "\"" + StringTools.replace(s,"\"","\\\"") + "\"";
};
thx_Strings.splitOnce = function(s,separator) {
	var pos = s.indexOf(separator);
	if(pos < 0) return [s];
	return [s.substring(0,pos),s.substring(pos + separator.length)];
};
thx_Strings.startsWithAny = function(s,values) {
	return thx_Iterables.any(values,function(start) {
		return StringTools.startsWith(s,start);
	});
};
thx_Strings.stripTags = function(s) {
	return thx_Strings.STRIPTAGS.replace(s,"");
};
thx_Strings.surround = function(s,left,right) {
	return "" + left + s + (null == right?left:right);
};
thx_Strings.toArray = function(s) {
	return s.split("");
};
thx_Strings.toCharcodes = function(s) {
	return thx_Strings.map(s,function(s1) {
		return HxOverrides.cca(s1,0);
	});
};
thx_Strings.toChunks = function(s,len) {
	var chunks = [];
	while(s.length > 0) {
		chunks.push(HxOverrides.substr(s,0,len));
		s = HxOverrides.substr(s,len,s.length - len);
	}
	return chunks;
};
thx_Strings.toLines = function(s) {
	return thx_Strings.SPLIT_LINES.split(s);
};
thx_Strings.trimChars = function(value,charlist) {
	return thx_Strings.trimCharsRight(thx_Strings.trimCharsLeft(value,charlist),charlist);
};
thx_Strings.trimCharsLeft = function(value,charlist) {
	var pos = 0;
	var _g1 = 0;
	var _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(thx_Strings.contains(charlist,value.charAt(i))) pos++; else break;
	}
	return value.substring(pos);
};
thx_Strings.trimCharsRight = function(value,charlist) {
	var len = value.length;
	var pos = len;
	var i;
	var _g = 0;
	while(_g < len) {
		var j = _g++;
		i = len - j - 1;
		if(thx_Strings.contains(charlist,value.charAt(i))) pos = i; else break;
	}
	return value.substring(0,pos);
};
thx_Strings.underscore = function(s) {
	s = new EReg("::","g").replace(s,"/");
	s = new EReg("([A-Z]+)([A-Z][a-z])","g").replace(s,"$1_$2");
	s = new EReg("([a-z\\d])([A-Z])","g").replace(s,"$1_$2");
	s = new EReg("-","g").replace(s,"_");
	return s.toLowerCase();
};
thx_Strings.upperCaseFirst = function(value) {
	return value.substring(0,1).toUpperCase() + value.substring(1);
};
thx_Strings.upTo = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return value; else return value.substring(0,pos);
};
thx_Strings.wrapColumns = function(s,columns,indent,newline) {
	if(newline == null) newline = "\n";
	if(indent == null) indent = "";
	if(columns == null) columns = 78;
	return thx_Strings.SPLIT_LINES.split(s).map(function(part) {
		return thx_Strings.wrapLine(StringTools.trim(thx_Strings.WSG.replace(part," ")),columns,indent,newline);
	}).join(newline);
};
thx_Strings.upperMatch = function(re) {
	return re.matched(0).toUpperCase();
};
thx_Strings.wrapLine = function(s,columns,indent,newline) {
	var parts = [];
	var pos = 0;
	var len = s.length;
	var ilen = indent.length;
	columns -= ilen;
	while(true) {
		if(pos + columns >= len - ilen) {
			parts.push(s.substring(pos));
			break;
		}
		var i = 0;
		while(!StringTools.isSpace(s,pos + columns - i) && i < columns) i++;
		if(i == columns) {
			i = 0;
			while(!StringTools.isSpace(s,pos + columns + i) && pos + columns + i < len) i++;
			parts.push(s.substring(pos,pos + columns + i));
			pos += columns + i + 1;
		} else {
			parts.push(s.substring(pos,pos + columns - i));
			pos += columns - i + 1;
		}
	}
	return indent + parts.join(newline + indent);
};
thx_Strings.lpad = function(s,$char,length) {
	var diff = length - s.length;
	if(diff > 0) return thx_Strings.repeat($char,diff) + s; else return s;
};
thx_Strings.rpad = function(s,$char,length) {
	var diff = length - s.length;
	if(diff > 0) return s + thx_Strings.repeat($char,diff); else return s;
};
var thx_TimePeriod = { __ename__ : ["thx","TimePeriod"], __constructs__ : ["Second","Minute","Hour","Day","Week","Month","Year"] };
thx_TimePeriod.Second = ["Second",0];
thx_TimePeriod.Second.toString = $estr;
thx_TimePeriod.Second.__enum__ = thx_TimePeriod;
thx_TimePeriod.Minute = ["Minute",1];
thx_TimePeriod.Minute.toString = $estr;
thx_TimePeriod.Minute.__enum__ = thx_TimePeriod;
thx_TimePeriod.Hour = ["Hour",2];
thx_TimePeriod.Hour.toString = $estr;
thx_TimePeriod.Hour.__enum__ = thx_TimePeriod;
thx_TimePeriod.Day = ["Day",3];
thx_TimePeriod.Day.toString = $estr;
thx_TimePeriod.Day.__enum__ = thx_TimePeriod;
thx_TimePeriod.Week = ["Week",4];
thx_TimePeriod.Week.toString = $estr;
thx_TimePeriod.Week.__enum__ = thx_TimePeriod;
thx_TimePeriod.Month = ["Month",5];
thx_TimePeriod.Month.toString = $estr;
thx_TimePeriod.Month.__enum__ = thx_TimePeriod;
thx_TimePeriod.Year = ["Year",6];
thx_TimePeriod.Year.toString = $estr;
thx_TimePeriod.Year.__enum__ = thx_TimePeriod;
var thx_Timer = function() { };
thx_Timer.__name__ = ["thx","Timer"];
thx_Timer.debounce = function(callback,delayms,leading) {
	if(leading == null) leading = false;
	var cancel = thx_Functions.noop;
	var poll = function() {
		cancel();
		cancel = thx_Timer.delay(callback,delayms);
	};
	return function() {
		if(leading) {
			leading = false;
			callback();
		}
		poll();
	};
};
thx_Timer.throttle = function(callback,delayms,leading) {
	if(leading == null) leading = false;
	var waiting = false;
	var poll = function() {
		waiting = true;
		thx_Timer.delay(callback,delayms);
	};
	return function() {
		if(leading) {
			leading = false;
			callback();
			return;
		}
		if(waiting) return;
		poll();
	};
};
thx_Timer.repeat = function(callback,delayms) {
	return (function(f,id) {
		return function() {
			f(id);
		};
	})(thx_Timer.clear,setInterval(callback,delayms));
};
thx_Timer.delay = function(callback,delayms) {
	return (function(f,id) {
		return function() {
			f(id);
		};
	})(thx_Timer.clear,setTimeout(callback,delayms));
};
thx_Timer.frame = function(callback) {
	var cancelled = false;
	var f = thx_Functions.noop;
	var current = performance.now();
	var next;
	f = function() {
		if(cancelled) return;
		next = performance.now();
		callback(next - current);
		current = next;
		requestAnimationFrame(f);
	};
	requestAnimationFrame(f);
	return function() {
		cancelled = true;
	};
};
thx_Timer.nextFrame = function(callback) {
	var id = requestAnimationFrame(callback);
	return function() {
		cancelAnimationFrame(id);
	};
};
thx_Timer.immediate = function(callback) {
	return (function(f,id) {
		return function() {
			f(id);
		};
	})(thx_Timer.clear,setImmediate(callback));
};
thx_Timer.clear = function(id) {
	clearTimeout(id);
	return;
};
thx_Timer.time = function() {
	return performance.now();
};
thx_Timer.resolution = function() {
	if(null != thx_Timer._resolution) return thx_Timer._resolution;
	var start = performance.now();
	var end;
	var loop = 0.0;
	do {
		loop++;
		end = performance.now();
	} while(end - start == 0);
	return thx_Timer._resolution = end - start;
};
var thx__$Timestamp_Timestamp_$Impl_$ = {};
thx__$Timestamp_Timestamp_$Impl_$.__name__ = ["thx","_Timestamp","Timestamp_Impl_"];
thx__$Timestamp_Timestamp_$Impl_$.create = function(year,month,day,hour,minute,second) {
	return thx_Dates.create(year,month,day,hour,minute,second).getTime();
};
thx__$Timestamp_Timestamp_$Impl_$.now = function() {
	var d = new Date();
	return d.getTime();
};
thx__$Timestamp_Timestamp_$Impl_$.fromDate = function(d) {
	return d.getTime();
};
thx__$Timestamp_Timestamp_$Impl_$.fromString = function(s) {
	return HxOverrides.strDate(s).getTime();
};
thx__$Timestamp_Timestamp_$Impl_$.toDate = function(this1) {
	var d = new Date();
	d.setTime(this1);
	return d;
};
thx__$Timestamp_Timestamp_$Impl_$.toString = function(this1) {
	var _this;
	var d = new Date();
	d.setTime(this1);
	_this = d;
	return HxOverrides.dateStr(_this);
};
thx__$Timestamp_Timestamp_$Impl_$.snapNext = function(this1,period) {
	switch(period[1]) {
	case 0:
		return Math.ceil(this1 / 1000.0) * 1000.0;
	case 1:
		return Math.ceil(this1 / 60000.0) * 60000.0;
	case 2:
		return Math.ceil(this1 / 3600000.0) * 3600000.0;
	case 3:
		var d;
		var d1 = new Date();
		d1.setTime(this1);
		d = d1;
		var year = d.getFullYear();
		var month = d.getMonth();
		var day = d.getDate() + 1;
		return thx_Dates.create(year,month,day,0,0,0).getTime();
	case 4:
		var d2;
		var d3 = new Date();
		d3.setTime(this1);
		d2 = d3;
		var wd = d2.getDay();
		var year1 = d2.getFullYear();
		var month1 = d2.getMonth();
		var day1 = d2.getDate() + 7 - wd;
		return thx_Dates.create(year1,month1,day1,0,0,0).getTime();
	case 5:
		var d4;
		var d5 = new Date();
		d5.setTime(this1);
		d4 = d5;
		var year2 = d4.getFullYear();
		var month2 = d4.getMonth() + 1;
		return thx_Dates.create(year2,month2,1,0,0,0).getTime();
	case 6:
		var d6;
		var d7 = new Date();
		d7.setTime(this1);
		d6 = d7;
		var year3 = d6.getFullYear() + 1;
		return thx_Dates.create(year3,0,1,0,0,0).getTime();
	}
};
thx__$Timestamp_Timestamp_$Impl_$.snapPrev = function(this1,period) {
	switch(period[1]) {
	case 0:
		return Math.floor(this1 / 1000.0) * 1000.0;
	case 1:
		return Math.floor(this1 / 60000.0) * 60000.0;
	case 2:
		return Math.floor(this1 / 3600000.0) * 3600000.0;
	case 3:
		var d;
		var d1 = new Date();
		d1.setTime(this1);
		d = d1;
		var year = d.getFullYear();
		var month = d.getMonth();
		var day = d.getDate();
		return thx_Dates.create(year,month,day,0,0,0).getTime();
	case 4:
		var d2;
		var d3 = new Date();
		d3.setTime(this1);
		d2 = d3;
		var wd = d2.getDay();
		var year1 = d2.getFullYear();
		var month1 = d2.getMonth();
		var day1 = d2.getDate() - wd;
		return thx_Dates.create(year1,month1,day1,0,0,0).getTime();
	case 5:
		var d4;
		var d5 = new Date();
		d5.setTime(this1);
		d4 = d5;
		var year2 = d4.getFullYear();
		var month2 = d4.getMonth();
		return thx_Dates.create(year2,month2,1,0,0,0).getTime();
	case 6:
		var d6;
		var d7 = new Date();
		d7.setTime(this1);
		d6 = d7;
		var year3 = d6.getFullYear();
		return thx_Dates.create(year3,0,1,0,0,0).getTime();
	}
};
thx__$Timestamp_Timestamp_$Impl_$.snapTo = function(this1,period) {
	switch(period[1]) {
	case 0:
		return Math.round(this1 / 1000.0) * 1000.0;
	case 1:
		return Math.round(this1 / 60000.0) * 60000.0;
	case 2:
		return Math.round(this1 / 3600000.0) * 3600000.0;
	case 3:
		var d;
		var d1 = new Date();
		d1.setTime(this1);
		d = d1;
		var mod;
		if(d.getHours() >= 12) mod = 1; else mod = 0;
		var year = d.getFullYear();
		var month = d.getMonth();
		var day = d.getDate() + mod;
		return thx_Dates.create(year,month,day,0,0,0).getTime();
	case 4:
		var d2;
		var d3 = new Date();
		d3.setTime(this1);
		d2 = d3;
		var wd = d2.getDay();
		var mod1;
		if(wd < 3) mod1 = -wd; else if(wd > 3) mod1 = 7 - wd; else if(d2.getHours() < 12) mod1 = -wd; else mod1 = 7 - wd;
		var year1 = d2.getFullYear();
		var month1 = d2.getMonth();
		var day1 = d2.getDate() + mod1;
		return thx_Dates.create(year1,month1,day1,0,0,0).getTime();
	case 5:
		var d4;
		var d5 = new Date();
		d5.setTime(this1);
		d4 = d5;
		var mod2;
		if(d4.getDate() > Math.round(DateTools.getMonthDays(d4) / 2)) mod2 = 1; else mod2 = 0;
		var year2 = d4.getFullYear();
		var month2 = d4.getMonth() + mod2;
		return thx_Dates.create(year2,month2,1,0,0,0).getTime();
	case 6:
		var d6;
		var d7 = new Date();
		d7.setTime(this1);
		d6 = d7;
		var mod3;
		if(this1 > new Date(d6.getFullYear(),6,2,0,0,0).getTime()) mod3 = 1; else mod3 = 0;
		var year3 = d6.getFullYear() + mod3;
		return thx_Dates.create(year3,0,1,0,0,0).getTime();
	}
};
thx__$Timestamp_Timestamp_$Impl_$.r = function(t,v) {
	return Math.round(t / v) * v;
};
thx__$Timestamp_Timestamp_$Impl_$.f = function(t,v) {
	return Math.floor(t / v) * v;
};
thx__$Timestamp_Timestamp_$Impl_$.c = function(t,v) {
	return Math.ceil(t / v) * v;
};
var thx__$Tuple_Tuple0_$Impl_$ = {};
thx__$Tuple_Tuple0_$Impl_$.__name__ = ["thx","_Tuple","Tuple0_Impl_"];
thx__$Tuple_Tuple0_$Impl_$._new = function() {
	return thx_Nil.nil;
};
thx__$Tuple_Tuple0_$Impl_$["with"] = function(this1,v) {
	return v;
};
thx__$Tuple_Tuple0_$Impl_$.toString = function(this1) {
	return "Tuple0()";
};
thx__$Tuple_Tuple0_$Impl_$.toNil = function(this1) {
	return this1;
};
thx__$Tuple_Tuple0_$Impl_$.nilToTuple = function(v) {
	return thx_Nil.nil;
};
var thx__$Tuple_Tuple1_$Impl_$ = {};
thx__$Tuple_Tuple1_$Impl_$.__name__ = ["thx","_Tuple","Tuple1_Impl_"];
thx__$Tuple_Tuple1_$Impl_$._new = function(_0) {
	return _0;
};
thx__$Tuple_Tuple1_$Impl_$.get__0 = function(this1) {
	return this1;
};
thx__$Tuple_Tuple1_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1, _1 : v};
};
thx__$Tuple_Tuple1_$Impl_$.toString = function(this1) {
	return "Tuple1(" + Std.string(this1) + ")";
};
thx__$Tuple_Tuple1_$Impl_$.arrayToTuple = function(v) {
	return v[0];
};
var thx__$Tuple_Tuple2_$Impl_$ = {};
thx__$Tuple_Tuple2_$Impl_$.__name__ = ["thx","_Tuple","Tuple2_Impl_"];
thx__$Tuple_Tuple2_$Impl_$.of = function(_0,_1) {
	return { _0 : _0, _1 : _1};
};
thx__$Tuple_Tuple2_$Impl_$._new = function(_0,_1) {
	return { _0 : _0, _1 : _1};
};
thx__$Tuple_Tuple2_$Impl_$.get_left = function(this1) {
	return this1._0;
};
thx__$Tuple_Tuple2_$Impl_$.get_right = function(this1) {
	return this1._1;
};
thx__$Tuple_Tuple2_$Impl_$.flip = function(this1) {
	return { _0 : this1._1, _1 : this1._0};
};
thx__$Tuple_Tuple2_$Impl_$.dropLeft = function(this1) {
	return this1._1;
};
thx__$Tuple_Tuple2_$Impl_$.dropRight = function(this1) {
	return this1._0;
};
thx__$Tuple_Tuple2_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : v};
};
thx__$Tuple_Tuple2_$Impl_$.toString = function(this1) {
	return "Tuple2(" + Std.string(this1._0) + "," + Std.string(this1._1) + ")";
};
thx__$Tuple_Tuple2_$Impl_$.map = function(this1,f) {
	var _1 = f(this1._1);
	return { _0 : this1._0, _1 : _1};
};
thx__$Tuple_Tuple2_$Impl_$.arrayToTuple2 = function(v) {
	return { _0 : v[0], _1 : v[1]};
};
var thx__$Tuple_Tuple3_$Impl_$ = {};
thx__$Tuple_Tuple3_$Impl_$.__name__ = ["thx","_Tuple","Tuple3_Impl_"];
thx__$Tuple_Tuple3_$Impl_$.of = function(_0,_1,_2) {
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx__$Tuple_Tuple3_$Impl_$._new = function(_0,_1,_2) {
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx__$Tuple_Tuple3_$Impl_$.flip = function(this1) {
	return { _0 : this1._2, _1 : this1._1, _2 : this1._0};
};
thx__$Tuple_Tuple3_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2};
};
thx__$Tuple_Tuple3_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1};
};
thx__$Tuple_Tuple3_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : v};
};
thx__$Tuple_Tuple3_$Impl_$.toString = function(this1) {
	return "Tuple3(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + ")";
};
thx__$Tuple_Tuple3_$Impl_$.arrayToTuple3 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2]};
};
thx__$Tuple_Tuple3_$Impl_$.map = function(this1,f) {
	var _2 = f(this1._2);
	return { _0 : this1._0, _1 : this1._1, _2 : _2};
};
var thx__$Tuple_Tuple4_$Impl_$ = {};
thx__$Tuple_Tuple4_$Impl_$.__name__ = ["thx","_Tuple","Tuple4_Impl_"];
thx__$Tuple_Tuple4_$Impl_$.of = function(_0,_1,_2,_3) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx__$Tuple_Tuple4_$Impl_$._new = function(_0,_1,_2,_3) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx__$Tuple_Tuple4_$Impl_$.flip = function(this1) {
	return { _0 : this1._3, _1 : this1._2, _2 : this1._1, _3 : this1._0};
};
thx__$Tuple_Tuple4_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3};
};
thx__$Tuple_Tuple4_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2};
};
thx__$Tuple_Tuple4_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : v};
};
thx__$Tuple_Tuple4_$Impl_$.toString = function(this1) {
	return "Tuple4(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + ")";
};
thx__$Tuple_Tuple4_$Impl_$.arrayToTuple4 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2], _3 : v[3]};
};
var thx__$Tuple_Tuple5_$Impl_$ = {};
thx__$Tuple_Tuple5_$Impl_$.__name__ = ["thx","_Tuple","Tuple5_Impl_"];
thx__$Tuple_Tuple5_$Impl_$.of = function(_0,_1,_2,_3,_4) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4};
};
thx__$Tuple_Tuple5_$Impl_$._new = function(_0,_1,_2,_3,_4) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4};
};
thx__$Tuple_Tuple5_$Impl_$.flip = function(this1) {
	return { _0 : this1._4, _1 : this1._3, _2 : this1._2, _3 : this1._1, _4 : this1._0};
};
thx__$Tuple_Tuple5_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3, _3 : this1._4};
};
thx__$Tuple_Tuple5_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3};
};
thx__$Tuple_Tuple5_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4, _5 : v};
};
thx__$Tuple_Tuple5_$Impl_$.toString = function(this1) {
	return "Tuple5(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + "," + Std.string(this1._4) + ")";
};
thx__$Tuple_Tuple5_$Impl_$.arrayToTuple5 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2], _3 : v[3], _4 : v[4]};
};
var thx__$Tuple_Tuple6_$Impl_$ = {};
thx__$Tuple_Tuple6_$Impl_$.__name__ = ["thx","_Tuple","Tuple6_Impl_"];
thx__$Tuple_Tuple6_$Impl_$.of = function(_0,_1,_2,_3,_4,_5) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4, _5 : _5};
};
thx__$Tuple_Tuple6_$Impl_$._new = function(_0,_1,_2,_3,_4,_5) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4, _5 : _5};
};
thx__$Tuple_Tuple6_$Impl_$.flip = function(this1) {
	return { _0 : this1._5, _1 : this1._4, _2 : this1._3, _3 : this1._2, _4 : this1._1, _5 : this1._0};
};
thx__$Tuple_Tuple6_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3, _3 : this1._4, _4 : this1._5};
};
thx__$Tuple_Tuple6_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4};
};
thx__$Tuple_Tuple6_$Impl_$.toString = function(this1) {
	return "Tuple6(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + "," + Std.string(this1._4) + "," + Std.string(this1._5) + ")";
};
thx__$Tuple_Tuple6_$Impl_$.arrayToTuple6 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2], _3 : v[3], _4 : v[4], _5 : v[5]};
};
var thx_Types = function() { };
thx_Types.__name__ = ["thx","Types"];
thx_Types.isAnonymousObject = function(v) {
	return Reflect.isObject(v) && null == Type.getClass(v);
};
thx_Types.isPrimitive = function(v) {
	{
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 1:case 2:case 3:
			return true;
		case 0:case 5:case 7:case 4:case 8:
			return false;
		case 6:
			var c = _g[2];
			return Type.getClassName(c) == "String";
		}
	}
};
thx_Types.isEnumValue = function(v) {
	{
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 7:
			return true;
		default:
			return false;
		}
	}
};
thx_Types.hasSuperClass = function(cls,sup) {
	while(null != cls) {
		if(cls == sup) return true;
		cls = Type.getSuperClass(cls);
	}
	return false;
};
thx_Types.sameType = function(a,b) {
	return thx_Types.toString(Type["typeof"](a)) == thx_Types.toString(Type["typeof"](b));
};
thx_Types.typeInheritance = function(type) {
	switch(type[1]) {
	case 1:
		return ["Int"];
	case 2:
		return ["Float"];
	case 3:
		return ["Bool"];
	case 4:
		return ["{}"];
	case 5:
		return ["Function"];
	case 6:
		var c = type[2];
		var classes = [];
		while(null != c) {
			classes.push(c);
			c = Type.getSuperClass(c);
		}
		return classes.map(Type.getClassName);
	case 7:
		var e = type[2];
		return [Type.getEnumName(e)];
	default:
		throw new js__$Boot_HaxeError("invalid type " + Std.string(type));
	}
};
thx_Types.toString = function(type) {
	switch(type[1]) {
	case 0:
		return "Null";
	case 1:
		return "Int";
	case 2:
		return "Float";
	case 3:
		return "Bool";
	case 4:
		return "{}";
	case 5:
		return "Function";
	case 6:
		var c = type[2];
		return Type.getClassName(c);
	case 7:
		var e = type[2];
		return Type.getEnumName(e);
	default:
		throw new js__$Boot_HaxeError("invalid type " + Std.string(type));
	}
};
thx_Types.valueTypeInheritance = function(value) {
	return thx_Types.typeInheritance(Type["typeof"](value));
};
thx_Types.valueTypeToString = function(value) {
	return thx_Types.toString(Type["typeof"](value));
};
thx_Types.anyValueToString = function(value) {
	if(js_Boot.__instanceof(value,ValueType)) return thx_Types.toString(value);
	if(js_Boot.__instanceof(value,Class)) return Type.getClassName(value);
	if(js_Boot.__instanceof(value,Enum)) return Type.getEnumName(value);
	return thx_Types.valueTypeToString(value);
};
var thx__$Validation_Validation_$Impl_$ = {};
thx__$Validation_Validation_$Impl_$.__name__ = ["thx","_Validation","Validation_Impl_"];
thx__$Validation_Validation_$Impl_$.validation = function(e) {
	return e;
};
thx__$Validation_Validation_$Impl_$.vnel = function(e) {
	return e;
};
thx__$Validation_Validation_$Impl_$.pure = function(a) {
	return thx_Either.Right(a);
};
thx__$Validation_Validation_$Impl_$.success = function(a) {
	return thx_Either.Right(a);
};
thx__$Validation_Validation_$Impl_$.failure = function(e) {
	return thx_Either.Left(e);
};
thx__$Validation_Validation_$Impl_$.nn = function(a,e) {
	if(a == null) return thx_Either.Left(e); else return thx_Either.Right(a);
};
thx__$Validation_Validation_$Impl_$.successNel = function(a) {
	return thx_Either.Right(a);
};
thx__$Validation_Validation_$Impl_$.failureNel = function(e) {
	return thx_Either.Left(thx__$Nel_Nel_$Impl_$.pure(e));
};
thx__$Validation_Validation_$Impl_$.nnNel = function(a,e) {
	if(a == null) return thx_Either.Left(thx__$Nel_Nel_$Impl_$.pure(e)); else return thx_Either.Right(a);
};
thx__$Validation_Validation_$Impl_$.get_either = function(this1) {
	return this1;
};
thx__$Validation_Validation_$Impl_$.map = function(this1,f) {
	return thx__$Validation_Validation_$Impl_$.ap(this1,thx_Either.Right(f),function(e1,e2) {
		throw new js__$Boot_HaxeError("Unreachable");
	});
};
thx__$Validation_Validation_$Impl_$.foldLeft = function(this1,b,f) {
	switch(this1[1]) {
	case 0:
		return b;
	case 1:
		var a = this1[2];
		return f(b,a);
	}
};
thx__$Validation_Validation_$Impl_$.foldMap = function(this1,f,m) {
	return thx__$Validation_Validation_$Impl_$.foldLeft(thx_Eithers.map(this1,f),thx__$Monoid_Monoid_$Impl_$.get_zero(m),(function(_e) {
		return function(a0,a1) {
			return thx__$Monoid_Monoid_$Impl_$.append(_e,a0,a1);
		};
	})(m));
};
thx__$Validation_Validation_$Impl_$.ap = function(this1,v,s) {
	switch(this1[1]) {
	case 0:
		var e0 = this1[2];
		{
			var _g = v;
			switch(_g[1]) {
			case 0:
				var e1 = _g[2];
				return thx_Either.Left((thx__$Semigroup_Semigroup_$Impl_$.get_append(s))(e0,e1));
			case 1:
				var b = _g[2];
				return thx_Either.Left(e0);
			}
		}
		break;
	case 1:
		var a = this1[2];
		{
			var _g1 = v;
			switch(_g1[1]) {
			case 0:
				var e = _g1[2];
				return thx_Either.Left(e);
			case 1:
				var f = _g1[2];
				return thx_Either.Right(f(a));
			}
		}
		break;
	}
};
thx__$Validation_Validation_$Impl_$.zip = function(this1,v,s) {
	return thx__$Validation_Validation_$Impl_$.ap(this1,thx_Eithers.map(v,function(b) {
		return (function(f,_1) {
			return function(_0) {
				return f(_0,_1);
			};
		})(thx__$Tuple_Tuple2_$Impl_$.of,b);
	}),s);
};
thx__$Validation_Validation_$Impl_$.leftMap = function(this1,f) {
	return thx_Eithers.leftMap(this1,f);
};
thx__$Validation_Validation_$Impl_$.wrapNel = function(this1) {
	return thx_Eithers.leftMap(this1,thx__$Nel_Nel_$Impl_$.pure);
};
thx__$Validation_Validation_$Impl_$.ensure = function(this1,p,error) {
	{
		var left = this1;
		switch(this1[1]) {
		case 1:
			var a = this1[2];
			if(p(a)) return this1; else return thx_Either.Left(error);
			break;
		default:
			return left;
		}
	}
};
thx__$Validation_Validation_$Impl_$.flatMapV = function(this1,f) {
	switch(this1[1]) {
	case 0:
		var a = this1[2];
		return thx_Either.Left(a);
	case 1:
		var b = this1[2];
		return f(b);
	}
};
thx__$Validation_Validation_$Impl_$.val2 = function(f,v1,v2,s) {
	return thx__$Validation_Validation_$Impl_$.ap(v2,(function($this) {
		var $r;
		var f1 = thx_Functions2.curry(f);
		$r = thx__$Validation_Validation_$Impl_$.ap(v1,thx_Either.Right(f1),function(e1,e2) {
			throw new js__$Boot_HaxeError("Unreachable");
		});
		return $r;
	}(this)),s);
};
thx__$Validation_Validation_$Impl_$.val3 = function(f,v1,v2,v3,s) {
	return thx__$Validation_Validation_$Impl_$.ap(v3,(function($this) {
		var $r;
		var f1 = thx_Functions3.curry(f);
		$r = thx__$Validation_Validation_$Impl_$.ap(v2,(function($this) {
			var $r;
			var f2 = thx_Functions2.curry(f1);
			$r = thx__$Validation_Validation_$Impl_$.ap(v1,thx_Either.Right(f2),function(e1,e2) {
				throw new js__$Boot_HaxeError("Unreachable");
			});
			return $r;
		}($this)),s);
		return $r;
	}(this)),s);
};
thx__$Validation_Validation_$Impl_$.val4 = function(f,v1,v2,v3,v4,s) {
	return thx__$Validation_Validation_$Impl_$.ap(v4,(function($this) {
		var $r;
		var f1 = thx_Functions4.curry(f);
		$r = thx__$Validation_Validation_$Impl_$.ap(v3,(function($this) {
			var $r;
			var f2 = thx_Functions3.curry(f1);
			$r = thx__$Validation_Validation_$Impl_$.ap(v2,(function($this) {
				var $r;
				var f3 = thx_Functions2.curry(f2);
				$r = thx__$Validation_Validation_$Impl_$.ap(v1,thx_Either.Right(f3),function(e1,e2) {
					throw new js__$Boot_HaxeError("Unreachable");
				});
				return $r;
			}($this)),s);
			return $r;
		}($this)),s);
		return $r;
	}(this)),s);
};
thx__$Validation_Validation_$Impl_$.val5 = function(f,v1,v2,v3,v4,v5,s) {
	return thx__$Validation_Validation_$Impl_$.ap(v5,(function($this) {
		var $r;
		var f1 = thx_Functions5.curry(f);
		$r = thx__$Validation_Validation_$Impl_$.ap(v4,(function($this) {
			var $r;
			var f2 = thx_Functions4.curry(f1);
			$r = thx__$Validation_Validation_$Impl_$.ap(v3,(function($this) {
				var $r;
				var f3 = thx_Functions3.curry(f2);
				$r = thx__$Validation_Validation_$Impl_$.ap(v2,(function($this) {
					var $r;
					var f4 = thx_Functions2.curry(f3);
					$r = thx__$Validation_Validation_$Impl_$.ap(v1,thx_Either.Right(f4),function(e1,e2) {
						throw new js__$Boot_HaxeError("Unreachable");
					});
					return $r;
				}($this)),s);
				return $r;
			}($this)),s);
			return $r;
		}($this)),s);
		return $r;
	}(this)),s);
};
thx__$Validation_Validation_$Impl_$.val6 = function(f,v1,v2,v3,v4,v5,v6,s) {
	return thx__$Validation_Validation_$Impl_$.ap(v6,(function($this) {
		var $r;
		var f1 = thx_Functions6.curry(f);
		$r = thx__$Validation_Validation_$Impl_$.ap(v5,(function($this) {
			var $r;
			var f2 = thx_Functions5.curry(f1);
			$r = thx__$Validation_Validation_$Impl_$.ap(v4,(function($this) {
				var $r;
				var f3 = thx_Functions4.curry(f2);
				$r = thx__$Validation_Validation_$Impl_$.ap(v3,(function($this) {
					var $r;
					var f4 = thx_Functions3.curry(f3);
					$r = thx__$Validation_Validation_$Impl_$.ap(v2,(function($this) {
						var $r;
						var f5 = thx_Functions2.curry(f4);
						$r = thx__$Validation_Validation_$Impl_$.ap(v1,thx_Either.Right(f5),function(e1,e2) {
							throw new js__$Boot_HaxeError("Unreachable");
						});
						return $r;
					}($this)),s);
					return $r;
				}($this)),s);
				return $r;
			}($this)),s);
			return $r;
		}($this)),s);
		return $r;
	}(this)),s);
};
thx__$Validation_Validation_$Impl_$.val7 = function(f,v1,v2,v3,v4,v5,v6,v7,s) {
	return thx__$Validation_Validation_$Impl_$.ap(v7,(function($this) {
		var $r;
		var f1 = thx_Functions7.curry(f);
		$r = thx__$Validation_Validation_$Impl_$.ap(v6,(function($this) {
			var $r;
			var f2 = thx_Functions6.curry(f1);
			$r = thx__$Validation_Validation_$Impl_$.ap(v5,(function($this) {
				var $r;
				var f3 = thx_Functions5.curry(f2);
				$r = thx__$Validation_Validation_$Impl_$.ap(v4,(function($this) {
					var $r;
					var f4 = thx_Functions4.curry(f3);
					$r = thx__$Validation_Validation_$Impl_$.ap(v3,(function($this) {
						var $r;
						var f5 = thx_Functions3.curry(f4);
						$r = thx__$Validation_Validation_$Impl_$.ap(v2,(function($this) {
							var $r;
							var f6 = thx_Functions2.curry(f5);
							$r = thx__$Validation_Validation_$Impl_$.ap(v1,thx_Either.Right(f6),function(e1,e2) {
								throw new js__$Boot_HaxeError("Unreachable");
							});
							return $r;
						}($this)),s);
						return $r;
					}($this)),s);
					return $r;
				}($this)),s);
				return $r;
			}($this)),s);
			return $r;
		}($this)),s);
		return $r;
	}(this)),s);
};
thx__$Validation_Validation_$Impl_$.val8 = function(f,v1,v2,v3,v4,v5,v6,v7,v8,s) {
	return thx__$Validation_Validation_$Impl_$.ap(v8,(function($this) {
		var $r;
		var f1 = thx_Functions8.curry(f);
		$r = thx__$Validation_Validation_$Impl_$.ap(v7,(function($this) {
			var $r;
			var f2 = thx_Functions7.curry(f1);
			$r = thx__$Validation_Validation_$Impl_$.ap(v6,(function($this) {
				var $r;
				var f3 = thx_Functions6.curry(f2);
				$r = thx__$Validation_Validation_$Impl_$.ap(v5,(function($this) {
					var $r;
					var f4 = thx_Functions5.curry(f3);
					$r = thx__$Validation_Validation_$Impl_$.ap(v4,(function($this) {
						var $r;
						var f5 = thx_Functions4.curry(f4);
						$r = thx__$Validation_Validation_$Impl_$.ap(v3,(function($this) {
							var $r;
							var f6 = thx_Functions3.curry(f5);
							$r = thx__$Validation_Validation_$Impl_$.ap(v2,(function($this) {
								var $r;
								var f7 = thx_Functions2.curry(f6);
								$r = thx__$Validation_Validation_$Impl_$.ap(v1,thx_Either.Right(f7),function(e1,e2) {
									throw new js__$Boot_HaxeError("Unreachable");
								});
								return $r;
							}($this)),s);
							return $r;
						}($this)),s);
						return $r;
					}($this)),s);
					return $r;
				}($this)),s);
				return $r;
			}($this)),s);
			return $r;
		}($this)),s);
		return $r;
	}(this)),s);
};
var thx_ValidationExtensions = function() { };
thx_ValidationExtensions.__name__ = ["thx","ValidationExtensions"];
thx_ValidationExtensions.leftMapNel = function(n,f) {
	return thx_Eithers.leftMap(n,function(n1) {
		return thx__$Nel_Nel_$Impl_$.map(n1,f);
	});
};
thx_ValidationExtensions.ensureNel = function(v,p,error) {
	{
		var left = v;
		switch(v[1]) {
		case 1:
			var a = v[2];
			if(p(a)) return v; else return thx_Either.Left(thx__$Nel_Nel_$Impl_$.pure(error));
			break;
		default:
			return left;
		}
	}
};
var thx_color__$Cmy_Cmy_$Impl_$ = {};
thx_color__$Cmy_Cmy_$Impl_$.__name__ = ["thx","color","_Cmy","Cmy_Impl_"];
thx_color__$Cmy_Cmy_$Impl_$.create = function(cyan,magenta,yellow) {
	return [cyan,magenta,yellow];
};
thx_color__$Cmy_Cmy_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return [arr[0],arr[1],arr[2]];
};
thx_color__$Cmy_Cmy_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "cmy":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Cmy_Cmy_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$Cmy_Cmy_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$Cmy_Cmy_$Impl_$.min = function(this1,other) {
	var cyan = Math.min(this1[0],other[0]);
	var magenta = Math.min(this1[1],other[1]);
	var yellow = Math.min(this1[2],other[2]);
	return [cyan,magenta,yellow];
};
thx_color__$Cmy_Cmy_$Impl_$.max = function(this1,other) {
	var cyan = Math.max(this1[0],other[0]);
	var magenta = Math.max(this1[1],other[1]);
	var yellow = Math.max(this1[2],other[2]);
	return [cyan,magenta,yellow];
};
thx_color__$Cmy_Cmy_$Impl_$.normalize = function(this1) {
	var cyan = thx_Floats.normalize(this1[0]);
	var magenta = thx_Floats.normalize(this1[1]);
	var yellow = thx_Floats.normalize(this1[2]);
	return [cyan,magenta,yellow];
};
thx_color__$Cmy_Cmy_$Impl_$.roundTo = function(this1,decimals) {
	var cyan = thx_Floats.roundTo(this1[0],decimals);
	var magenta = thx_Floats.roundTo(this1[1],decimals);
	var yellow = thx_Floats.roundTo(this1[2],decimals);
	return [cyan,magenta,yellow];
};
thx_color__$Cmy_Cmy_$Impl_$.withCyan = function(this1,newcyan) {
	return [newcyan,this1[1],this1[2]];
};
thx_color__$Cmy_Cmy_$Impl_$.withMagenta = function(this1,newmagenta) {
	return [this1[0],newmagenta,this1[2]];
};
thx_color__$Cmy_Cmy_$Impl_$.withYellow = function(this1,newyellow) {
	return [this1[0],this1[1],newyellow];
};
thx_color__$Cmy_Cmy_$Impl_$.toString = function(this1) {
	return "cmy(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx_color__$Cmy_Cmy_$Impl_$.equals = function(this1,other) {
	return thx_color__$Cmy_Cmy_$Impl_$.nearEquals(this1,other);
};
thx_color__$Cmy_Cmy_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return thx_Floats.nearEquals(this1[0],other[0],tolerance) && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance);
};
thx_color__$Cmy_Cmy_$Impl_$.toLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toLab(thx_color__$Cmy_Cmy_$Impl_$.toXyz(this1));
};
thx_color__$Cmy_Cmy_$Impl_$.toLCh = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toLCh(thx_color__$Cmy_Cmy_$Impl_$.toLab(this1));
};
thx_color__$Cmy_Cmy_$Impl_$.toLuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toLuv(thx_color__$Cmy_Cmy_$Impl_$.toRgbx(this1));
};
thx_color__$Cmy_Cmy_$Impl_$.toCmyk = function(this1) {
	var k = Math.min(Math.min(this1[0],this1[1]),this1[2]);
	if(k == 1) return [0,0,0,1]; else return [(this1[0] - k) / (1 - k),(this1[1] - k) / (1 - k),(this1[2] - k) / (1 - k),k];
};
thx_color__$Cmy_Cmy_$Impl_$.toCubeHelix = function(this1) {
	var this2 = thx_color__$Cmy_Cmy_$Impl_$.toRgbx(this1);
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma(this2,1);
};
thx_color__$Cmy_Cmy_$Impl_$.toGrey = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toGrey(thx_color__$Cmy_Cmy_$Impl_$.toRgbx(this1));
};
thx_color__$Cmy_Cmy_$Impl_$.toHsl = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$Cmy_Cmy_$Impl_$.toRgbx(this1));
};
thx_color__$Cmy_Cmy_$Impl_$.toHsv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsv(thx_color__$Cmy_Cmy_$Impl_$.toRgbx(this1));
};
thx_color__$Cmy_Cmy_$Impl_$.toHunterLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHunterLab(thx_color__$Cmy_Cmy_$Impl_$.toXyz(this1));
};
thx_color__$Cmy_Cmy_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$Cmy_Cmy_$Impl_$.toRgbx(this1));
};
thx_color__$Cmy_Cmy_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Cmy_Cmy_$Impl_$.toRgbxa(this1));
};
thx_color__$Cmy_Cmy_$Impl_$.toRgbx = function(this1) {
	return [1 - this1[0],1 - this1[1],1 - this1[2]];
};
thx_color__$Cmy_Cmy_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa(thx_color__$Cmy_Cmy_$Impl_$.toRgbx(this1));
};
thx_color__$Cmy_Cmy_$Impl_$.toTemperature = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature(thx_color__$Cmy_Cmy_$Impl_$.toRgbx(this1));
};
thx_color__$Cmy_Cmy_$Impl_$.toXyz = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toXyz(thx_color__$Cmy_Cmy_$Impl_$.toRgbx(this1));
};
thx_color__$Cmy_Cmy_$Impl_$.toYuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYuv(thx_color__$Cmy_Cmy_$Impl_$.toRgbx(this1));
};
thx_color__$Cmy_Cmy_$Impl_$.toYxy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYxy(thx_color__$Cmy_Cmy_$Impl_$.toRgbx(this1));
};
thx_color__$Cmy_Cmy_$Impl_$.get_cyan = function(this1) {
	return this1[0];
};
thx_color__$Cmy_Cmy_$Impl_$.get_magenta = function(this1) {
	return this1[1];
};
thx_color__$Cmy_Cmy_$Impl_$.get_yellow = function(this1) {
	return this1[2];
};
var thx_color__$Cmyk_Cmyk_$Impl_$ = {};
thx_color__$Cmyk_Cmyk_$Impl_$.__name__ = ["thx","color","_Cmyk","Cmyk_Impl_"];
thx_color__$Cmyk_Cmyk_$Impl_$.create = function(cyan,magenta,yellow,black) {
	return [cyan,magenta,yellow,black];
};
thx_color__$Cmyk_Cmyk_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,4);
	return [arr[0],arr[1],arr[2],arr[3]];
};
thx_color__$Cmyk_Cmyk_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "cmyk":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,4,false);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Cmyk_Cmyk_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$Cmyk_Cmyk_$Impl_$.darker = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Floats.interpolate(t,this1[3],1)];
	return channels;
};
thx_color__$Cmyk_Cmyk_$Impl_$.lighter = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Floats.interpolate(t,this1[3],0)];
	return channels;
};
thx_color__$Cmyk_Cmyk_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2]),thx_Floats.interpolate(t,this1[3],other[3])];
	return channels;
};
thx_color__$Cmyk_Cmyk_$Impl_$.min = function(this1,other) {
	var cyan = Math.min(this1[0],other[0]);
	var magenta = Math.min(this1[1],other[1]);
	var yellow = Math.min(this1[2],other[2]);
	var black = Math.min(this1[3],other[3]);
	return [cyan,magenta,yellow,black];
};
thx_color__$Cmyk_Cmyk_$Impl_$.max = function(this1,other) {
	var cyan = Math.max(this1[0],other[0]);
	var magenta = Math.max(this1[1],other[1]);
	var yellow = Math.max(this1[2],other[2]);
	var black = Math.max(this1[3],other[3]);
	return [cyan,magenta,yellow,black];
};
thx_color__$Cmyk_Cmyk_$Impl_$.normalize = function(this1) {
	var cyan = thx_Floats.normalize(this1[0]);
	var magenta = thx_Floats.normalize(this1[1]);
	var yellow = thx_Floats.normalize(this1[2]);
	var black = thx_Floats.normalize(this1[3]);
	return [cyan,magenta,yellow,black];
};
thx_color__$Cmyk_Cmyk_$Impl_$.roundTo = function(this1,decimals) {
	var cyan = thx_Floats.roundTo(this1[0],decimals);
	var magenta = thx_Floats.roundTo(this1[1],decimals);
	var yellow = thx_Floats.roundTo(this1[2],decimals);
	var black = thx_Floats.roundTo(this1[3],decimals);
	return [cyan,magenta,yellow,black];
};
thx_color__$Cmyk_Cmyk_$Impl_$.withCyan = function(this1,newcyan) {
	return [newcyan,this1[1],this1[2],this1[3]];
};
thx_color__$Cmyk_Cmyk_$Impl_$.withMagenta = function(this1,newmagenta) {
	return [this1[0],newmagenta,this1[2],this1[3]];
};
thx_color__$Cmyk_Cmyk_$Impl_$.withYellow = function(this1,newyellow) {
	return [this1[0],this1[1],newyellow,this1[3]];
};
thx_color__$Cmyk_Cmyk_$Impl_$.withBlack = function(this1,newblack) {
	return [this1[0],this1[1],this1[2],newblack];
};
thx_color__$Cmyk_Cmyk_$Impl_$.toString = function(this1) {
	return "cmyk(" + this1[0] + "," + this1[1] + "," + this1[2] + "," + this1[3] + ")";
};
thx_color__$Cmyk_Cmyk_$Impl_$.equals = function(this1,other) {
	return thx_color__$Cmyk_Cmyk_$Impl_$.nearEquals(this1,other);
};
thx_color__$Cmyk_Cmyk_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return thx_Floats.nearEquals(this1[0],other[0],tolerance) && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance) && thx_Floats.nearEquals(this1[3],other[3],tolerance);
};
thx_color__$Cmyk_Cmyk_$Impl_$.toLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toLab(thx_color__$Cmyk_Cmyk_$Impl_$.toXyz(this1));
};
thx_color__$Cmyk_Cmyk_$Impl_$.toLCh = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toLCh(thx_color__$Cmyk_Cmyk_$Impl_$.toLab(this1));
};
thx_color__$Cmyk_Cmyk_$Impl_$.toLuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toLuv(thx_color__$Cmyk_Cmyk_$Impl_$.toRgbx(this1));
};
thx_color__$Cmyk_Cmyk_$Impl_$.toCmy = function(this1) {
	return [this1[3] + (1 - this1[3]) * this1[0],this1[3] + (1 - this1[3]) * this1[1],this1[3] + (1 - this1[3]) * this1[2]];
};
thx_color__$Cmyk_Cmyk_$Impl_$.toCubeHelix = function(this1) {
	var this2 = thx_color__$Cmyk_Cmyk_$Impl_$.toRgbx(this1);
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma(this2,1);
};
thx_color__$Cmyk_Cmyk_$Impl_$.toGrey = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toGrey(thx_color__$Cmyk_Cmyk_$Impl_$.toRgbx(this1));
};
thx_color__$Cmyk_Cmyk_$Impl_$.toHsl = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$Cmyk_Cmyk_$Impl_$.toRgbx(this1));
};
thx_color__$Cmyk_Cmyk_$Impl_$.toHsv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsv(thx_color__$Cmyk_Cmyk_$Impl_$.toRgbx(this1));
};
thx_color__$Cmyk_Cmyk_$Impl_$.toHunterLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHunterLab(thx_color__$Cmyk_Cmyk_$Impl_$.toXyz(this1));
};
thx_color__$Cmyk_Cmyk_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$Cmyk_Cmyk_$Impl_$.toRgbx(this1));
};
thx_color__$Cmyk_Cmyk_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Cmyk_Cmyk_$Impl_$.toRgbxa(this1));
};
thx_color__$Cmyk_Cmyk_$Impl_$.toRgbx = function(this1) {
	return [(1 - this1[3]) * (1 - this1[0]),(1 - this1[3]) * (1 - this1[1]),(1 - this1[3]) * (1 - this1[2])];
};
thx_color__$Cmyk_Cmyk_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa(thx_color__$Cmyk_Cmyk_$Impl_$.toRgbx(this1));
};
thx_color__$Cmyk_Cmyk_$Impl_$.toTemperature = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature(thx_color__$Cmyk_Cmyk_$Impl_$.toRgbx(this1));
};
thx_color__$Cmyk_Cmyk_$Impl_$.toXyz = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toXyz(thx_color__$Cmyk_Cmyk_$Impl_$.toRgbx(this1));
};
thx_color__$Cmyk_Cmyk_$Impl_$.toYuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYuv(thx_color__$Cmyk_Cmyk_$Impl_$.toRgbx(this1));
};
thx_color__$Cmyk_Cmyk_$Impl_$.toYxy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYxy(thx_color__$Cmyk_Cmyk_$Impl_$.toRgbx(this1));
};
thx_color__$Cmyk_Cmyk_$Impl_$.get_cyan = function(this1) {
	return this1[0];
};
thx_color__$Cmyk_Cmyk_$Impl_$.get_magenta = function(this1) {
	return this1[1];
};
thx_color__$Cmyk_Cmyk_$Impl_$.get_yellow = function(this1) {
	return this1[2];
};
thx_color__$Cmyk_Cmyk_$Impl_$.get_black = function(this1) {
	return this1[3];
};
var thx_color__$CubeHelix_CubeHelix_$Impl_$ = {};
thx_color__$CubeHelix_CubeHelix_$Impl_$.__name__ = ["thx","color","_CubeHelix","CubeHelix_Impl_"];
thx_color__$CubeHelix_CubeHelix_$Impl_$.create = function(hue,saturation,lightness,gamma) {
	return [hue,saturation,lightness,null == gamma?1.0:gamma];
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.fromFloats = function(arr) {
	if(arr.length < 4) {
		thx_ArrayFloats.resize(arr,3);
		arr.push(1);
	}
	var gamma = arr[3];
	return [arr[0],arr[1],arr[2],null == gamma?1.0:gamma];
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "cubehelix":
			if(info.channels.length >= 4) {
				var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,4,false);
				return channels;
			} else {
				var channels1 = thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false).concat([1.0]);
				return channels1;
			}
			break;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$CubeHelix_CubeHelix_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx_color__$CubeHelix_CubeHelix_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$CubeHelix_CubeHelix_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.complement = function(this1) {
	return thx_color__$CubeHelix_CubeHelix_$Impl_$.rotate(this1,180);
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.darker = function(this1,t) {
	var channels = [this1[0],this1[1],thx_Floats.interpolate(t,this1[2],0),this1[3]];
	return channels;
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.lighter = function(this1,t) {
	var channels = [this1[0],this1[1],thx_Floats.interpolate(t,this1[2],1),this1[3]];
	return channels;
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolateAngle(t,this1[0],other[0],360),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2]),thx_Floats.interpolate(t,this1[3],other[3])];
	return channels;
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.interpolateWidest = function(this1,other,t) {
	var channels = [thx_Floats.interpolateAngleWidest(t,this1[0],other[0],360),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2]),thx_Floats.interpolate(t,this1[3],other[3])];
	return channels;
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.min = function(this1,other) {
	var hue = Math.min(this1[0],other[0]);
	var saturation = Math.min(this1[1],other[1]);
	var lightness = Math.min(this1[2],other[2]);
	var gamma = Math.min(this1[3],other[3]);
	return [hue,saturation,lightness,null == gamma?1.0:gamma];
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.max = function(this1,other) {
	var hue = Math.max(this1[0],other[0]);
	var saturation = Math.max(this1[1],other[1]);
	var lightness = Math.max(this1[2],other[2]);
	var gamma = Math.max(this1[3],other[3]);
	return [hue,saturation,lightness,null == gamma?1.0:gamma];
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.normalize = function(this1) {
	var hue = thx_Floats.wrapCircular(this1[0],360);
	var saturation = thx_Floats.normalize(this1[1]);
	var lightness = thx_Floats.normalize(this1[2]);
	var gamma = thx_Floats.normalize(this1[3]);
	return [hue,saturation,lightness,null == gamma?1.0:gamma];
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.rotate = function(this1,angle) {
	return thx_color__$CubeHelix_CubeHelix_$Impl_$.withHue(this1,this1[0] + angle);
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.roundTo = function(this1,decimals) {
	var hue = thx_Floats.roundTo(this1[0],decimals);
	var saturation = thx_Floats.roundTo(this1[1],decimals);
	var lightness = thx_Floats.roundTo(this1[2],decimals);
	var gamma = thx_Floats.roundTo(this1[3],decimals);
	return [hue,saturation,lightness,null == gamma?1.0:gamma];
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.split = function(this1,spread) {
	if(spread == null) spread = 144.0;
	var _0 = thx_color__$CubeHelix_CubeHelix_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$CubeHelix_CubeHelix_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.square = function(this1) {
	return thx_color__$CubeHelix_CubeHelix_$Impl_$.tetrad(this1,90);
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.tetrad = function(this1,angle) {
	var _0 = thx_color__$CubeHelix_CubeHelix_$Impl_$.rotate(this1,0);
	var _1 = thx_color__$CubeHelix_CubeHelix_$Impl_$.rotate(this1,angle);
	var _2 = thx_color__$CubeHelix_CubeHelix_$Impl_$.rotate(this1,180);
	var _3 = thx_color__$CubeHelix_CubeHelix_$Impl_$.rotate(this1,180 + angle);
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.triad = function(this1) {
	var _0 = thx_color__$CubeHelix_CubeHelix_$Impl_$.rotate(this1,-120);
	var _1 = thx_color__$CubeHelix_CubeHelix_$Impl_$.rotate(this1,0);
	var _2 = thx_color__$CubeHelix_CubeHelix_$Impl_$.rotate(this1,120);
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.withGamma = function(this1,newgamma) {
	return [this1[0],this1[1],this1[2],newgamma];
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.withHue = function(this1,newhue) {
	return [newhue,this1[1],this1[2],this1[3]];
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.withLightness = function(this1,newlightness) {
	return [this1[0],this1[1],newlightness,this1[3]];
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.withSaturation = function(this1,newsaturation) {
	return [this1[0],newsaturation,this1[2],this1[3]];
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toCss3 = function(this1) {
	return thx_color__$CubeHelix_CubeHelix_$Impl_$.toString(this1);
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toString = function(this1) {
	if(this1[3] != 1) return "cubehelix(" + this1[0] + "," + this1[1] + "," + this1[2] + ", " + this1[3] + ")"; else return "cubehelix(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.equals = function(this1,other) {
	return thx_color__$CubeHelix_CubeHelix_$Impl_$.nearEquals(this1,other);
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return Math.abs(thx_Floats.angleDifference(this1[0],other[0],360.0)) <= tolerance && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance) && thx_Floats.nearEquals(this1[3],other[3],tolerance);
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toLab(thx_color__$CubeHelix_CubeHelix_$Impl_$.toXyz(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toLCh = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toLCh(thx_color__$CubeHelix_CubeHelix_$Impl_$.toLab(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toLuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toLuv(thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbx(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toCmy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmy(thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbx(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toCmyk = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmyk(thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbx(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toGrey = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toGrey(thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbx(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toHsl = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbx(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toHsv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsv(thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbx(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toHunterLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHunterLab(thx_color__$CubeHelix_CubeHelix_$Impl_$.toXyz(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbx(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbxa(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbx = function(this1) {
	var h;
	if(isNaN(this1[0])) h = 0; else h = (this1[0] + 120) / 180 * Math.PI;
	var l = Math.pow(this1[2],this1[3]);
	var a;
	if(isNaN(this1[1])) a = 0; else a = this1[1] * l * (1 - l);
	var cosh = Math.cos(h);
	var sinh = Math.sin(h);
	return [l + a * (-0.14861 * cosh + 1.78277 * sinh),l + a * (-0.29227 * cosh + -0.90649 * sinh),l + a * (1.97294 * cosh)];
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa(thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbx(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toTemperature = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature(thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbx(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toXyz = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toXyz(thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbx(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toYuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYuv(thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbx(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.toYxy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYxy(thx_color__$CubeHelix_CubeHelix_$Impl_$.toRgbx(this1));
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.get_hue = function(this1) {
	return this1[0];
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.get_saturation = function(this1) {
	return this1[1];
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.get_lightness = function(this1) {
	return this1[2];
};
thx_color__$CubeHelix_CubeHelix_$Impl_$.get_gamma = function(this1) {
	return this1[3];
};
var thx_color__$Grey_Grey_$Impl_$ = {};
thx_color__$Grey_Grey_$Impl_$.__name__ = ["thx","color","_Grey","Grey_Impl_"];
thx_color__$Grey_Grey_$Impl_$.create = function(v) {
	return v;
};
thx_color__$Grey_Grey_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "grey":case "gray":
			var grey = thx_color_parse_ColorParser.getFloatChannels(info.channels,1,false)[0];
			return grey;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Grey_Grey_$Impl_$._new = function(grey) {
	return grey;
};
thx_color__$Grey_Grey_$Impl_$.contrast = function(this1) {
	if(this1 > 0.5) return thx_color__$Grey_Grey_$Impl_$.black; else return thx_color__$Grey_Grey_$Impl_$.white;
};
thx_color__$Grey_Grey_$Impl_$.darker = function(this1,t) {
	var grey = thx_Floats.interpolate(t,this1,0);
	return grey;
};
thx_color__$Grey_Grey_$Impl_$.lighter = function(this1,t) {
	var grey = thx_Floats.interpolate(t,this1,1);
	return grey;
};
thx_color__$Grey_Grey_$Impl_$.interpolate = function(this1,other,t) {
	var grey = thx_Floats.interpolate(t,this1,other);
	return grey;
};
thx_color__$Grey_Grey_$Impl_$.min = function(this1,other) {
	var v = Math.min(this1,other);
	return v;
};
thx_color__$Grey_Grey_$Impl_$.max = function(this1,other) {
	var v = Math.max(this1,other);
	return v;
};
thx_color__$Grey_Grey_$Impl_$.normalize = function(this1) {
	return this1 < 0?0:this1 > 1?1:this1;
};
thx_color__$Grey_Grey_$Impl_$.roundTo = function(this1,decimals) {
	var v = thx_Floats.roundTo(this1,decimals);
	return v;
};
thx_color__$Grey_Grey_$Impl_$.toString = function(this1) {
	return "grey(" + this1 * 100 + "%)";
};
thx_color__$Grey_Grey_$Impl_$.equals = function(this1,other) {
	return thx_Floats.nearEquals(this1,other);
};
thx_color__$Grey_Grey_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return thx_Floats.nearEquals(this1,other,tolerance);
};
thx_color__$Grey_Grey_$Impl_$.get_grey = function(this1) {
	return this1;
};
thx_color__$Grey_Grey_$Impl_$.toLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toLab(thx_color__$Grey_Grey_$Impl_$.toXyz(this1));
};
thx_color__$Grey_Grey_$Impl_$.toLCh = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toLCh(thx_color__$Grey_Grey_$Impl_$.toLab(this1));
};
thx_color__$Grey_Grey_$Impl_$.toLuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toLuv(thx_color__$Grey_Grey_$Impl_$.toRgbx(this1));
};
thx_color__$Grey_Grey_$Impl_$.toCmy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmy(thx_color__$Grey_Grey_$Impl_$.toRgbx(this1));
};
thx_color__$Grey_Grey_$Impl_$.toCmyk = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmyk(thx_color__$Grey_Grey_$Impl_$.toRgbx(this1));
};
thx_color__$Grey_Grey_$Impl_$.toCubeHelix = function(this1) {
	var this2 = thx_color__$Grey_Grey_$Impl_$.toRgbx(this1);
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma(this2,1);
};
thx_color__$Grey_Grey_$Impl_$.toHsl = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$Grey_Grey_$Impl_$.toRgbx(this1));
};
thx_color__$Grey_Grey_$Impl_$.toHsv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsv(thx_color__$Grey_Grey_$Impl_$.toRgbx(this1));
};
thx_color__$Grey_Grey_$Impl_$.toHunterLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHunterLab(thx_color__$Grey_Grey_$Impl_$.toXyz(this1));
};
thx_color__$Grey_Grey_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$Grey_Grey_$Impl_$.toRgbx(this1));
};
thx_color__$Grey_Grey_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Grey_Grey_$Impl_$.toRgbxa(this1));
};
thx_color__$Grey_Grey_$Impl_$.toRgbx = function(this1) {
	return [this1,this1,this1];
};
thx_color__$Grey_Grey_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa(thx_color__$Grey_Grey_$Impl_$.toRgbx(this1));
};
thx_color__$Grey_Grey_$Impl_$.toTemperature = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature(thx_color__$Grey_Grey_$Impl_$.toRgbx(this1));
};
thx_color__$Grey_Grey_$Impl_$.toYuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYuv(thx_color__$Grey_Grey_$Impl_$.toRgbx(this1));
};
thx_color__$Grey_Grey_$Impl_$.toXyz = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toXyz(thx_color__$Grey_Grey_$Impl_$.toRgbx(this1));
};
thx_color__$Grey_Grey_$Impl_$.toYxy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYxy(thx_color__$Grey_Grey_$Impl_$.toRgbx(this1));
};
var thx_color__$Hsl_Hsl_$Impl_$ = {};
thx_color__$Hsl_Hsl_$Impl_$.__name__ = ["thx","color","_Hsl","Hsl_Impl_"];
thx_color__$Hsl_Hsl_$Impl_$.create = function(hue,saturation,lightness) {
	return [hue,saturation,lightness];
};
thx_color__$Hsl_Hsl_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return [arr[0],arr[1],arr[2]];
};
thx_color__$Hsl_Hsl_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "hsl":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Hsl_Hsl_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$Hsl_Hsl_$Impl_$.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx_color__$Hsl_Hsl_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$Hsl_Hsl_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$Hsl_Hsl_$Impl_$.complement = function(this1) {
	return thx_color__$Hsl_Hsl_$Impl_$.rotate(this1,180);
};
thx_color__$Hsl_Hsl_$Impl_$.darker = function(this1,t) {
	var channels = [this1[0],this1[1],thx_Floats.interpolate(t,this1[2],0)];
	return channels;
};
thx_color__$Hsl_Hsl_$Impl_$.lighter = function(this1,t) {
	var channels = [this1[0],this1[1],thx_Floats.interpolate(t,this1[2],1)];
	return channels;
};
thx_color__$Hsl_Hsl_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolateAngle(t,this1[0],other[0],360),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$Hsl_Hsl_$Impl_$.interpolateWidest = function(this1,other,t) {
	var channels = [thx_Floats.interpolateAngleWidest(t,this1[0],other[0],360),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$Hsl_Hsl_$Impl_$.min = function(this1,other) {
	var hue = Math.min(this1[0],other[0]);
	var saturation = Math.min(this1[1],other[1]);
	var lightness = Math.min(this1[2],other[2]);
	return [hue,saturation,lightness];
};
thx_color__$Hsl_Hsl_$Impl_$.max = function(this1,other) {
	var hue = Math.max(this1[0],other[0]);
	var saturation = Math.max(this1[1],other[1]);
	var lightness = Math.max(this1[2],other[2]);
	return [hue,saturation,lightness];
};
thx_color__$Hsl_Hsl_$Impl_$.normalize = function(this1) {
	var hue = thx_Floats.wrapCircular(this1[0],360);
	var saturation = thx_Floats.normalize(this1[1]);
	var lightness = thx_Floats.normalize(this1[2]);
	return [hue,saturation,lightness];
};
thx_color__$Hsl_Hsl_$Impl_$.rotate = function(this1,angle) {
	return thx_color__$Hsl_Hsl_$Impl_$.withHue(this1,this1[0] + angle);
};
thx_color__$Hsl_Hsl_$Impl_$.roundTo = function(this1,decimals) {
	var hue = thx_Floats.roundTo(this1[0],decimals);
	var saturation = thx_Floats.roundTo(this1[1],decimals);
	var lightness = thx_Floats.roundTo(this1[2],decimals);
	return [hue,saturation,lightness];
};
thx_color__$Hsl_Hsl_$Impl_$.split = function(this1,spread) {
	if(spread == null) spread = 144.0;
	var _0 = thx_color__$Hsl_Hsl_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$Hsl_Hsl_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$Hsl_Hsl_$Impl_$.square = function(this1) {
	return thx_color__$Hsl_Hsl_$Impl_$.tetrad(this1,90);
};
thx_color__$Hsl_Hsl_$Impl_$.tetrad = function(this1,angle) {
	var _0 = thx_color__$Hsl_Hsl_$Impl_$.rotate(this1,0);
	var _1 = thx_color__$Hsl_Hsl_$Impl_$.rotate(this1,angle);
	var _2 = thx_color__$Hsl_Hsl_$Impl_$.rotate(this1,180);
	var _3 = thx_color__$Hsl_Hsl_$Impl_$.rotate(this1,180 + angle);
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx_color__$Hsl_Hsl_$Impl_$.triad = function(this1) {
	var _0 = thx_color__$Hsl_Hsl_$Impl_$.rotate(this1,-120);
	var _1 = thx_color__$Hsl_Hsl_$Impl_$.rotate(this1,0);
	var _2 = thx_color__$Hsl_Hsl_$Impl_$.rotate(this1,120);
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx_color__$Hsl_Hsl_$Impl_$.withAlpha = function(this1,alpha) {
	var channels = this1.concat([alpha]);
	return channels;
};
thx_color__$Hsl_Hsl_$Impl_$.withHue = function(this1,newhue) {
	return [newhue,this1[1],this1[2]];
};
thx_color__$Hsl_Hsl_$Impl_$.withLightness = function(this1,newlightness) {
	return [this1[0],this1[1],newlightness];
};
thx_color__$Hsl_Hsl_$Impl_$.withSaturation = function(this1,newsaturation) {
	return [this1[0],newsaturation,this1[2]];
};
thx_color__$Hsl_Hsl_$Impl_$.toCss3 = function(this1) {
	return thx_color__$Hsl_Hsl_$Impl_$.toString(this1);
};
thx_color__$Hsl_Hsl_$Impl_$.toString = function(this1) {
	return "hsl(" + this1[0] + "," + this1[1] * 100 + "%," + this1[2] * 100 + "%)";
};
thx_color__$Hsl_Hsl_$Impl_$.equals = function(this1,other) {
	return thx_color__$Hsl_Hsl_$Impl_$.nearEquals(this1,other);
};
thx_color__$Hsl_Hsl_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return Math.abs(thx_Floats.angleDifference(this1[0],other[0],360.0)) <= tolerance && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance);
};
thx_color__$Hsl_Hsl_$Impl_$.toLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toLab(thx_color__$Hsl_Hsl_$Impl_$.toXyz(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.toLCh = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toLCh(thx_color__$Hsl_Hsl_$Impl_$.toLab(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.toLuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toLuv(thx_color__$Hsl_Hsl_$Impl_$.toRgbx(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.toCmy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmy(thx_color__$Hsl_Hsl_$Impl_$.toRgbx(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.toCmyk = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmyk(thx_color__$Hsl_Hsl_$Impl_$.toRgbx(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.toCubeHelix = function(this1) {
	var this2 = thx_color__$Hsl_Hsl_$Impl_$.toRgbx(this1);
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma(this2,1);
};
thx_color__$Hsl_Hsl_$Impl_$.toGrey = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toGrey(thx_color__$Hsl_Hsl_$Impl_$.toRgbx(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.toHsv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsv(thx_color__$Hsl_Hsl_$Impl_$.toRgbx(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$Hsl_Hsl_$Impl_$.toRgbx(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Hsl_Hsl_$Impl_$.toRgbxa(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.toRgbx = function(this1) {
	var channels = [thx_color__$Hsl_Hsl_$Impl_$._c(this1[0] + 120,this1[1],this1[2]),thx_color__$Hsl_Hsl_$Impl_$._c(this1[0],this1[1],this1[2]),thx_color__$Hsl_Hsl_$Impl_$._c(this1[0] - 120,this1[1],this1[2])];
	return channels;
};
thx_color__$Hsl_Hsl_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa(thx_color__$Hsl_Hsl_$Impl_$.toRgbx(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.toHsla = function(this1) {
	return thx_color__$Hsl_Hsl_$Impl_$.withAlpha(this1,1.0);
};
thx_color__$Hsl_Hsl_$Impl_$.toHunterLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHunterLab(thx_color__$Hsl_Hsl_$Impl_$.toXyz(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.toTemperature = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature(thx_color__$Hsl_Hsl_$Impl_$.toRgbx(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.toXyz = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toXyz(thx_color__$Hsl_Hsl_$Impl_$.toRgbx(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.toYuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYuv(thx_color__$Hsl_Hsl_$Impl_$.toRgbx(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.toYxy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYxy(thx_color__$Hsl_Hsl_$Impl_$.toRgbx(this1));
};
thx_color__$Hsl_Hsl_$Impl_$.get_hue = function(this1) {
	return this1[0];
};
thx_color__$Hsl_Hsl_$Impl_$.get_saturation = function(this1) {
	return this1[1];
};
thx_color__$Hsl_Hsl_$Impl_$.get_lightness = function(this1) {
	return this1[2];
};
thx_color__$Hsl_Hsl_$Impl_$._c = function(d,s,l) {
	var m2;
	if(l <= 0.5) m2 = l * (1 + s); else m2 = l + s - l * s;
	var m1 = 2 * l - m2;
	d = thx_Floats.wrapCircular(d,360);
	if(d < 60) return m1 + (m2 - m1) * d / 60; else if(d < 180) return m2; else if(d < 240) return m1 + (m2 - m1) * (240 - d) / 60; else return m1;
};
var thx_color__$Hsla_Hsla_$Impl_$ = {};
thx_color__$Hsla_Hsla_$Impl_$.__name__ = ["thx","color","_Hsla","Hsla_Impl_"];
thx_color__$Hsla_Hsla_$Impl_$.create = function(hue,saturation,lightness,alpha) {
	return [hue,saturation,lightness,alpha];
};
thx_color__$Hsla_Hsla_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,4);
	return [arr[0],arr[1],arr[2],arr[3]];
};
thx_color__$Hsla_Hsla_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "hsl":
			return thx_color__$Hsl_Hsl_$Impl_$.toHsla((function($this) {
				var $r;
				var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false);
				$r = channels;
				return $r;
			}(this)));
		case "hsla":
			var channels1 = thx_color_parse_ColorParser.getFloatChannels(info.channels,4,false);
			return channels1;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Hsla_Hsla_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$Hsla_Hsla_$Impl_$.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx_color__$Hsla_Hsla_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$Hsla_Hsla_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$Hsla_Hsla_$Impl_$.complement = function(this1) {
	return thx_color__$Hsla_Hsla_$Impl_$.rotate(this1,180);
};
thx_color__$Hsla_Hsla_$Impl_$.darker = function(this1,t) {
	var channels = [this1[0],this1[1],thx_Floats.interpolate(t,this1[2],0),this1[3]];
	return channels;
};
thx_color__$Hsla_Hsla_$Impl_$.lighter = function(this1,t) {
	var channels = [this1[0],this1[1],thx_Floats.interpolate(t,this1[2],1),this1[3]];
	return channels;
};
thx_color__$Hsla_Hsla_$Impl_$.normalize = function(this1) {
	var hue = thx_Floats.wrapCircular(this1[0],360);
	var saturation = thx_Floats.normalize(this1[1]);
	var lightness = thx_Floats.normalize(this1[2]);
	var alpha = thx_Floats.normalize(this1[3]);
	return [hue,saturation,lightness,alpha];
};
thx_color__$Hsla_Hsla_$Impl_$.roundTo = function(this1,decimals) {
	var hue = thx_Floats.roundTo(this1[0],decimals);
	var saturation = thx_Floats.roundTo(this1[1],decimals);
	var lightness = thx_Floats.roundTo(this1[2],decimals);
	var alpha = thx_Floats.roundTo(this1[3],decimals);
	return [hue,saturation,lightness,alpha];
};
thx_color__$Hsla_Hsla_$Impl_$.transparent = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Floats.interpolate(t,this1[3],0)];
	return channels;
};
thx_color__$Hsla_Hsla_$Impl_$.opaque = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Floats.interpolate(t,this1[3],1)];
	return channels;
};
thx_color__$Hsla_Hsla_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolateAngle(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2]),thx_Floats.interpolate(t,this1[3],other[3])];
	return channels;
};
thx_color__$Hsla_Hsla_$Impl_$.rotate = function(this1,angle) {
	return [this1[0] + angle,this1[1],this1[2],this1[3]];
};
thx_color__$Hsla_Hsla_$Impl_$.split = function(this1,spread) {
	if(spread == null) spread = 150.0;
	var _0 = thx_color__$Hsla_Hsla_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$Hsla_Hsla_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$Hsla_Hsla_$Impl_$.withAlpha = function(this1,newalpha) {
	return [this1[0],this1[1],this1[2],newalpha];
};
thx_color__$Hsla_Hsla_$Impl_$.withHue = function(this1,newhue) {
	return [newhue,this1[1],this1[2],this1[3]];
};
thx_color__$Hsla_Hsla_$Impl_$.withLightness = function(this1,newlightness) {
	return [this1[0],this1[1],newlightness,this1[3]];
};
thx_color__$Hsla_Hsla_$Impl_$.withSaturation = function(this1,newsaturation) {
	return [this1[0],newsaturation,this1[2],this1[3]];
};
thx_color__$Hsla_Hsla_$Impl_$.toCss3 = function(this1) {
	return thx_color__$Hsla_Hsla_$Impl_$.toString(this1);
};
thx_color__$Hsla_Hsla_$Impl_$.toString = function(this1) {
	return "hsla(" + this1[0] + "," + this1[1] * 100 + "%," + this1[2] * 100 + "%," + this1[3] + ")";
};
thx_color__$Hsla_Hsla_$Impl_$.equals = function(this1,other) {
	return thx_color__$Hsla_Hsla_$Impl_$.nearEquals(this1,other);
};
thx_color__$Hsla_Hsla_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return Math.abs(thx_Floats.angleDifference(this1[0],other[0],360.0)) <= tolerance && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance) && thx_Floats.nearEquals(this1[3],other[3],tolerance);
};
thx_color__$Hsla_Hsla_$Impl_$.toHsl = function(this1) {
	var channels = this1.slice(0,3);
	return channels;
};
thx_color__$Hsla_Hsla_$Impl_$.toHsva = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toHsva(thx_color__$Hsla_Hsla_$Impl_$.toRgbxa(this1));
};
thx_color__$Hsla_Hsla_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgb(thx_color__$Hsla_Hsla_$Impl_$.toRgbxa(this1));
};
thx_color__$Hsla_Hsla_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Hsla_Hsla_$Impl_$.toRgbxa(this1));
};
thx_color__$Hsla_Hsla_$Impl_$.toRgbxa = function(this1) {
	var channels = [thx_color__$Hsl_Hsl_$Impl_$._c(this1[0] + 120,this1[1],this1[2]),thx_color__$Hsl_Hsl_$Impl_$._c(this1[0],this1[1],this1[2]),thx_color__$Hsl_Hsl_$Impl_$._c(this1[0] - 120,this1[1],this1[2]),this1[3]];
	return channels;
};
thx_color__$Hsla_Hsla_$Impl_$.get_hue = function(this1) {
	return this1[0];
};
thx_color__$Hsla_Hsla_$Impl_$.get_saturation = function(this1) {
	return this1[1];
};
thx_color__$Hsla_Hsla_$Impl_$.get_lightness = function(this1) {
	return this1[2];
};
thx_color__$Hsla_Hsla_$Impl_$.get_alpha = function(this1) {
	return this1[3];
};
var thx_color__$Hsv_Hsv_$Impl_$ = {};
thx_color__$Hsv_Hsv_$Impl_$.__name__ = ["thx","color","_Hsv","Hsv_Impl_"];
thx_color__$Hsv_Hsv_$Impl_$.create = function(hue,saturation,value) {
	return [hue,saturation,value];
};
thx_color__$Hsv_Hsv_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return [arr[0],arr[1],arr[2]];
};
thx_color__$Hsv_Hsv_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "hsv":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Hsv_Hsv_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$Hsv_Hsv_$Impl_$.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx_color__$Hsv_Hsv_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$Hsv_Hsv_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$Hsv_Hsv_$Impl_$.complement = function(this1) {
	return thx_color__$Hsv_Hsv_$Impl_$.rotate(this1,180);
};
thx_color__$Hsv_Hsv_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolateAngle(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$Hsv_Hsv_$Impl_$.interpolateWidest = function(this1,other,t) {
	var channels = [thx_Floats.interpolateAngleWidest(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$Hsv_Hsv_$Impl_$.min = function(this1,other) {
	var hue = Math.min(this1[0],other[0]);
	var saturation = Math.min(this1[1],other[1]);
	var value = Math.min(this1[2],other[2]);
	return [hue,saturation,value];
};
thx_color__$Hsv_Hsv_$Impl_$.max = function(this1,other) {
	var hue = Math.max(this1[0],other[0]);
	var saturation = Math.max(this1[1],other[1]);
	var value = Math.max(this1[2],other[2]);
	return [hue,saturation,value];
};
thx_color__$Hsv_Hsv_$Impl_$.normalize = function(this1) {
	var hue = thx_Floats.wrapCircular(this1[0],360);
	var saturation = thx_Floats.normalize(this1[1]);
	var value = thx_Floats.normalize(this1[2]);
	return [hue,saturation,value];
};
thx_color__$Hsv_Hsv_$Impl_$.rotate = function(this1,angle) {
	return thx_color__$Hsv_Hsv_$Impl_$.normalize(thx_color__$Hsv_Hsv_$Impl_$.withHue(this1,this1[0] + angle));
};
thx_color__$Hsv_Hsv_$Impl_$.roundTo = function(this1,decimals) {
	var hue = thx_Floats.roundTo(this1[0],decimals);
	var saturation = thx_Floats.roundTo(this1[1],decimals);
	var value = thx_Floats.roundTo(this1[2],decimals);
	return [hue,saturation,value];
};
thx_color__$Hsv_Hsv_$Impl_$.split = function(this1,spread) {
	if(spread == null) spread = 144.0;
	var _0 = thx_color__$Hsv_Hsv_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$Hsv_Hsv_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$Hsv_Hsv_$Impl_$.square = function(this1) {
	return thx_color__$Hsv_Hsv_$Impl_$.tetrad(this1,90);
};
thx_color__$Hsv_Hsv_$Impl_$.tetrad = function(this1,angle) {
	var _0 = thx_color__$Hsv_Hsv_$Impl_$.rotate(this1,0);
	var _1 = thx_color__$Hsv_Hsv_$Impl_$.rotate(this1,angle);
	var _2 = thx_color__$Hsv_Hsv_$Impl_$.rotate(this1,180);
	var _3 = thx_color__$Hsv_Hsv_$Impl_$.rotate(this1,180 + angle);
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx_color__$Hsv_Hsv_$Impl_$.triad = function(this1) {
	var _0 = thx_color__$Hsv_Hsv_$Impl_$.rotate(this1,-120);
	var _1 = thx_color__$Hsv_Hsv_$Impl_$.rotate(this1,0);
	var _2 = thx_color__$Hsv_Hsv_$Impl_$.rotate(this1,120);
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx_color__$Hsv_Hsv_$Impl_$.withAlpha = function(this1,alpha) {
	var channels = this1.concat([alpha]);
	return channels;
};
thx_color__$Hsv_Hsv_$Impl_$.withHue = function(this1,newhue) {
	return [newhue,this1[1],this1[2]];
};
thx_color__$Hsv_Hsv_$Impl_$.withValue = function(this1,newvalue) {
	return [this1[0],this1[1],newvalue];
};
thx_color__$Hsv_Hsv_$Impl_$.withSaturation = function(this1,newsaturation) {
	return [this1[0],newsaturation,this1[2]];
};
thx_color__$Hsv_Hsv_$Impl_$.toString = function(this1) {
	return "hsv(" + this1[0] + "," + this1[1] * 100 + "%," + this1[2] * 100 + "%)";
};
thx_color__$Hsv_Hsv_$Impl_$.equals = function(this1,other) {
	return thx_color__$Hsv_Hsv_$Impl_$.nearEquals(this1,other);
};
thx_color__$Hsv_Hsv_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return Math.abs(thx_Floats.angleDifference(this1[0],other[0],360.0)) <= tolerance && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance);
};
thx_color__$Hsv_Hsv_$Impl_$.toLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toLab(thx_color__$Hsv_Hsv_$Impl_$.toXyz(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.toLCh = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toLCh(thx_color__$Hsv_Hsv_$Impl_$.toLab(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.toLuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toLuv(thx_color__$Hsv_Hsv_$Impl_$.toRgbx(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.toCmy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmy(thx_color__$Hsv_Hsv_$Impl_$.toRgbx(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.toCmyk = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmyk(thx_color__$Hsv_Hsv_$Impl_$.toRgbx(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.toCubeHelix = function(this1) {
	var this2 = thx_color__$Hsv_Hsv_$Impl_$.toRgbx(this1);
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma(this2,1);
};
thx_color__$Hsv_Hsv_$Impl_$.toGrey = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toGrey(thx_color__$Hsv_Hsv_$Impl_$.toRgbx(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.toHsl = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$Hsv_Hsv_$Impl_$.toRgbx(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.toHsva = function(this1) {
	return thx_color__$Hsv_Hsv_$Impl_$.withAlpha(this1,1.0);
};
thx_color__$Hsv_Hsv_$Impl_$.toHunterLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHunterLab(thx_color__$Hsv_Hsv_$Impl_$.toXyz(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$Hsv_Hsv_$Impl_$.toRgbx(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Hsv_Hsv_$Impl_$.toRgbxa(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.toRgbx = function(this1) {
	if(this1[1] == 0) return [this1[2],this1[2],this1[2]];
	var r;
	var g;
	var b;
	var i;
	var f;
	var p;
	var q;
	var t;
	var h = this1[0] / 60;
	i = Math.floor(h);
	f = h - i;
	p = this1[2] * (1 - this1[1]);
	q = this1[2] * (1 - f * this1[1]);
	t = this1[2] * (1 - (1 - f) * this1[1]);
	switch(i) {
	case 0:
		r = this1[2];
		g = t;
		b = p;
		break;
	case 1:
		r = q;
		g = this1[2];
		b = p;
		break;
	case 2:
		r = p;
		g = this1[2];
		b = t;
		break;
	case 3:
		r = p;
		g = q;
		b = this1[2];
		break;
	case 4:
		r = t;
		g = p;
		b = this1[2];
		break;
	default:
		r = this1[2];
		g = p;
		b = q;
	}
	return [r,g,b];
};
thx_color__$Hsv_Hsv_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa(thx_color__$Hsv_Hsv_$Impl_$.toRgbx(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.toTemperature = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature(thx_color__$Hsv_Hsv_$Impl_$.toRgbx(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.toXyz = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toXyz(thx_color__$Hsv_Hsv_$Impl_$.toRgbx(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.toYuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYuv(thx_color__$Hsv_Hsv_$Impl_$.toRgbx(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.toYxy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYxy(thx_color__$Hsv_Hsv_$Impl_$.toRgbx(this1));
};
thx_color__$Hsv_Hsv_$Impl_$.get_hue = function(this1) {
	return this1[0];
};
thx_color__$Hsv_Hsv_$Impl_$.get_saturation = function(this1) {
	return this1[1];
};
thx_color__$Hsv_Hsv_$Impl_$.get_value = function(this1) {
	return this1[2];
};
var thx_color__$Hsva_Hsva_$Impl_$ = {};
thx_color__$Hsva_Hsva_$Impl_$.__name__ = ["thx","color","_Hsva","Hsva_Impl_"];
thx_color__$Hsva_Hsva_$Impl_$.create = function(hue,saturation,value,alpha) {
	return [hue,saturation,value,alpha];
};
thx_color__$Hsva_Hsva_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,4);
	return [arr[0],arr[1],arr[2],arr[3]];
};
thx_color__$Hsva_Hsva_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "hsv":
			return thx_color__$Hsv_Hsv_$Impl_$.toHsva((function($this) {
				var $r;
				var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false);
				$r = channels;
				return $r;
			}(this)));
		case "hsva":
			var channels1 = thx_color_parse_ColorParser.getFloatChannels(info.channels,4,false);
			return channels1;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Hsva_Hsva_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$Hsva_Hsva_$Impl_$.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx_color__$Hsva_Hsva_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$Hsva_Hsva_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$Hsva_Hsva_$Impl_$.complement = function(this1) {
	return thx_color__$Hsva_Hsva_$Impl_$.rotate(this1,180);
};
thx_color__$Hsva_Hsva_$Impl_$.normalize = function(this1) {
	var hue = thx_Floats.wrapCircular(this1[0],360);
	var saturation = thx_Floats.normalize(this1[1]);
	var value = thx_Floats.normalize(this1[2]);
	var alpha = thx_Floats.normalize(this1[3]);
	return [hue,saturation,value,alpha];
};
thx_color__$Hsva_Hsva_$Impl_$.transparent = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Floats.interpolate(t,this1[3],0)];
	return channels;
};
thx_color__$Hsva_Hsva_$Impl_$.opaque = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Floats.interpolate(t,this1[3],1)];
	return channels;
};
thx_color__$Hsva_Hsva_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolateAngle(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2]),thx_Floats.interpolate(t,this1[3],other[3])];
	return channels;
};
thx_color__$Hsva_Hsva_$Impl_$.interpolateWidest = function(this1,other,t) {
	var channels = [thx_Floats.interpolateAngleWidest(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2]),thx_Floats.interpolate(t,this1[3],other[3])];
	return channels;
};
thx_color__$Hsva_Hsva_$Impl_$.rotate = function(this1,angle) {
	return thx_color__$Hsva_Hsva_$Impl_$.normalize([this1[0] + angle,this1[1],this1[2],this1[3]]);
};
thx_color__$Hsva_Hsva_$Impl_$.roundTo = function(this1,decimals) {
	var hue = thx_Floats.roundTo(this1[0],decimals);
	var saturation = thx_Floats.roundTo(this1[1],decimals);
	var value = thx_Floats.roundTo(this1[2],decimals);
	var alpha = thx_Floats.roundTo(this1[3],decimals);
	return [hue,saturation,value,alpha];
};
thx_color__$Hsva_Hsva_$Impl_$.split = function(this1,spread) {
	if(spread == null) spread = 150.0;
	var _0 = thx_color__$Hsva_Hsva_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$Hsva_Hsva_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$Hsva_Hsva_$Impl_$.withAlpha = function(this1,newalpha) {
	return [this1[0],this1[1],this1[2],newalpha];
};
thx_color__$Hsva_Hsva_$Impl_$.withHue = function(this1,newhue) {
	return [newhue,this1[1],this1[2],this1[3]];
};
thx_color__$Hsva_Hsva_$Impl_$.withLightness = function(this1,newvalue) {
	return [this1[0],this1[1],newvalue,this1[3]];
};
thx_color__$Hsva_Hsva_$Impl_$.withSaturation = function(this1,newsaturation) {
	return [this1[0],newsaturation,this1[2],this1[3]];
};
thx_color__$Hsva_Hsva_$Impl_$.toString = function(this1) {
	return "hsva(" + this1[0] + "," + this1[1] * 100 + "%," + this1[2] * 100 + "%," + this1[3] + ")";
};
thx_color__$Hsva_Hsva_$Impl_$.equals = function(this1,other) {
	return thx_color__$Hsva_Hsva_$Impl_$.nearEquals(this1,other);
};
thx_color__$Hsva_Hsva_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return Math.abs(thx_Floats.angleDifference(this1[0],other[0],360.0)) <= tolerance && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance) && thx_Floats.nearEquals(this1[3],other[3],tolerance);
};
thx_color__$Hsva_Hsva_$Impl_$.toHsv = function(this1) {
	var channels = this1.slice(0,3);
	return channels;
};
thx_color__$Hsva_Hsva_$Impl_$.toHsla = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toHsla(thx_color__$Hsva_Hsva_$Impl_$.toRgbxa(this1));
};
thx_color__$Hsva_Hsva_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgb(thx_color__$Hsva_Hsva_$Impl_$.toRgbxa(this1));
};
thx_color__$Hsva_Hsva_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Hsva_Hsva_$Impl_$.toRgbxa(this1));
};
thx_color__$Hsva_Hsva_$Impl_$.toRgbxa = function(this1) {
	if(this1[1] == 0) return [this1[2],this1[2],this1[2],this1[3]];
	var r;
	var g;
	var b;
	var i;
	var f;
	var p;
	var q;
	var t;
	var h = this1[0] / 60;
	i = Math.floor(h);
	f = h - i;
	p = this1[2] * (1 - this1[1]);
	q = this1[2] * (1 - f * this1[1]);
	t = this1[2] * (1 - (1 - f) * this1[1]);
	switch(i) {
	case 0:
		r = this1[2];
		g = t;
		b = p;
		break;
	case 1:
		r = q;
		g = this1[2];
		b = p;
		break;
	case 2:
		r = p;
		g = this1[2];
		b = t;
		break;
	case 3:
		r = p;
		g = q;
		b = this1[2];
		break;
	case 4:
		r = t;
		g = p;
		b = this1[2];
		break;
	default:
		r = this1[2];
		g = p;
		b = q;
	}
	return [r,g,b,this1[3]];
};
thx_color__$Hsva_Hsva_$Impl_$.get_hue = function(this1) {
	return this1[0];
};
thx_color__$Hsva_Hsva_$Impl_$.get_saturation = function(this1) {
	return this1[1];
};
thx_color__$Hsva_Hsva_$Impl_$.get_value = function(this1) {
	return this1[2];
};
thx_color__$Hsva_Hsva_$Impl_$.get_alpha = function(this1) {
	return this1[3];
};
var thx_color__$HunterLab_HunterLab_$Impl_$ = {};
thx_color__$HunterLab_HunterLab_$Impl_$.__name__ = ["thx","color","_HunterLab","HunterLab_Impl_"];
thx_color__$HunterLab_HunterLab_$Impl_$.create = function(l,a,b) {
	return [l,a,b];
};
thx_color__$HunterLab_HunterLab_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return [arr[0],arr[1],arr[2]];
};
thx_color__$HunterLab_HunterLab_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "hunterlab":
			return thx_color__$HunterLab_HunterLab_$Impl_$.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false));
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$HunterLab_HunterLab_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$HunterLab_HunterLab_$Impl_$.distance = function(this1,other) {
	return (this1[0] - other[0]) * (this1[0] - other[0]) + (this1[1] - other[1]) * (this1[1] - other[1]) + (this1[2] - other[2]) * (this1[2] - other[2]);
};
thx_color__$HunterLab_HunterLab_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$HunterLab_HunterLab_$Impl_$.match = function(this1,palette) {
	var it = palette;
	if(null == it) throw new thx_error_NullArgument("Iterable argument \"this\" cannot be null",{ fileName : "NullArgument.hx", lineNumber : 73, className : "thx.color._HunterLab.HunterLab_Impl_", methodName : "match"}); else if(!$iterator(it)().hasNext()) throw new thx_error_NullArgument("Iterable argument \"this\" cannot be empty",{ fileName : "NullArgument.hx", lineNumber : 75, className : "thx.color._HunterLab.HunterLab_Impl_", methodName : "match"});
	var dist = Infinity;
	var closest = null;
	var $it0 = $iterator(palette)();
	while( $it0.hasNext() ) {
		var color = $it0.next();
		var ndist = thx_color__$HunterLab_HunterLab_$Impl_$.distance(this1,color);
		if(ndist < dist) {
			dist = ndist;
			closest = color;
		}
	}
	return closest;
};
thx_color__$HunterLab_HunterLab_$Impl_$.min = function(this1,other) {
	var l = Math.min(this1[0],other[0]);
	var a = Math.min(this1[1],other[1]);
	var b = Math.min(this1[2],other[2]);
	return [l,a,b];
};
thx_color__$HunterLab_HunterLab_$Impl_$.max = function(this1,other) {
	var l = Math.max(this1[0],other[0]);
	var a = Math.max(this1[1],other[1]);
	var b = Math.max(this1[2],other[2]);
	return [l,a,b];
};
thx_color__$HunterLab_HunterLab_$Impl_$.roundTo = function(this1,decimals) {
	var l = thx_Floats.roundTo(this1[0],decimals);
	var a = thx_Floats.roundTo(this1[1],decimals);
	var b = thx_Floats.roundTo(this1[2],decimals);
	return [l,a,b];
};
thx_color__$HunterLab_HunterLab_$Impl_$.equals = function(this1,other) {
	return thx_color__$HunterLab_HunterLab_$Impl_$.nearEquals(this1,other);
};
thx_color__$HunterLab_HunterLab_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return thx_Floats.nearEquals(this1[0],other[0],tolerance) && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance);
};
thx_color__$HunterLab_HunterLab_$Impl_$.withL = function(this1,newl) {
	return [newl,this1[1],this1[2]];
};
thx_color__$HunterLab_HunterLab_$Impl_$.withA = function(this1,newa) {
	return [this1[0],newa,this1[2]];
};
thx_color__$HunterLab_HunterLab_$Impl_$.withB = function(this1,newb) {
	return [this1[0],this1[1],newb];
};
thx_color__$HunterLab_HunterLab_$Impl_$.toString = function(this1) {
	return "hunterlab(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx_color__$HunterLab_HunterLab_$Impl_$.toLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toLab(thx_color__$HunterLab_HunterLab_$Impl_$.toXyz(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.toLCh = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toLCh(thx_color__$HunterLab_HunterLab_$Impl_$.toLab(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.toLuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toLuv(thx_color__$HunterLab_HunterLab_$Impl_$.toRgbx(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.toCmy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmy(thx_color__$HunterLab_HunterLab_$Impl_$.toRgbx(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.toCmyk = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmyk(thx_color__$HunterLab_HunterLab_$Impl_$.toRgbx(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.toCubeHelix = function(this1) {
	var this2 = thx_color__$HunterLab_HunterLab_$Impl_$.toRgbx(this1);
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma(this2,1);
};
thx_color__$HunterLab_HunterLab_$Impl_$.toGrey = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toGrey(thx_color__$HunterLab_HunterLab_$Impl_$.toRgbx(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.toHsl = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$HunterLab_HunterLab_$Impl_$.toRgbx(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.toHsv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsv(thx_color__$HunterLab_HunterLab_$Impl_$.toRgbx(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$HunterLab_HunterLab_$Impl_$.toRgbx(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$HunterLab_HunterLab_$Impl_$.toRgbxa(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.toRgbx = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toRgbx(thx_color__$HunterLab_HunterLab_$Impl_$.toXyz(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa(thx_color__$HunterLab_HunterLab_$Impl_$.toRgbx(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.toTemperature = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature(thx_color__$HunterLab_HunterLab_$Impl_$.toRgbx(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.toXyz = function(this1) {
	var x = this1[1] / 17.5 * (this1[0] / 10.0);
	var l10 = this1[0] / 10.0;
	var y = l10 * l10;
	var z = this1[2] / 7.0 * (this1[0] / 10.0);
	return [(x + y) / 1.02,y,-(z - y) / 0.847];
};
thx_color__$HunterLab_HunterLab_$Impl_$.toYuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYuv(thx_color__$HunterLab_HunterLab_$Impl_$.toRgbx(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.toYxy = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toYxy(thx_color__$HunterLab_HunterLab_$Impl_$.toXyz(this1));
};
thx_color__$HunterLab_HunterLab_$Impl_$.get_l = function(this1) {
	return this1[0];
};
thx_color__$HunterLab_HunterLab_$Impl_$.get_a = function(this1) {
	return this1[1];
};
thx_color__$HunterLab_HunterLab_$Impl_$.get_b = function(this1) {
	return this1[2];
};
var thx_color__$LCh_LCh_$Impl_$ = {};
thx_color__$LCh_LCh_$Impl_$.__name__ = ["thx","color","_LCh","LCh_Impl_"];
thx_color__$LCh_LCh_$Impl_$.create = function(lightness,chroma,hue) {
	return [lightness,chroma,hue];
};
thx_color__$LCh_LCh_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return [arr[0],arr[1],arr[2]];
};
thx_color__$LCh_LCh_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "cielch":case "lch":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false);
			return channels;
		case "hcl":
			var c = thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false);
			return [c[2],c[1],c[0]];
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$LCh_LCh_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$LCh_LCh_$Impl_$.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx_color__$LCh_LCh_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$LCh_LCh_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$LCh_LCh_$Impl_$.complement = function(this1) {
	return thx_color__$LCh_LCh_$Impl_$.rotate(this1,180);
};
thx_color__$LCh_LCh_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolateAngle(t,this1[2],other[2],360)];
	return channels;
};
thx_color__$LCh_LCh_$Impl_$.interpolateWidest = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolateAngleWidest(t,this1[2],other[2],360)];
	return channels;
};
thx_color__$LCh_LCh_$Impl_$.min = function(this1,other) {
	var lightness = Math.min(this1[0],other[0]);
	var chroma = Math.min(this1[1],other[1]);
	var hue = Math.min(this1[2],other[2]);
	return [lightness,chroma,hue];
};
thx_color__$LCh_LCh_$Impl_$.max = function(this1,other) {
	var lightness = Math.max(this1[0],other[0]);
	var chroma = Math.max(this1[1],other[1]);
	var hue = Math.max(this1[2],other[2]);
	return [lightness,chroma,hue];
};
thx_color__$LCh_LCh_$Impl_$.normalize = function(this1) {
	var lightness = thx_Floats.clamp(this1[0],0,1);
	var chroma = thx_Floats.clamp(this1[1],0,1);
	var hue = thx_Floats.wrapCircular(this1[2],360);
	return [lightness,chroma,hue];
};
thx_color__$LCh_LCh_$Impl_$.rotate = function(this1,angle) {
	return thx_color__$LCh_LCh_$Impl_$.normalize(thx_color__$LCh_LCh_$Impl_$.withHue(this1,this1[2] + angle));
};
thx_color__$LCh_LCh_$Impl_$.roundTo = function(this1,decimals) {
	var lightness = thx_Floats.roundTo(this1[0],decimals);
	var chroma = thx_Floats.roundTo(this1[1],decimals);
	var hue = thx_Floats.roundTo(this1[2],decimals);
	return [lightness,chroma,hue];
};
thx_color__$LCh_LCh_$Impl_$.split = function(this1,spread) {
	if(spread == null) spread = 144.0;
	var _0 = thx_color__$LCh_LCh_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$LCh_LCh_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$LCh_LCh_$Impl_$.square = function(this1) {
	return thx_color__$LCh_LCh_$Impl_$.tetrad(this1,90);
};
thx_color__$LCh_LCh_$Impl_$.tetrad = function(this1,angle) {
	var _0 = thx_color__$LCh_LCh_$Impl_$.rotate(this1,0);
	var _1 = thx_color__$LCh_LCh_$Impl_$.rotate(this1,angle);
	var _2 = thx_color__$LCh_LCh_$Impl_$.rotate(this1,180);
	var _3 = thx_color__$LCh_LCh_$Impl_$.rotate(this1,180 + angle);
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx_color__$LCh_LCh_$Impl_$.triad = function(this1) {
	var _0 = thx_color__$LCh_LCh_$Impl_$.rotate(this1,-120);
	var _1 = thx_color__$LCh_LCh_$Impl_$.rotate(this1,0);
	var _2 = thx_color__$LCh_LCh_$Impl_$.rotate(this1,120);
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx_color__$LCh_LCh_$Impl_$.withLightness = function(this1,newlightness) {
	return [newlightness,this1[1],this1[2]];
};
thx_color__$LCh_LCh_$Impl_$.withChroma = function(this1,newchroma) {
	return [this1[0],newchroma,this1[2]];
};
thx_color__$LCh_LCh_$Impl_$.withHue = function(this1,newhue) {
	return [this1[0],this1[1],newhue];
};
thx_color__$LCh_LCh_$Impl_$.equals = function(this1,other) {
	return thx_color__$LCh_LCh_$Impl_$.nearEquals(this1,other);
};
thx_color__$LCh_LCh_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return Math.abs(thx_Floats.angleDifference(this1[0],other[0],360.0)) <= tolerance && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance);
};
thx_color__$LCh_LCh_$Impl_$.toString = function(this1) {
	return "lch(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx_color__$LCh_LCh_$Impl_$.toHclString = function(this1) {
	return "hcl(" + this1[2] + "," + this1[1] + "," + this1[0] + ")";
};
thx_color__$LCh_LCh_$Impl_$.toLab = function(this1) {
	var hradi = this1[2] * (Math.PI / 180);
	var a = Math.cos(hradi) * this1[1];
	var b = Math.sin(hradi) * this1[1];
	return [this1[0],a,b];
};
thx_color__$LCh_LCh_$Impl_$.toLuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toLuv(thx_color__$LCh_LCh_$Impl_$.toRgbx(this1));
};
thx_color__$LCh_LCh_$Impl_$.toCmy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmy(thx_color__$LCh_LCh_$Impl_$.toRgbx(this1));
};
thx_color__$LCh_LCh_$Impl_$.toCmyk = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmyk(thx_color__$LCh_LCh_$Impl_$.toRgbx(this1));
};
thx_color__$LCh_LCh_$Impl_$.toCubeHelix = function(this1) {
	var this2 = thx_color__$LCh_LCh_$Impl_$.toRgbx(this1);
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma(this2,1);
};
thx_color__$LCh_LCh_$Impl_$.toGrey = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toGrey(thx_color__$LCh_LCh_$Impl_$.toRgbx(this1));
};
thx_color__$LCh_LCh_$Impl_$.toHsl = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$LCh_LCh_$Impl_$.toRgbx(this1));
};
thx_color__$LCh_LCh_$Impl_$.toHsv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsv(thx_color__$LCh_LCh_$Impl_$.toRgbx(this1));
};
thx_color__$LCh_LCh_$Impl_$.toHunterLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHunterLab(thx_color__$LCh_LCh_$Impl_$.toXyz(this1));
};
thx_color__$LCh_LCh_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$LCh_LCh_$Impl_$.toRgbx(this1));
};
thx_color__$LCh_LCh_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$LCh_LCh_$Impl_$.toRgbxa(this1));
};
thx_color__$LCh_LCh_$Impl_$.toRgbx = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toRgbx(thx_color__$LCh_LCh_$Impl_$.toLab(this1));
};
thx_color__$LCh_LCh_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa(thx_color__$LCh_LCh_$Impl_$.toRgbx(this1));
};
thx_color__$LCh_LCh_$Impl_$.toTemperature = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature(thx_color__$LCh_LCh_$Impl_$.toRgbx(this1));
};
thx_color__$LCh_LCh_$Impl_$.toXyz = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toXyz(thx_color__$LCh_LCh_$Impl_$.toLab(this1));
};
thx_color__$LCh_LCh_$Impl_$.toYuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYuv(thx_color__$LCh_LCh_$Impl_$.toRgbx(this1));
};
thx_color__$LCh_LCh_$Impl_$.toYxy = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toYxy(thx_color__$LCh_LCh_$Impl_$.toLab(this1));
};
thx_color__$LCh_LCh_$Impl_$.get_lightness = function(this1) {
	return this1[0];
};
thx_color__$LCh_LCh_$Impl_$.get_chroma = function(this1) {
	return this1[1];
};
thx_color__$LCh_LCh_$Impl_$.get_hue = function(this1) {
	return this1[2];
};
var thx_color__$Lab_Lab_$Impl_$ = {};
thx_color__$Lab_Lab_$Impl_$.__name__ = ["thx","color","_Lab","Lab_Impl_"];
thx_color__$Lab_Lab_$Impl_$.create = function(l,a,b) {
	return [l,a,b];
};
thx_color__$Lab_Lab_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return [arr[0],arr[1],arr[2]];
};
thx_color__$Lab_Lab_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "lab":case "l*a*b*":case "cielab":
			return thx_color__$Lab_Lab_$Impl_$.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false));
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Lab_Lab_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$Lab_Lab_$Impl_$.distance = function(this1,other) {
	return (this1[0] - other[0]) * (this1[0] - other[0]) + (this1[1] - other[1]) * (this1[1] - other[1]) + (this1[2] - other[2]) * (this1[2] - other[2]);
};
thx_color__$Lab_Lab_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$Lab_Lab_$Impl_$.match = function(this1,palette) {
	var it = palette;
	if(null == it) throw new thx_error_NullArgument("Iterable argument \"this\" cannot be null",{ fileName : "NullArgument.hx", lineNumber : 73, className : "thx.color._Lab.Lab_Impl_", methodName : "match"}); else if(!$iterator(it)().hasNext()) throw new thx_error_NullArgument("Iterable argument \"this\" cannot be empty",{ fileName : "NullArgument.hx", lineNumber : 75, className : "thx.color._Lab.Lab_Impl_", methodName : "match"});
	var dist = Infinity;
	var closest = null;
	var $it0 = $iterator(palette)();
	while( $it0.hasNext() ) {
		var color = $it0.next();
		var ndist = thx_color__$Lab_Lab_$Impl_$.distance(this1,color);
		if(ndist < dist) {
			dist = ndist;
			closest = color;
		}
	}
	return closest;
};
thx_color__$Lab_Lab_$Impl_$.min = function(this1,other) {
	var l = Math.min(this1[0],other[0]);
	var a = Math.min(this1[1],other[1]);
	var b = Math.min(this1[2],other[2]);
	return [l,a,b];
};
thx_color__$Lab_Lab_$Impl_$.max = function(this1,other) {
	var l = Math.max(this1[0],other[0]);
	var a = Math.max(this1[1],other[1]);
	var b = Math.max(this1[2],other[2]);
	return [l,a,b];
};
thx_color__$Lab_Lab_$Impl_$.roundTo = function(this1,decimals) {
	var l = thx_Floats.roundTo(this1[0],decimals);
	var a = thx_Floats.roundTo(this1[1],decimals);
	var b = thx_Floats.roundTo(this1[2],decimals);
	return [l,a,b];
};
thx_color__$Lab_Lab_$Impl_$.equals = function(this1,other) {
	return thx_color__$Lab_Lab_$Impl_$.nearEquals(this1,other);
};
thx_color__$Lab_Lab_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return thx_Floats.nearEquals(this1[0],other[0],tolerance) && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance);
};
thx_color__$Lab_Lab_$Impl_$.withL = function(this1,newl) {
	return [newl,this1[1],this1[2]];
};
thx_color__$Lab_Lab_$Impl_$.withA = function(this1,newa) {
	return [this1[0],newa,this1[2]];
};
thx_color__$Lab_Lab_$Impl_$.withB = function(this1,newb) {
	return [this1[0],this1[1],newb];
};
thx_color__$Lab_Lab_$Impl_$.toString = function(this1) {
	return "lab(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx_color__$Lab_Lab_$Impl_$.toLCh = function(this1) {
	var h = Math.atan2(this1[2],this1[1]) * 180 / Math.PI;
	var c = Math.sqrt(this1[1] * this1[1] + this1[2] * this1[2]);
	return [this1[0],c,h];
};
thx_color__$Lab_Lab_$Impl_$.toLuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toLuv(thx_color__$Lab_Lab_$Impl_$.toRgbx(this1));
};
thx_color__$Lab_Lab_$Impl_$.toCmy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmy(thx_color__$Lab_Lab_$Impl_$.toRgbx(this1));
};
thx_color__$Lab_Lab_$Impl_$.toCmyk = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmyk(thx_color__$Lab_Lab_$Impl_$.toRgbx(this1));
};
thx_color__$Lab_Lab_$Impl_$.toCubeHelix = function(this1) {
	var this2 = thx_color__$Lab_Lab_$Impl_$.toRgbx(this1);
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma(this2,1);
};
thx_color__$Lab_Lab_$Impl_$.toGrey = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toGrey(thx_color__$Lab_Lab_$Impl_$.toRgbx(this1));
};
thx_color__$Lab_Lab_$Impl_$.toHsl = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$Lab_Lab_$Impl_$.toRgbx(this1));
};
thx_color__$Lab_Lab_$Impl_$.toHsv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsv(thx_color__$Lab_Lab_$Impl_$.toRgbx(this1));
};
thx_color__$Lab_Lab_$Impl_$.toHunterLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHunterLab(thx_color__$Lab_Lab_$Impl_$.toXyz(this1));
};
thx_color__$Lab_Lab_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$Lab_Lab_$Impl_$.toRgbx(this1));
};
thx_color__$Lab_Lab_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Lab_Lab_$Impl_$.toRgbxa(this1));
};
thx_color__$Lab_Lab_$Impl_$.toRgbx = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toRgbx(thx_color__$Lab_Lab_$Impl_$.toXyz(this1));
};
thx_color__$Lab_Lab_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa(thx_color__$Lab_Lab_$Impl_$.toRgbx(this1));
};
thx_color__$Lab_Lab_$Impl_$.toTemperature = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature(thx_color__$Lab_Lab_$Impl_$.toRgbx(this1));
};
thx_color__$Lab_Lab_$Impl_$.toXyz = function(this1) {
	var f = function(t) {
		if(t > 0.206896551724137928) return Math.pow(t,3); else return 0.128418549346016653 * (t - 0.137931034482758619);
	};
	var x = thx_color__$Xyz_Xyz_$Impl_$.whiteReference[0] * f(0.00862068965517241367 * (this1[0] + 16) + 0.002 * this1[1]);
	var y = thx_color__$Xyz_Xyz_$Impl_$.whiteReference[1] * f(0.00862068965517241367 * (this1[0] + 16));
	var z = thx_color__$Xyz_Xyz_$Impl_$.whiteReference[2] * f(0.00862068965517241367 * (this1[0] + 16) - 0.005 * this1[2]);
	return [x,y,z];
};
thx_color__$Lab_Lab_$Impl_$.toYuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYuv(thx_color__$Lab_Lab_$Impl_$.toRgbx(this1));
};
thx_color__$Lab_Lab_$Impl_$.toYxy = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toYxy(thx_color__$Lab_Lab_$Impl_$.toXyz(this1));
};
thx_color__$Lab_Lab_$Impl_$.get_l = function(this1) {
	return this1[0];
};
thx_color__$Lab_Lab_$Impl_$.get_a = function(this1) {
	return this1[1];
};
thx_color__$Lab_Lab_$Impl_$.get_b = function(this1) {
	return this1[2];
};
var thx_color__$Luv_Luv_$Impl_$ = {};
thx_color__$Luv_Luv_$Impl_$.__name__ = ["thx","color","_Luv","Luv_Impl_"];
thx_color__$Luv_Luv_$Impl_$.create = function(l,u,v) {
	return [l,u,v];
};
thx_color__$Luv_Luv_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return [arr[0],arr[1],arr[2]];
};
thx_color__$Luv_Luv_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "cieluv":case "luv":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Luv_Luv_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$Luv_Luv_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$Luv_Luv_$Impl_$.min = function(this1,other) {
	var l = Math.min(this1[0],other[0]);
	var u = Math.min(this1[1],other[1]);
	var v = Math.min(this1[2],other[2]);
	return [l,u,v];
};
thx_color__$Luv_Luv_$Impl_$.max = function(this1,other) {
	var l = Math.max(this1[0],other[0]);
	var u = Math.max(this1[1],other[1]);
	var v = Math.max(this1[2],other[2]);
	return [l,u,v];
};
thx_color__$Luv_Luv_$Impl_$.normalize = function(this1) {
	var l = thx_Floats.normalize(this1[0]);
	var u = thx_Floats.clamp(this1[1],-0.436,0.436);
	var v = thx_Floats.clamp(this1[2],-0.615,0.615);
	return [l,u,v];
};
thx_color__$Luv_Luv_$Impl_$.roundTo = function(this1,decimals) {
	var l = thx_Floats.roundTo(this1[0],decimals);
	var u = thx_Floats.roundTo(this1[1],decimals);
	var v = thx_Floats.roundTo(this1[2],decimals);
	return [l,u,v];
};
thx_color__$Luv_Luv_$Impl_$.withY = function(this1,newy) {
	return [newy,this1[1],this1[2]];
};
thx_color__$Luv_Luv_$Impl_$.withU = function(this1,newu) {
	return [this1[0],newu,this1[2]];
};
thx_color__$Luv_Luv_$Impl_$.withV = function(this1,newv) {
	return [this1[0],this1[1],newv];
};
thx_color__$Luv_Luv_$Impl_$.toString = function(this1) {
	return "cieluv(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx_color__$Luv_Luv_$Impl_$.equals = function(this1,other) {
	return thx_color__$Luv_Luv_$Impl_$.nearEquals(this1,other);
};
thx_color__$Luv_Luv_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return thx_Floats.nearEquals(this1[0],other[0],tolerance) && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance);
};
thx_color__$Luv_Luv_$Impl_$.toLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toLab(thx_color__$Luv_Luv_$Impl_$.toXyz(this1));
};
thx_color__$Luv_Luv_$Impl_$.toLCh = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toLCh(thx_color__$Luv_Luv_$Impl_$.toLab(this1));
};
thx_color__$Luv_Luv_$Impl_$.toCmy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmy(thx_color__$Luv_Luv_$Impl_$.toRgbx(this1));
};
thx_color__$Luv_Luv_$Impl_$.toCmyk = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmyk(thx_color__$Luv_Luv_$Impl_$.toRgbx(this1));
};
thx_color__$Luv_Luv_$Impl_$.toCubeHelix = function(this1) {
	var this2 = thx_color__$Luv_Luv_$Impl_$.toRgbx(this1);
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma(this2,1);
};
thx_color__$Luv_Luv_$Impl_$.toGrey = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toGrey(thx_color__$Luv_Luv_$Impl_$.toRgbx(this1));
};
thx_color__$Luv_Luv_$Impl_$.toHsl = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$Luv_Luv_$Impl_$.toRgbx(this1));
};
thx_color__$Luv_Luv_$Impl_$.toHsv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsv(thx_color__$Luv_Luv_$Impl_$.toRgbx(this1));
};
thx_color__$Luv_Luv_$Impl_$.toHunterLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHunterLab(thx_color__$Luv_Luv_$Impl_$.toXyz(this1));
};
thx_color__$Luv_Luv_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$Luv_Luv_$Impl_$.toRgbx(this1));
};
thx_color__$Luv_Luv_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Luv_Luv_$Impl_$.toRgbxa(this1));
};
thx_color__$Luv_Luv_$Impl_$.toRgbx = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toRgbx(thx_color__$Luv_Luv_$Impl_$.toXyz(this1));
};
thx_color__$Luv_Luv_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa(thx_color__$Luv_Luv_$Impl_$.toRgbx(this1));
};
thx_color__$Luv_Luv_$Impl_$.toTemperature = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature(thx_color__$Luv_Luv_$Impl_$.toRgbx(this1));
};
thx_color__$Luv_Luv_$Impl_$.toYxy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYxy(thx_color__$Luv_Luv_$Impl_$.toRgbx(this1));
};
thx_color__$Luv_Luv_$Impl_$.toXyz = function(this1) {
	var l = this1[0] * 100;
	var u = this1[1] * 100;
	var v = this1[2] * 100;
	var x = 9 * u / (9 * u - 16 * v + 12);
	var y = 4 * v / (9 * u - 16 * v + 12);
	var uPrime;
	uPrime = (l == 0?0:u / (13 * l)) + thx_color__$Xyz_Xyz_$Impl_$.get_u(thx_color__$Xyz_Xyz_$Impl_$.whiteReference) * 100;
	var vPrime;
	vPrime = (l == 0?0:v / (13 * l)) + thx_color__$Xyz_Xyz_$Impl_$.get_v(thx_color__$Xyz_Xyz_$Impl_$.whiteReference) * 100;
	var Y;
	if(l > 8) Y = thx_color__$Xyz_Xyz_$Impl_$.whiteReference[1] * 100 * Math.pow((l + 16) / 116,3); else Y = thx_color__$Xyz_Xyz_$Impl_$.whiteReference[1] * 100 * l * Math.pow(0.103448275862068964,3);
	var X = Y * 9 * uPrime / (4 * vPrime);
	var Z = Y * (12 - 3 * uPrime - 20 * vPrime) / (4 * vPrime);
	return [X / 100,Y / 100,Z / 100];
};
thx_color__$Luv_Luv_$Impl_$.get_l = function(this1) {
	return this1[0];
};
thx_color__$Luv_Luv_$Impl_$.get_u = function(this1) {
	return this1[1];
};
thx_color__$Luv_Luv_$Impl_$.get_v = function(this1) {
	return this1[2];
};
var thx_color__$Rgb_Rgb_$Impl_$ = {};
thx_color__$Rgb_Rgb_$Impl_$.__name__ = ["thx","color","_Rgb","Rgb_Impl_"];
thx_color__$Rgb_Rgb_$Impl_$.create = function(red,green,blue) {
	return (red & 255) << 16 | (green & 255) << 8 | blue & 255;
};
thx_color__$Rgb_Rgb_$Impl_$.createf = function(red,green,blue) {
	var red1 = Math.round(red * 255);
	var green1 = Math.round(green * 255);
	var blue1 = Math.round(blue * 255);
	return (red1 & 255) << 16 | (green1 & 255) << 8 | blue1 & 255;
};
thx_color__$Rgb_Rgb_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseHex(color);
	if(null == info) info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "rgb":
			return thx_color__$Rgb_Rgb_$Impl_$.fromInts(thx_color_parse_ColorParser.getInt8Channels(info.channels,3));
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Rgb_Rgb_$Impl_$.fromInts = function(arr) {
	thx_ArrayInts.resize(arr,3);
	return (arr[0] & 255) << 16 | (arr[1] & 255) << 8 | arr[2] & 255;
};
thx_color__$Rgb_Rgb_$Impl_$._new = function(rgb) {
	return rgb;
};
thx_color__$Rgb_Rgb_$Impl_$.darker = function(this1,t) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$Rgbx_Rgbx_$Impl_$.darker(thx_color__$Rgb_Rgb_$Impl_$.toRgbx(this1),t));
};
thx_color__$Rgb_Rgb_$Impl_$.lighter = function(this1,t) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$Rgbx_Rgbx_$Impl_$.lighter(thx_color__$Rgb_Rgb_$Impl_$.toRgbx(this1),t));
};
thx_color__$Rgb_Rgb_$Impl_$.interpolate = function(this1,other,t) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$Rgbx_Rgbx_$Impl_$.interpolate(thx_color__$Rgb_Rgb_$Impl_$.toRgbx(this1),thx_color__$Rgb_Rgb_$Impl_$.toRgbx(other),t));
};
thx_color__$Rgb_Rgb_$Impl_$.min = function(this1,other) {
	var red = thx_Ints.min(thx_color__$Rgb_Rgb_$Impl_$.get_red(this1),thx_color__$Rgb_Rgb_$Impl_$.get_red(other));
	var green = thx_Ints.min(thx_color__$Rgb_Rgb_$Impl_$.get_green(this1),thx_color__$Rgb_Rgb_$Impl_$.get_green(other));
	var blue = thx_Ints.min(thx_color__$Rgb_Rgb_$Impl_$.get_blue(this1),thx_color__$Rgb_Rgb_$Impl_$.get_blue(other));
	return (red & 255) << 16 | (green & 255) << 8 | blue & 255;
};
thx_color__$Rgb_Rgb_$Impl_$.max = function(this1,other) {
	var red = thx_Ints.max(thx_color__$Rgb_Rgb_$Impl_$.get_red(this1),thx_color__$Rgb_Rgb_$Impl_$.get_red(other));
	var green = thx_Ints.max(thx_color__$Rgb_Rgb_$Impl_$.get_green(this1),thx_color__$Rgb_Rgb_$Impl_$.get_green(other));
	var blue = thx_Ints.max(thx_color__$Rgb_Rgb_$Impl_$.get_blue(this1),thx_color__$Rgb_Rgb_$Impl_$.get_blue(other));
	return (red & 255) << 16 | (green & 255) << 8 | blue & 255;
};
thx_color__$Rgb_Rgb_$Impl_$.withAlpha = function(this1,alpha) {
	return thx_color__$Rgba_Rgba_$Impl_$.fromInts([thx_color__$Rgb_Rgb_$Impl_$.get_red(this1),thx_color__$Rgb_Rgb_$Impl_$.get_green(this1),thx_color__$Rgb_Rgb_$Impl_$.get_blue(this1),alpha]);
};
thx_color__$Rgb_Rgb_$Impl_$.withAlphaf = function(this1,newalpha) {
	return thx_color__$Rgba_Rgba_$Impl_$.fromInts([thx_color__$Rgb_Rgb_$Impl_$.get_red(this1),thx_color__$Rgb_Rgb_$Impl_$.get_green(this1),thx_color__$Rgb_Rgb_$Impl_$.get_blue(this1),Math.round(255 * newalpha)]);
};
thx_color__$Rgb_Rgb_$Impl_$.withRed = function(this1,newred) {
	return thx_color__$Rgb_Rgb_$Impl_$.fromInts([newred,thx_color__$Rgb_Rgb_$Impl_$.get_green(this1),thx_color__$Rgb_Rgb_$Impl_$.get_blue(this1)]);
};
thx_color__$Rgb_Rgb_$Impl_$.withGreen = function(this1,newgreen) {
	return thx_color__$Rgb_Rgb_$Impl_$.fromInts([thx_color__$Rgb_Rgb_$Impl_$.get_red(this1),newgreen,thx_color__$Rgb_Rgb_$Impl_$.get_blue(this1)]);
};
thx_color__$Rgb_Rgb_$Impl_$.withBlue = function(this1,newblue) {
	return thx_color__$Rgb_Rgb_$Impl_$.fromInts([thx_color__$Rgb_Rgb_$Impl_$.get_red(this1),thx_color__$Rgb_Rgb_$Impl_$.get_green(this1),newblue]);
};
thx_color__$Rgb_Rgb_$Impl_$.toCss3 = function(this1) {
	return "rgb(" + thx_color__$Rgb_Rgb_$Impl_$.get_red(this1) + "," + thx_color__$Rgb_Rgb_$Impl_$.get_green(this1) + "," + thx_color__$Rgb_Rgb_$Impl_$.get_blue(this1) + ")";
};
thx_color__$Rgb_Rgb_$Impl_$.toString = function(this1) {
	return thx_color__$Rgb_Rgb_$Impl_$.toHex(this1);
};
thx_color__$Rgb_Rgb_$Impl_$.toHex = function(this1,prefix) {
	if(prefix == null) prefix = "#";
	return "" + prefix + StringTools.hex(thx_color__$Rgb_Rgb_$Impl_$.get_red(this1),2) + StringTools.hex(thx_color__$Rgb_Rgb_$Impl_$.get_green(this1),2) + StringTools.hex(thx_color__$Rgb_Rgb_$Impl_$.get_blue(this1),2);
};
thx_color__$Rgb_Rgb_$Impl_$.equals = function(this1,other) {
	return thx_color__$Rgb_Rgb_$Impl_$.get_red(this1) == thx_color__$Rgb_Rgb_$Impl_$.get_red(other) && thx_color__$Rgb_Rgb_$Impl_$.get_green(this1) == thx_color__$Rgb_Rgb_$Impl_$.get_green(other) && thx_color__$Rgb_Rgb_$Impl_$.get_blue(this1) == thx_color__$Rgb_Rgb_$Impl_$.get_blue(other);
};
thx_color__$Rgb_Rgb_$Impl_$.toLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toLab(thx_color__$Rgb_Rgb_$Impl_$.toXyz(this1));
};
thx_color__$Rgb_Rgb_$Impl_$.toLCh = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toLCh(thx_color__$Rgb_Rgb_$Impl_$.toLab(this1));
};
thx_color__$Rgb_Rgb_$Impl_$.toLuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toLuv(thx_color__$Rgb_Rgb_$Impl_$.toRgbx(this1));
};
thx_color__$Rgb_Rgb_$Impl_$.toCmy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmy(thx_color__$Rgb_Rgb_$Impl_$.toRgbx(this1));
};
thx_color__$Rgb_Rgb_$Impl_$.toCmyk = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmyk(thx_color__$Rgb_Rgb_$Impl_$.toRgbx(this1));
};
thx_color__$Rgb_Rgb_$Impl_$.toCubeHelix = function(this1) {
	var this2 = thx_color__$Rgb_Rgb_$Impl_$.toRgbx(this1);
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma(this2,1);
};
thx_color__$Rgb_Rgb_$Impl_$.toGrey = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toGrey(thx_color__$Rgb_Rgb_$Impl_$.toRgbx(this1));
};
thx_color__$Rgb_Rgb_$Impl_$.toHsl = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$Rgb_Rgb_$Impl_$.toRgbx(this1));
};
thx_color__$Rgb_Rgb_$Impl_$.toHsv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsv(thx_color__$Rgb_Rgb_$Impl_$.toRgbx(this1));
};
thx_color__$Rgb_Rgb_$Impl_$.toHunterLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHunterLab(thx_color__$Rgb_Rgb_$Impl_$.toXyz(this1));
};
thx_color__$Rgb_Rgb_$Impl_$.toRgbx = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.fromInts([thx_color__$Rgb_Rgb_$Impl_$.get_red(this1),thx_color__$Rgb_Rgb_$Impl_$.get_green(this1),thx_color__$Rgb_Rgb_$Impl_$.get_blue(this1)]);
};
thx_color__$Rgb_Rgb_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgb_Rgb_$Impl_$.withAlpha(this1,255);
};
thx_color__$Rgb_Rgb_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgba_Rgba_$Impl_$.toRgbxa(thx_color__$Rgb_Rgb_$Impl_$.toRgba(this1));
};
thx_color__$Rgb_Rgb_$Impl_$.toTemperature = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature(thx_color__$Rgb_Rgb_$Impl_$.toRgbx(this1));
};
thx_color__$Rgb_Rgb_$Impl_$.toYuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYuv(thx_color__$Rgb_Rgb_$Impl_$.toRgbx(this1));
};
thx_color__$Rgb_Rgb_$Impl_$.toYxy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYxy(thx_color__$Rgb_Rgb_$Impl_$.toRgbx(this1));
};
thx_color__$Rgb_Rgb_$Impl_$.toXyz = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toXyz(thx_color__$Rgb_Rgb_$Impl_$.toRgbx(this1));
};
thx_color__$Rgb_Rgb_$Impl_$.get_red = function(this1) {
	return this1 >> 16 & 255;
};
thx_color__$Rgb_Rgb_$Impl_$.get_green = function(this1) {
	return this1 >> 8 & 255;
};
thx_color__$Rgb_Rgb_$Impl_$.get_blue = function(this1) {
	return this1 & 255;
};
var thx_color__$Rgba_Rgba_$Impl_$ = {};
thx_color__$Rgba_Rgba_$Impl_$.__name__ = ["thx","color","_Rgba","Rgba_Impl_"];
thx_color__$Rgba_Rgba_$Impl_$.create = function(red,green,blue,alpha) {
	return (red & 255) << 24 | (green & 255) << 16 | (blue & 255) << 8 | alpha & 255;
};
thx_color__$Rgba_Rgba_$Impl_$.fromFloats = function(arr) {
	var ints = thx_ArrayFloats.resize(arr,4).map(function(_) {
		return Math.round(_ * 255);
	});
	return (ints[0] & 255) << 24 | (ints[1] & 255) << 16 | (ints[2] & 255) << 8 | ints[3] & 255;
};
thx_color__$Rgba_Rgba_$Impl_$.fromInt = function(rgba) {
	return rgba;
};
thx_color__$Rgba_Rgba_$Impl_$.fromInts = function(arr) {
	thx_ArrayInts.resize(arr,4);
	return (arr[0] & 255) << 24 | (arr[1] & 255) << 16 | (arr[2] & 255) << 8 | arr[3] & 255;
};
thx_color__$Rgba_Rgba_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseHex(color);
	if(null == info) info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "rgb":
			return thx_color__$Rgb_Rgb_$Impl_$.toRgba(thx_color__$Rgb_Rgb_$Impl_$.fromInts(thx_color_parse_ColorParser.getInt8Channels(info.channels,3)));
		case "rgba":
			var red = thx_color_parse_ColorParser.getInt8Channel(info.channels[0]);
			var green = thx_color_parse_ColorParser.getInt8Channel(info.channels[1]);
			var blue = thx_color_parse_ColorParser.getInt8Channel(info.channels[2]);
			var alpha = Math.round(thx_color_parse_ColorParser.getFloatChannel(info.channels[3]) * 255);
			return (red & 255) << 24 | (green & 255) << 16 | (blue & 255) << 8 | alpha & 255;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Rgba_Rgba_$Impl_$._new = function(rgba) {
	return rgba;
};
thx_color__$Rgba_Rgba_$Impl_$.combineColor = function(this1,other) {
	var a = (this1 & 255) / 255;
	return thx_color__$Rgb_Rgb_$Impl_$.fromInts([Math.round((1 - a) * thx_color__$Rgb_Rgb_$Impl_$.get_red(other) + a * (this1 >> 24 & 255)),Math.round((1 - a) * thx_color__$Rgb_Rgb_$Impl_$.get_green(other) + a * (this1 >> 16 & 255)),Math.round((1 - a) * thx_color__$Rgb_Rgb_$Impl_$.get_blue(other) + a * (this1 >> 8 & 255))]);
};
thx_color__$Rgba_Rgba_$Impl_$.darker = function(this1,t) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Rgbxa_Rgbxa_$Impl_$.darker(thx_color__$Rgba_Rgba_$Impl_$.toRgbxa(this1),t));
};
thx_color__$Rgba_Rgba_$Impl_$.lighter = function(this1,t) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Rgbxa_Rgbxa_$Impl_$.lighter(thx_color__$Rgba_Rgba_$Impl_$.toRgbxa(this1),t));
};
thx_color__$Rgba_Rgba_$Impl_$.transparent = function(this1,t) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Rgbxa_Rgbxa_$Impl_$.transparent(thx_color__$Rgba_Rgba_$Impl_$.toRgbxa(this1),t));
};
thx_color__$Rgba_Rgba_$Impl_$.opaque = function(this1,t) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Rgbxa_Rgbxa_$Impl_$.opaque(thx_color__$Rgba_Rgba_$Impl_$.toRgbxa(this1),t));
};
thx_color__$Rgba_Rgba_$Impl_$.interpolate = function(this1,other,t) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Rgbxa_Rgbxa_$Impl_$.interpolate(thx_color__$Rgba_Rgba_$Impl_$.toRgbxa(this1),thx_color__$Rgba_Rgba_$Impl_$.toRgbxa(other),t));
};
thx_color__$Rgba_Rgba_$Impl_$.withAlpha = function(this1,newalpha) {
	return thx_color__$Rgba_Rgba_$Impl_$.fromInts([this1 >> 24 & 255,this1 >> 16 & 255,this1 >> 8 & 255,newalpha]);
};
thx_color__$Rgba_Rgba_$Impl_$.withAlphaf = function(this1,newalpha) {
	return thx_color__$Rgba_Rgba_$Impl_$.fromInts([this1 >> 24 & 255,this1 >> 16 & 255,this1 >> 8 & 255,Math.round(255 * newalpha)]);
};
thx_color__$Rgba_Rgba_$Impl_$.withRed = function(this1,newred) {
	return thx_color__$Rgba_Rgba_$Impl_$.fromInts([newred,this1 >> 16 & 255,this1 >> 8 & 255]);
};
thx_color__$Rgba_Rgba_$Impl_$.withGreen = function(this1,newgreen) {
	return thx_color__$Rgba_Rgba_$Impl_$.fromInts([this1 >> 24 & 255,newgreen,this1 >> 8 & 255]);
};
thx_color__$Rgba_Rgba_$Impl_$.withBlue = function(this1,newblue) {
	return thx_color__$Rgba_Rgba_$Impl_$.fromInts([this1 >> 24 & 255,this1 >> 16 & 255,newblue]);
};
thx_color__$Rgba_Rgba_$Impl_$.toHsla = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toHsla(thx_color__$Rgba_Rgba_$Impl_$.toRgbxa(this1));
};
thx_color__$Rgba_Rgba_$Impl_$.toHsva = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toHsva(thx_color__$Rgba_Rgba_$Impl_$.toRgbxa(this1));
};
thx_color__$Rgba_Rgba_$Impl_$.toRgb = function(this1) {
	return (this1 >> 24 & 255 & 255) << 16 | (this1 >> 16 & 255 & 255) << 8 | this1 >> 8 & 255 & 255;
};
thx_color__$Rgba_Rgba_$Impl_$.toRgbx = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.fromInts([this1 >> 24 & 255,this1 >> 16 & 255,this1 >> 8 & 255]);
};
thx_color__$Rgba_Rgba_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.fromInts([this1 >> 24 & 255,this1 >> 16 & 255,this1 >> 8 & 255,this1 & 255]);
};
thx_color__$Rgba_Rgba_$Impl_$.toCss3 = function(this1) {
	return "" + this1;
};
thx_color__$Rgba_Rgba_$Impl_$.toString = function(this1) {
	return "rgba(" + (this1 >> 24 & 255) + "," + (this1 >> 16 & 255) + "," + (this1 >> 8 & 255) + "," + (this1 & 255) / 255 + ")";
};
thx_color__$Rgba_Rgba_$Impl_$.toHex = function(this1,prefix) {
	if(prefix == null) prefix = "#";
	return "" + prefix + StringTools.hex(this1 & 255,2) + StringTools.hex(this1 >> 24 & 255,2) + StringTools.hex(this1 >> 16 & 255,2) + StringTools.hex(this1 >> 8 & 255,2);
};
thx_color__$Rgba_Rgba_$Impl_$.equals = function(this1,other) {
	return (this1 >> 24 & 255) == (other >> 24 & 255) && (this1 & 255) == (other & 255) && (this1 >> 16 & 255) == (other >> 16 & 255) && (this1 >> 8 & 255) == (other >> 8 & 255);
};
thx_color__$Rgba_Rgba_$Impl_$.get_alpha = function(this1) {
	return this1 & 255;
};
thx_color__$Rgba_Rgba_$Impl_$.get_red = function(this1) {
	return this1 >> 24 & 255;
};
thx_color__$Rgba_Rgba_$Impl_$.get_green = function(this1) {
	return this1 >> 16 & 255;
};
thx_color__$Rgba_Rgba_$Impl_$.get_blue = function(this1) {
	return this1 >> 8 & 255;
};
var thx_color__$Rgbx_Rgbx_$Impl_$ = {};
thx_color__$Rgbx_Rgbx_$Impl_$.__name__ = ["thx","color","_Rgbx","Rgbx_Impl_"];
thx_color__$Rgbx_Rgbx_$Impl_$.create = function(red,green,blue) {
	return [red,green,blue];
};
thx_color__$Rgbx_Rgbx_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return [arr[0],arr[1],arr[2]];
};
thx_color__$Rgbx_Rgbx_$Impl_$.fromInts = function(arr) {
	thx_ArrayInts.resize(arr,3);
	return [arr[0] / 255.0,arr[1] / 255.0,arr[2] / 255.0];
};
thx_color__$Rgbx_Rgbx_$Impl_$.fromInt = function(value) {
	var rgb = value;
	var red = thx_color__$Rgb_Rgb_$Impl_$.get_red(rgb) / 255;
	var green = thx_color__$Rgb_Rgb_$Impl_$.get_green(rgb) / 255;
	var blue = thx_color__$Rgb_Rgb_$Impl_$.get_blue(rgb) / 255;
	return [red,green,blue];
};
thx_color__$Rgbx_Rgbx_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseHex(color);
	if(null == info) info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "rgb":
			return thx_color__$Rgbx_Rgbx_$Impl_$.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,true));
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Rgbx_Rgbx_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$Rgbx_Rgbx_$Impl_$.darker = function(this1,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],0),thx_Floats.interpolate(t,this1[1],0),thx_Floats.interpolate(t,this1[2],0)];
	return channels;
};
thx_color__$Rgbx_Rgbx_$Impl_$.lighter = function(this1,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],1),thx_Floats.interpolate(t,this1[1],1),thx_Floats.interpolate(t,this1[2],1)];
	return channels;
};
thx_color__$Rgbx_Rgbx_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$Rgbx_Rgbx_$Impl_$.min = function(this1,other) {
	var red = Math.min(this1[0],other[0]);
	var green = Math.min(this1[1],other[1]);
	var blue = Math.min(this1[2],other[2]);
	return [red,green,blue];
};
thx_color__$Rgbx_Rgbx_$Impl_$.max = function(this1,other) {
	var red = Math.max(this1[0],other[0]);
	var green = Math.max(this1[1],other[1]);
	var blue = Math.max(this1[2],other[2]);
	return [red,green,blue];
};
thx_color__$Rgbx_Rgbx_$Impl_$.normalize = function(this1) {
	var channels = [thx_Floats.normalize(this1[0]),thx_Floats.normalize(this1[1]),thx_Floats.normalize(this1[2])];
	return channels;
};
thx_color__$Rgbx_Rgbx_$Impl_$.roundTo = function(this1,decimals) {
	var red = thx_Floats.roundTo(this1[0],decimals);
	var green = thx_Floats.roundTo(this1[1],decimals);
	var blue = thx_Floats.roundTo(this1[2],decimals);
	return [red,green,blue];
};
thx_color__$Rgbx_Rgbx_$Impl_$.toCss3 = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toString(this1);
};
thx_color__$Rgbx_Rgbx_$Impl_$.toString = function(this1) {
	return "rgb(" + this1[0] * 100 + "%," + this1[1] * 100 + "%," + this1[2] * 100 + "%)";
};
thx_color__$Rgbx_Rgbx_$Impl_$.toHex = function(this1,prefix) {
	if(prefix == null) prefix = "#";
	return "" + prefix + StringTools.hex(thx_color__$Rgbx_Rgbx_$Impl_$.get_red(this1),2) + StringTools.hex(thx_color__$Rgbx_Rgbx_$Impl_$.get_green(this1),2) + StringTools.hex(thx_color__$Rgbx_Rgbx_$Impl_$.get_blue(this1),2);
};
thx_color__$Rgbx_Rgbx_$Impl_$.equals = function(this1,other) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.nearEquals(this1,other);
};
thx_color__$Rgbx_Rgbx_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return thx_Floats.nearEquals(this1[0],other[0],tolerance) && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance);
};
thx_color__$Rgbx_Rgbx_$Impl_$.withAlpha = function(this1,alpha) {
	var channels = this1.concat([alpha]);
	return channels;
};
thx_color__$Rgbx_Rgbx_$Impl_$.withRed = function(this1,newred) {
	var channels = [newred,thx_color__$Rgbx_Rgbx_$Impl_$.get_green(this1),thx_color__$Rgbx_Rgbx_$Impl_$.get_blue(this1)];
	return channels;
};
thx_color__$Rgbx_Rgbx_$Impl_$.withGreen = function(this1,newgreen) {
	var channels = [thx_color__$Rgbx_Rgbx_$Impl_$.get_red(this1),newgreen,thx_color__$Rgbx_Rgbx_$Impl_$.get_blue(this1)];
	return channels;
};
thx_color__$Rgbx_Rgbx_$Impl_$.withBlue = function(this1,newblue) {
	var channels = [thx_color__$Rgbx_Rgbx_$Impl_$.get_red(this1),thx_color__$Rgbx_Rgbx_$Impl_$.get_green(this1),newblue];
	return channels;
};
thx_color__$Rgbx_Rgbx_$Impl_$.toLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toLab(thx_color__$Rgbx_Rgbx_$Impl_$.toXyz(this1));
};
thx_color__$Rgbx_Rgbx_$Impl_$.toLCh = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toLCh(thx_color__$Rgbx_Rgbx_$Impl_$.toLab(this1));
};
thx_color__$Rgbx_Rgbx_$Impl_$.toLuv = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toLuv(thx_color__$Rgbx_Rgbx_$Impl_$.toXyz(this1));
};
thx_color__$Rgbx_Rgbx_$Impl_$.toCmy = function(this1) {
	return [1 - this1[0],1 - this1[1],1 - this1[2]];
};
thx_color__$Rgbx_Rgbx_$Impl_$.toCmyk = function(this1) {
	var c = 0.0;
	var y = 0.0;
	var m = 0.0;
	var k;
	if(this1[0] + this1[1] + this1[2] == 0) k = 1.0; else {
		k = 1 - Math.max(Math.max(this1[0],this1[1]),this1[2]);
		c = (1 - this1[0] - k) / (1 - k);
		m = (1 - this1[1] - k) / (1 - k);
		y = (1 - this1[2] - k) / (1 - k);
	}
	return [c,m,y,k];
};
thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelix = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma(this1,1);
};
thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma = function(this1,gamma) {
	var l = (-0.655763666799999867 * this1[2] + -1.7884503806 * this1[0] - 3.5172982438 * this1[1]) / -5.9615122912;
	var bl = this1[2] - l;
	var k = (1.97294 * (this1[1] - l) - -0.29227 * bl) / -0.90649;
	var lgamma = Math.pow(l,gamma);
	var s;
	try {
		s = Math.sqrt(k * k + bl * bl) / (1.97294 * lgamma * (1 - lgamma));
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		s = 0.0;
	}
	var h;
	try {
		if(s != 0) h = Math.atan2(k,bl) / Math.PI * 180 - 120; else {
			h = NaN;
		}
	} catch( e1 ) {
		haxe_CallStack.lastException = e1;
		if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
		h = 0.0;
	}
	if(isNaN(s)) s = 0;
	if(isNaN(h)) h = 0;
	if(h < 0) h += 360;
	return [h,s,l,1];
};
thx_color__$Rgbx_Rgbx_$Impl_$.toGrey = function(this1) {
	return this1[0] * .2126 + this1[1] * .7152 + this1[2] * .0722;
};
thx_color__$Rgbx_Rgbx_$Impl_$.toPerceivedGrey = function(this1) {
	return this1[0] * .299 + this1[1] * .587 + this1[2] * .114;
};
thx_color__$Rgbx_Rgbx_$Impl_$.toPerceivedAccurateGrey = function(this1) {
	var grey = Math.pow(this1[0],2) * .241 + Math.pow(this1[1],2) * .691 + Math.pow(this1[2],2) * .068;
	return grey;
};
thx_color__$Rgbx_Rgbx_$Impl_$.toHsl = function(this1) {
	var min = Math.min(Math.min(this1[0],this1[1]),this1[2]);
	var max = Math.max(Math.max(this1[0],this1[1]),this1[2]);
	var delta = max - min;
	var h;
	var s;
	var l = (max + min) / 2;
	if(delta == 0.0) s = h = 0.0; else {
		if(l < 0.5) s = delta / (max + min); else s = delta / (2 - max - min);
		if(this1[0] == max) h = (this1[1] - this1[2]) / delta + (this1[1] < thx_color__$Rgbx_Rgbx_$Impl_$.get_blue(this1)?6:0); else if(this1[1] == max) h = (this1[2] - this1[0]) / delta + 2; else h = (this1[0] - this1[1]) / delta + 4;
		h *= 60;
	}
	return [h,s,l];
};
thx_color__$Rgbx_Rgbx_$Impl_$.toHsv = function(this1) {
	var min = Math.min(Math.min(this1[0],this1[1]),this1[2]);
	var max = Math.max(Math.max(this1[0],this1[1]),this1[2]);
	var delta = max - min;
	var h;
	var s;
	var v = max;
	if(delta != 0) s = delta / max; else {
		s = 0;
		h = -1;
		return [h,s,v];
	}
	if(this1[0] == max) h = (this1[1] - this1[2]) / delta; else if(this1[1] == max) h = 2 + (this1[2] - this1[0]) / delta; else h = 4 + (this1[0] - this1[1]) / delta;
	h *= 60;
	if(h < 0) h += 360;
	return [h,s,v];
};
thx_color__$Rgbx_Rgbx_$Impl_$.toHunterLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHunterLab(thx_color__$Rgbx_Rgbx_$Impl_$.toXyz(this1));
};
thx_color__$Rgbx_Rgbx_$Impl_$.toRgb = function(this1) {
	var red = Math.round(this1[0] * 255);
	var green = Math.round(this1[1] * 255);
	var blue = Math.round(this1[2] * 255);
	return (red & 255) << 16 | (green & 255) << 8 | blue & 255;
};
thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.withAlpha(this1,1.0);
};
thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature = function(this1) {
	var t = 0;
	var rgb;
	var epsilon = 0.4;
	var minT = 1000;
	var maxT = 40000;
	while(maxT - minT > epsilon) {
		t = (maxT + minT) / 2;
		rgb = thx_color__$Temperature_Temperature_$Impl_$.temperatureToRgbx(t);
		if(rgb[2] / rgb[0] >= this1[2] / this1[0]) maxT = t; else minT = t;
	}
	return t;
};
thx_color__$Rgbx_Rgbx_$Impl_$.toXyz = function(this1) {
	var r = this1[0];
	var g = this1[1];
	var b = this1[2];
	if(r > 0.04045) r = Math.pow((r + 0.055) / 1.055,2.4); else r = r / 12.92;
	if(g > 0.04045) g = Math.pow((g + 0.055) / 1.055,2.4); else g = g / 12.92;
	if(b > 0.04045) b = Math.pow((b + 0.055) / 1.055,2.4); else b = b / 12.92;
	return [r * 0.4124564 + g * 0.3575761 + b * 0.1804375,r * 0.2126729 + g * 0.7151522 + b * 0.0721750,r * 0.0193339 + g * 0.1191920 + b * 0.9503041];
};
thx_color__$Rgbx_Rgbx_$Impl_$.toYuv = function(this1) {
	var r = this1[0];
	var g = this1[1];
	var b = this1[2];
	var y = 0.299 * r + 0.587 * g + 0.114 * b;
	var u = -0.14713 * r - 0.28886 * g + 0.436 * b;
	var v = 0.615 * r - 0.51499 * g - 0.10001 * b;
	return [y,u,v];
};
thx_color__$Rgbx_Rgbx_$Impl_$.toYxy = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toYxy(thx_color__$Rgbx_Rgbx_$Impl_$.toXyz(this1));
};
thx_color__$Rgbx_Rgbx_$Impl_$.get_red = function(this1) {
	return Math.round(this1[0] * 255);
};
thx_color__$Rgbx_Rgbx_$Impl_$.get_green = function(this1) {
	return Math.round(this1[1] * 255);
};
thx_color__$Rgbx_Rgbx_$Impl_$.get_blue = function(this1) {
	return Math.round(this1[2] * 255);
};
thx_color__$Rgbx_Rgbx_$Impl_$.get_redf = function(this1) {
	return this1[0];
};
thx_color__$Rgbx_Rgbx_$Impl_$.get_greenf = function(this1) {
	return this1[1];
};
thx_color__$Rgbx_Rgbx_$Impl_$.get_bluef = function(this1) {
	return this1[2];
};
thx_color__$Rgbx_Rgbx_$Impl_$.get_inSpace = function(this1) {
	return this1[0] >= 0 && this1[0] <= 1 && this1[1] >= 0 && this1[1] <= 1 && this1[2] >= 0 && this1[2] <= 1;
};
var thx_color__$Rgbxa_Rgbxa_$Impl_$ = {};
thx_color__$Rgbxa_Rgbxa_$Impl_$.__name__ = ["thx","color","_Rgbxa","Rgbxa_Impl_"];
thx_color__$Rgbxa_Rgbxa_$Impl_$.create = function(red,green,blue,alpha) {
	return [red,green,blue,alpha];
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,4);
	return [arr[0],arr[1],arr[2],arr[3]];
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.fromInts = function(arr) {
	thx_ArrayInts.resize(arr,4);
	return [arr[0] / 255.0,arr[1] / 255.0,arr[2] / 255.0,arr[3] / 255.0];
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.fromInt = function(value) {
	var rgba = value;
	return [(rgba >> 24 & 255) / 255,(rgba >> 16 & 255) / 255,(rgba >> 8 & 255) / 255,(rgba & 255) / 255];
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseHex(color);
	if(null == info) info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "rgb":
			return thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa(thx_color__$Rgbx_Rgbx_$Impl_$.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,true)));
		case "rgba":
			return thx_color__$Rgbxa_Rgbxa_$Impl_$.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,4,true));
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Rgbxa_Rgbxa_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.combineColor = function(this1,other) {
	return [(1 - this1[3]) * other[0] + this1[3] * this1[0],(1 - this1[3]) * other[1] + this1[3] * this1[1],(1 - this1[3]) * other[2] + this1[3] * this1[2]];
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.darker = function(this1,t) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.withAlpha(thx_color__$Rgbx_Rgbx_$Impl_$.darker(thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgbx(this1),t),thx_color__$Rgbxa_Rgbxa_$Impl_$.get_alpha(this1));
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.lighter = function(this1,t) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.withAlpha(thx_color__$Rgbx_Rgbx_$Impl_$.lighter(thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgbx(this1),t),thx_color__$Rgbxa_Rgbxa_$Impl_$.get_alpha(this1));
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.transparent = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Ints.interpolate(t,this1[3],0)];
	return channels;
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.opaque = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Ints.interpolate(t,this1[3],1)];
	return channels;
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Ints.interpolate(t,this1[0],other[0]),thx_Ints.interpolate(t,this1[1],other[1]),thx_Ints.interpolate(t,this1[2],other[2]),thx_Ints.interpolate(t,this1[3],other[3])];
	return channels;
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.normalize = function(this1) {
	var channels = [thx_Floats.normalize(this1[0]),thx_Floats.normalize(this1[1]),thx_Floats.normalize(this1[2]),thx_Floats.normalize(this1[3])];
	return channels;
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.roundTo = function(this1,decimals) {
	var red = thx_Floats.roundTo(this1[0],decimals);
	var green = thx_Floats.roundTo(this1[1],decimals);
	var blue = thx_Floats.roundTo(this1[2],decimals);
	var alpha = thx_Floats.roundTo(this1[3],decimals);
	return [red,green,blue,alpha];
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.withAlpha = function(this1,newalpha) {
	var channels = [thx_color__$Rgbxa_Rgbxa_$Impl_$.get_red(this1),thx_color__$Rgbxa_Rgbxa_$Impl_$.get_green(this1),thx_color__$Rgbxa_Rgbxa_$Impl_$.get_blue(this1),newalpha];
	return channels;
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.withRed = function(this1,newred) {
	var channels = [newred,thx_color__$Rgbxa_Rgbxa_$Impl_$.get_green(this1),thx_color__$Rgbxa_Rgbxa_$Impl_$.get_blue(this1),thx_color__$Rgbxa_Rgbxa_$Impl_$.get_alpha(this1)];
	return channels;
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.withGreen = function(this1,newgreen) {
	var channels = [thx_color__$Rgbxa_Rgbxa_$Impl_$.get_red(this1),newgreen,thx_color__$Rgbxa_Rgbxa_$Impl_$.get_blue(this1),thx_color__$Rgbxa_Rgbxa_$Impl_$.get_alpha(this1)];
	return channels;
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.withBlue = function(this1,newblue) {
	var channels = [thx_color__$Rgbxa_Rgbxa_$Impl_$.get_red(this1),thx_color__$Rgbxa_Rgbxa_$Impl_$.get_green(this1),newblue,thx_color__$Rgbxa_Rgbxa_$Impl_$.get_alpha(this1)];
	return channels;
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.toCss3 = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toString(this1);
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.toString = function(this1) {
	return "rgba(" + this1[0] * 100 + "%," + this1[1] * 100 + "%," + this1[2] * 100 + "%," + this1[3] + ")";
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.toHex = function(this1,prefix) {
	if(prefix == null) prefix = "#";
	return "" + prefix + StringTools.hex(thx_color__$Rgbxa_Rgbxa_$Impl_$.get_alpha(this1),2) + StringTools.hex(thx_color__$Rgbxa_Rgbxa_$Impl_$.get_red(this1),2) + StringTools.hex(thx_color__$Rgbxa_Rgbxa_$Impl_$.get_green(this1),2) + StringTools.hex(thx_color__$Rgbxa_Rgbxa_$Impl_$.get_blue(this1),2);
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.equals = function(this1,other) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.nearEquals(this1,other);
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return thx_Floats.nearEquals(this1[0],other[0],tolerance) && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance) && thx_Floats.nearEquals(this1[3],other[3],tolerance);
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.toHsla = function(this1) {
	return thx_color__$Hsl_Hsl_$Impl_$.withAlpha(thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgbx(this1)),thx_color__$Rgbxa_Rgbxa_$Impl_$.get_alpha(this1));
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.toHsva = function(this1) {
	return thx_color__$Hsv_Hsv_$Impl_$.withAlpha(thx_color__$Rgbx_Rgbx_$Impl_$.toHsv(thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgbx(this1)),thx_color__$Rgbxa_Rgbxa_$Impl_$.get_alpha(this1));
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgbx(this1));
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgbx = function(this1) {
	var channels = this1.slice(0,3);
	return channels;
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgba_Rgba_$Impl_$.fromFloats([this1[0],this1[1],this1[2],this1[3]]);
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.get_red = function(this1) {
	return Math.round(this1[0] * 255);
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.get_green = function(this1) {
	return Math.round(this1[1] * 255);
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.get_blue = function(this1) {
	return Math.round(this1[2] * 255);
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.get_alpha = function(this1) {
	return Math.round(this1[3] * 255);
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.get_redf = function(this1) {
	return this1[0];
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.get_greenf = function(this1) {
	return this1[1];
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.get_bluef = function(this1) {
	return this1[2];
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.get_alphaf = function(this1) {
	return this1[3];
};
thx_color__$Rgbxa_Rgbxa_$Impl_$.get_inSpace = function(this1) {
	return this1[0] >= 0 && this1[0] <= 1 && this1[1] >= 0 && this1[1] <= 1 && this1[2] >= 0 && this1[2] <= 1 && this1[3] >= 0 && this1[3] <= 1;
};
var thx_color__$Temperature_Temperature_$Impl_$ = {};
thx_color__$Temperature_Temperature_$Impl_$.__name__ = ["thx","color","_Temperature","Temperature_Impl_"];
thx_color__$Temperature_Temperature_$Impl_$.temperatureToRgbx = function(kelvin) {
	var t = kelvin / 100.0;
	var r;
	var g;
	var b;
	if(t < 66.0) r = 1; else {
		r = t - 55.0;
		r = (351.97690566805693 + 0.114206453784165 * r - 40.25366309332127 * Math.log(r)) / 255;
		if(r < 0) r = 0;
		if(r > 1) r = 1;
	}
	if(t < 66.0) {
		g = t - 2;
		g = (-155.254855627091786 - 0.44596950469579133 * g + 104.49216199393888 * Math.log(g)) / 255;
		if(g < 0) g = 0;
		if(g > 1) g = 1;
	} else {
		g = t - 50;
		g = (325.4494125711974 + 0.07943456536662342 * g - 28.0852963507957 * Math.log(g)) / 255;
		if(g < 0) g = 0;
		if(g > 1) g = 1;
	}
	if(t >= 66.0) b = 1; else if(t <= 20.0) b = 0; else {
		b = t - 10;
		b = (-254.769351841209016 + 0.8274096064007395 * b + 115.67994401066147 * Math.log(b)) / 255;
		if(b < 0) b = 0;
		if(b > 1) b = 1;
	}
	return [r,g,b];
};
thx_color__$Temperature_Temperature_$Impl_$.create = function(v) {
	return v;
};
thx_color__$Temperature_Temperature_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "temperature":
			var kelvin = thx_color_parse_ColorParser.getFloatChannels(info.channels,1,false)[0];
			return kelvin;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Temperature_Temperature_$Impl_$._new = function(kelvin) {
	return kelvin;
};
thx_color__$Temperature_Temperature_$Impl_$.interpolate = function(this1,other,t) {
	var kelvin = thx_Floats.interpolate(t,this1,other);
	return kelvin;
};
thx_color__$Temperature_Temperature_$Impl_$.min = function(this1,other) {
	var v = Math.min(this1,other);
	return v;
};
thx_color__$Temperature_Temperature_$Impl_$.max = function(this1,other) {
	var v = Math.max(this1,other);
	return v;
};
thx_color__$Temperature_Temperature_$Impl_$.roundTo = function(this1,decimals) {
	var v = thx_Floats.roundTo(this1,decimals);
	return v;
};
thx_color__$Temperature_Temperature_$Impl_$.toString = function(this1) {
	return "temperature(" + this1 + ")";
};
thx_color__$Temperature_Temperature_$Impl_$.equals = function(this1,other) {
	return thx_Floats.nearEquals(this1,other);
};
thx_color__$Temperature_Temperature_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return thx_Floats.nearEquals(this1,other,tolerance);
};
thx_color__$Temperature_Temperature_$Impl_$.get_kelvin = function(this1) {
	return this1;
};
thx_color__$Temperature_Temperature_$Impl_$.toLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toLab(thx_color__$Temperature_Temperature_$Impl_$.toXyz(this1));
};
thx_color__$Temperature_Temperature_$Impl_$.toLCh = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toLCh(thx_color__$Temperature_Temperature_$Impl_$.toLab(this1));
};
thx_color__$Temperature_Temperature_$Impl_$.toLuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toLuv(thx_color__$Temperature_Temperature_$Impl_$.toRgbx(this1));
};
thx_color__$Temperature_Temperature_$Impl_$.toCmy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmy(thx_color__$Temperature_Temperature_$Impl_$.toRgbx(this1));
};
thx_color__$Temperature_Temperature_$Impl_$.toCmyk = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmyk(thx_color__$Temperature_Temperature_$Impl_$.toRgbx(this1));
};
thx_color__$Temperature_Temperature_$Impl_$.toCubeHelix = function(this1) {
	var this2 = thx_color__$Temperature_Temperature_$Impl_$.toRgbx(this1);
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma(this2,1);
};
thx_color__$Temperature_Temperature_$Impl_$.toHsl = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$Temperature_Temperature_$Impl_$.toRgbx(this1));
};
thx_color__$Temperature_Temperature_$Impl_$.toHsv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsv(thx_color__$Temperature_Temperature_$Impl_$.toRgbx(this1));
};
thx_color__$Temperature_Temperature_$Impl_$.toHunterLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHunterLab(thx_color__$Temperature_Temperature_$Impl_$.toXyz(this1));
};
thx_color__$Temperature_Temperature_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$Temperature_Temperature_$Impl_$.toRgbx(this1));
};
thx_color__$Temperature_Temperature_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Temperature_Temperature_$Impl_$.toRgbxa(this1));
};
thx_color__$Temperature_Temperature_$Impl_$.toRgbxTannerHelland = function(this1) {
	var t = this1 / 100;
	var r;
	var g;
	var b;
	if(t <= 66) r = 1; else {
		r = t - 60;
		r = 329.698727446 * Math.pow(r,-0.1332047592) / 1;
		if(r < 0) r = 0;
		if(r > 1) r = 1;
	}
	if(t <= 66.0) {
		g = t;
		g = (99.4708025861 * Math.log(g) - 161.1195681661) / 1;
		if(g < 0) g = 0;
		if(g > 1) g = 1;
	} else {
		g = t - 60.0;
		g = 288.1221695283 * Math.pow(g,-0.0755148492) / 1;
		if(g < 0) g = 0;
		if(g > 1) g = 1;
	}
	if(t >= 66.0) b = 1; else if(t <= 19.0) b = 0; else {
		b = t - 10;
		b = (138.5177312231 * Math.log(b) - 305.0447927307) / 1;
		if(b < 0) b = 0;
		if(b > 1) b = 1;
	}
	return [r,g,b];
};
thx_color__$Temperature_Temperature_$Impl_$.toRgbx = function(this1) {
	return thx_color__$Temperature_Temperature_$Impl_$.temperatureToRgbx(this1);
};
thx_color__$Temperature_Temperature_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa(thx_color__$Temperature_Temperature_$Impl_$.toRgbx(this1));
};
thx_color__$Temperature_Temperature_$Impl_$.toYuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYuv(thx_color__$Temperature_Temperature_$Impl_$.toRgbx(this1));
};
thx_color__$Temperature_Temperature_$Impl_$.toXyz = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toXyz(thx_color__$Temperature_Temperature_$Impl_$.toRgbx(this1));
};
thx_color__$Temperature_Temperature_$Impl_$.toYxy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYxy(thx_color__$Temperature_Temperature_$Impl_$.toRgbx(this1));
};
var thx_color__$Xyz_Xyz_$Impl_$ = {};
thx_color__$Xyz_Xyz_$Impl_$.__name__ = ["thx","color","_Xyz","Xyz_Impl_"];
thx_color__$Xyz_Xyz_$Impl_$.create = function(x,y,z) {
	return [x,y,z];
};
thx_color__$Xyz_Xyz_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return [arr[0],arr[1],arr[2]];
};
thx_color__$Xyz_Xyz_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "ciexyz":case "xyz":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Xyz_Xyz_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$Xyz_Xyz_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$Xyz_Xyz_$Impl_$.min = function(this1,other) {
	var x = Math.min(this1[0],other[0]);
	var y = Math.min(this1[1],other[1]);
	var z = Math.min(this1[2],other[2]);
	return [x,y,z];
};
thx_color__$Xyz_Xyz_$Impl_$.max = function(this1,other) {
	var x = Math.max(this1[0],other[0]);
	var y = Math.max(this1[1],other[1]);
	var z = Math.max(this1[2],other[2]);
	return [x,y,z];
};
thx_color__$Xyz_Xyz_$Impl_$.roundTo = function(this1,decimals) {
	var x = thx_Floats.roundTo(this1[0],decimals);
	var y = thx_Floats.roundTo(this1[1],decimals);
	var z = thx_Floats.roundTo(this1[2],decimals);
	return [x,y,z];
};
thx_color__$Xyz_Xyz_$Impl_$.withX = function(this1,newx) {
	return [newx,this1[1],this1[2]];
};
thx_color__$Xyz_Xyz_$Impl_$.withY = function(this1,newy) {
	return [this1[0],newy,this1[2]];
};
thx_color__$Xyz_Xyz_$Impl_$.withZ = function(this1,newz) {
	return [this1[0],this1[1],newz];
};
thx_color__$Xyz_Xyz_$Impl_$.toString = function(this1) {
	return "xyz(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx_color__$Xyz_Xyz_$Impl_$.equals = function(this1,other) {
	return thx_color__$Xyz_Xyz_$Impl_$.nearEquals(this1,other);
};
thx_color__$Xyz_Xyz_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return thx_Floats.nearEquals(this1[0],other[0],tolerance) && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance);
};
thx_color__$Xyz_Xyz_$Impl_$.toLab = function(this1) {
	var f = function(t) {
		if(t > 0.0088564516790356311) return Math.pow(t,0.333333333333333315); else return 7.78703703703703543 * t + 0.137931034482758619;
	};
	var x1 = this1[0] / thx_color__$Xyz_Xyz_$Impl_$.whiteReference[0];
	var y1 = this1[1] / thx_color__$Xyz_Xyz_$Impl_$.whiteReference[1];
	var z1 = this1[2] / thx_color__$Xyz_Xyz_$Impl_$.whiteReference[2];
	var fy1 = f(y1);
	var l = 116 * fy1 - 16;
	var a = 500 * (f(x1) - fy1);
	var b = 200 * (fy1 - f(z1));
	return [l,a,b];
};
thx_color__$Xyz_Xyz_$Impl_$.toLCh = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toLCh(thx_color__$Xyz_Xyz_$Impl_$.toLab(this1));
};
thx_color__$Xyz_Xyz_$Impl_$.toLuv = function(this1) {
	var x = this1[0] * 100;
	var y = this1[1] * 100;
	var z = this1[2] * 100;
	var f = y / (thx_color__$Xyz_Xyz_$Impl_$.whiteReference[1] * 100);
	var r = Math.pow(0.206896551724137928,3);
	var l;
	if(f > r) l = 116 * Math.pow(f,0.333333333333333315) - 16; else l = Math.pow(9.66666666666666607,3) * f;
	var u = 13 * l * (thx_color__$Xyz_Xyz_$Impl_$.get_u(this1) - thx_color__$Xyz_Xyz_$Impl_$.get_u(thx_color__$Xyz_Xyz_$Impl_$.whiteReference) * 100);
	var v = 13 * l * (thx_color__$Xyz_Xyz_$Impl_$.get_v(this1) - thx_color__$Xyz_Xyz_$Impl_$.get_v(thx_color__$Xyz_Xyz_$Impl_$.whiteReference) * 100);
	return [l / 100,u / 100,v / 100];
};
thx_color__$Xyz_Xyz_$Impl_$.toCmy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmy(thx_color__$Xyz_Xyz_$Impl_$.toRgbx(this1));
};
thx_color__$Xyz_Xyz_$Impl_$.toCmyk = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmyk(thx_color__$Xyz_Xyz_$Impl_$.toRgbx(this1));
};
thx_color__$Xyz_Xyz_$Impl_$.toCubeHelix = function(this1) {
	var this2 = thx_color__$Xyz_Xyz_$Impl_$.toRgbx(this1);
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma(this2,1);
};
thx_color__$Xyz_Xyz_$Impl_$.toGrey = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toGrey(thx_color__$Xyz_Xyz_$Impl_$.toRgbx(this1));
};
thx_color__$Xyz_Xyz_$Impl_$.toHsl = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$Xyz_Xyz_$Impl_$.toRgbx(this1));
};
thx_color__$Xyz_Xyz_$Impl_$.toHsv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsv(thx_color__$Xyz_Xyz_$Impl_$.toRgbx(this1));
};
thx_color__$Xyz_Xyz_$Impl_$.toHunterLab = function(this1) {
	var l = 10.0 * Math.sqrt(this1[1]);
	var a;
	if(this1[1] != 0) a = 17.5 * ((1.02 * this1[0] - this1[1]) / Math.sqrt(this1[1])); else a = 0;
	var b;
	if(this1[1] != 0) b = 7.0 * ((this1[1] - .847 * this1[2]) / Math.sqrt(this1[1])); else b = 0;
	return [l,a,b];
};
thx_color__$Xyz_Xyz_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$Xyz_Xyz_$Impl_$.toRgbx(this1));
};
thx_color__$Xyz_Xyz_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Xyz_Xyz_$Impl_$.toRgbxa(this1));
};
thx_color__$Xyz_Xyz_$Impl_$.toRgbx = function(this1) {
	var x = this1[0];
	var y = this1[1];
	var z = this1[2];
	var r = x * 3.2406 + y * -1.5372 + z * -0.4986;
	var g = x * -0.9689 + y * 1.8758 + z * 0.0415;
	var b = x * 0.0557 + y * -0.204 + z * 1.0570;
	if(r > 0.0031308) r = 1.055 * Math.pow(r,0.416666666666666685) - 0.055; else r = 12.92 * r;
	if(g > 0.0031308) g = 1.055 * Math.pow(g,0.416666666666666685) - 0.055; else g = 12.92 * g;
	if(b > 0.0031308) b = 1.055 * Math.pow(b,0.416666666666666685) - 0.055; else b = 12.92 * b;
	return [r,g,b];
};
thx_color__$Xyz_Xyz_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa(thx_color__$Xyz_Xyz_$Impl_$.toRgbx(this1));
};
thx_color__$Xyz_Xyz_$Impl_$.toTemperature = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature(thx_color__$Xyz_Xyz_$Impl_$.toRgbx(this1));
};
thx_color__$Xyz_Xyz_$Impl_$.toYuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYuv(thx_color__$Xyz_Xyz_$Impl_$.toRgbx(this1));
};
thx_color__$Xyz_Xyz_$Impl_$.toYxy = function(this1) {
	var sum = this1[0] + this1[1] + this1[2];
	return [this1[1],sum == 0?1:this1[0] / sum,sum == 0?1:this1[1] / sum];
};
thx_color__$Xyz_Xyz_$Impl_$.get_x = function(this1) {
	return this1[0];
};
thx_color__$Xyz_Xyz_$Impl_$.get_y = function(this1) {
	return this1[1];
};
thx_color__$Xyz_Xyz_$Impl_$.get_z = function(this1) {
	return this1[2];
};
thx_color__$Xyz_Xyz_$Impl_$.get_u = function(this1) {
	try {
		return 4 * this1[0] / (this1[0] + 15 * this1[1] + 3 * this1[2]);
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return 0;
	}
};
thx_color__$Xyz_Xyz_$Impl_$.get_v = function(this1) {
	try {
		return 9 * this1[1] / (this1[0] + 15 * this1[1] + 3 * this1[2]);
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return 0;
	}
};
var thx_color__$Yuv_Yuv_$Impl_$ = {};
thx_color__$Yuv_Yuv_$Impl_$.__name__ = ["thx","color","_Yuv","Yuv_Impl_"];
thx_color__$Yuv_Yuv_$Impl_$.create = function(y,u,v) {
	return [y,u,v];
};
thx_color__$Yuv_Yuv_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return [arr[0],arr[1],arr[2]];
};
thx_color__$Yuv_Yuv_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "yuv":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Yuv_Yuv_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$Yuv_Yuv_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$Yuv_Yuv_$Impl_$.min = function(this1,other) {
	var y = Math.min(this1[0],other[0]);
	var u = Math.min(this1[1],other[1]);
	var v = Math.min(this1[2],other[2]);
	return [y,u,v];
};
thx_color__$Yuv_Yuv_$Impl_$.max = function(this1,other) {
	var y = Math.max(this1[0],other[0]);
	var u = Math.max(this1[1],other[1]);
	var v = Math.max(this1[2],other[2]);
	return [y,u,v];
};
thx_color__$Yuv_Yuv_$Impl_$.normalize = function(this1) {
	var y = thx_Floats.normalize(this1[0]);
	var u = thx_Floats.clamp(this1[1],-0.436,0.436);
	var v = thx_Floats.clamp(this1[2],-0.615,0.615);
	return [y,u,v];
};
thx_color__$Yuv_Yuv_$Impl_$.roundTo = function(this1,decimals) {
	var y = thx_Floats.roundTo(this1[0],decimals);
	var u = thx_Floats.roundTo(this1[1],decimals);
	var v = thx_Floats.roundTo(this1[2],decimals);
	return [y,u,v];
};
thx_color__$Yuv_Yuv_$Impl_$.withY = function(this1,newy) {
	return [newy,this1[1],this1[2]];
};
thx_color__$Yuv_Yuv_$Impl_$.withU = function(this1,newu) {
	return [this1[0],newu,this1[2]];
};
thx_color__$Yuv_Yuv_$Impl_$.withV = function(this1,newv) {
	return [this1[0],this1[1],newv];
};
thx_color__$Yuv_Yuv_$Impl_$.toString = function(this1) {
	return "yuv(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx_color__$Yuv_Yuv_$Impl_$.equals = function(this1,other) {
	return thx_color__$Yuv_Yuv_$Impl_$.nearEquals(this1,other);
};
thx_color__$Yuv_Yuv_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return thx_Floats.nearEquals(this1[0],other[0],tolerance) && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance);
};
thx_color__$Yuv_Yuv_$Impl_$.toLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toLab(thx_color__$Yuv_Yuv_$Impl_$.toXyz(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.toLCh = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toLCh(thx_color__$Yuv_Yuv_$Impl_$.toLab(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.toLuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toLuv(thx_color__$Yuv_Yuv_$Impl_$.toRgbx(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.toCmy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmy(thx_color__$Yuv_Yuv_$Impl_$.toRgbx(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.toCmyk = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCmyk(thx_color__$Yuv_Yuv_$Impl_$.toRgbx(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.toCubeHelix = function(this1) {
	var this2 = thx_color__$Yuv_Yuv_$Impl_$.toRgbx(this1);
	return thx_color__$Rgbx_Rgbx_$Impl_$.toCubeHelixWithGamma(this2,1);
};
thx_color__$Yuv_Yuv_$Impl_$.toGrey = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toGrey(thx_color__$Yuv_Yuv_$Impl_$.toRgbx(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.toHsl = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$Yuv_Yuv_$Impl_$.toRgbx(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.toHsv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsv(thx_color__$Yuv_Yuv_$Impl_$.toRgbx(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.toHunterLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHunterLab(thx_color__$Yuv_Yuv_$Impl_$.toXyz(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.toRgb = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgb(thx_color__$Yuv_Yuv_$Impl_$.toRgbx(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Yuv_Yuv_$Impl_$.toRgbxa(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.toRgbx = function(this1) {
	var r = this1[0] + 1.139837398373983740 * this1[2];
	var g = this1[0] - 0.3946517043589703515 * this1[1] - 0.5805986066674976801 * this1[2];
	var b = this1[0] + 2.032110091743119266 * this1[1];
	return [r,g,b];
};
thx_color__$Yuv_Yuv_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toRgbxa(thx_color__$Yuv_Yuv_$Impl_$.toRgbx(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.toTemperature = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature(thx_color__$Yuv_Yuv_$Impl_$.toRgbx(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.toYxy = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYxy(thx_color__$Yuv_Yuv_$Impl_$.toRgbx(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.toXyz = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toXyz(thx_color__$Yuv_Yuv_$Impl_$.toRgbx(this1));
};
thx_color__$Yuv_Yuv_$Impl_$.get_y = function(this1) {
	return this1[0];
};
thx_color__$Yuv_Yuv_$Impl_$.get_u = function(this1) {
	return this1[1];
};
thx_color__$Yuv_Yuv_$Impl_$.get_v = function(this1) {
	return this1[2];
};
var thx_color__$Yxy_Yxy_$Impl_$ = {};
thx_color__$Yxy_Yxy_$Impl_$.__name__ = ["thx","color","_Yxy","Yxy_Impl_"];
thx_color__$Yxy_Yxy_$Impl_$.create = function(y1,x,y2) {
	return [y1,x,y2];
};
thx_color__$Yxy_Yxy_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return [arr[0],arr[1],arr[2]];
};
thx_color__$Yxy_Yxy_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "yxy":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Yxy_Yxy_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$Yxy_Yxy_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$Yxy_Yxy_$Impl_$.min = function(this1,other) {
	var y1 = Math.min(this1[0],other[0]);
	var x = Math.min(this1[1],other[1]);
	var y2 = Math.min(this1[2],other[2]);
	return [y1,x,y2];
};
thx_color__$Yxy_Yxy_$Impl_$.max = function(this1,other) {
	var y1 = Math.max(this1[0],other[0]);
	var x = Math.max(this1[1],other[1]);
	var y2 = Math.max(this1[2],other[2]);
	return [y1,x,y2];
};
thx_color__$Yxy_Yxy_$Impl_$.roundTo = function(this1,decimals) {
	var y1 = thx_Floats.roundTo(this1[0],decimals);
	var x = thx_Floats.roundTo(this1[1],decimals);
	var y2 = thx_Floats.roundTo(this1[2],decimals);
	return [y1,x,y2];
};
thx_color__$Yxy_Yxy_$Impl_$.withY1 = function(this1,newy1) {
	return [newy1,this1[1],this1[2]];
};
thx_color__$Yxy_Yxy_$Impl_$.withY = function(this1,newx) {
	return [this1[0],newx,this1[2]];
};
thx_color__$Yxy_Yxy_$Impl_$.withZ = function(this1,newy2) {
	return [this1[0],this1[1],newy2];
};
thx_color__$Yxy_Yxy_$Impl_$.toString = function(this1) {
	return "yxy(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx_color__$Yxy_Yxy_$Impl_$.equals = function(this1,other) {
	return thx_color__$Yxy_Yxy_$Impl_$.nearEquals(this1,other);
};
thx_color__$Yxy_Yxy_$Impl_$.nearEquals = function(this1,other,tolerance) {
	if(tolerance == null) tolerance = 1e-9;
	return thx_Floats.nearEquals(this1[0],other[0],tolerance) && thx_Floats.nearEquals(this1[1],other[1],tolerance) && thx_Floats.nearEquals(this1[2],other[2],tolerance);
};
thx_color__$Yxy_Yxy_$Impl_$.toLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toLab(thx_color__$Yxy_Yxy_$Impl_$.toXyz(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toLCh = function(this1) {
	return thx_color__$Lab_Lab_$Impl_$.toLCh(thx_color__$Yxy_Yxy_$Impl_$.toLab(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toLuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toLuv(thx_color__$Yxy_Yxy_$Impl_$.toRgbx(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toCmy = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toCmy(thx_color__$Yxy_Yxy_$Impl_$.toXyz(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toCmyk = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toCmyk(thx_color__$Yxy_Yxy_$Impl_$.toXyz(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toCubeHelix = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toCubeHelix(thx_color__$Yxy_Yxy_$Impl_$.toXyz(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toGrey = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toGrey(thx_color__$Yxy_Yxy_$Impl_$.toXyz(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toHsl = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toHsl(thx_color__$Yxy_Yxy_$Impl_$.toRgbx(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toHsv = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHsv(thx_color__$Yxy_Yxy_$Impl_$.toXyz(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toHunterLab = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toHunterLab(thx_color__$Yxy_Yxy_$Impl_$.toXyz(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toRgb = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toRgb(thx_color__$Yxy_Yxy_$Impl_$.toXyz(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toRgba = function(this1) {
	return thx_color__$Rgbxa_Rgbxa_$Impl_$.toRgba(thx_color__$Yxy_Yxy_$Impl_$.toRgbxa(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toRgbx = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toRgbx(thx_color__$Yxy_Yxy_$Impl_$.toXyz(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toRgbxa = function(this1) {
	return thx_color__$Xyz_Xyz_$Impl_$.toRgbxa(thx_color__$Yxy_Yxy_$Impl_$.toXyz(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toTemperature = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toTemperature(thx_color__$Yxy_Yxy_$Impl_$.toRgbx(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toYuv = function(this1) {
	return thx_color__$Rgbx_Rgbx_$Impl_$.toYuv(thx_color__$Yxy_Yxy_$Impl_$.toRgbx(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toXyz = function(this1) {
	return [this1[1] * (this1[0] / this1[2]),this1[0],(1 - this1[1] - this1[2]) * (this1[0] / this1[2])];
};
thx_color__$Yxy_Yxy_$Impl_$.get_y1 = function(this1) {
	return this1[0];
};
thx_color__$Yxy_Yxy_$Impl_$.get_x = function(this1) {
	return this1[1];
};
thx_color__$Yxy_Yxy_$Impl_$.get_y2 = function(this1) {
	return this1[2];
};
var thx_color_parse_ColorParser = function() {
	this.pattern_color = new EReg("^\\s*([^(]+)\\s*\\(([^)]*)\\)\\s*$","i");
	this.pattern_channel = new EReg("^\\s*(-?\\d*.\\d+|-?\\d+)(%|deg|rad)?\\s*$","i");
};
thx_color_parse_ColorParser.__name__ = ["thx","color","parse","ColorParser"];
thx_color_parse_ColorParser.parseColor = function(s) {
	return thx_color_parse_ColorParser.parser.processColor(s);
};
thx_color_parse_ColorParser.parseHex = function(s) {
	return thx_color_parse_ColorParser.parser.processHex(s);
};
thx_color_parse_ColorParser.parseChannel = function(s) {
	return thx_color_parse_ColorParser.parser.processChannel(s);
};
thx_color_parse_ColorParser.getFloatChannels = function(channels,length,useInt8) {
	if(length != channels.length) throw new js__$Boot_HaxeError("invalid number of channels, expected " + length + " but it is " + channels.length);
	return channels.map((function(f,a2) {
		return function(a1) {
			return f(a1,a2);
		};
	})(thx_color_parse_ColorParser.getFloatChannel,useInt8));
};
thx_color_parse_ColorParser.getInt8Channels = function(channels,length) {
	if(length != channels.length) throw new js__$Boot_HaxeError("invalid number of channels, expected " + length + " but it is " + channels.length);
	return channels.map(thx_color_parse_ColorParser.getInt8Channel);
};
thx_color_parse_ColorParser.getFloatChannel = function(channel,useInt8) {
	if(useInt8 == null) useInt8 = true;
	switch(channel[1]) {
	case 5:
		var v = channel[2];
		if(v) return 1; else return 0;
		break;
	case 1:
		var v1 = channel[2];
		return v1;
	case 4:
		var v2 = channel[2];
		return v2;
	case 2:
		var v3 = channel[2];
		return v3;
	case 3:
		var v4 = channel[2];
		if(useInt8) return v4 / 255; else {
			var v5 = channel[2];
			return v5;
		}
		break;
	case 0:
		var v6 = channel[2];
		return v6 / 100;
	}
};
thx_color_parse_ColorParser.getInt8Channel = function(channel) {
	switch(channel[1]) {
	case 5:
		var v = channel[2];
		if(v) return 1; else return 0;
		break;
	case 3:
		var v1 = channel[2];
		return v1;
	case 0:
		var v2 = channel[2];
		return Math.round(255 * v2 / 100);
	default:
		throw new js__$Boot_HaxeError("unable to extract a valid int8 value");
	}
};
thx_color_parse_ColorParser.prototype = {
	pattern_color: null
	,pattern_channel: null
	,processHex: function(s) {
		if(!thx_color_parse_ColorParser.isPureHex.match(s)) {
			if(HxOverrides.substr(s,0,1) == "#") {
				if(s.length == 4) s = s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2) + s.charAt(3) + s.charAt(3); else if(s.length == 5) s = s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2) + s.charAt(3) + s.charAt(3) + s.charAt(4) + s.charAt(4); else s = HxOverrides.substr(s,1,null);
			} else if(HxOverrides.substr(s,0,2) == "0x") s = HxOverrides.substr(s,2,null); else return null;
		}
		var channels = [];
		while(s.length > 0) {
			channels.push(thx_color_parse_ChannelInfo.CIInt8(Std.parseInt("0x" + HxOverrides.substr(s,0,2))));
			s = HxOverrides.substr(s,2,null);
		}
		if(channels.length == 4) return new thx_color_parse_ColorInfo("rgba",channels.slice(1).concat([channels[0]])); else return new thx_color_parse_ColorInfo("rgb",channels);
	}
	,processColor: function(s) {
		if(!this.pattern_color.match(s)) return null;
		var name = this.pattern_color.matched(1);
		if(null == name) return null;
		name = name.toLowerCase();
		var m2 = this.pattern_color.matched(2);
		var s_channels;
		if(null == m2) s_channels = []; else s_channels = m2.split(",");
		var channels = [];
		var channel;
		var _g = 0;
		while(_g < s_channels.length) {
			var s_channel = s_channels[_g];
			++_g;
			channel = this.processChannel(s_channel);
			if(null == channel) return null;
			channels.push(channel);
		}
		return new thx_color_parse_ColorInfo(name,channels);
	}
	,processChannel: function(s) {
		if(!this.pattern_channel.match(s)) return null;
		var value = this.pattern_channel.matched(1);
		var unit = this.pattern_channel.matched(2);
		if(unit == null) unit = "";
		try {
			switch(unit) {
			case "%":
				if(thx_Floats.canParse(value)) return thx_color_parse_ChannelInfo.CIPercent(thx_Floats.parse(value)); else return null;
				break;
			case "deg":
				if(thx_Floats.canParse(value)) return thx_color_parse_ChannelInfo.CIDegree(thx_Floats.parse(value)); else return null;
				break;
			case "DEG":
				if(thx_Floats.canParse(value)) return thx_color_parse_ChannelInfo.CIDegree(thx_Floats.parse(value)); else return null;
				break;
			case "rad":
				if(thx_Floats.canParse(value)) return thx_color_parse_ChannelInfo.CIDegree(thx_Floats.parse(value) * 180 / Math.PI); else return null;
				break;
			case "RAD":
				if(thx_Floats.canParse(value)) return thx_color_parse_ChannelInfo.CIDegree(thx_Floats.parse(value) * 180 / Math.PI); else return null;
				break;
			case "":
				if(value == "" + thx_Ints.parse(value)) {
					var i = thx_Ints.parse(value);
					if(i == 0) return thx_color_parse_ChannelInfo.CIBool(false); else if(i == 1) return thx_color_parse_ChannelInfo.CIBool(true); else if(i < 256) return thx_color_parse_ChannelInfo.CIInt8(i); else return thx_color_parse_ChannelInfo.CIInt(i);
				} else if(thx_Floats.canParse(value)) return thx_color_parse_ChannelInfo.CIFloat(thx_Floats.parse(value)); else return null;
				break;
			default:
				return null;
			}
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return null;
		}
	}
	,__class__: thx_color_parse_ColorParser
};
var thx_color_parse_ColorInfo = function(name,channels) {
	this.name = name;
	this.channels = channels;
};
thx_color_parse_ColorInfo.__name__ = ["thx","color","parse","ColorInfo"];
thx_color_parse_ColorInfo.prototype = {
	name: null
	,channels: null
	,toString: function() {
		return "" + this.name + ", channels: " + Std.string(this.channels);
	}
	,__class__: thx_color_parse_ColorInfo
};
var thx_color_parse_ChannelInfo = { __ename__ : ["thx","color","parse","ChannelInfo"], __constructs__ : ["CIPercent","CIFloat","CIDegree","CIInt8","CIInt","CIBool"] };
thx_color_parse_ChannelInfo.CIPercent = function(value) { var $x = ["CIPercent",0,value]; $x.__enum__ = thx_color_parse_ChannelInfo; $x.toString = $estr; return $x; };
thx_color_parse_ChannelInfo.CIFloat = function(value) { var $x = ["CIFloat",1,value]; $x.__enum__ = thx_color_parse_ChannelInfo; $x.toString = $estr; return $x; };
thx_color_parse_ChannelInfo.CIDegree = function(value) { var $x = ["CIDegree",2,value]; $x.__enum__ = thx_color_parse_ChannelInfo; $x.toString = $estr; return $x; };
thx_color_parse_ChannelInfo.CIInt8 = function(value) { var $x = ["CIInt8",3,value]; $x.__enum__ = thx_color_parse_ChannelInfo; $x.toString = $estr; return $x; };
thx_color_parse_ChannelInfo.CIInt = function(value) { var $x = ["CIInt",4,value]; $x.__enum__ = thx_color_parse_ChannelInfo; $x.toString = $estr; return $x; };
thx_color_parse_ChannelInfo.CIBool = function(value) { var $x = ["CIBool",5,value]; $x.__enum__ = thx_color_parse_ChannelInfo; $x.toString = $estr; return $x; };
var thx_error_ErrorWrapper = function(message,innerError,stack,pos) {
	thx_Error.call(this,message,stack,pos);
	this.innerError = innerError;
};
thx_error_ErrorWrapper.__name__ = ["thx","error","ErrorWrapper"];
thx_error_ErrorWrapper.__super__ = thx_Error;
thx_error_ErrorWrapper.prototype = $extend(thx_Error.prototype,{
	innerError: null
	,__class__: thx_error_ErrorWrapper
});
var thx_error_NullArgument = function(message,posInfo) {
	thx_Error.call(this,message,null,posInfo);
};
thx_error_NullArgument.__name__ = ["thx","error","NullArgument"];
thx_error_NullArgument.__super__ = thx_Error;
thx_error_NullArgument.prototype = $extend(thx_Error.prototype,{
	__class__: thx_error_NullArgument
});
var thx_fp__$Map_Map_$Impl_$ = {};
thx_fp__$Map_Map_$Impl_$.__name__ = ["thx","fp","_Map","Map_Impl_"];
thx_fp__$Map_Map_$Impl_$.empty = function() {
	return thx_fp_MapImpl.Tip;
};
thx_fp__$Map_Map_$Impl_$.singleton = function(k,v) {
	return thx_fp_MapImpl.Bin(1,k,v,thx_fp_MapImpl.Tip,thx_fp_MapImpl.Tip);
};
thx_fp__$Map_Map_$Impl_$.bin = function(k,v,lhs,rhs) {
	return thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(lhs) + thx_fp__$Map_Map_$Impl_$.size(rhs) + 1,k,v,lhs,rhs);
};
thx_fp__$Map_Map_$Impl_$.fromNative = function(map,comparator) {
	var r = thx_fp_MapImpl.Tip;
	var $it0 = map.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		r = thx_fp__$Map_Map_$Impl_$.insert(r,key,map.get(key),comparator);
	}
	return r;
};
thx_fp__$Map_Map_$Impl_$.lookup = function(this1,key,comparator) {
	switch(this1[1]) {
	case 0:
		return haxe_ds_Option.None;
	case 1:
		var rhs = this1[6];
		var lhs = this1[5];
		var xvalue = this1[4];
		var xkey = this1[3];
		var size = this1[2];
		var c = comparator(key,xkey);
		switch(c[1]) {
		case 0:
			return thx_fp__$Map_Map_$Impl_$.lookup(lhs,key,comparator);
		case 1:
			return thx_fp__$Map_Map_$Impl_$.lookup(rhs,key,comparator);
		case 2:
			return haxe_ds_Option.Some(xvalue);
		}
		break;
	}
};
thx_fp__$Map_Map_$Impl_$.lookupTuple = function(this1,key,comparator) {
	switch(this1[1]) {
	case 0:
		return haxe_ds_Option.None;
	case 1:
		var rhs = this1[6];
		var lhs = this1[5];
		var xvalue = this1[4];
		var xkey = this1[3];
		var size = this1[2];
		var c = comparator(key,xkey);
		switch(c[1]) {
		case 0:
			return thx_fp__$Map_Map_$Impl_$.lookupTuple(lhs,key,comparator);
		case 1:
			return thx_fp__$Map_Map_$Impl_$.lookupTuple(rhs,key,comparator);
		case 2:
			return haxe_ds_Option.Some({ _0 : xkey, _1 : xvalue});
		}
		break;
	}
};
thx_fp__$Map_Map_$Impl_$["delete"] = function(this1,key,comparator) {
	switch(this1[1]) {
	case 0:
		return thx_fp_MapImpl.Tip;
	case 1:
		var rhs = this1[6];
		var lhs = this1[5];
		var x = this1[4];
		var kx = this1[3];
		var size = this1[2];
		var _g = comparator(key,kx);
		switch(_g[1]) {
		case 0:
			return thx_fp__$Map_Map_$Impl_$.balance(kx,x,thx_fp__$Map_Map_$Impl_$["delete"](lhs,key,comparator),rhs);
		case 1:
			return thx_fp__$Map_Map_$Impl_$.balance(kx,x,lhs,thx_fp__$Map_Map_$Impl_$["delete"](rhs,key,comparator));
		case 2:
			return thx_fp__$Map_Map_$Impl_$.glue(lhs,rhs);
		}
		break;
	}
};
thx_fp__$Map_Map_$Impl_$.insert = function(this1,kx,x,comparator) {
	switch(this1[1]) {
	case 0:
		return thx_fp_MapImpl.Bin(1,kx,x,thx_fp_MapImpl.Tip,thx_fp_MapImpl.Tip);
	case 1:
		var rhs = this1[6];
		var lhs = this1[5];
		var y = this1[4];
		var ky = this1[3];
		var sz = this1[2];
		var _g = comparator(kx,ky);
		switch(_g[1]) {
		case 0:
			return thx_fp__$Map_Map_$Impl_$.balance(ky,y,thx_fp__$Map_Map_$Impl_$.insert(lhs,kx,x,comparator),rhs);
		case 1:
			return thx_fp__$Map_Map_$Impl_$.balance(ky,y,lhs,thx_fp__$Map_Map_$Impl_$.insert(rhs,kx,x,comparator));
		case 2:
			return thx_fp_MapImpl.Bin(sz,kx,x,lhs,rhs);
		}
		break;
	}
};
thx_fp__$Map_Map_$Impl_$.foldLeft = function(this1,b,f) {
	switch(this1[1]) {
	case 0:
		return b;
	case 1:
		var r = this1[6];
		var l = this1[5];
		var x = this1[4];
		return thx_fp__$Map_Map_$Impl_$.foldLeft(r,thx_fp__$Map_Map_$Impl_$.foldLeft(l,f(b,x),f),f);
	}
};
thx_fp__$Map_Map_$Impl_$.map = function(this1,f) {
	switch(this1[1]) {
	case 0:
		return thx_fp_MapImpl.Tip;
	case 1:
		var rhs = this1[6];
		var lhs = this1[5];
		var y = this1[4];
		var ky = this1[3];
		var sz = this1[2];
		return thx_fp_MapImpl.Bin(sz,ky,f(y),thx_fp__$Map_Map_$Impl_$.map(lhs,f),thx_fp__$Map_Map_$Impl_$.map(rhs,f));
	}
};
thx_fp__$Map_Map_$Impl_$.values = function(this1) {
	return thx_fp__$Map_Map_$Impl_$.foldLeft(this1,[],function(acc,v) {
		acc.push(v);
		return acc;
	});
};
thx_fp__$Map_Map_$Impl_$.foldLeftKeys = function(this1,b,f) {
	switch(this1[1]) {
	case 0:
		return b;
	case 1:
		var r = this1[6];
		var l = this1[5];
		var kx = this1[3];
		return thx_fp__$Map_Map_$Impl_$.foldLeftKeys(r,thx_fp__$Map_Map_$Impl_$.foldLeftKeys(l,f(b,kx),f),f);
	}
};
thx_fp__$Map_Map_$Impl_$.foldLeftAll = function(this1,b,f) {
	switch(this1[1]) {
	case 0:
		return b;
	case 1:
		var r = this1[6];
		var l = this1[5];
		var x = this1[4];
		var kx = this1[3];
		return thx_fp__$Map_Map_$Impl_$.foldLeftAll(r,thx_fp__$Map_Map_$Impl_$.foldLeftAll(l,f(b,kx,x),f),f);
	}
};
thx_fp__$Map_Map_$Impl_$.foldLeftTuples = function(this1,b,f) {
	switch(this1[1]) {
	case 0:
		return b;
	case 1:
		var r = this1[6];
		var l = this1[5];
		var x = this1[4];
		var kx = this1[3];
		return thx_fp__$Map_Map_$Impl_$.foldLeftTuples(r,thx_fp__$Map_Map_$Impl_$.foldLeftTuples(l,f(b,{ _0 : kx, _1 : x}),f),f);
	}
};
thx_fp__$Map_Map_$Impl_$.size = function(this1) {
	switch(this1[1]) {
	case 0:
		return 0;
	case 1:
		var size = this1[2];
		return size;
	}
};
thx_fp__$Map_Map_$Impl_$.balance = function(k,x,lhs,rhs) {
	var ls = thx_fp__$Map_Map_$Impl_$.size(lhs);
	var rs = thx_fp__$Map_Map_$Impl_$.size(rhs);
	var xs = ls + rs + 1;
	if(ls + rs <= 1) return thx_fp_MapImpl.Bin(xs,k,x,lhs,rhs); else if(rs >= 5 * ls) return thx_fp__$Map_Map_$Impl_$.rotateLeft(k,x,lhs,rhs); else if(ls >= 5 * rs) return thx_fp__$Map_Map_$Impl_$.rotateRight(k,x,lhs,rhs); else return thx_fp_MapImpl.Bin(xs,k,x,lhs,rhs);
};
thx_fp__$Map_Map_$Impl_$.glue = function(this1,that) {
	{
		var l = this1;
		var l1 = this1;
		switch(this1[1]) {
		case 0:
			return that;
		default:
			var r = that;
			var r1 = that;
			switch(that[1]) {
			case 0:
				return this1;
			default:
				if(thx_fp__$Map_Map_$Impl_$.size(l) > thx_fp__$Map_Map_$Impl_$.size(r)) {
					var t = thx_fp__$Map_Map_$Impl_$.deleteFindMax(l);
					return thx_fp__$Map_Map_$Impl_$.balance(t.k,t.x,t.t,r);
				} else {
					var t1 = thx_fp__$Map_Map_$Impl_$.deleteFindMin(r1);
					return thx_fp__$Map_Map_$Impl_$.balance(t1.k,t1.x,l1,t1.t);
				}
			}
		}
	}
};
thx_fp__$Map_Map_$Impl_$.deleteFindMin = function(map) {
	switch(map[1]) {
	case 1:
		var l = map[5];
		switch(map[5][1]) {
		case 0:
			var r = map[6];
			var x = map[4];
			var k = map[3];
			return { k : k, x : x, t : r};
		default:
			var r1 = map[6];
			var x1 = map[4];
			var k1 = map[3];
			var t = thx_fp__$Map_Map_$Impl_$.deleteFindMin(l);
			return { k : t.k, x : t.x, t : thx_fp__$Map_Map_$Impl_$.balance(k1,x1,t.t,r1)};
		}
		break;
	case 0:
		throw new thx_Error("can not return the minimal element of an empty map",null,{ fileName : "Map.hx", lineNumber : 161, className : "thx.fp._Map.Map_Impl_", methodName : "deleteFindMin"});
		break;
	}
};
thx_fp__$Map_Map_$Impl_$.deleteFindMax = function(map) {
	switch(map[1]) {
	case 1:
		var r = map[6];
		switch(map[6][1]) {
		case 0:
			var l = map[5];
			var x = map[4];
			var k = map[3];
			return { k : k, x : x, t : l};
		default:
			var l1 = map[5];
			var x1 = map[4];
			var k1 = map[3];
			var t = thx_fp__$Map_Map_$Impl_$.deleteFindMax(r);
			return { k : t.k, x : t.x, t : thx_fp__$Map_Map_$Impl_$.balance(k1,x1,l1,t.t)};
		}
		break;
	case 0:
		throw new thx_Error("can not return the maximal element of an empty map",null,{ fileName : "Map.hx", lineNumber : 171, className : "thx.fp._Map.Map_Impl_", methodName : "deleteFindMax"});
		break;
	}
};
thx_fp__$Map_Map_$Impl_$.rotateLeft = function(k,x,lhs,rhs) {
	switch(rhs[1]) {
	case 1:
		var ry = rhs[6];
		var ly = rhs[5];
		if(thx_fp__$Map_Map_$Impl_$.size(ly) < 2 * thx_fp__$Map_Map_$Impl_$.size(ry)) return thx_fp__$Map_Map_$Impl_$.singleLeft(k,x,lhs,rhs); else return thx_fp__$Map_Map_$Impl_$.doubleLeft(k,x,lhs,rhs);
		break;
	default:
		return thx_fp__$Map_Map_$Impl_$.doubleLeft(k,x,lhs,rhs);
	}
};
thx_fp__$Map_Map_$Impl_$.rotateRight = function(k,x,lhs,rhs) {
	switch(lhs[1]) {
	case 1:
		var ry = lhs[6];
		var ly = lhs[5];
		if(thx_fp__$Map_Map_$Impl_$.size(ry) < 2 * thx_fp__$Map_Map_$Impl_$.size(ly)) return thx_fp__$Map_Map_$Impl_$.singleRight(k,x,lhs,rhs); else return thx_fp__$Map_Map_$Impl_$.doubleRight(k,x,lhs,rhs);
		break;
	default:
		return thx_fp__$Map_Map_$Impl_$.doubleRight(k,x,lhs,rhs);
	}
};
thx_fp__$Map_Map_$Impl_$.singleLeft = function(k1,x1,t1,rhs) {
	switch(rhs[1]) {
	case 1:
		var t3 = rhs[6];
		var t2 = rhs[5];
		var x2 = rhs[4];
		var k2 = rhs[3];
		var lhs = thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(t1) + thx_fp__$Map_Map_$Impl_$.size(t2) + 1,k1,x1,t1,t2);
		return thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(lhs) + thx_fp__$Map_Map_$Impl_$.size(t3) + 1,k2,x2,lhs,t3);
	default:
		throw new thx_Error("damn it, this should never happen",null,{ fileName : "Map.hx", lineNumber : 193, className : "thx.fp._Map.Map_Impl_", methodName : "singleLeft"});
	}
};
thx_fp__$Map_Map_$Impl_$.singleRight = function(k1,x1,lhs,t3) {
	switch(lhs[1]) {
	case 1:
		var t2 = lhs[6];
		var t1 = lhs[5];
		var x2 = lhs[4];
		var k2 = lhs[3];
		var rhs = thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(t2) + thx_fp__$Map_Map_$Impl_$.size(t3) + 1,k1,x1,t2,t3);
		return thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(t1) + thx_fp__$Map_Map_$Impl_$.size(rhs) + 1,k2,x2,t1,rhs);
	default:
		throw new thx_Error("damn it, this should never happen",null,{ fileName : "Map.hx", lineNumber : 199, className : "thx.fp._Map.Map_Impl_", methodName : "singleRight"});
	}
};
thx_fp__$Map_Map_$Impl_$.doubleLeft = function(k1,x1,t1,rhs) {
	switch(rhs[1]) {
	case 1:
		switch(rhs[5][1]) {
		case 1:
			var t4 = rhs[6];
			var x2 = rhs[4];
			var k2 = rhs[3];
			var t3 = rhs[5][6];
			var t2 = rhs[5][5];
			var x3 = rhs[5][4];
			var k3 = rhs[5][3];
			var lhs = thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(t1) + thx_fp__$Map_Map_$Impl_$.size(t2) + 1,k1,x1,t1,t2);
			var rhs1 = thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(t3) + thx_fp__$Map_Map_$Impl_$.size(t4) + 1,k2,x2,t3,t4);
			return thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(lhs) + thx_fp__$Map_Map_$Impl_$.size(rhs1) + 1,k3,x3,lhs,rhs1);
		default:
			throw new thx_Error("damn it, this should never happen",null,{ fileName : "Map.hx", lineNumber : 206, className : "thx.fp._Map.Map_Impl_", methodName : "doubleLeft"});
		}
		break;
	default:
		throw new thx_Error("damn it, this should never happen",null,{ fileName : "Map.hx", lineNumber : 206, className : "thx.fp._Map.Map_Impl_", methodName : "doubleLeft"});
	}
};
thx_fp__$Map_Map_$Impl_$.doubleRight = function(k1,x1,lhs,t4) {
	switch(lhs[1]) {
	case 1:
		switch(lhs[6][1]) {
		case 1:
			var t1 = lhs[5];
			var x2 = lhs[4];
			var k2 = lhs[3];
			var t3 = lhs[6][6];
			var t2 = lhs[6][5];
			var x3 = lhs[6][4];
			var k3 = lhs[6][3];
			var lhs1 = thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(t1) + thx_fp__$Map_Map_$Impl_$.size(t2) + 1,k2,x2,t1,t2);
			var rhs = thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(t3) + thx_fp__$Map_Map_$Impl_$.size(t4) + 1,k1,x1,t3,t4);
			return thx_fp_MapImpl.Bin(thx_fp__$Map_Map_$Impl_$.size(lhs1) + thx_fp__$Map_Map_$Impl_$.size(rhs) + 1,k3,x3,lhs1,rhs);
		default:
			throw new thx_Error("damn it, this should never happen",null,{ fileName : "Map.hx", lineNumber : 213, className : "thx.fp._Map.Map_Impl_", methodName : "doubleRight"});
		}
		break;
	default:
		throw new thx_Error("damn it, this should never happen",null,{ fileName : "Map.hx", lineNumber : 213, className : "thx.fp._Map.Map_Impl_", methodName : "doubleRight"});
	}
};
var thx_fp_MapImpl = { __ename__ : ["thx","fp","MapImpl"], __constructs__ : ["Tip","Bin"] };
thx_fp_MapImpl.Tip = ["Tip",0];
thx_fp_MapImpl.Tip.toString = $estr;
thx_fp_MapImpl.Tip.__enum__ = thx_fp_MapImpl;
thx_fp_MapImpl.Bin = function(size,key,value,lhs,rhs) { var $x = ["Bin",1,size,key,value,lhs,rhs]; $x.__enum__ = thx_fp_MapImpl; $x.toString = $estr; return $x; };
var thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$ = {};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.__name__ = ["thx","unit","angle","_BinaryDegree","BinaryDegree_Impl_"];
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.fromFloat = function(value) {
	return value;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.fromInt = function(value) {
	return value;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return value;
	}
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.min = function(this1,that) {
	{
		var value = thx_Floats.min(this1,that);
		return value;
	}
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.max = function(this1,that) {
	{
		var value = thx_Floats.max(this1,that);
		return value;
	}
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.negate = function(this1) {
	return -this1;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.add = function(this1,that) {
	return this1 + that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.subtract = function(this1,that) {
	return this1 - that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.multiply = function(this1,that) {
	return this1 * that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.divide = function(this1,that) {
	return this1 / that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.modulo = function(this1,that) {
	return this1 % that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.equalsTo = function(this1,that) {
	return this1 == that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.equals = function(self,that) {
	return self == that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.nearEqualsTo = function(this1,that) {
	return thx_Floats.nearEquals(this1,that);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.nearEquals = function(self,that) {
	return thx_Floats.nearEquals(self,that);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.notEqualsTo = function(this1,that) {
	return this1 != that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.notEquals = function(self,that) {
	return self != that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.lessThan = function(this1,that) {
	return this1 < that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.less = function(self,that) {
	return self < that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.lessEqualsTo = function(this1,that) {
	return this1 <= that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.lessEquals = function(self,that) {
	return self <= that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.greaterThan = function(this1,that) {
	return this1 > that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.greater = function(self,that) {
	return self >= that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.greaterEqualsTo = function(this1,that) {
	return this1 >= that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.greaterEquals = function(self,that) {
	return self >= that;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toBinaryDegree = function(this1) {
	return this1;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toDegree = function(this1) {
	return this1 * thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.ofUnit / thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerDegree;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toGrad = function(this1) {
	return this1 * thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.ofUnit / thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerGrad;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toHourAngle = function(this1) {
	return this1 * thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.ofUnit / thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerHourAngle;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toMinuteOfArc = function(this1) {
	return this1 * thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.ofUnit / thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerMinuteOfArc;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toPoint = function(this1) {
	return this1 * thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.ofUnit / thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerPoint;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toQuadrant = function(this1) {
	return this1 * thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.ofUnit / thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerQuadrant;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toRadian = function(this1) {
	return this1 * thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.ofUnit / thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerRadian;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toRevolution = function(this1) {
	return this1 * thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.ofUnit / thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerRevolution;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toSecondOfArc = function(this1) {
	return this1 * thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.ofUnit / thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerSecondOfArc;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toSextant = function(this1) {
	return this1 * thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.ofUnit / thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerSextant;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toTurn = function(this1) {
	return this1 * thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.ofUnit / thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerTurn;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toString = function(this1) {
	return "" + this1 + "binary degree";
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.pointToBinaryDegree = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = value;
		}
		return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerBinaryDegree;
	}
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.cos = function(this1) {
	return Math.cos(this1 * thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.ofUnit / thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerRadian);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.sin = function(this1) {
	return Math.sin(this1 * thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.ofUnit / thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerRadian);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.normalize = function(this1) {
	var n = this1 % thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.turn;
	if(n < 0) return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.turn + n; else return n;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.normalizeDirection = function(this1) {
	var normalized = thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.normalize(this1);
	if(normalized >= thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.turn / 2) return normalized - thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.turn; else return normalized;
};
var thx_unit_angle__$Degree_Degree_$Impl_$ = {};
thx_unit_angle__$Degree_Degree_$Impl_$.__name__ = ["thx","unit","angle","_Degree","Degree_Impl_"];
thx_unit_angle__$Degree_Degree_$Impl_$.fromFloat = function(value) {
	return value;
};
thx_unit_angle__$Degree_Degree_$Impl_$.fromInt = function(value) {
	return value;
};
thx_unit_angle__$Degree_Degree_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Degree_Degree_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return value;
	}
};
thx_unit_angle__$Degree_Degree_$Impl_$.min = function(this1,that) {
	{
		var value = thx_Floats.min(this1,that);
		return value;
	}
};
thx_unit_angle__$Degree_Degree_$Impl_$.max = function(this1,that) {
	{
		var value = thx_Floats.max(this1,that);
		return value;
	}
};
thx_unit_angle__$Degree_Degree_$Impl_$.negate = function(this1) {
	return -this1;
};
thx_unit_angle__$Degree_Degree_$Impl_$.add = function(this1,that) {
	return this1 + that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.subtract = function(this1,that) {
	return this1 - that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.multiply = function(this1,that) {
	return this1 * that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.divide = function(this1,that) {
	return this1 / that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.modulo = function(this1,that) {
	return this1 % that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.equalsTo = function(this1,that) {
	return this1 == that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.equals = function(self,that) {
	return self == that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.nearEqualsTo = function(this1,that) {
	return thx_Floats.nearEquals(this1,that);
};
thx_unit_angle__$Degree_Degree_$Impl_$.nearEquals = function(self,that) {
	return thx_Floats.nearEquals(self,that);
};
thx_unit_angle__$Degree_Degree_$Impl_$.notEqualsTo = function(this1,that) {
	return this1 != that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.notEquals = function(self,that) {
	return self != that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.lessThan = function(this1,that) {
	return this1 < that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.less = function(self,that) {
	return self < that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.lessEqualsTo = function(this1,that) {
	return this1 <= that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.lessEquals = function(self,that) {
	return self <= that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.greaterThan = function(this1,that) {
	return this1 > that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.greater = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.greaterEqualsTo = function(this1,that) {
	return this1 >= that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.greaterEquals = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toBinaryDegree = function(this1) {
	return this1 * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerBinaryDegree;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toDegree = function(this1) {
	return this1;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toGrad = function(this1) {
	return this1 * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerGrad;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toHourAngle = function(this1) {
	return this1 * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerHourAngle;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toMinuteOfArc = function(this1) {
	return this1 * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerMinuteOfArc;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toPoint = function(this1) {
	return this1 * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerPoint;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toQuadrant = function(this1) {
	return this1 * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerQuadrant;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toRadian = function(this1) {
	return this1 * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerRadian;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toRevolution = function(this1) {
	return this1 * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerRevolution;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toSecondOfArc = function(this1) {
	return this1 * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerSecondOfArc;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toSextant = function(this1) {
	return this1 * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerSextant;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toTurn = function(this1) {
	return this1 * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerTurn;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toString = function(this1) {
	return "" + this1 + "°";
};
thx_unit_angle__$Degree_Degree_$Impl_$.pointToDegree = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = value;
		}
		return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerDegree;
	}
};
thx_unit_angle__$Degree_Degree_$Impl_$.cos = function(this1) {
	return Math.cos(this1 * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerRadian);
};
thx_unit_angle__$Degree_Degree_$Impl_$.sin = function(this1) {
	return Math.sin(this1 * thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit / thx_unit_angle__$Degree_Degree_$Impl_$.dividerRadian);
};
thx_unit_angle__$Degree_Degree_$Impl_$.normalize = function(this1) {
	var n = this1 % thx_unit_angle__$Degree_Degree_$Impl_$.turn;
	if(n < 0) return thx_unit_angle__$Degree_Degree_$Impl_$.turn + n; else return n;
};
thx_unit_angle__$Degree_Degree_$Impl_$.normalizeDirection = function(this1) {
	var normalized = thx_unit_angle__$Degree_Degree_$Impl_$.normalize(this1);
	if(normalized >= thx_unit_angle__$Degree_Degree_$Impl_$.turn / 2) return normalized - thx_unit_angle__$Degree_Degree_$Impl_$.turn; else return normalized;
};
var thx_unit_angle__$Grad_Grad_$Impl_$ = {};
thx_unit_angle__$Grad_Grad_$Impl_$.__name__ = ["thx","unit","angle","_Grad","Grad_Impl_"];
thx_unit_angle__$Grad_Grad_$Impl_$.fromFloat = function(value) {
	return value;
};
thx_unit_angle__$Grad_Grad_$Impl_$.fromInt = function(value) {
	return value;
};
thx_unit_angle__$Grad_Grad_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Grad_Grad_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return value;
	}
};
thx_unit_angle__$Grad_Grad_$Impl_$.min = function(this1,that) {
	{
		var value = thx_Floats.min(this1,that);
		return value;
	}
};
thx_unit_angle__$Grad_Grad_$Impl_$.max = function(this1,that) {
	{
		var value = thx_Floats.max(this1,that);
		return value;
	}
};
thx_unit_angle__$Grad_Grad_$Impl_$.negate = function(this1) {
	return -this1;
};
thx_unit_angle__$Grad_Grad_$Impl_$.add = function(this1,that) {
	return this1 + that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.subtract = function(this1,that) {
	return this1 - that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.multiply = function(this1,that) {
	return this1 * that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.divide = function(this1,that) {
	return this1 / that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.modulo = function(this1,that) {
	return this1 % that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.equalsTo = function(this1,that) {
	return this1 == that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.equals = function(self,that) {
	return self == that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.nearEqualsTo = function(this1,that) {
	return thx_Floats.nearEquals(this1,that);
};
thx_unit_angle__$Grad_Grad_$Impl_$.nearEquals = function(self,that) {
	return thx_Floats.nearEquals(self,that);
};
thx_unit_angle__$Grad_Grad_$Impl_$.notEqualsTo = function(this1,that) {
	return this1 != that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.notEquals = function(self,that) {
	return self != that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.lessThan = function(this1,that) {
	return this1 < that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.less = function(self,that) {
	return self < that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.lessEqualsTo = function(this1,that) {
	return this1 <= that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.lessEquals = function(self,that) {
	return self <= that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.greaterThan = function(this1,that) {
	return this1 > that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.greater = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.greaterEqualsTo = function(this1,that) {
	return this1 >= that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.greaterEquals = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toBinaryDegree = function(this1) {
	return this1 * thx_unit_angle__$Grad_Grad_$Impl_$.ofUnit / thx_unit_angle__$Grad_Grad_$Impl_$.dividerBinaryDegree;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toDegree = function(this1) {
	return this1 * thx_unit_angle__$Grad_Grad_$Impl_$.ofUnit / thx_unit_angle__$Grad_Grad_$Impl_$.dividerDegree;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toGrad = function(this1) {
	return this1;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toHourAngle = function(this1) {
	return this1 * thx_unit_angle__$Grad_Grad_$Impl_$.ofUnit / thx_unit_angle__$Grad_Grad_$Impl_$.dividerHourAngle;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toMinuteOfArc = function(this1) {
	return this1 * thx_unit_angle__$Grad_Grad_$Impl_$.ofUnit / thx_unit_angle__$Grad_Grad_$Impl_$.dividerMinuteOfArc;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toPoint = function(this1) {
	return this1 * thx_unit_angle__$Grad_Grad_$Impl_$.ofUnit / thx_unit_angle__$Grad_Grad_$Impl_$.dividerPoint;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toQuadrant = function(this1) {
	return this1 * thx_unit_angle__$Grad_Grad_$Impl_$.ofUnit / thx_unit_angle__$Grad_Grad_$Impl_$.dividerQuadrant;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toRadian = function(this1) {
	return this1 * thx_unit_angle__$Grad_Grad_$Impl_$.ofUnit / thx_unit_angle__$Grad_Grad_$Impl_$.dividerRadian;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toRevolution = function(this1) {
	return this1 * thx_unit_angle__$Grad_Grad_$Impl_$.ofUnit / thx_unit_angle__$Grad_Grad_$Impl_$.dividerRevolution;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toSecondOfArc = function(this1) {
	return this1 * thx_unit_angle__$Grad_Grad_$Impl_$.ofUnit / thx_unit_angle__$Grad_Grad_$Impl_$.dividerSecondOfArc;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toSextant = function(this1) {
	return this1 * thx_unit_angle__$Grad_Grad_$Impl_$.ofUnit / thx_unit_angle__$Grad_Grad_$Impl_$.dividerSextant;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toTurn = function(this1) {
	return this1 * thx_unit_angle__$Grad_Grad_$Impl_$.ofUnit / thx_unit_angle__$Grad_Grad_$Impl_$.dividerTurn;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toString = function(this1) {
	return "" + this1 + "grad";
};
thx_unit_angle__$Grad_Grad_$Impl_$.pointToGrad = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = value;
		}
		return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerGrad;
	}
};
thx_unit_angle__$Grad_Grad_$Impl_$.cos = function(this1) {
	return Math.cos(this1 * thx_unit_angle__$Grad_Grad_$Impl_$.ofUnit / thx_unit_angle__$Grad_Grad_$Impl_$.dividerRadian);
};
thx_unit_angle__$Grad_Grad_$Impl_$.sin = function(this1) {
	return Math.sin(this1 * thx_unit_angle__$Grad_Grad_$Impl_$.ofUnit / thx_unit_angle__$Grad_Grad_$Impl_$.dividerRadian);
};
thx_unit_angle__$Grad_Grad_$Impl_$.normalize = function(this1) {
	var n = this1 % thx_unit_angle__$Grad_Grad_$Impl_$.turn;
	if(n < 0) return thx_unit_angle__$Grad_Grad_$Impl_$.turn + n; else return n;
};
thx_unit_angle__$Grad_Grad_$Impl_$.normalizeDirection = function(this1) {
	var normalized = thx_unit_angle__$Grad_Grad_$Impl_$.normalize(this1);
	if(normalized >= thx_unit_angle__$Grad_Grad_$Impl_$.turn / 2) return normalized - thx_unit_angle__$Grad_Grad_$Impl_$.turn; else return normalized;
};
var thx_unit_angle__$HourAngle_HourAngle_$Impl_$ = {};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.__name__ = ["thx","unit","angle","_HourAngle","HourAngle_Impl_"];
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.fromFloat = function(value) {
	return value;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.fromInt = function(value) {
	return value;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return value;
	}
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.min = function(this1,that) {
	{
		var value = thx_Floats.min(this1,that);
		return value;
	}
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.max = function(this1,that) {
	{
		var value = thx_Floats.max(this1,that);
		return value;
	}
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.negate = function(this1) {
	return -this1;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.add = function(this1,that) {
	return this1 + that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.subtract = function(this1,that) {
	return this1 - that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.multiply = function(this1,that) {
	return this1 * that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.divide = function(this1,that) {
	return this1 / that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.modulo = function(this1,that) {
	return this1 % that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.equalsTo = function(this1,that) {
	return this1 == that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.equals = function(self,that) {
	return self == that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.nearEqualsTo = function(this1,that) {
	return thx_Floats.nearEquals(this1,that);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.nearEquals = function(self,that) {
	return thx_Floats.nearEquals(self,that);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.notEqualsTo = function(this1,that) {
	return this1 != that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.notEquals = function(self,that) {
	return self != that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.lessThan = function(this1,that) {
	return this1 < that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.less = function(self,that) {
	return self < that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.lessEqualsTo = function(this1,that) {
	return this1 <= that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.lessEquals = function(self,that) {
	return self <= that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.greaterThan = function(this1,that) {
	return this1 > that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.greater = function(self,that) {
	return self >= that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.greaterEqualsTo = function(this1,that) {
	return this1 >= that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.greaterEquals = function(self,that) {
	return self >= that;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toBinaryDegree = function(this1) {
	return this1 * thx_unit_angle__$HourAngle_HourAngle_$Impl_$.ofUnit / thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerBinaryDegree;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toDegree = function(this1) {
	return this1 * thx_unit_angle__$HourAngle_HourAngle_$Impl_$.ofUnit / thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerDegree;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toGrad = function(this1) {
	return this1 * thx_unit_angle__$HourAngle_HourAngle_$Impl_$.ofUnit / thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerGrad;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toHourAngle = function(this1) {
	return this1;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toMinuteOfArc = function(this1) {
	return this1 * thx_unit_angle__$HourAngle_HourAngle_$Impl_$.ofUnit / thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerMinuteOfArc;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toPoint = function(this1) {
	return this1 * thx_unit_angle__$HourAngle_HourAngle_$Impl_$.ofUnit / thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerPoint;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toQuadrant = function(this1) {
	return this1 * thx_unit_angle__$HourAngle_HourAngle_$Impl_$.ofUnit / thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerQuadrant;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toRadian = function(this1) {
	return this1 * thx_unit_angle__$HourAngle_HourAngle_$Impl_$.ofUnit / thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerRadian;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toRevolution = function(this1) {
	return this1 * thx_unit_angle__$HourAngle_HourAngle_$Impl_$.ofUnit / thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerRevolution;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toSecondOfArc = function(this1) {
	return this1 * thx_unit_angle__$HourAngle_HourAngle_$Impl_$.ofUnit / thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerSecondOfArc;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toSextant = function(this1) {
	return this1 * thx_unit_angle__$HourAngle_HourAngle_$Impl_$.ofUnit / thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerSextant;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toTurn = function(this1) {
	return this1 * thx_unit_angle__$HourAngle_HourAngle_$Impl_$.ofUnit / thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerTurn;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toString = function(this1) {
	return "" + this1 + "hour";
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.pointToHourAngle = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = value;
		}
		return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerHourAngle;
	}
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.cos = function(this1) {
	return Math.cos(this1 * thx_unit_angle__$HourAngle_HourAngle_$Impl_$.ofUnit / thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerRadian);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.sin = function(this1) {
	return Math.sin(this1 * thx_unit_angle__$HourAngle_HourAngle_$Impl_$.ofUnit / thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerRadian);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.normalize = function(this1) {
	var n = this1 % thx_unit_angle__$HourAngle_HourAngle_$Impl_$.turn;
	if(n < 0) return thx_unit_angle__$HourAngle_HourAngle_$Impl_$.turn + n; else return n;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.normalizeDirection = function(this1) {
	var normalized = thx_unit_angle__$HourAngle_HourAngle_$Impl_$.normalize(this1);
	if(normalized >= thx_unit_angle__$HourAngle_HourAngle_$Impl_$.turn / 2) return normalized - thx_unit_angle__$HourAngle_HourAngle_$Impl_$.turn; else return normalized;
};
var thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$ = {};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.__name__ = ["thx","unit","angle","_MinuteOfArc","MinuteOfArc_Impl_"];
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.fromFloat = function(value) {
	return value;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.fromInt = function(value) {
	return value;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return value;
	}
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.min = function(this1,that) {
	{
		var value = thx_Floats.min(this1,that);
		return value;
	}
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.max = function(this1,that) {
	{
		var value = thx_Floats.max(this1,that);
		return value;
	}
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.negate = function(this1) {
	return -this1;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.add = function(this1,that) {
	return this1 + that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.subtract = function(this1,that) {
	return this1 - that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.multiply = function(this1,that) {
	return this1 * that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.divide = function(this1,that) {
	return this1 / that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.modulo = function(this1,that) {
	return this1 % that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.equalsTo = function(this1,that) {
	return this1 == that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.equals = function(self,that) {
	return self == that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.nearEqualsTo = function(this1,that) {
	return thx_Floats.nearEquals(this1,that);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.nearEquals = function(self,that) {
	return thx_Floats.nearEquals(self,that);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.notEqualsTo = function(this1,that) {
	return this1 != that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.notEquals = function(self,that) {
	return self != that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.lessThan = function(this1,that) {
	return this1 < that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.less = function(self,that) {
	return self < that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.lessEqualsTo = function(this1,that) {
	return this1 <= that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.lessEquals = function(self,that) {
	return self <= that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.greaterThan = function(this1,that) {
	return this1 > that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.greater = function(self,that) {
	return self >= that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.greaterEqualsTo = function(this1,that) {
	return this1 >= that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.greaterEquals = function(self,that) {
	return self >= that;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toBinaryDegree = function(this1) {
	return this1 * thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.ofUnit / thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerBinaryDegree;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toDegree = function(this1) {
	return this1 * thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.ofUnit / thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerDegree;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toGrad = function(this1) {
	return this1 * thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.ofUnit / thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerGrad;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toHourAngle = function(this1) {
	return this1 * thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.ofUnit / thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerHourAngle;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toMinuteOfArc = function(this1) {
	return this1;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toPoint = function(this1) {
	return this1 * thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.ofUnit / thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerPoint;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toQuadrant = function(this1) {
	return this1 * thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.ofUnit / thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerQuadrant;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toRadian = function(this1) {
	return this1 * thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.ofUnit / thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerRadian;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toRevolution = function(this1) {
	return this1 * thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.ofUnit / thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerRevolution;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toSecondOfArc = function(this1) {
	return this1 * thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.ofUnit / thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerSecondOfArc;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toSextant = function(this1) {
	return this1 * thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.ofUnit / thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerSextant;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toTurn = function(this1) {
	return this1 * thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.ofUnit / thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerTurn;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toString = function(this1) {
	return "" + this1 + "′";
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.pointToMinuteOfArc = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = value;
		}
		return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerMinuteOfArc;
	}
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.cos = function(this1) {
	return Math.cos(this1 * thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.ofUnit / thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerRadian);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.sin = function(this1) {
	return Math.sin(this1 * thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.ofUnit / thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerRadian);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.normalize = function(this1) {
	var n = this1 % thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.turn;
	if(n < 0) return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.turn + n; else return n;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.normalizeDirection = function(this1) {
	var normalized = thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.normalize(this1);
	if(normalized >= thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.turn / 2) return normalized - thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.turn; else return normalized;
};
var thx_unit_angle__$Point_Point_$Impl_$ = {};
thx_unit_angle__$Point_Point_$Impl_$.__name__ = ["thx","unit","angle","_Point","Point_Impl_"];
thx_unit_angle__$Point_Point_$Impl_$.fromFloat = function(value) {
	return value;
};
thx_unit_angle__$Point_Point_$Impl_$.fromInt = function(value) {
	return value;
};
thx_unit_angle__$Point_Point_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Point_Point_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return value;
	}
};
thx_unit_angle__$Point_Point_$Impl_$.min = function(this1,that) {
	{
		var value = thx_Floats.min(this1,that);
		return value;
	}
};
thx_unit_angle__$Point_Point_$Impl_$.max = function(this1,that) {
	{
		var value = thx_Floats.max(this1,that);
		return value;
	}
};
thx_unit_angle__$Point_Point_$Impl_$.negate = function(this1) {
	return -this1;
};
thx_unit_angle__$Point_Point_$Impl_$.add = function(this1,that) {
	return this1 + that;
};
thx_unit_angle__$Point_Point_$Impl_$.subtract = function(this1,that) {
	return this1 - that;
};
thx_unit_angle__$Point_Point_$Impl_$.multiply = function(this1,that) {
	return this1 * that;
};
thx_unit_angle__$Point_Point_$Impl_$.divide = function(this1,that) {
	return this1 / that;
};
thx_unit_angle__$Point_Point_$Impl_$.modulo = function(this1,that) {
	return this1 % that;
};
thx_unit_angle__$Point_Point_$Impl_$.equalsTo = function(this1,that) {
	return this1 == that;
};
thx_unit_angle__$Point_Point_$Impl_$.equals = function(self,that) {
	return self == that;
};
thx_unit_angle__$Point_Point_$Impl_$.nearEqualsTo = function(this1,that) {
	return thx_Floats.nearEquals(this1,that);
};
thx_unit_angle__$Point_Point_$Impl_$.nearEquals = function(self,that) {
	return thx_Floats.nearEquals(self,that);
};
thx_unit_angle__$Point_Point_$Impl_$.notEqualsTo = function(this1,that) {
	return this1 != that;
};
thx_unit_angle__$Point_Point_$Impl_$.notEquals = function(self,that) {
	return self != that;
};
thx_unit_angle__$Point_Point_$Impl_$.lessThan = function(this1,that) {
	return this1 < that;
};
thx_unit_angle__$Point_Point_$Impl_$.less = function(self,that) {
	return self < that;
};
thx_unit_angle__$Point_Point_$Impl_$.lessEqualsTo = function(this1,that) {
	return this1 <= that;
};
thx_unit_angle__$Point_Point_$Impl_$.lessEquals = function(self,that) {
	return self <= that;
};
thx_unit_angle__$Point_Point_$Impl_$.greaterThan = function(this1,that) {
	return this1 > that;
};
thx_unit_angle__$Point_Point_$Impl_$.greater = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Point_Point_$Impl_$.greaterEqualsTo = function(this1,that) {
	return this1 >= that;
};
thx_unit_angle__$Point_Point_$Impl_$.greaterEquals = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Point_Point_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Point_Point_$Impl_$.toBinaryDegree = function(this1) {
	return this1 * thx_unit_angle__$Point_Point_$Impl_$.ofUnit / thx_unit_angle__$Point_Point_$Impl_$.dividerBinaryDegree;
};
thx_unit_angle__$Point_Point_$Impl_$.toDegree = function(this1) {
	return this1 * thx_unit_angle__$Point_Point_$Impl_$.ofUnit / thx_unit_angle__$Point_Point_$Impl_$.dividerDegree;
};
thx_unit_angle__$Point_Point_$Impl_$.toGrad = function(this1) {
	return this1 * thx_unit_angle__$Point_Point_$Impl_$.ofUnit / thx_unit_angle__$Point_Point_$Impl_$.dividerGrad;
};
thx_unit_angle__$Point_Point_$Impl_$.toHourAngle = function(this1) {
	return this1 * thx_unit_angle__$Point_Point_$Impl_$.ofUnit / thx_unit_angle__$Point_Point_$Impl_$.dividerHourAngle;
};
thx_unit_angle__$Point_Point_$Impl_$.toMinuteOfArc = function(this1) {
	return this1 * thx_unit_angle__$Point_Point_$Impl_$.ofUnit / thx_unit_angle__$Point_Point_$Impl_$.dividerMinuteOfArc;
};
thx_unit_angle__$Point_Point_$Impl_$.toPoint = function(this1) {
	return this1;
};
thx_unit_angle__$Point_Point_$Impl_$.toQuadrant = function(this1) {
	return this1 * thx_unit_angle__$Point_Point_$Impl_$.ofUnit / thx_unit_angle__$Point_Point_$Impl_$.dividerQuadrant;
};
thx_unit_angle__$Point_Point_$Impl_$.toRadian = function(this1) {
	return this1 * thx_unit_angle__$Point_Point_$Impl_$.ofUnit / thx_unit_angle__$Point_Point_$Impl_$.dividerRadian;
};
thx_unit_angle__$Point_Point_$Impl_$.toRevolution = function(this1) {
	return this1 * thx_unit_angle__$Point_Point_$Impl_$.ofUnit / thx_unit_angle__$Point_Point_$Impl_$.dividerRevolution;
};
thx_unit_angle__$Point_Point_$Impl_$.toSecondOfArc = function(this1) {
	return this1 * thx_unit_angle__$Point_Point_$Impl_$.ofUnit / thx_unit_angle__$Point_Point_$Impl_$.dividerSecondOfArc;
};
thx_unit_angle__$Point_Point_$Impl_$.toSextant = function(this1) {
	return this1 * thx_unit_angle__$Point_Point_$Impl_$.ofUnit / thx_unit_angle__$Point_Point_$Impl_$.dividerSextant;
};
thx_unit_angle__$Point_Point_$Impl_$.toTurn = function(this1) {
	return this1 * thx_unit_angle__$Point_Point_$Impl_$.ofUnit / thx_unit_angle__$Point_Point_$Impl_$.dividerTurn;
};
thx_unit_angle__$Point_Point_$Impl_$.toString = function(this1) {
	return "" + this1 + "point";
};
thx_unit_angle__$Point_Point_$Impl_$.pointToPoint = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = value;
		}
		return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerPoint;
	}
};
thx_unit_angle__$Point_Point_$Impl_$.cos = function(this1) {
	return Math.cos(this1 * thx_unit_angle__$Point_Point_$Impl_$.ofUnit / thx_unit_angle__$Point_Point_$Impl_$.dividerRadian);
};
thx_unit_angle__$Point_Point_$Impl_$.sin = function(this1) {
	return Math.sin(this1 * thx_unit_angle__$Point_Point_$Impl_$.ofUnit / thx_unit_angle__$Point_Point_$Impl_$.dividerRadian);
};
thx_unit_angle__$Point_Point_$Impl_$.normalize = function(this1) {
	var n = this1 % thx_unit_angle__$Point_Point_$Impl_$.turn;
	if(n < 0) return thx_unit_angle__$Point_Point_$Impl_$.turn + n; else return n;
};
thx_unit_angle__$Point_Point_$Impl_$.normalizeDirection = function(this1) {
	var normalized = thx_unit_angle__$Point_Point_$Impl_$.normalize(this1);
	if(normalized >= thx_unit_angle__$Point_Point_$Impl_$.turn / 2) return normalized - thx_unit_angle__$Point_Point_$Impl_$.turn; else return normalized;
};
var thx_unit_angle__$Quadrant_Quadrant_$Impl_$ = {};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.__name__ = ["thx","unit","angle","_Quadrant","Quadrant_Impl_"];
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.fromFloat = function(value) {
	return value;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.fromInt = function(value) {
	return value;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return value;
	}
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.min = function(this1,that) {
	{
		var value = thx_Floats.min(this1,that);
		return value;
	}
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.max = function(this1,that) {
	{
		var value = thx_Floats.max(this1,that);
		return value;
	}
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.negate = function(this1) {
	return -this1;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.add = function(this1,that) {
	return this1 + that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.subtract = function(this1,that) {
	return this1 - that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.multiply = function(this1,that) {
	return this1 * that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.divide = function(this1,that) {
	return this1 / that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.modulo = function(this1,that) {
	return this1 % that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.equalsTo = function(this1,that) {
	return this1 == that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.equals = function(self,that) {
	return self == that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.nearEqualsTo = function(this1,that) {
	return thx_Floats.nearEquals(this1,that);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.nearEquals = function(self,that) {
	return thx_Floats.nearEquals(self,that);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.notEqualsTo = function(this1,that) {
	return this1 != that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.notEquals = function(self,that) {
	return self != that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.lessThan = function(this1,that) {
	return this1 < that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.less = function(self,that) {
	return self < that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.lessEqualsTo = function(this1,that) {
	return this1 <= that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.lessEquals = function(self,that) {
	return self <= that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.greaterThan = function(this1,that) {
	return this1 > that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.greater = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.greaterEqualsTo = function(this1,that) {
	return this1 >= that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.greaterEquals = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toBinaryDegree = function(this1) {
	return this1 * thx_unit_angle__$Quadrant_Quadrant_$Impl_$.ofUnit / thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerBinaryDegree;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toDegree = function(this1) {
	return this1 * thx_unit_angle__$Quadrant_Quadrant_$Impl_$.ofUnit / thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerDegree;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toGrad = function(this1) {
	return this1 * thx_unit_angle__$Quadrant_Quadrant_$Impl_$.ofUnit / thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerGrad;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toHourAngle = function(this1) {
	return this1 * thx_unit_angle__$Quadrant_Quadrant_$Impl_$.ofUnit / thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerHourAngle;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toMinuteOfArc = function(this1) {
	return this1 * thx_unit_angle__$Quadrant_Quadrant_$Impl_$.ofUnit / thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerMinuteOfArc;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toPoint = function(this1) {
	return this1 * thx_unit_angle__$Quadrant_Quadrant_$Impl_$.ofUnit / thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerPoint;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toQuadrant = function(this1) {
	return this1;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toRadian = function(this1) {
	return this1 * thx_unit_angle__$Quadrant_Quadrant_$Impl_$.ofUnit / thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerRadian;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toRevolution = function(this1) {
	return this1 * thx_unit_angle__$Quadrant_Quadrant_$Impl_$.ofUnit / thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerRevolution;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toSecondOfArc = function(this1) {
	return this1 * thx_unit_angle__$Quadrant_Quadrant_$Impl_$.ofUnit / thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerSecondOfArc;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toSextant = function(this1) {
	return this1 * thx_unit_angle__$Quadrant_Quadrant_$Impl_$.ofUnit / thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerSextant;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toTurn = function(this1) {
	return this1 * thx_unit_angle__$Quadrant_Quadrant_$Impl_$.ofUnit / thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerTurn;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toString = function(this1) {
	return "" + this1 + "quad.";
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.pointToQuadrant = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = value;
		}
		return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerQuadrant;
	}
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.cos = function(this1) {
	return Math.cos(this1 * thx_unit_angle__$Quadrant_Quadrant_$Impl_$.ofUnit / thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerRadian);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.sin = function(this1) {
	return Math.sin(this1 * thx_unit_angle__$Quadrant_Quadrant_$Impl_$.ofUnit / thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerRadian);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.normalize = function(this1) {
	var n = this1 % thx_unit_angle__$Quadrant_Quadrant_$Impl_$.turn;
	if(n < 0) return thx_unit_angle__$Quadrant_Quadrant_$Impl_$.turn + n; else return n;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.normalizeDirection = function(this1) {
	var normalized = thx_unit_angle__$Quadrant_Quadrant_$Impl_$.normalize(this1);
	if(normalized >= thx_unit_angle__$Quadrant_Quadrant_$Impl_$.turn / 2) return normalized - thx_unit_angle__$Quadrant_Quadrant_$Impl_$.turn; else return normalized;
};
var thx_unit_angle__$Radian_Radian_$Impl_$ = {};
thx_unit_angle__$Radian_Radian_$Impl_$.__name__ = ["thx","unit","angle","_Radian","Radian_Impl_"];
thx_unit_angle__$Radian_Radian_$Impl_$.fromFloat = function(value) {
	return value;
};
thx_unit_angle__$Radian_Radian_$Impl_$.fromInt = function(value) {
	return value;
};
thx_unit_angle__$Radian_Radian_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Radian_Radian_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return value;
	}
};
thx_unit_angle__$Radian_Radian_$Impl_$.min = function(this1,that) {
	{
		var value = thx_Floats.min(this1,that);
		return value;
	}
};
thx_unit_angle__$Radian_Radian_$Impl_$.max = function(this1,that) {
	{
		var value = thx_Floats.max(this1,that);
		return value;
	}
};
thx_unit_angle__$Radian_Radian_$Impl_$.negate = function(this1) {
	return -this1;
};
thx_unit_angle__$Radian_Radian_$Impl_$.add = function(this1,that) {
	return this1 + that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.subtract = function(this1,that) {
	return this1 - that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.multiply = function(this1,that) {
	return this1 * that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.divide = function(this1,that) {
	return this1 / that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.modulo = function(this1,that) {
	return this1 % that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.equalsTo = function(this1,that) {
	return this1 == that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.equals = function(self,that) {
	return self == that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.nearEqualsTo = function(this1,that) {
	return thx_Floats.nearEquals(this1,that);
};
thx_unit_angle__$Radian_Radian_$Impl_$.nearEquals = function(self,that) {
	return thx_Floats.nearEquals(self,that);
};
thx_unit_angle__$Radian_Radian_$Impl_$.notEqualsTo = function(this1,that) {
	return this1 != that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.notEquals = function(self,that) {
	return self != that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.lessThan = function(this1,that) {
	return this1 < that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.less = function(self,that) {
	return self < that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.lessEqualsTo = function(this1,that) {
	return this1 <= that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.lessEquals = function(self,that) {
	return self <= that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.greaterThan = function(this1,that) {
	return this1 > that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.greater = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.greaterEqualsTo = function(this1,that) {
	return this1 >= that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.greaterEquals = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toBinaryDegree = function(this1) {
	return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerBinaryDegree;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toDegree = function(this1) {
	return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerDegree;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toGrad = function(this1) {
	return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerGrad;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toHourAngle = function(this1) {
	return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerHourAngle;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toMinuteOfArc = function(this1) {
	return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerMinuteOfArc;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toPoint = function(this1) {
	return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerPoint;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toQuadrant = function(this1) {
	return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerQuadrant;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toRadian = function(this1) {
	return this1;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toRevolution = function(this1) {
	return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerRevolution;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toSecondOfArc = function(this1) {
	return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerSecondOfArc;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toSextant = function(this1) {
	return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerSextant;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toTurn = function(this1) {
	return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerTurn;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toString = function(this1) {
	return "" + this1 + "rad";
};
thx_unit_angle__$Radian_Radian_$Impl_$.pointToRadian = function(x,y) {
	{
		var value = Math.atan2(y,x);
		return value;
	}
};
thx_unit_angle__$Radian_Radian_$Impl_$.cos = function(this1) {
	return Math.cos(this1);
};
thx_unit_angle__$Radian_Radian_$Impl_$.sin = function(this1) {
	return Math.sin(this1);
};
thx_unit_angle__$Radian_Radian_$Impl_$.normalize = function(this1) {
	var n = this1 % thx_unit_angle__$Radian_Radian_$Impl_$.turn;
	if(n < 0) return thx_unit_angle__$Radian_Radian_$Impl_$.turn + n; else return n;
};
thx_unit_angle__$Radian_Radian_$Impl_$.normalizeDirection = function(this1) {
	var normalized = thx_unit_angle__$Radian_Radian_$Impl_$.normalize(this1);
	if(normalized >= thx_unit_angle__$Radian_Radian_$Impl_$.turn / 2) return normalized - thx_unit_angle__$Radian_Radian_$Impl_$.turn; else return normalized;
};
var thx_unit_angle__$Revolution_Revolution_$Impl_$ = {};
thx_unit_angle__$Revolution_Revolution_$Impl_$.__name__ = ["thx","unit","angle","_Revolution","Revolution_Impl_"];
thx_unit_angle__$Revolution_Revolution_$Impl_$.fromFloat = function(value) {
	return value;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.fromInt = function(value) {
	return value;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return value;
	}
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.min = function(this1,that) {
	{
		var value = thx_Floats.min(this1,that);
		return value;
	}
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.max = function(this1,that) {
	{
		var value = thx_Floats.max(this1,that);
		return value;
	}
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.negate = function(this1) {
	return -this1;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.add = function(this1,that) {
	return this1 + that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.subtract = function(this1,that) {
	return this1 - that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.multiply = function(this1,that) {
	return this1 * that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.divide = function(this1,that) {
	return this1 / that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.modulo = function(this1,that) {
	return this1 % that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.equalsTo = function(this1,that) {
	return this1 == that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.equals = function(self,that) {
	return self == that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.nearEqualsTo = function(this1,that) {
	return thx_Floats.nearEquals(this1,that);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.nearEquals = function(self,that) {
	return thx_Floats.nearEquals(self,that);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.notEqualsTo = function(this1,that) {
	return this1 != that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.notEquals = function(self,that) {
	return self != that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.lessThan = function(this1,that) {
	return this1 < that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.less = function(self,that) {
	return self < that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.lessEqualsTo = function(this1,that) {
	return this1 <= that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.lessEquals = function(self,that) {
	return self <= that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.greaterThan = function(this1,that) {
	return this1 > that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.greater = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.greaterEqualsTo = function(this1,that) {
	return this1 >= that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.greaterEquals = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toBinaryDegree = function(this1) {
	return this1 * thx_unit_angle__$Revolution_Revolution_$Impl_$.ofUnit / thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerBinaryDegree;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toDegree = function(this1) {
	return this1 * thx_unit_angle__$Revolution_Revolution_$Impl_$.ofUnit / thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerDegree;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toGrad = function(this1) {
	return this1 * thx_unit_angle__$Revolution_Revolution_$Impl_$.ofUnit / thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerGrad;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toHourAngle = function(this1) {
	return this1 * thx_unit_angle__$Revolution_Revolution_$Impl_$.ofUnit / thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerHourAngle;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toMinuteOfArc = function(this1) {
	return this1 * thx_unit_angle__$Revolution_Revolution_$Impl_$.ofUnit / thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerMinuteOfArc;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toPoint = function(this1) {
	return this1 * thx_unit_angle__$Revolution_Revolution_$Impl_$.ofUnit / thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerPoint;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toQuadrant = function(this1) {
	return this1 * thx_unit_angle__$Revolution_Revolution_$Impl_$.ofUnit / thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerQuadrant;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toRadian = function(this1) {
	return this1 * thx_unit_angle__$Revolution_Revolution_$Impl_$.ofUnit / thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerRadian;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toRevolution = function(this1) {
	return this1;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toSecondOfArc = function(this1) {
	return this1 * thx_unit_angle__$Revolution_Revolution_$Impl_$.ofUnit / thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerSecondOfArc;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toSextant = function(this1) {
	return this1 * thx_unit_angle__$Revolution_Revolution_$Impl_$.ofUnit / thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerSextant;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toTurn = function(this1) {
	return this1 * thx_unit_angle__$Revolution_Revolution_$Impl_$.ofUnit / thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerTurn;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toString = function(this1) {
	return "" + this1 + "r";
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.pointToRevolution = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = value;
		}
		return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerRevolution;
	}
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.cos = function(this1) {
	return Math.cos(this1 * thx_unit_angle__$Revolution_Revolution_$Impl_$.ofUnit / thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerRadian);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.sin = function(this1) {
	return Math.sin(this1 * thx_unit_angle__$Revolution_Revolution_$Impl_$.ofUnit / thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerRadian);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.normalize = function(this1) {
	var n = this1 % thx_unit_angle__$Revolution_Revolution_$Impl_$.turn;
	if(n < 0) return thx_unit_angle__$Revolution_Revolution_$Impl_$.turn + n; else return n;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.normalizeDirection = function(this1) {
	var normalized = thx_unit_angle__$Revolution_Revolution_$Impl_$.normalize(this1);
	if(normalized >= thx_unit_angle__$Revolution_Revolution_$Impl_$.turn / 2) return normalized - thx_unit_angle__$Revolution_Revolution_$Impl_$.turn; else return normalized;
};
var thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$ = {};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.__name__ = ["thx","unit","angle","_SecondOfArc","SecondOfArc_Impl_"];
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.fromFloat = function(value) {
	return value;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.fromInt = function(value) {
	return value;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return value;
	}
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.min = function(this1,that) {
	{
		var value = thx_Floats.min(this1,that);
		return value;
	}
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.max = function(this1,that) {
	{
		var value = thx_Floats.max(this1,that);
		return value;
	}
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.negate = function(this1) {
	return -this1;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.add = function(this1,that) {
	return this1 + that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.subtract = function(this1,that) {
	return this1 - that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.multiply = function(this1,that) {
	return this1 * that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.divide = function(this1,that) {
	return this1 / that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.modulo = function(this1,that) {
	return this1 % that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.equalsTo = function(this1,that) {
	return this1 == that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.equals = function(self,that) {
	return self == that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.nearEqualsTo = function(this1,that) {
	return thx_Floats.nearEquals(this1,that);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.nearEquals = function(self,that) {
	return thx_Floats.nearEquals(self,that);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.notEqualsTo = function(this1,that) {
	return this1 != that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.notEquals = function(self,that) {
	return self != that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.lessThan = function(this1,that) {
	return this1 < that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.less = function(self,that) {
	return self < that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.lessEqualsTo = function(this1,that) {
	return this1 <= that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.lessEquals = function(self,that) {
	return self <= that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.greaterThan = function(this1,that) {
	return this1 > that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.greater = function(self,that) {
	return self >= that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.greaterEqualsTo = function(this1,that) {
	return this1 >= that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.greaterEquals = function(self,that) {
	return self >= that;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toBinaryDegree = function(this1) {
	return this1 * thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.ofUnit / thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerBinaryDegree;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toDegree = function(this1) {
	return this1 * thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.ofUnit / thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerDegree;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toGrad = function(this1) {
	return this1 * thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.ofUnit / thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerGrad;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toHourAngle = function(this1) {
	return this1 * thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.ofUnit / thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerHourAngle;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toMinuteOfArc = function(this1) {
	return this1 * thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.ofUnit / thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerMinuteOfArc;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toPoint = function(this1) {
	return this1 * thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.ofUnit / thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerPoint;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toQuadrant = function(this1) {
	return this1 * thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.ofUnit / thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerQuadrant;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toRadian = function(this1) {
	return this1 * thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.ofUnit / thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerRadian;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toRevolution = function(this1) {
	return this1 * thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.ofUnit / thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerRevolution;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toSecondOfArc = function(this1) {
	return this1;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toSextant = function(this1) {
	return this1 * thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.ofUnit / thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerSextant;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toTurn = function(this1) {
	return this1 * thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.ofUnit / thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerTurn;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toString = function(this1) {
	return "" + this1 + "″";
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.pointToSecondOfArc = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = value;
		}
		return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerSecondOfArc;
	}
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.cos = function(this1) {
	return Math.cos(this1 * thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.ofUnit / thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerRadian);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.sin = function(this1) {
	return Math.sin(this1 * thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.ofUnit / thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerRadian);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.normalize = function(this1) {
	var n = this1 % thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.turn;
	if(n < 0) return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.turn + n; else return n;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.normalizeDirection = function(this1) {
	var normalized = thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.normalize(this1);
	if(normalized >= thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.turn / 2) return normalized - thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.turn; else return normalized;
};
var thx_unit_angle__$Sextant_Sextant_$Impl_$ = {};
thx_unit_angle__$Sextant_Sextant_$Impl_$.__name__ = ["thx","unit","angle","_Sextant","Sextant_Impl_"];
thx_unit_angle__$Sextant_Sextant_$Impl_$.fromFloat = function(value) {
	return value;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.fromInt = function(value) {
	return value;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return value;
	}
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.min = function(this1,that) {
	{
		var value = thx_Floats.min(this1,that);
		return value;
	}
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.max = function(this1,that) {
	{
		var value = thx_Floats.max(this1,that);
		return value;
	}
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.negate = function(this1) {
	return -this1;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.add = function(this1,that) {
	return this1 + that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.subtract = function(this1,that) {
	return this1 - that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.multiply = function(this1,that) {
	return this1 * that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.divide = function(this1,that) {
	return this1 / that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.modulo = function(this1,that) {
	return this1 % that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.equalsTo = function(this1,that) {
	return this1 == that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.equals = function(self,that) {
	return self == that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.nearEqualsTo = function(this1,that) {
	return thx_Floats.nearEquals(this1,that);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.nearEquals = function(self,that) {
	return thx_Floats.nearEquals(self,that);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.notEqualsTo = function(this1,that) {
	return this1 != that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.notEquals = function(self,that) {
	return self != that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.lessThan = function(this1,that) {
	return this1 < that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.less = function(self,that) {
	return self < that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.lessEqualsTo = function(this1,that) {
	return this1 <= that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.lessEquals = function(self,that) {
	return self <= that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.greaterThan = function(this1,that) {
	return this1 > that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.greater = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.greaterEqualsTo = function(this1,that) {
	return this1 >= that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.greaterEquals = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toBinaryDegree = function(this1) {
	return this1 * thx_unit_angle__$Sextant_Sextant_$Impl_$.ofUnit / thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerBinaryDegree;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toDegree = function(this1) {
	return this1 * thx_unit_angle__$Sextant_Sextant_$Impl_$.ofUnit / thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerDegree;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toGrad = function(this1) {
	return this1 * thx_unit_angle__$Sextant_Sextant_$Impl_$.ofUnit / thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerGrad;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toHourAngle = function(this1) {
	return this1 * thx_unit_angle__$Sextant_Sextant_$Impl_$.ofUnit / thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerHourAngle;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toMinuteOfArc = function(this1) {
	return this1 * thx_unit_angle__$Sextant_Sextant_$Impl_$.ofUnit / thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerMinuteOfArc;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toPoint = function(this1) {
	return this1 * thx_unit_angle__$Sextant_Sextant_$Impl_$.ofUnit / thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerPoint;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toQuadrant = function(this1) {
	return this1 * thx_unit_angle__$Sextant_Sextant_$Impl_$.ofUnit / thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerQuadrant;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toRadian = function(this1) {
	return this1 * thx_unit_angle__$Sextant_Sextant_$Impl_$.ofUnit / thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerRadian;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toRevolution = function(this1) {
	return this1 * thx_unit_angle__$Sextant_Sextant_$Impl_$.ofUnit / thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerRevolution;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toSecondOfArc = function(this1) {
	return this1 * thx_unit_angle__$Sextant_Sextant_$Impl_$.ofUnit / thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerSecondOfArc;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toSextant = function(this1) {
	return this1;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toTurn = function(this1) {
	return this1 * thx_unit_angle__$Sextant_Sextant_$Impl_$.ofUnit / thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerTurn;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toString = function(this1) {
	return "" + this1 + "sextant";
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.pointToSextant = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = value;
		}
		return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerSextant;
	}
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.cos = function(this1) {
	return Math.cos(this1 * thx_unit_angle__$Sextant_Sextant_$Impl_$.ofUnit / thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerRadian);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.sin = function(this1) {
	return Math.sin(this1 * thx_unit_angle__$Sextant_Sextant_$Impl_$.ofUnit / thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerRadian);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.normalize = function(this1) {
	var n = this1 % thx_unit_angle__$Sextant_Sextant_$Impl_$.turn;
	if(n < 0) return thx_unit_angle__$Sextant_Sextant_$Impl_$.turn + n; else return n;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.normalizeDirection = function(this1) {
	var normalized = thx_unit_angle__$Sextant_Sextant_$Impl_$.normalize(this1);
	if(normalized >= thx_unit_angle__$Sextant_Sextant_$Impl_$.turn / 2) return normalized - thx_unit_angle__$Sextant_Sextant_$Impl_$.turn; else return normalized;
};
var thx_unit_angle__$Turn_Turn_$Impl_$ = {};
thx_unit_angle__$Turn_Turn_$Impl_$.__name__ = ["thx","unit","angle","_Turn","Turn_Impl_"];
thx_unit_angle__$Turn_Turn_$Impl_$.fromFloat = function(value) {
	return value;
};
thx_unit_angle__$Turn_Turn_$Impl_$.fromInt = function(value) {
	return value;
};
thx_unit_angle__$Turn_Turn_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Turn_Turn_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return value;
	}
};
thx_unit_angle__$Turn_Turn_$Impl_$.min = function(this1,that) {
	{
		var value = thx_Floats.min(this1,that);
		return value;
	}
};
thx_unit_angle__$Turn_Turn_$Impl_$.max = function(this1,that) {
	{
		var value = thx_Floats.max(this1,that);
		return value;
	}
};
thx_unit_angle__$Turn_Turn_$Impl_$.negate = function(this1) {
	return -this1;
};
thx_unit_angle__$Turn_Turn_$Impl_$.add = function(this1,that) {
	return this1 + that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.subtract = function(this1,that) {
	return this1 - that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.multiply = function(this1,that) {
	return this1 * that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.divide = function(this1,that) {
	return this1 / that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.modulo = function(this1,that) {
	return this1 % that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.equalsTo = function(this1,that) {
	return this1 == that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.equals = function(self,that) {
	return self == that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.nearEqualsTo = function(this1,that) {
	return thx_Floats.nearEquals(this1,that);
};
thx_unit_angle__$Turn_Turn_$Impl_$.nearEquals = function(self,that) {
	return thx_Floats.nearEquals(self,that);
};
thx_unit_angle__$Turn_Turn_$Impl_$.notEqualsTo = function(this1,that) {
	return this1 != that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.notEquals = function(self,that) {
	return self != that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.lessThan = function(this1,that) {
	return this1 < that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.less = function(self,that) {
	return self < that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.lessEqualsTo = function(this1,that) {
	return this1 <= that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.lessEquals = function(self,that) {
	return self <= that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.greaterThan = function(this1,that) {
	return this1 > that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.greater = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.greaterEqualsTo = function(this1,that) {
	return this1 >= that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.greaterEquals = function(self,that) {
	return self >= that;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toBinaryDegree = function(this1) {
	return this1 * thx_unit_angle__$Turn_Turn_$Impl_$.ofUnit / thx_unit_angle__$Turn_Turn_$Impl_$.dividerBinaryDegree;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toDegree = function(this1) {
	return this1 * thx_unit_angle__$Turn_Turn_$Impl_$.ofUnit / thx_unit_angle__$Turn_Turn_$Impl_$.dividerDegree;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toGrad = function(this1) {
	return this1 * thx_unit_angle__$Turn_Turn_$Impl_$.ofUnit / thx_unit_angle__$Turn_Turn_$Impl_$.dividerGrad;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toHourAngle = function(this1) {
	return this1 * thx_unit_angle__$Turn_Turn_$Impl_$.ofUnit / thx_unit_angle__$Turn_Turn_$Impl_$.dividerHourAngle;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toMinuteOfArc = function(this1) {
	return this1 * thx_unit_angle__$Turn_Turn_$Impl_$.ofUnit / thx_unit_angle__$Turn_Turn_$Impl_$.dividerMinuteOfArc;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toPoint = function(this1) {
	return this1 * thx_unit_angle__$Turn_Turn_$Impl_$.ofUnit / thx_unit_angle__$Turn_Turn_$Impl_$.dividerPoint;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toQuadrant = function(this1) {
	return this1 * thx_unit_angle__$Turn_Turn_$Impl_$.ofUnit / thx_unit_angle__$Turn_Turn_$Impl_$.dividerQuadrant;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toRadian = function(this1) {
	return this1 * thx_unit_angle__$Turn_Turn_$Impl_$.ofUnit / thx_unit_angle__$Turn_Turn_$Impl_$.dividerRadian;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toRevolution = function(this1) {
	return this1 * thx_unit_angle__$Turn_Turn_$Impl_$.ofUnit / thx_unit_angle__$Turn_Turn_$Impl_$.dividerRevolution;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toSecondOfArc = function(this1) {
	return this1 * thx_unit_angle__$Turn_Turn_$Impl_$.ofUnit / thx_unit_angle__$Turn_Turn_$Impl_$.dividerSecondOfArc;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toSextant = function(this1) {
	return this1 * thx_unit_angle__$Turn_Turn_$Impl_$.ofUnit / thx_unit_angle__$Turn_Turn_$Impl_$.dividerSextant;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toTurn = function(this1) {
	return this1;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toString = function(this1) {
	return "" + this1 + "τ";
};
thx_unit_angle__$Turn_Turn_$Impl_$.pointToTurn = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = value;
		}
		return this1 * thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit / thx_unit_angle__$Radian_Radian_$Impl_$.dividerTurn;
	}
};
thx_unit_angle__$Turn_Turn_$Impl_$.cos = function(this1) {
	return Math.cos(this1 * thx_unit_angle__$Turn_Turn_$Impl_$.ofUnit / thx_unit_angle__$Turn_Turn_$Impl_$.dividerRadian);
};
thx_unit_angle__$Turn_Turn_$Impl_$.sin = function(this1) {
	return Math.sin(this1 * thx_unit_angle__$Turn_Turn_$Impl_$.ofUnit / thx_unit_angle__$Turn_Turn_$Impl_$.dividerRadian);
};
thx_unit_angle__$Turn_Turn_$Impl_$.normalize = function(this1) {
	var n = this1 % thx_unit_angle__$Turn_Turn_$Impl_$.turn;
	if(n < 0) return thx_unit_angle__$Turn_Turn_$Impl_$.turn + n; else return n;
};
thx_unit_angle__$Turn_Turn_$Impl_$.normalizeDirection = function(this1) {
	var normalized = thx_unit_angle__$Turn_Turn_$Impl_$.normalize(this1);
	if(normalized >= thx_unit_angle__$Turn_Turn_$Impl_$.turn / 2) return normalized - thx_unit_angle__$Turn_Turn_$Impl_$.turn; else return normalized;
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
var __map_reserved = {}
var ArrayBuffer = $global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = $global.DataView || js_html_compat_DataView;
var Uint8Array = $global.Uint8Array || js_html_compat_Uint8Array._new;
msignal_SlotList.NIL = new msignal_SlotList(null,null);
var scope = ("undefined" !== typeof window && window) || ("undefined" !== typeof global && global) || Function("return this")();
if(!scope.setImmediate) scope.setImmediate = function(callback) {
	scope.setTimeout(callback,0);
};
var lastTime = 0;
var vendors = ["webkit","moz"];
var x = 0;
while(x < vendors.length && !scope.requestAnimationFrame) {
	scope.requestAnimationFrame = scope[vendors[x] + "RequestAnimationFrame"];
	scope.cancelAnimationFrame = scope[vendors[x] + "CancelAnimationFrame"] || scope[vendors[x] + "CancelRequestAnimationFrame"];
	x++;
}
if(!scope.requestAnimationFrame) scope.requestAnimationFrame = function(callback1) {
	var currTime = new Date().getTime();
	var timeToCall = Math.max(0,16 - (currTime - lastTime));
	var id = scope.setTimeout(function() {
		callback1(currTime + timeToCall);
	},timeToCall);
	lastTime = currTime + timeToCall;
	return id;
};
if(!scope.cancelAnimationFrame) scope.cancelAnimationFrame = function(id1) {
	scope.clearTimeout(id1);
};
if(typeof(scope.performance) == "undefined") scope.performance = { };
if(typeof(scope.performance.now) == "undefined") {
	var nowOffset = new Date().getTime();
	if(scope.performance.timing && scope.performance.timing.navigationStart) nowOffset = scope.performance.timing.navigationStart;
	var now = function() {
		return new Date() - nowOffset;
	};
	scope.performance.now = now;
}
DateTools.DAYS_OF_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31];
crowded_CrowdService.server = "http://localhost:2000";
haxe_crypto_Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe_ds_ObjectMap.count = 0;
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
js_Boot.__toStr = {}.toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
murmur_Canvas.width = 1900;
murmur_Canvas.height = 1000;
murmur_Canvas.document = window.document;
murmur_Canvas.paused = 0;
murmur_Canvas._velocity = 1.0;
murmur_Canvas._numPeople = 50;
murmur_PeopleImage.count = 0;
thx_Floats.TOLERANCE = 10e-5;
thx_Floats.EPSILON = 1e-9;
thx_Floats.pattern_parse = new EReg("^(\\+|-)?\\d+(\\.\\d+)?(e-?\\d+)?$","");
thx_Floats.order = thx__$Ord_Ord_$Impl_$.fromIntComparison(thx_Floats.compare);
thx_Floats.monoid = { zero : 0.0, append : function(a,b) {
	return a + b;
}};
thx_Ints.pattern_parse = new EReg("^[ \t\r\n]*[+-]?(\\d+|0x[0-9A-F]+)","i");
thx_Ints.BASE = "0123456789abcdefghijklmnopqrstuvwxyz";
thx_Ints.order = function(i0,i1) {
	if(i0 > i1) return thx_OrderingImpl.GT; else if(i0 == i1) return thx_OrderingImpl.EQ; else return thx_OrderingImpl.LT;
};
thx_Ints.monoid = { zero : 0, append : function(a,b) {
	return a + b;
}};
thx_Orderings.monoid = { zero : thx_OrderingImpl.EQ, append : function(o0,o1) {
	switch(o0[1]) {
	case 0:
		return thx_OrderingImpl.LT;
	case 2:
		return o1;
	case 1:
		return thx_OrderingImpl.GT;
	}
}};
thx_Strings.order = thx__$Ord_Ord_$Impl_$.fromIntComparison(thx_Strings.compare);
thx_Strings.HASCODE_MAX = 2147483647;
thx_Strings.HASCODE_MUL = 31;
thx_Strings.monoid = { zero : "", append : function(a,b) {
	return a + b;
}};
thx_Strings.UCWORDS = new EReg("[^a-zA-Z]([a-z])","g");
thx_Strings.IS_BREAKINGWHITESPACE = new EReg("[^\t\n\r ]","");
thx_Strings.IS_ALPHA = new EReg("[^a-zA-Z]","");
thx_Strings.UCWORDSWS = new EReg("[ \t\r\n][a-z]","g");
thx_Strings.ALPHANUM = new EReg("^[a-z0-9]+$","i");
thx_Strings.DIGITS = new EReg("^[0-9]+$","");
thx_Strings.STRIPTAGS = new EReg("</?[a-z]+[^>]*>","gi");
thx_Strings.WSG = new EReg("[ \t\r\n]+","g");
thx_Strings.SPLIT_LINES = new EReg("\r\n|\n\r|\n|\r","g");
thx_Strings.CANONICALIZE_LINES = new EReg("\r\n|\n\r|\r","g");
thx_Timer.FRAME_RATE = Math.round(16.6666666666666679);
thx_color__$CubeHelix_CubeHelix_$Impl_$.A = -0.14861;
thx_color__$CubeHelix_CubeHelix_$Impl_$.B = 1.78277;
thx_color__$CubeHelix_CubeHelix_$Impl_$.C = -0.29227;
thx_color__$CubeHelix_CubeHelix_$Impl_$.D = -0.90649;
thx_color__$CubeHelix_CubeHelix_$Impl_$.E = 1.97294;
thx_color__$CubeHelix_CubeHelix_$Impl_$.ED = -1.7884503806;
thx_color__$CubeHelix_CubeHelix_$Impl_$.EB = 3.5172982438;
thx_color__$CubeHelix_CubeHelix_$Impl_$.BC_DA = -0.655763666799999867;
thx_color__$Grey_Grey_$Impl_$.black = 0;
thx_color__$Grey_Grey_$Impl_$.white = 1;
thx_color__$Xyz_Xyz_$Impl_$.whiteReference = [0.95047,1,1.08883];
thx_color__$Xyz_Xyz_$Impl_$.epsilon = 0.0088564516790356311;
thx_color__$Xyz_Xyz_$Impl_$.kappa = 903.296296296296305;
thx_color_parse_ColorParser.parser = new thx_color_parse_ColorParser();
thx_color_parse_ColorParser.isPureHex = new EReg("^([0-9a-f]{2}){3,4}$","i");
thx_fp__$Map_Map_$Impl_$.delta = 5;
thx_fp__$Map_Map_$Impl_$.ratio = 2;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.ofUnit = 0.00390625;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.turn = 256.0;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerBinaryDegree = 0.00390625;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerDegree = 0.00277777777777777788;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerGrad = 0.0025;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerHourAngle = 0.0416666666666666644;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerMinuteOfArc = 4.6296296296296294e-05;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerPoint = 0.03125;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerQuadrant = 0.25;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerRadian = 0.159154943091895346;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerRevolution = 1.;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerSecondOfArc = 7.71604938271604893e-07;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerSextant = 0.166666666666666657;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.dividerTurn = 1.;
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.symbol = "binary degree";
thx_unit_angle__$Degree_Degree_$Impl_$.ofUnit = 0.00277777777777777788;
thx_unit_angle__$Degree_Degree_$Impl_$.turn = 360.0;
thx_unit_angle__$Degree_Degree_$Impl_$.dividerBinaryDegree = 0.00390625;
thx_unit_angle__$Degree_Degree_$Impl_$.dividerDegree = 0.00277777777777777788;
thx_unit_angle__$Degree_Degree_$Impl_$.dividerGrad = 0.0025;
thx_unit_angle__$Degree_Degree_$Impl_$.dividerHourAngle = 0.0416666666666666644;
thx_unit_angle__$Degree_Degree_$Impl_$.dividerMinuteOfArc = 4.6296296296296294e-05;
thx_unit_angle__$Degree_Degree_$Impl_$.dividerPoint = 0.03125;
thx_unit_angle__$Degree_Degree_$Impl_$.dividerQuadrant = 0.25;
thx_unit_angle__$Degree_Degree_$Impl_$.dividerRadian = 0.159154943091895346;
thx_unit_angle__$Degree_Degree_$Impl_$.dividerRevolution = 1.;
thx_unit_angle__$Degree_Degree_$Impl_$.dividerSecondOfArc = 7.71604938271604893e-07;
thx_unit_angle__$Degree_Degree_$Impl_$.dividerSextant = 0.166666666666666657;
thx_unit_angle__$Degree_Degree_$Impl_$.dividerTurn = 1.;
thx_unit_angle__$Degree_Degree_$Impl_$.symbol = "°";
thx_unit_angle__$Grad_Grad_$Impl_$.ofUnit = 0.0025;
thx_unit_angle__$Grad_Grad_$Impl_$.turn = 400.0;
thx_unit_angle__$Grad_Grad_$Impl_$.dividerBinaryDegree = 0.00390625;
thx_unit_angle__$Grad_Grad_$Impl_$.dividerDegree = 0.00277777777777777788;
thx_unit_angle__$Grad_Grad_$Impl_$.dividerGrad = 0.0025;
thx_unit_angle__$Grad_Grad_$Impl_$.dividerHourAngle = 0.0416666666666666644;
thx_unit_angle__$Grad_Grad_$Impl_$.dividerMinuteOfArc = 4.6296296296296294e-05;
thx_unit_angle__$Grad_Grad_$Impl_$.dividerPoint = 0.03125;
thx_unit_angle__$Grad_Grad_$Impl_$.dividerQuadrant = 0.25;
thx_unit_angle__$Grad_Grad_$Impl_$.dividerRadian = 0.159154943091895346;
thx_unit_angle__$Grad_Grad_$Impl_$.dividerRevolution = 1.;
thx_unit_angle__$Grad_Grad_$Impl_$.dividerSecondOfArc = 7.71604938271604893e-07;
thx_unit_angle__$Grad_Grad_$Impl_$.dividerSextant = 0.166666666666666657;
thx_unit_angle__$Grad_Grad_$Impl_$.dividerTurn = 1.;
thx_unit_angle__$Grad_Grad_$Impl_$.symbol = "grad";
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.ofUnit = 0.0416666666666666644;
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.turn = 24.0;
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerBinaryDegree = 0.00390625;
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerDegree = 0.00277777777777777788;
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerGrad = 0.0025;
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerHourAngle = 0.0416666666666666644;
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerMinuteOfArc = 4.6296296296296294e-05;
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerPoint = 0.03125;
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerQuadrant = 0.25;
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerRadian = 0.159154943091895346;
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerRevolution = 1.;
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerSecondOfArc = 7.71604938271604893e-07;
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerSextant = 0.166666666666666657;
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.dividerTurn = 1.;
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.symbol = "hour";
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.ofUnit = 4.6296296296296294e-05;
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.turn = 21600.0;
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerBinaryDegree = 0.00390625;
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerDegree = 0.00277777777777777788;
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerGrad = 0.0025;
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerHourAngle = 0.0416666666666666644;
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerMinuteOfArc = 4.6296296296296294e-05;
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerPoint = 0.03125;
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerQuadrant = 0.25;
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerRadian = 0.159154943091895346;
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerRevolution = 1.;
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerSecondOfArc = 7.71604938271604893e-07;
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerSextant = 0.166666666666666657;
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.dividerTurn = 1.;
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.symbol = "′";
thx_unit_angle__$Point_Point_$Impl_$.ofUnit = 0.03125;
thx_unit_angle__$Point_Point_$Impl_$.turn = 32.0;
thx_unit_angle__$Point_Point_$Impl_$.dividerBinaryDegree = 0.00390625;
thx_unit_angle__$Point_Point_$Impl_$.dividerDegree = 0.00277777777777777788;
thx_unit_angle__$Point_Point_$Impl_$.dividerGrad = 0.0025;
thx_unit_angle__$Point_Point_$Impl_$.dividerHourAngle = 0.0416666666666666644;
thx_unit_angle__$Point_Point_$Impl_$.dividerMinuteOfArc = 4.6296296296296294e-05;
thx_unit_angle__$Point_Point_$Impl_$.dividerPoint = 0.03125;
thx_unit_angle__$Point_Point_$Impl_$.dividerQuadrant = 0.25;
thx_unit_angle__$Point_Point_$Impl_$.dividerRadian = 0.159154943091895346;
thx_unit_angle__$Point_Point_$Impl_$.dividerRevolution = 1.;
thx_unit_angle__$Point_Point_$Impl_$.dividerSecondOfArc = 7.71604938271604893e-07;
thx_unit_angle__$Point_Point_$Impl_$.dividerSextant = 0.166666666666666657;
thx_unit_angle__$Point_Point_$Impl_$.dividerTurn = 1.;
thx_unit_angle__$Point_Point_$Impl_$.symbol = "point";
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.ofUnit = 0.25;
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.turn = 4.0;
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerBinaryDegree = 0.00390625;
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerDegree = 0.00277777777777777788;
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerGrad = 0.0025;
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerHourAngle = 0.0416666666666666644;
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerMinuteOfArc = 4.6296296296296294e-05;
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerPoint = 0.03125;
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerQuadrant = 0.25;
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerRadian = 0.159154943091895346;
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerRevolution = 1.;
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerSecondOfArc = 7.71604938271604893e-07;
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerSextant = 0.166666666666666657;
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.dividerTurn = 1.;
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.symbol = "quad.";
thx_unit_angle__$Radian_Radian_$Impl_$.ofUnit = 0.159154943091895346;
thx_unit_angle__$Radian_Radian_$Impl_$.turn = 6.283185307179586;
thx_unit_angle__$Radian_Radian_$Impl_$.dividerBinaryDegree = 0.00390625;
thx_unit_angle__$Radian_Radian_$Impl_$.dividerDegree = 0.00277777777777777788;
thx_unit_angle__$Radian_Radian_$Impl_$.dividerGrad = 0.0025;
thx_unit_angle__$Radian_Radian_$Impl_$.dividerHourAngle = 0.0416666666666666644;
thx_unit_angle__$Radian_Radian_$Impl_$.dividerMinuteOfArc = 4.6296296296296294e-05;
thx_unit_angle__$Radian_Radian_$Impl_$.dividerPoint = 0.03125;
thx_unit_angle__$Radian_Radian_$Impl_$.dividerQuadrant = 0.25;
thx_unit_angle__$Radian_Radian_$Impl_$.dividerRadian = 0.159154943091895346;
thx_unit_angle__$Radian_Radian_$Impl_$.dividerRevolution = 1.;
thx_unit_angle__$Radian_Radian_$Impl_$.dividerSecondOfArc = 7.71604938271604893e-07;
thx_unit_angle__$Radian_Radian_$Impl_$.dividerSextant = 0.166666666666666657;
thx_unit_angle__$Radian_Radian_$Impl_$.dividerTurn = 1.;
thx_unit_angle__$Radian_Radian_$Impl_$.symbol = "rad";
thx_unit_angle__$Revolution_Revolution_$Impl_$.ofUnit = 1.;
thx_unit_angle__$Revolution_Revolution_$Impl_$.turn = 1.0;
thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerBinaryDegree = 0.00390625;
thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerDegree = 0.00277777777777777788;
thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerGrad = 0.0025;
thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerHourAngle = 0.0416666666666666644;
thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerMinuteOfArc = 4.6296296296296294e-05;
thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerPoint = 0.03125;
thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerQuadrant = 0.25;
thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerRadian = 0.159154943091895346;
thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerRevolution = 1.;
thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerSecondOfArc = 7.71604938271604893e-07;
thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerSextant = 0.166666666666666657;
thx_unit_angle__$Revolution_Revolution_$Impl_$.dividerTurn = 1.;
thx_unit_angle__$Revolution_Revolution_$Impl_$.symbol = "r";
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.ofUnit = 7.71604938271604893e-07;
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.turn = 1296000.0;
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerBinaryDegree = 0.00390625;
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerDegree = 0.00277777777777777788;
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerGrad = 0.0025;
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerHourAngle = 0.0416666666666666644;
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerMinuteOfArc = 4.6296296296296294e-05;
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerPoint = 0.03125;
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerQuadrant = 0.25;
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerRadian = 0.159154943091895346;
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerRevolution = 1.;
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerSecondOfArc = 7.71604938271604893e-07;
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerSextant = 0.166666666666666657;
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.dividerTurn = 1.;
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.symbol = "″";
thx_unit_angle__$Sextant_Sextant_$Impl_$.ofUnit = 0.166666666666666657;
thx_unit_angle__$Sextant_Sextant_$Impl_$.turn = 6.0;
thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerBinaryDegree = 0.00390625;
thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerDegree = 0.00277777777777777788;
thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerGrad = 0.0025;
thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerHourAngle = 0.0416666666666666644;
thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerMinuteOfArc = 4.6296296296296294e-05;
thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerPoint = 0.03125;
thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerQuadrant = 0.25;
thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerRadian = 0.159154943091895346;
thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerRevolution = 1.;
thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerSecondOfArc = 7.71604938271604893e-07;
thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerSextant = 0.166666666666666657;
thx_unit_angle__$Sextant_Sextant_$Impl_$.dividerTurn = 1.;
thx_unit_angle__$Sextant_Sextant_$Impl_$.symbol = "sextant";
thx_unit_angle__$Turn_Turn_$Impl_$.ofUnit = 1.;
thx_unit_angle__$Turn_Turn_$Impl_$.turn = 1.0;
thx_unit_angle__$Turn_Turn_$Impl_$.dividerBinaryDegree = 0.00390625;
thx_unit_angle__$Turn_Turn_$Impl_$.dividerDegree = 0.00277777777777777788;
thx_unit_angle__$Turn_Turn_$Impl_$.dividerGrad = 0.0025;
thx_unit_angle__$Turn_Turn_$Impl_$.dividerHourAngle = 0.0416666666666666644;
thx_unit_angle__$Turn_Turn_$Impl_$.dividerMinuteOfArc = 4.6296296296296294e-05;
thx_unit_angle__$Turn_Turn_$Impl_$.dividerPoint = 0.03125;
thx_unit_angle__$Turn_Turn_$Impl_$.dividerQuadrant = 0.25;
thx_unit_angle__$Turn_Turn_$Impl_$.dividerRadian = 0.159154943091895346;
thx_unit_angle__$Turn_Turn_$Impl_$.dividerRevolution = 1.;
thx_unit_angle__$Turn_Turn_$Impl_$.dividerSecondOfArc = 7.71604938271604893e-07;
thx_unit_angle__$Turn_Turn_$Impl_$.dividerSextant = 0.166666666666666657;
thx_unit_angle__$Turn_Turn_$Impl_$.dividerTurn = 1.;
thx_unit_angle__$Turn_Turn_$Impl_$.symbol = "τ";
murmur_Canvas.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);

//# sourceMappingURL=canvas.js.map