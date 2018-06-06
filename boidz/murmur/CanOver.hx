package murmur;
import boidz.IRender;
import boidz.IRenderable;
import boidz.render.canvas.CanvasRender;
import js.html.*;
import js.Browser.document in doc;
import msignal.Signal;
typedef Point={
	x:Int,
	y:Int
}
typedef Rectangle={
	>Point,
	width:Int,
	height:Int
}

class Overlay  {
public  var signal:msignal.Signal1<Rectangle>;
public var memoIn:Point={x:0,y:0};
  public var memoOut:Point={x:0,y:0};
  var width:Int;
  var height:Int;
  var ctx:CanvasRenderingContext2D;
  public var rec:Rectangle;
  public function new(width:Int,height:Int) {
   	//this.ctx=ctx;
   	this.width=width;
   	this.height=height;
  }


  public function listen(){
  	signal= new Signal1();
  	doc.addEventListener("mousedown",onEnter);
  	
  	trace( "listen");
  }
  function onEnter(e:js.html.MouseEvent){
  	trace("onEnter");
  	
  	doc.addEventListener("mousemove",onMove);
  	doc.addEventListener("mouseup",onUp);
  	memoIn= {x:e.offsetX, y:e.offsetY};
  }
  function onMove(e){
  	trace( "move");
  	//clear();
  	memoOut={x:e.offsetX, y:e.offsetY};
  	rec= {x:memoIn.x,y:memoIn.y,width:memoOut.x-memoIn.x,height:memoOut.y-memoIn.y}
  	//drawRec();

  }
  function onUp(e){
  	trace("onUp");
  	memoOut={x:e.offsetX, y:e.offsetY};
  	doc.removeEventListener("mousemove",onMove);
  	doc.removeEventListener("mouseup",onUp);
  	//var rec= {x:memoIn.x,y:memoIn.y,width:memoOut.x-memoIn.x,height:memoOut.y-memoIn.y}
  	signal.dispatch(rec);
  	//drawRec();
  	
  }
  function drawRec(ctx:js.html.CanvasRenderingContext2D){
  	this.ctx.fillStyle="#00AAFF";
  	ctx.lineWidth=1;
  	trace( '${memoIn.x},${memoIn.y},${memoOut.x},${memoOut.y}');
  	//ctx.fillRect(memoIn.x,memoIn.y,memoOut.x-memoIn.x,memoOut.y-memoIn.y);
  	//ctx.fillRect(memoIn.x,memoIn.y,memoOut.x-memoIn.x,memoOut.y-memoIn.y);
  	ctx.moveTo(rec.x,rec.y);
  	ctx.lineTo(rec.x+rec.width,rec.y);
  	ctx.lineTo(rec.x+rec.width,rec.y+rec.height);
  	ctx.lineTo(rec.x,rec.y+rec.height);
  	ctx.lineTo(rec.x,rec.y);
  }

  public function render(ctx){
  	drawRec(ctx);
  }

  function clear(ctx){
  	ctx.clearRect(0, 0, width, height);
  }


  	// public function render(render : Render) {

  	// };

  	 

  	

  // static public function main(){
  // 	new Overlay(getCanvas());
  // }
}

class CanOver implements IRender{
	public var canvas(default, null) : CanvasElement;
  	public var ctx(default, null) : CanvasRenderingContext2D;
  	static var width:Int=800;
  	static var height:Int=600;
  	public function new() {
    this.canvas = getCanvas();
    this.ctx = canvas.getContext2d();

   // this.ctx.imageSmoothingEnabled = true;
   	var over=new Overlay(600,800);
   	over.listen();
   	over.signal.add(this.render);
   	
 
    this.ctx.save();
  	}


  	public function beforeEach()
    this.ctx.save();

  	public function afterEach()
    this.ctx.restore();

	public function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  	}

  	function render(rec){
  		trace( "render");
  	this.ctx.fillStyle="#00AAFF";
  	//trace( '${memoIn.x},${memoIn.y},${memoOut.x},${memoOut.y}');
  	//ctx.fillRect(memoIn.x,memoIn.y,memoOut.x-memoIn.x,memoOut.y-memoIn.y);
  	//ctx.fillRect(rec.x,rec.y,rec.width,rec.height);
  	//ctx.beginPath();
  	// ctx.moveTo(rec.x,rec.y);
  	// ctx.lineTo(rec.x+rec.width,rec.y);
  	// ctx.lineTo(rec.x+rec.width,rec.y+rec.height);
  	// ctx.lineTo(rec.x,rec.y+rec.height);
  	// ctx.lineTo(rec.x,rec.y);
  	ctx.strokeRect(rec.x,rec.y,rec.width,rec.height);
  	//ctx.stroke();

  	}

     static function getCanvas() {
    var canvas = doc.createCanvasElement();
    canvas.width = width;
    canvas.height = height;
    doc.body.appendChild(canvas);
    return canvas;
  }

  public static function main(){
  	trace( "helllo");
  	
  	new CanOver();
  }
}

class Over implements IRenderable<CanvasRender> {
	public var drawn:Signal1<Rectangle>;
	public var enabled : Bool=true;
	var over:Overlay;
	public function new(){
		drawn= new Signal1();
		over= new Overlay(2000,2000);
		over.listen();
		over.signal.add(drawn.dispatch);
	}
  	public function render(render : CanvasRender) : Void{
  		
  		//over.render(render.ctx);
  		var rec=over.rec;
  		//trace("render over"+rec);
  		#if debug
  		if (rec!=null)
  		//render.ctx.fillRect(rec.x,rec.y,rec.width,rec.height);
  		render.ctx.strokeRect(rec.x,rec.y,rec.width,rec.height);
  		#end
  		//render.ctx.fillRect(100,100,100,100);
  	}

	}