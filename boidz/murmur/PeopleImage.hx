package murmur;
import js.html.*;
class PeopleImage {

	static var count:Int=0;
	public var path:String;

	public function new() {
			
			//count++;
			count=Math.round(Math.random()*400);
			this.path= 'people/people$count.png';
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