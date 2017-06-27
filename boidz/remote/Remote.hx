package remote;
import js.html.*;
import js.Browser.*;
import thx.unit.time.*;
import thx.Timer;
class Remote {
	var colors=["blue","white","red","pink","green"];
	var boxMap:Map<String,Box>= new Map();
	var doc:js.html.HTMLDocument;
	public static var signal=socket.signal.ControlSignal.getInstance();
	public function new(){
     var sok=new socket.SocketManager();
     sok.connected.addOnce(execute);
     doc= document;
    
  }
  var chronoT:js.html.HeadingElement;
  function execute(arg:{ width : Int, height : Int, clientID : Int }){
  	trace ("hello bob");
   chronoT= cast doc.createElement("h1");
   doc.body.appendChild(chronoT);
  	var a=addBar();
  for ( i in 1... 3){
    a.appendChild(
  	generateBox('utils$i', colors[i-1]).box
    );
  } 

    var b=addBar();
  for ( i in 1... 5){
    b.appendChild(
    generateBox('phases$i', colors[i-1]).box
    );
  } 

  boxMap.get('utils1').touch("action","reload");
  boxMap.get('utils1').box.addEventListener("click",function(e){
    trace( "yo chrono");
    chrono();
  });
  boxMap.get('utils2').touch("action","togDebug");

  boxMap.get('phases1').touch("phase","timedScenario");
  boxMap.get('phases2').touch("phase","dessinAlone");
  boxMap.get('phases3').touch("phase","slam");
  boxMap.get('phases4').touch("phase","wall");
  
   
 
 var c=addBar();
  c.appendChild(
    generateBox("red","red").touch("modify","towardCenter").box
    );
  c.appendChild(
    generateBox("red","red").touch("modify","towardUp").box
    );
  c.appendChild(
    generateBox("red","red").touch("modify","towardDown").box
    );
  c.appendChild(
    generateBox("red","red").touch("modify","plusClient1").box
    );
  c.appendChild(
    generateBox("red","red").touch("modify","plusClient0").box
    );
     c.appendChild(
    generateBox("red","red").touch("modify","moinsClient1").box
    );
  c.appendChild(
    generateBox("red","red").touch("modify","moinsClient0").box
    );
  var d=addBar();
    d.appendChild(
    generateBox("fall","olive").touch("action","fall").box
    );
    // d.appendChild(
    // generateBox("contain","orange").touch("action","contain").box
    // );
    d.appendChild(
    generateBox("invade","gray").touch("action","invade").box
    );
    d.appendChild(
    generateBox("act1","green").touch("action","addWalk").box
    );
    
   

  }

    var cancel=function(){};
    public function chrono(){
      cancel();
      var start = thx.Timer.time();
       cancel= thx.Timer.frame(function(delta) {
       var time = thx.Timer.time();
         var elapsed=(time-start);
        // trace( elapsed +"/"+ maxTime);
        

   
        var t:Second= elapsed/1000;
        var minutes= t.toMinute();
        chronoT.innerText=(t:Second).toTime().minutes+" min" +(t:Second).toTime().seconds;
    }); 
      //fini.add(cancel);
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
		var app = new Remote();
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
			Remote.signal.dispatch(this.type,this.value);
		});

		return this;
	}
}