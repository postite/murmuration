package murmur;
import js.Browser;
import js.html.*;


typedef SpriteOptions={

src:String,
width:Int,
height:Int,
//image:Image,
numberOfFrames:Int,
fps:Int,
?loop:Bool
}

class Sprite{

//var context:js.html.CanvasRenderingContext2D;
public var state:Int;
var width:Int;
var height:Int; 
var image:Image; 
public var currentFrame:Int;
var tickCount:Int;
var ticksPerFrame:Int;
var numberOfFrames:Int;

var loop:Bool;
var step:Int;
public var x:Float;
public var y:Float=0;
	public function new(options:SpriteOptions,?state:Int):Void
	{
	//context = options.context;
    width = options.width;
    height = options.height;
    //image = options.image;
    loop=(options.loop!=null)? options.loop :true;
    currentFrame = 0;
   	tickCount = 0;
   	this.state=state;
    ticksPerFrame = Math.floor(60/options.fps); //60fps/15
    numberOfFrames = (options.numberOfFrames!=0)? options.numberOfFrames :1;
	loadImage(options.src);
	}

	public function loadImage(src){
		image= new Image();
		image.src=src;
	}

	public function setFrame(index:Int){
		currentFrame=index;
	}



/*context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)

img	Source image object	Sprite sheet
sx	Source x	Frame index times frame width
sy	Source y	0
sw	Source width	Frame width
sh	Source height	Frame height
dx	Destination x	0
dy	Destination y	0
dw	Destination width	Frame width
dh	Destination height	Frame height
*/
public function render(context:CanvasRenderingContext2D){
		
		//clear
		//context.clearRect(0, 0, width, height);
        //draw
        context.drawImage(
           image,
           currentFrame * image.width / numberOfFrames,
           0,
           image.width / numberOfFrames,
          height,

           x,
          y,

           image.width / numberOfFrames,
           height
           );
    };

 public function update(context){
 	// trace( 'tickCount=$tickCount');
 	// trace( 'ticksPerFrame=$ticksPerFrame');
 	// trace( 'numberOfFrames=$numberOfFrames');
 	tickCount += 1;
			
        if (tickCount > ticksPerFrame) {
        
            tickCount = 0;
        	
            // If the current frame index is in range
            if (currentFrame < numberOfFrames - 1) {	
                // Go to the next frame
                currentFrame += 1;
            } else if (loop) {
                currentFrame = 0;
            }
 	}
 	render(context);
 }
public function back(){
	x=-image.width/numberOfFrames;
	
}
 public function move(step:Float){
 	x=x+step;
 	
 }

}