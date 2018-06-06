// Generated by Haxe 3.3.0
(function () { "use strict";
var murmur_Medaillon = function() {
	console.log("yo");
	this.render = new murmur_CanvasRender(this.getCanvas());
	this.goDraw(this.render.ctx);
};
murmur_Medaillon.main = function() {
	new murmur_Medaillon();
};
murmur_Medaillon.prototype = {
	goDraw: function(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "#cc3300";
		ctx.arc(0,0,20,0,2 * Math.PI,false);
		ctx.fill();
	}
	,getCanvas: function() {
		var canvas = window.document.createElement("canvas");
		canvas.width = murmur_Medaillon.width;
		canvas.height = murmur_Medaillon.height;
		window.document.body.appendChild(canvas);
		return canvas;
	}
};
var murmur_CanvasRender = function(canvas) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d",null);
	this.ctx.save();
};
murmur_CanvasRender.prototype = {
	clear: function() {
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	}
	,beforeEach: function() {
		this.ctx.save();
	}
	,afterEach: function() {
		this.ctx.restore();
	}
};
murmur_Medaillon.width = 800;
murmur_Medaillon.height = 800;
murmur_Medaillon.main();
})();
