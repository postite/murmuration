package murmur.scenarios;
import boidz.rules.*;
import boidz.render.canvas.*;
import thx.unit.time.*;
class WallWalk extends TimedScenario implements IScenario{


	public function new(can:murmur.Canvas,clientId,delay:Minute,?maxTime:Millisecond)
     
    {
        super(can,clientId,delay,maxTime);
    	
    } 
    override function doScene(){
        if( enabled){
            trace( "doscene"+scenes.length);
        can.changeAnyColor();
        var coun = counter++;
        if( coun >= scenes.length){
           timer.stop();
           cancel();
           return;
        }  
        trace( coun);
        //removeorAdd();
        //this.dispatch("_scene"+coun+1);
        scenes[coun]();
        }
    }

    
//ici
    override function pushScenes(){
       // scenes.push(addWalk);
       // scenes.push(fake);
       // scenes.push(removeWalk);

        scenes.push(loin3);
        scenes.push(zoned);
        scenes.push(morezoned);
       
        
        //scenes.push(fall);

         scenes.push(scene4);
         scenes.push(scene5);
    }


    // 	var zaway:SteerAway;
    //  function loin(){
    //  	split(true);
    // 	 zaway=new SteerAway(500,500);
    //      can.randomVelocity=false;
    // 	setVelocity(lowSpeed);
    // 	can.flock.addRule(zaway);
    // 	zaway.enabled=true;
    // 	this.dispatch("loin");
    // }

    function fake(){

    }
    //var toZone:SteerTowardZone;
    function zoned(){
    	zaway.enabled=false;
    	var zone=null;
    	if (clientID==1)
    		zone=new RespectBoundaries((can.width/3),can.width,(can.height/3),can.height);
    	else
    		zone=new RespectBoundaries(0,(can.width/3),(can.height/3),can.height);
    	 toZone= new SteerTowardZone(can.flock,new ZoneBounds(zone));
    	can.flock.addRule(toZone);
    	this.dispatch("zoned");
    }

    function morezoned(){
    	//  thx.Timer.delay(function(){
     //        dispatch("end towardCenter");
     //        centrer(false);
     //        collision(false);
     //        setVelocity(lowSpeed);
     //    },10*1000);
    	// toZone.enabled=false;
    	// setVelocity(midSpeed);
    	// resetWP();
     //    collision(true,80);
    	// centrer(true);
    	this.dispatch("morezoned");
    }
    override function kill(){
    	//toZone.enabled=false;
    	//zaway.enabled=false;
    	enabled=false;
    	setVelocity(lowSpeed);
    	timer.stop();
    }
    override function wakeup(){

    }
}