package murmur.scenarios;
import boidz.rules.*;
import boidz.render.canvas.*;
import thx.unit.time.*;
class Slam extends TimedScenario implements IScenario{


	public function new(can:murmur.Canvas,clientId,delay:Minute,?maxTime:Millisecond)
     
    {
        super(can,clientId,delay,maxTime);
    	        
    } 

    override function pushScenes(){
        //super.execute()
        scenes.push(prepareSplit);
        
        scenes.push(varie);
        scenes.push(isole);
        scenes.push(invade);
        scenes.push(disperse);
        
    }


    function prepareSplit(){
        contain();
        dispatch("prepareSplit");
    }
    function varie(){
        if( clientID==1)
        towardCenter();
        dispatch("varie(toCenter");
    }
    function disperse(){
        if(clientID==0){
        thx.Timer.delay(function(){
            dispatch("end disperse");
            collision(false);
        },3*1000);
        scene1();
        setVelocity(lowSpeed);
        dispatch("disperse");
    }
    }
    function isole(){
        if (clientID==1){
            towardZone((can.width/3)-200,(can.width/3)+200,(can.height/3)-200,(can.height/3)+200 );
        }
    }

    override function kill(){
        enabled=false;
    	split(true);
        timer.stop();
    }
}