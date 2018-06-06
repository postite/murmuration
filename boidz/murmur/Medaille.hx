package murmur;
import de.polygonal.ds.DLL;
import js.Browser.*;
import js.html.*;
import tweenx909.TweenX;
using tweenx909.ChainX;

class Medaille {

	public var images:DLL<Image>;
	var current:de.polygonal.ds.DLLNode<js.html.Image>;
	var timer:haxe.Timer;
	var container:js.html.DivElement;
	//var img:Image;
	public function new(){

		var images=populateTab();
		//disposehead();
		
		container=document.createDivElement();
		document.body.appendChild(container);
		container.style.position="relative";
		container.style.margin="0 auto";
		container.style.marginTop="200px";
		container.style.width="600px";
		//container.style.left="100px";
		current=images.head;
		masque();
		trace( current);
		affiche(current);
		timer=new haxe.Timer(10000);
		timer.run=next;

	}
	function masque(){
		document.body.style.backgroundColor="black";
		var canvas = document.createCanvasElement();
		canvas.width=600;
		canvas.height=600;
		canvas.id="mask";
		canvas.style.position="absolute";
		container.appendChild(canvas);
    	var ctx = canvas.getContext2d();

    	//this.ctx.save();

      //trace( y);
      canvas.style.backgroundColor="#000";
      ctx.beginPath();
      ctx.fillStyle ="#FFFFFF";// Medaillon.changeColor(color,(((rayon*100)/400)/100));
      //ctx.fillStyle ="#00AAFF";// Medaillon.changeColor(color,(((rayon*100)/400)/100));
      ctx.arc(300, 300, 300, 0, 2 * Math.PI, false);
      ctx.fill();
  		ctx.save();
	}

	function next(){
		//diminue(current);
		TweenX.tweenFunc1(diminue.bind(current.val),1,0).time(30);//.ease(Easing.quadIn);
		current=current.next;
		affiche(current);
		TweenX.tweenFunc1(augmente.bind(current.val),0,1).time(3);//.ease(Easing.quadIn);
		//augmente(current);
	}
	function populateTab(){
		images= new DLL();


		for (a in 1...21){
			var img=new js.html.Image();
	 		img.style.position="absolute";
			//img.src='./medaille/Calque_$a.png';
			img.src='./medaille/lombezportrait$a.png';
			images.append(img);
		}
		images.close();
		trace(images.toString());
		trace( images.isCircular());
		
		return images;
	}

	function affiche(c){
	 
		container.appendChild(c.val);	
	}

	function diminue(it:js.html.Image,val:Float){

		it.style.opacity='$val';
	}
	function augmente(it:js.html.Image,val:Float){
		it.style.opacity='$val';
	}
// 	function draw(x:Float, size:Float) {
//     graphics.lineStyle(1, 0x335F73);
//     graphics.drawCircle(x, 200, size);
// }




	static public function main() {
		var app = new Medaille();
	}
}