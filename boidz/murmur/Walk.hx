package murmur;

import js.Browser;
import js.html.*;

import boidz.render.canvas.*;
import boidz.Boid;
import boidz.Flock;
import boidz.IRenderable;
import boidz.Point;
import thx.Ints;
import thx.color.Rgb;
import thx.color.Rgba;
import msignal.Signal;
import socket.signal.WalkOut;
class Walk implements IRenderable<CanvasRender> {
 // var flock : Flock;
  public var enabled : Bool = true;
  var sprite:Sprite;
  public var gone:Bool=false;
 // public static var outBounds:Signal2<String,Sprite>= new Signal2();
  public static var outBounds:WalkOut= WalkOut.getInstance();
  public function new(state:Int) {
     sprite= new Sprite({
		src:"anim/compiled_small.jpg",
		width:400,
		height:375,
		
		numberOfFrames:13,
		fps:7
		}
		,state);
  }

  public function back(dir:String,sprite:Sprite){
  	switch (dir) {
  		case "right":this.sprite.back();
  		case "left":
  		case _:
  	}

  }
  public function setState(state:Int){
  	this.sprite.state=state;
  }

  public function moveX(v:Float){
  	sprite.x+=v;
  }
  public function render(render : CanvasRender) {

  	moveX(4);
  	sprite.update(render.ctx);
  	 if( sprite.x > render.canvas.width){
  	 		if (enabled)
  	 		outBounds.dispatch("right",sprite);
        	
  	 }

  }

    
}

/*
class Walk {

	var doc:js.html.HTMLDocument;
	var canvas:js.html.CanvasElement;
	public function new(?canvas:js.html.CanvasElement) {
		// 	trace("yeah" );
		if( canvas==null){
		doc=Browser.document;
		Browser.window.onload=function(e){
		//trace( doc.body);
		// canvas=cast doc.createElement("canvas");
		// canvas.id="sprited";
		// doc.body.appendChild(canvas);
		canvas=cast doc.getElementById("sprited");
		canvas.width=Browser.window.innerWidth;
		canvas.height=375;
		init();
		};
		}else{
			this.canvas=canvas;
		}
	}
	public function init():Void {
		var coinImage:Image = new Image();
		//doc.body.appendChild(coinImage);
		//coinImage.onload=function(){
		
		var sprite= new Sprite({
		src:"anim/compiled_small.jpg",
		context:canvas.getContext("2d"),
		width:canvas.width,
		height:375,
		image:coinImage,
		numberOfFrames:13,
		fps:7
		});

		

		
		thx.Timer.frame(function(delta) {
      	//delta += 1;
      //while( step >= 0) {

        //var time = thx.Timer.time();
        sprite.update();
        

        sprite.x+=1.3;
        if( sprite.x > Browser.window.innerWidth)
        	sprite.back();

       
       });
     


	
	
	
	//coinImage.src = "compiled_small.jpg";
	//coinImage.src = "coins.png";

	}//end init

	

	
}
*/

