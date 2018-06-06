package murmur;
import js.html.*;
import boidz.Boid.BoidType;
class PeopleImage {

	static var count:Int=0;
	public var path:String;

	public function new(?type:BoidType) {
			
			//count++;
			
			var loc=switch(type){
				
				case Red:
				count=Math.round(Math.random()*78);
				'/reds/red$count.png';
				case Normal,_:
				count=Math.round(Math.random()*400);
				'/people/people$count.png';

			}
			this.path= js.Browser.window.location.origin+loc;
			trace( type +"path="+this.path);
			//this.render();
	}

	public function render():js.html.Image{

		//var im=haxe.Resource.getString("pip");
		//trace( im);
		var img = new js.html.Image();
    	img.src = path;
    	img.onload=function(e){
    		var i:Image= e.target;
    		//trace( 'w=${i.width} h=${i.height}');
    	}

    	return img;

	}
}
