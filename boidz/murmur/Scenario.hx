package murmur;

class Scenario {
	var can:murmur.Canvas;
	var randomVelocity = false;
	var delay:Int;

	var scenarios=[];
	var counter=0;
	public function new(can:murmur.Canvas,delay:Int)
     
    {
    	this.can=can;
    	scenarios.push(scene1);
    	scenarios.push(scene2);
    	scenarios.push(scene3);

    	this.delay=delay;
    	var timer= new haxe.Timer(delay);
    	
    	timer.run=doScene;
    	//haxe.Timer.(doScene,delay);
    }


    function doScene(){
    	if(counter<scenarios.length)
    	scenarios[counter++]();
    }

    function scene1(){
    	can.velocity=3;
    	can.updateVelocity();
    	
    	can.avoidCollisions.enabled=true;
    	can.avoidCollisions.radius=80;
    	can.DS.dispatch();
    }

    function scene2(){
    	can.velocity=1;
    	can.updateVelocity();
    	
    	can.avoidCollisions.enabled=true;
    	can.avoidCollisions.radius=80;
    	can.DS.dispatch();
    }


    function scene3(){
    	can.velocity=7;
    	can.updateVelocity();
    	
    	can.avoidCollisions.enabled=true;
    	can.avoidCollisions.radius=80;
    	can.DS.dispatch();
    }




    
}