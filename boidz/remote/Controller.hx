package remote;
import js.html.*;
import js.Browser.*;


class Controller {
	var colors=["blue","white","red"];
	var boxMap:Map<String,Box>= new Map();
	var doc:js.html.HTMLDocument;
	public static var signal=socket.signal.ControlSignal.getInstance();
	public function new(){
     var sok=new socket.SocketManager();
     sok.connected.addOnce(execute);
     doc= document;
    
  }
  function execute(arg:{ width : Int, height : Int, clientID : Int }){
  	trace ("hello bob");
  
  	
  for ( a in 1... 3){
  	generateBox('box$a', colors[a-1]);
  } 

  boxMap.get('box1').touch("action","reload");
  boxMap.get('box2').touch("action","togDebug");
  
  var act1= generateBox("act1","green").touch("action","walk");
  var act2= generateBox("act1","yellow").touch("action","nowalk");
 var b= addBar();
 b.appendChild(
   generateBox("scenTest","purple").touch("action","scene1").box
   );
 b.appendChild(
   generateBox("scenTest","purple").touch("action","scene2").box
   );
 b.appendChild(
   generateBox("scenTest","purple").touch("action","scene3").box
   );
 b.appendChild(
   generateBox("scenTest","purple").touch("action","scene4").box
   );
 b.appendChild(
   generateBox("scenTest","purple").touch("action","scene5").box
   );
   generateBox("red","red").touch("action","towardCenter");
   generateBox("fall","olive").touch("action","fall");
   generateBox("contain","orange").touch("action","contain");
   generateBox("invade","gray").touch("action","invade");
   generateBox("scenario","gray").touch("action","scenario");
   

  }
  function addBar(){
  	var bar=doc.createDivElement();
  	bar.classList.add("bar");
  	doc.body.appendChild(bar);
  	return bar;
  }

  function generateBox(id,color):Box{
  	var b=new Box(id,color );
  	boxMap.set(id,b);
  	return b;

  	
  }

	static public function main() {
		var app = new Controller();
	}
}

class Box {
	public var box:js.html.Element;
	var type:String;
	var value:Dynamic;
	var titre:String;
	var htitre:js.html.HeadingElement;

	public function new(id:String,color:String){
		box= js.Browser.document.createElement("div");
		box.id=id;
		box.classList.add("box");
		 htitre=cast document.createElement("h6");
		htitre.innerText="op";
		box.appendChild(htitre);
		box.style.backgroundColor=color;
		document.body.appendChild(box);
	}
	public function touch(type,value){
		this.type=type;
		this.value=value;
		this.titre=value;
		htitre.innerText=titre;
		box.addEventListener("click",function(e){
			trace("click");
			Controller.signal.dispatch(this.type,this.value);
		});

		return this;
	}
}