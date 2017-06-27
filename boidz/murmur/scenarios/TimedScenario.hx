package murmur.scenarios;
import boidz.render.canvas.*;
import boidz.rules.*;
import murmur.scenarios.IScenario;
import thx.unit.time.*;
import msignal.Signal;
class TimedScenario extends Scenario implements IScenario{
	//var can:murmur.Canvas;
	//var randomVelocity = false;
	//var delay:Int;

	//var scenarios=[];
	//var counter=0;
    public var fini:msignal.Signal0;
    public var elapsed:Float;
    public var scenes:Array<Dynamic>=[];
    public var enabled:Bool=true;
    public var maxTime:Float;
    public var cancel:Void->Void;
    var timer:haxe.Timer;
	public function new(can:murmur.Canvas,clientId,delay:Minute,?maxTime:Millisecond)
     
    {
        super(can,clientId);
    	
    	this.maxTime=maxTime.toFloat();
        //execute();
    	this.delay=Std.int(delay.toMillisecond().toFloat());
        fini= new Signal0();

    
    	//haxe.Timer.(doScene,delay);
    }

    public function chrono(){

        var start = thx.Timer.time();
       cancel= thx.Timer.frame(function(delta) {
       var time = thx.Timer.time();
         elapsed=(time-start);
        // trace( elapsed +"/"+ maxTime);
         if (elapsed>maxTime){
            trace( "fini");
            fini.dispatch();

    }
        var t:Second= elapsed/1000;
        var minutes= t.toMinute();
    }); 
      fini.add(cancel);
    }

    public function execute(){
        chrono();
        
        timer= new haxe.Timer(delay);
        dispatch("execute");
        pushScenes();
        timer.run=doScene;
        
        
        doScene();
    }
    function pushScenes(){
        scenes.push(_scene1);
        scenes.push(_scene2);
        scenes.push(_scene3);
        scenes.push(_scene4);
        scenes.push(_scene5);
    }


    function doScene(){
        if( enabled){
            trace( "doscene"+scenes.length);
    	can.changeAnyColor();
    	var coun = Std.int(Math.abs(counter++ %scenes.length));
    	trace( "coun="+coun);
    	removeorAdd();
        //this.dispatch("_scene"+coun+1);
    	scenes[coun]();
        }
    }

    function _scene1(){
    	setVelocity(.5);

    	can.waypoints.goals=[];
        collision(false);
    	
    	dispatch("_scene1/normal");
    }

    function _scene2(){
    	setVelocity(.6);
 
    	//collision(true,80);
    	
    	
    	dispatch("_scene2/collision");
    }


    function _scene3(){
    	
        setVelocity(.7);
        collision(false);
    	// can.display.removeRenderable(can.zoneBounds);
    	// can.avoidCollisions.enabled=false;
    	 //can.zoneBounds= new ZoneBounds(new RespectBoundaries(200, 800, 200, 500, 50, 25));
         can.flock.addRule(can.zone);
    	// can.zone= new SteerTowardZone(can.flock,can.zoneBounds);

    	// can.display.addRenderable(can.zoneBounds);
   		//  can.flock.addRule(can.zone);
    	dispatch("_scene3/zone/velocity");
    }

    function _scene4(){
    	setVelocity(.6);
    	//can.display.removeRenderable(can.zoneBounds);
    	can.zone.enabled=false;
        collision(false);
    	//can.zoneBounds= new ZoneBounds(new RespectBoundaries(400, 800, 200, 500, 50, 25));

   		can.waypoints.addGoal(Math.random()*can.width, Math.random()*can.height);
   // can.flock.addRule(can.zone);
    	dispatch("_scene4/wayPoint(random)nocollision");
    }

    function _scene5(){
        thx.Timer.delay(function(){
            dispatch("end scene5");
            can.zone.enabled=false;
            setVelocity(lowSpeed);
        },3*1000);
    	setVelocity(moreSpeed);
    
    	can.zoneBounds= new ZoneBounds(new RespectBoundaries(400, 800, 200, 500, 50, 25));

   		
   		can.flock.addRule(can.zone);
    	dispatch("_scene5");
    }

    public function kill(){
        enabled=false;
        can.zone.enabled=true;
        timer.stop();
    }

    public function wakeup(){
         enabled=true;
         //counter=0;
        chrono();
        cancel();
        timer= new haxe.Timer(delay);
        
        timer.run=doScene;
    }

    


    



    
}