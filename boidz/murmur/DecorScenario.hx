package murmur;
import murmur.CanOver.Rectangle;
import boidz.Flock;
import boidz.Boid;
import boidz.rules.*;

class DecorScenario extends murmur.scenarios.TimedScenario{


	//var decors=Array<Decor>;
	//var scenarios:Array<murmur.scenarios.IScenario>=[];
	var curDecor:murmur.Decor;
	var curGrappe:murmur.People;
	static  var currentScenario=null;
	override public function execute(){
		trace("yo execute DecorScenario");
		chrono();
		 timer= new haxe.Timer(delay);
		 //dispatch("execute");
		 timer.run=decoradd;
		 decoradd();
	}
	

    function decoradd(){
    	
    	if(curDecor!=null) remove();
    	//load decor 
    	var image= new murmur.Decor.DecorImage();
    	// get Width/heigt?

    	curDecor = new murmur.Decor(image,{width:can.width,height:can.height});
    	
    	

    	curDecor.init();
    	curDecor.fim.map(function(i){
    		trace( "fimed"+i);
    		
    	});
    	
    	// add to can
    	addRenderable(curDecor);
    	addGrappe(randomRec());

    	//wait 
    	
    }
    function remove(){
    	trace("remove");
    	can.display.removeRenderable(curDecor);
    	can.display.removeRenderable(curGrappe);

    }

    function randomRec():Rectangle{
    	
    	var width=100+Std.random(can.width-200);
    	var height=100+Std.random(can.height-200);
    	var x= Std.random(can.width-width);
    	var y= Std.random(can.height-height);

    	return {x:x,y:y,width:width,height:height};
    }

    function numGroupe():Int{
    	return 1+Std.random(6);
    }

    function addGrappe(rec:murmur.CanOver.Rectangle){

        trace("drawn people" +rec);
        var petitflock =new Flock();
        can.flocks.push(petitflock);
        curGrappe= new murmur.People(petitflock);
        var steerAway=new boidz.rules.SteerAway(rec.x+rec.width/2,rec.y+rec.height/2);
        petitflock.addRule(steerAway);
        var split= new murmur.SplitBoundaries(0, can.width, 0, can.height);
        murmur.SplitBoundaries.outBounds.add(function(a,b){
        	petitflock.boids.remove(b);
        });

        petitflock.addRule(split);
        var groupeBounds = new RespectBoundaries(rec.x,rec.width, rec.y,rec.height);
        can.addBoidsInBounds(petitflock, numGroupe(),can.velocity,groupeBounds,BoidType.Red);
        addRenderable(curGrappe);
    
    }


  //   function removeBoid(dir:String,b:Boid){ 	
  //   flock.boids.remove(b);
  //   debugRender.peopleID=flock.boids.length;
  // }

}