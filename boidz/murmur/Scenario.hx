package murmur;
import boidz.render.canvas.*;
import boidz.rules.*;
import boidz.IRenderable;
import msignal.Signal;
import thx.promise.Promise;
class Scenario {

    public var hiSpeed=1;
    public var lowSpeed=.6;
    public var midSpeed=.7;
    public var moreSpeed=.8;
    public var veryHiSpeed=1.2;

    var delaySign:Signal0;
	var can:murmur.Canvas;
	var randomVelocity = false;
	var delay:Int;

	
	var counter=0;
    var clientID:Int;

    var zoom:Zoom;
    var away:boidz.rules.SteerAway;


	public function new(can:murmur.Canvas,clientID:Int)
     
    {
    	this.can=can;
        this.clientID=clientID;

    }
    
    
    public function addWalk(){
        thx.Timer.delay(function(){
            can.DS.dispatch("end walk");
            removeWalk();
        },30*1000);
        removeRenderable(can.canvasFlock);
        can.canvasFlock.enabled=false;


        zoom=new Zoom(can.flock);        
        away=new SteerAway(500,500,300);

        can.flock.addRule(away);


        zoom.signal.add(function (){
            can.walk.enabled=true;

            if (can.clientID==0)
            addRenderable(can.walk);
            zoom.enabled=false;
            removeRenderable(zoom);
        });

        setVelocity(hiSpeed);
        addRenderable(zoom);
        
        
        
    }   

    public function removeWalk(){

        away.enabled=false;

        //addRenderable(can.canvasFlock);
        can.canvasFlock.enabled=true;

        zoom.enabled=false;
        removeRenderable(zoom);

        can.walk.enabled=false;
        removeRenderable(can.walk);
        can.timedScenario.wakeup();
        respectBoundaries(true);
        //can.reset();
        addRenderable(can.canvasFlock);
    }


    public function act(value){
        can.DS.dispatch(value);
        if (can.timedScenario.enabled)can.timedScenario.kill();
        //trace( 'Sacenario Act $value');
        switch(value){
            case "walk": 
            can.walk= new Walk(0);
            addWalk();
            case "nowalk":
            removeWalk();
            case x:
            trace(x);
            var methode=Reflect.field(this,x);
            Reflect.callMethod(this,Reflect.field(this,x),[]);
            //
            //wait for last run ?
  
        }
        
    }

    function togDebug(){
        can.toggleDebug();
    }


    function reload(){
        js.Browser.location.reload();
    }

    function contain(){
        
        split(false);
        respectBoundaries(true);
 
      if( clientID==0){
       delaygrowCrowd(250);
       setVelocity(midSpeed);
        }else{
        delayreduceCrowd(30);
    }


    }

    function invade(){

        thx.Timer.delay(function(){
            can.DS.dispatch("end invade");
            can.waypoints.goals=[];
        can.waypoints.enabled=false;
        setVelocity(lowSpeed);
        },30*1000);
        collision(false);
        split(true);
        respectBoundaries(false);

        if( clientID==0){

        can.waypoints.addGoal(3000, 300);
        can.waypoints.enabled=true;
        can.DS.dispatch("end invade");
        setVelocity(veryHiSpeed);
        }else{
            collision(true);
        //reduceCrowd(100);
        }
    }

    function fall(){
        setVelocity(veryHiSpeed);
        collision(false);

        can.fall.enabled=true;
        can.fall.signal.add(function(){
           //can.changeColor("#00AAFF");
           addRenderable(new End(0)); 
        });
        split(false);

    }
    

    function scene1(){
    	setVelocity(hiSpeed);
    	resetWP();
        collision(true,80);
    	centrer(false);
        
    }

    //annule ça !
    function towardCenter(?b:Bool=true){
        trace( "tow"+b);

        thx.Timer.delay(function(){
            can.DS.dispatch("end towardCenter");
            centrer(false);
        },3*1000);

        can.DS.dispatch("toward center b"+b);
        setVelocity(lowSpeed);
        centrer(b);

        trace( "afterTow");
       
    }


     function cancelEffect(m){
    //can.DS.dispatch( 'hefll');
    var promise = Promise.value(m).delay(3000);
    //promise.success(cancel.bind(_,false));
    promise.success(cancel.bind(_,false));
    }
    function cancel(a:Bool->Void,b:Bool){
        //trace( b);
    a(b);
    //can.DS.dispatch( 'hefll $a');
  }


    function scene2(){
    	
        setVelocity(lowSpeed);
        centrer(false);

        collision(true,80);
    	
    	
    }


    function scene3(){
    	setVelocity(midSpeed);
    	// can.display.removeRenderable(can.zoneBounds);
    	// can.avoidCollisions.enabled=false;
    	// can.zoneBounds= new ZoneBounds(new RespectBoundaries(200, 800, 200, 500, 50, 25));

    	// can.zone= new SteerTowardZone(can.flock,can.zoneBounds);

    	// can.display.addRenderable(can.zoneBounds);
   		//  can.flock.addRule(can.zone);
    	//can.DS.dispatch();
    }

    //wayPoints
    function scene4(){
    	setVelocity(midSpeed);
    	//can.display.removeRenderable(can.zoneBounds);
    	collision(false);
    	//can.zoneBounds= new ZoneBounds(new RespectBoundaries(400, 800, 200, 500, 50, 25));

   		can.waypoints.addGoal(Math.random()*can.width, Math.random()*can.height);
        can.waypoints.enabled=true;
   // can.flock.addRule(can.zone);
    	//can.DS.dispatch();
    }

    function scene5(){
    	setVelocity(midSpeed);
    	
    	//can.zoneBounds= new ZoneBounds(new RespectBoundaries(400, 800, 200, 500, 50, 25));

   		
   		//can.flock.addRule(can.zone);
    	//can.DS.dispatch();
    }


    /// ----composition Functions ----
    /// 
    

    inline function respectBoundaries(b:Bool){
        can.respectBoundaries.enabled=b;
        can.respectBoundaries.maxSteer=60;
        can.respectBoundaries.offset=300;
    }

    inline function split(b:Bool)
        can.split.enabled=b;
    
    inline function resetWP(){
        can.waypoints.goals=[];
    }

    inline function centrer(b:Bool){
        can.steerCenter.enabled=b;
    }

    inline function collision(b:Bool,?radius:Int){
        can.avoidCollisions.enabled=b;
        if( radius!=null)
            can.avoidCollisions.radius=radius;
    }
    inline function addRenderable(r:IRenderable<CanvasRender>)
        can.display.addRenderable(r);

    inline function removeRenderable(r:IRenderable<CanvasRender>)
        can.display.addRenderable(r);

     inline function setVelocity(v:Float){
        can.velocity=v;
        can.updateVelocity();
    }

    function removeorAdd(?limit:Int=200){
        trace( "removeorAdd");
    	var num = Std.random(10);
    	var rem:Bool=Random.bool();
    	//rem=false;
    	trace( 'num=$num rem=$rem');
    	if(rem){
    		if( num<can.flock.boids.length && can.flock.boids.length>limit)
    		can.flock.boids.splice(0, num);
    	}else{
            if(can.flock.boids.length>limit)
    	can.addBoids(can.flock, num , can.velocity, can.respectBoundaries.offset);
    	}
    }

function delaygrowCrowd(num){
        var count=0;
        var tim= new haxe.Timer(1000);
        tim.run=function(){
            can.DS.dispatch("delaygrowCrowd");
            if (count<num){
                
        can.addBoids(can.flock,Std.random(5),can.velocity, can.respectBoundaries.offset);
        count+=3;
        }}
        ;
        
    }

    function delayreduceCrowd(limit){
         
        var tim= new haxe.Timer(1000);
        tim.run=function(){
            can.DS.dispatch("delayreduceCrowd");
            if (can.flock.boids.length>limit){
            reduceCrowd(2);
            
            }else{
                tim.stop();
            }
        }
        ;
    }
    function growCrowd(num){

        can.addBoids(can.flock,num,can.velocity, can.respectBoundaries.offset);
    }

    function reduceCrowd(num){
        if( num<can.flock.boids.length)
            can.flock.boids.splice(0, num);
    }





    
}