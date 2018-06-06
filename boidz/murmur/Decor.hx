package murmur;


import boidz.IRender;
import boidz.IRenderable;
import boidz.render.canvas.CanvasRender;
import js.html.*;
import js.Browser.document in doc;
import msignal.Signal;
using tink.CoreApi;
class Decor  implements IRenderable<CanvasRender>{
public var enabled:Bool=true;
	
	public var x:Int;
	public var y:Int;
	public var width:Int;
	public var height:Int;
	public var opacity=1.0;
	public var im:Image;
	public var fim:Future<js.html.Image>;
	var bounds:{width:Int,height:Int};

	public function new(d:DecorImage,bounds) {
			this.bounds=bounds;
   			fim=d.frender();
   			trace( "eho");

	}
	public function init(){
		

   			fim.handle(function(e){
   				im =e;
   				trace("im="+im);
			 width=300+Std.random(bounds.width-300);
			 height= Std.int(im.height * (width/im.width));
			 x=Std.random(bounds.width-width);
			 y=100+Std.random(bounds.height-height);
			 trace( "decor rec"+ {x:x, y:y,width:width,height:height});
   				});
	}

	public function render (render:CanvasRender){
		//trace(width,height);
		//opacity=opacity-0.001;
		//render.ctx.globalAlpha = opacity;
		//render.ctx.drawImage(im,b.x-(newW/2),b.y-(newH/2),newW,newH);
		//if (opacity> 0.1)
		if (im!=null)
		render.ctx.drawImage(im,x,y,width,height);
		//render.ctx.drawImage(im,100,100,width,height);
		//trace( "opacity"+opacity);
		
	}
}


//usage
//peopleImage= new PeopleImage();
//image= peopleImage.render();
//
class DecorImage extends murmur.PeopleImage{
	static var count:Int=0;
	static var maxCount:Int=36;
	public function new()
	{
		super();
	    count=(count+1)%maxCount;
	    if(count==0)count=1; //beurk
		this.path= js.Browser.window.location.origin+'/decor/dec/decor$count.png';
	}

	 public function frender():Future<js.html.Image>{
		//var im=haxe.Resource.getString("pip");
		//trace( im);
		var f= Future.async(function(cb){
			var img = new js.html.Image();
    		img.src = path;
    		img.onload=function(e)cb(e.target);

		});
		
    	

    	return f;

	}
}