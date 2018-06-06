package murmur;
import js.html.*;
import thx.color.Rgb;
import msignal.Signal;
using tweenxcore.Tools;
import de.polygonal.ds.DLL;
using Std;
class Medaillon {

	public static var width:Float=800;
	public static var height:Int=800;
  var counter:Int=1;
  public var items:DLL<Item>=new DLL();
	var render:CanvasRender;
  public static var TOTAL_FRAME:Int = 20;
   // private var square:Square;
  private var frameCount = 0;

	public function new() {
		trace( "yo");
		render=new CanvasRender(getCanvas());
    for( a in 0...5){
      var item=new Item(render.ctx,counter);
        items.append(item);
        item.color=anyColor();
        item.reset();

        counter=counter+20;
        trace("counter="+counter); 
      }
      update();
      //var loop= new haxe.Timer(10000);
      //loop.run=update;
      
      // loop.run=function(){
      //   var timer=new haxe.Timer(100);
      //   timer.run=update.bind(null);
      // }
	  
   
    Item.signal.add(function(i:Item){
      trace( "removed");
       //items.remove(i);
      // //i.enabled=false;
      i.x=10;

       //i.reset();
     
    }
      );
  //update();

	}



	static public function main() {
		var app = new Medaillon();
	}

	// 
  // 

	function getCanvas() {
    var canvas = js.Browser.document.createCanvasElement();
    canvas.width = cast width;
    canvas.height = height;
    js.Browser.document.body.appendChild(canvas);
    return canvas;
  }

  public function anyColor():String{
    return "#"+StringTools.hex(
        Std.int(Math.random()
        * 0xFFFFFF ));
  }
  public static function changeAnyColor():String{
    return changeColor("#"+StringTools.hex(
        Std.int(Math.random()
        * 0xFFFFFF ))
      );
  }
  public static function changeColor(color:String,?amount:Float=.30):String{
    
    var rgb:Rgb=color;
    var lightcolor= rgb.darker(amount);
    return lightcolor;
    //js.Browser.document.body.style.backgroundColor=lightcolor.toHex();
    
  }

  public function _update():Void {
    
        var rate = frameCount / TOTAL_FRAME;
        if (rate <= 1) {
          render.clear();
          trace( rate);
          for (item in items){
       
        item.x = rate.linear().lerp(item.x,item.x+100);
        //item.rayon = rate.quintOut().lerp(item.rayon,item.rayon+25);
        item.update();
        //item.enabled=true;
        //itemTimer.run=item.update.bind(null);

        
        }
          frameCount++; 
        }
         
    }
var diff:Int=0;

  function update(){
     
     //render.clear();
      var tween= new haxe.Timer(100);
      tween.run=_update;
      //timer.stop();
     // if( diff<100)
      //js.Browser.window.requestAnimationFrame(update);

  }

}

class Item{

  public var x:Float;
  public var y:Float;
  public var rayon:Float;
  public var color:String;
  public var enabled:Bool=true;
  public static var signal:Signal1<Item>=new Signal1();
  var counter:Int;
  var ctx:CanvasRenderingContext2D;
  public function new(ctx,id){
    this.ctx=ctx;
    this.counter=id;
  }
  public function render(){
      //trace( y);

      ctx.beginPath();
      ctx.fillStyle =color;// Medaillon.changeColor(color,(((rayon*100)/400)/100));
      ctx.arc(x, y, rayon, 0, 2 * Math.PI, false);
      ctx.fill();
  }
  public function update(?index:Float){

    
    if(this.x>400)
      signal.dispatch(this);
    if (enabled)
    render();
    
  }
  public function reset(){
        //this.x=(800/2)+((counter*2)%100);
        this.x=6*counter;
        this.y=60;
        this.rayon=30;//(counter*3);
        //this.color="#ffffff";
  }

}

class CanvasRender  {
  public var canvas(default, null) : CanvasElement;
  public var ctx(default, null) : CanvasRenderingContext2D;

  public function new(canvas : CanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext2d();
    this.ctx.save();
  }

  public function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  public function beforeEach()
    this.ctx.save();

  public function afterEach()
    this.ctx.restore();
}