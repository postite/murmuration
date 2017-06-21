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
import js.html.Image;
class End implements IRenderable<CanvasRender> {
 // var flock : Flock;
  public var enabled : Bool = true;
  var image:Image;

 // public static var outBounds:Signal2<String,Sprite>= new Signal2();
  public static var outBounds:WalkOut= WalkOut.getInstance();
  
  public function new(state:Int) {
    	image = new Image();
    	image.src="/anim/end.png";

  }

  
  
  public function render(render : CanvasRender) {

  	render.ctx.drawImage(
           image,
           0 ,
           0,
           image.width,
          image.height,

           0,
          0,

           image.width ,
           image.height
           );
  	

  }
  

    
}

