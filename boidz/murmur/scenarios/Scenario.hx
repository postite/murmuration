package murmur.scenarios;
import boidz.render.canvas.*;
import boidz.rules.*;
import boidz.IRenderable;
import msignal.Signal;
import thx.unit.time.*;
class Scenario {

    public var hiSpeed=1;
    public var lowSpeed=.6;
    public var midSpeed=.7;
    public var moreSpeed=.8;
    public var veryHiSpeed=1.2;
    public var antiSpeed:Bool=false;
    public static var DS:murmur.DoneSignal;

    //scenarios
   // var timedScenario :TimedScenario;
   public var faller:Fall;
   static  var currentScenario:IScenario;
    var delaySign:Signal0;
	var can:murmur.Canvas;
	var randomVelocity = false;
	var delay:Int;

	var scenarios:Array<murmur.scenarios.IScenario>=[];

	var counter=0;
    var clientID:Int;
    var scenariosCount:Int=0;
    var zoom:Zoom;
    var away:boidz.rules.SteerAway;


	public function new(can:murmur.Canvas,clientID:Int)
     
    {
    	this.can=can;
        this.clientID=clientID;

    }

    public function init(){
        DS=murmur.DoneSignal.getInstance();
       // currentScenario=new TimedScenario(can,clientID,21600);
        //currentScenario=new DessinAlone(can,clientID,21600);
        initScenarios();
        chainingScenarios();
        dispatch("init");
        


        //socket.SocketManager.ctrlSignal.add(function (type,value){
        socket.signal.ControlSignal.getInstance().complete.add(function (type,value){
      trace("new ctrl Signal");
      switch (type){
        case "color": can.changeColor(value);
        case "action": act(value);
        case "phase": phase(value);
        case "modify": modify(value);
        case _: 
      }
    });
        
        
    }

    function chainingScenarios(){
        trace( "chainig "+ scenariosCount);
        currentScenario=scenarios[scenariosCount];
        if (currentScenario.elapsed==null)
        currentScenario.execute();
        else 
        currentScenario.wakeup();
        currentScenario.fini.add(function(){
            trace("fini"+scenariosCount);
            currentScenario.kill();
            chainingScenarios();
            dispatch("switch");
        });
        if (scenariosCount==scenarios.length-1)
            scenariosCount=0;
         else
        scenariosCount=scenariosCount+1 ;//Std.int(Math.abs(counter++ %scenarios.length));
    }


    public function phase(value){
        trace("phase"+value);
        currentScenario.kill();
        switch(value){
            case "timedScenario":
                scenariosCount=0;
            case "dessinAlone":
            scenariosCount=1;
            case "slam":
            scenariosCount=2;
            case "wall":
            scenariosCount=3;
            
        }
        chainingScenarios();

    }


    function initScenarios(){
         
        
        scenarios.push(new TimedScenario(can,clientID,(5 : Minute)/5,(5 : Minute).toMillisecond()));
        
        scenarios.push(new DessinAlone(can,clientID,(1 : Minute)/4,(1 : Minute).toMillisecond()));
        scenarios.push(new Slam(can,clientID,(7 : Minute)/5,(7 : Minute).toMillisecond()));
        scenarios.push(new WallWalk(can,clientID,(8: Minute)/6,( 8: Minute).toMillisecond()));
        
        //scenarios.push(new Jam(can,clientID,(5 : Minute)/5,(5 : Minute).toMillisecond()));
        scenarios.push(new TimedScenario(can,clientID,(5 : Minute)/5,(5 : Minute).toMillisecond()));

    }
    
    
    public function addWalk(?remote:Bool=false){
        #if debug
        can.changeAnyColor();
        #end
        can.randomVelocity=false;
        setVelocity(.1);
        away=new SteerAway(500,500,23);
        can.flock.addRule(away);
       // away.enabled=false;

        removeRenderable(can.canvasFlock);
        can.canvasFlock.enabled=false;

        can.walk=new Walk(1);
        zoom=new Zoom(can.flock); 

        trace( away);
        setVelocity(5);
        away.enabled=true;

         


        zoom.signal.add(function (){
            #if debug
        can.changeAnyColor();
        #end
            can.walk.enabled=true;
            away.enabled=false;
            can.randomVelocity=true;
            setVelocity(lowSpeed);
            if (clientID==1)
            addRenderable(can.walk);
            zoom.enabled=false;
            removeRenderable(zoom);

            if(remote)
            thx.Timer.delay(function(){
            
            removeWalk(true);
            dispatch("end walk");
            },30*1000);
        
        });

        //setVelocity(hiSpeed);
        addRenderable(zoom);
        
        
        
        
    }   

    public function removeWalk(?remote:Bool=false){

        socket.SocketManager.walkSignal.addOnce(function(dir,sprite:murmur.Sprite){
        can.walk.gone=true;
        can.walk.enabled=false;

        away.enabled=false;

        //addRenderable(can.canvasFlock);
        can.canvasFlock.enabled=true;
        setVelocity(1);
        zoom.enabled=false;
        removeRenderable(zoom);

        
        removeRenderable(can.walk);
        currentScenario.wakeup();
        respectBoundaries(true);
        //can.reset();
        addRenderable(can.canvasFlock);
        });

    }


    public function act(value){
        can.debugRender.affiche(value);
        dispatch(value);
        resetRules();
        if (currentScenario.enabled)currentScenario.kill();
        //trace( 'Sacenario Act $value');
        switch(value){
            
            case x:
            trace(x);
            var methode=Reflect.field(this,x);
            Reflect.callMethod(this,Reflect.field(this,x),[true]);
            //
            //wait for last run ?
  
        }
        
    }



    public function modify(value){
        can.debugRender.affiche(value);
        switch(value){
            
            case x:
            trace(x);
            var methode=Reflect.field(this,x);
            Reflect.callMethod(this,Reflect.field(this,x),[]);
            //
            //wait for last run ?
  
        }
    }

    public function towardUp(){
        thx.Timer.delay(function(){
            toZone.enabled=false;
        //setVelocity(lowSpeed);
        },30*1000);
        towardZone(0,can.width,0,300);
    }

    public function towardDown(){
        thx.Timer.delay(function(){
            toZone.enabled=false;
        //setVelocity(lowSpeed);
        },30*1000);
        towardZone(0,can.width,can.height-300,can.height);
    }

    function loin1(){
        if (clientID==1)
            loin();
    }
    function loin2(){
        if (clientID==2)
            loin();
    }
    function loin3(){
        if (clientID==3)
            loin();
    }

        var zaway:SteerAway;
     function loin(){
        split(true);
         zaway=new SteerAway(500,500);
         can.randomVelocity=false;
        setVelocity(lowSpeed);
        can.flock.addRule(zaway);
        zaway.enabled=true;
        respectBoundaries(true);
        this.dispatch("loin");
    }

    public function plusClient():Void {
        //if( clientID==2)
            delaygrowCrowd(200);
    }
    public function moinsClient():Void {
        //if( clientID==2)
            delayreduceCrowd(50);
    }

    // public function plusClient1():Void {
    //     if( clientID==1)
    //         delaygrowCrowd(200);
    // }
    // public function moinsClient1():Void {
    //     if( clientID==1)
    //         delayreduceCrowd(50);
    // }
    public function plusrapide():Void {
        
        setVelocity(can.velocity+.5,true);
        antiSpeed=true;
    }
    public function moinsrapide():Void {
        
        setVelocity(can.velocity-.5,true);
        antiSpeed=true;
    }
    public function libereSpeed():Void {
        antiSpeed=false;
        
    }



    function togDebug(){
        can.toggleDebug();
    }


    function reload(){
        js.Browser.location.reload();
    }

    function jam(){
        setVelocity(3); 
       collision(true);
    }

    function stop(){
        setVelocity(0,true);
    }

    function contain(){
        
        split(false);
        respectBoundaries(true);
 
      if( clientID==1){
       delaygrowCrowd(400);
       setVelocity(midSpeed);
        }else{
        delayreduceCrowd(50);
    }


    }

    function invade(){

        thx.Timer.delay(function(){
            dispatch("end invade");
            can.waypoints.goals=[];

        can.waypoints.enabled=false;
        setVelocity(lowSpeed);
        },30*1000);
        collision(false);
        split(true);
        respectBoundaries(false);
        currentScenario.kill();
        if( clientID==1){
          can.waypoints.maxSteer=7;
          can.waypoints.radius=72;  
        can.waypoints.addGoal(3000,72);
        can.waypoints.enabled=true;
        dispatch("end invade");
        can.randomVelocity=true;
        setVelocity(veryHiSpeed);
        }else{
            //collision(true);
        //reduceCrowd(100);
        }
    }

    

    var toZone:SteerTowardZone;
    function towardZone(minX,maxX,minY,maxY){
       
        var zone=null;
        
            zone=new RespectBoundaries(minX,maxX,minY,maxY);
        
         toZone= new SteerTowardZone(can.flock,new ZoneBounds(zone));
        can.flock.addRule(toZone);
        this.dispatch("towardZone");
    }

    function fall(?remote:Bool=false){


        faller= new murmur.Fall(can.flock,new boidz.render.canvas.ZoneBounds(new RespectBoundaries(0,can.width,0,can.height)),null);
        faller.enabled=false;
        can.flock.addRule(faller);
        dispatch("fall");
        can.randomVelocity=false;
        setVelocity(veryHiSpeed);
        collision(false);

        faller.enabled=true;
        faller.signal.add(function(){
           //can.changeColor("#00AAFF");
           addRenderable(new End(0));
           finish(); 
        });
        split(false);

    }

    function finish(){
        currentScenario.kill();
    }
    

    function scene1(){
    	setVelocity(hiSpeed);
    	resetWP();
        collision(true,80);
    	centrer(false);
        
    }
    function resetRules(){
        for( rule in can.flock.rules)
            rule.enabled=false;
    }

    //annule ça !
    function towardCenter(?b:Bool=true){
        trace( "tow"+b);

        thx.Timer.delay(function(){
            dispatch("end towardCenter");
            centrer(false);
        },3*1000);

        dispatch("toward center b"+b);
        setVelocity(lowSpeed);
        centrer(b);

        
       
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

     inline function setVelocity(v:Float,?bypass:Bool=false){
        if (!antiSpeed||bypass){
        can.velocity=v;
        can.updateVelocity();
        }
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

function delaygrowCrowd(num:Int){
        var count=0;
        var tim= new haxe.Timer(1000);
        tim.run=function(){
            //dispatch("delaygrowCrowd");
            trace( 'count:$count, num:$num');
            if (count<num){

                var rand=Std.random(5);
                trace( 'rand=$rand');
        can.addBoids(can.flock,rand,can.velocity, can.respectBoundaries.offset);
        count=count+rand;
        can.debugRender.peopleID=can.flock.boids.length;
        }else{
            tim.stop();
        }}
        ;
        
    }

    function delayreduceCrowd(limit){
         
        var tim= new haxe.Timer(1000);
        tim.run=function(){
           // dispatch("delayreduceCrowd");
            if (can.flock.boids.length>limit){
            reduceCrowd(2);
            
            }else{
                tim.stop();
            }
        }
        ;

    }
    public function growCrowd(num){

        can.addBoids(can.flock,num,can.velocity, can.respectBoundaries.offset);
        can.debugRender.peopleID=can.flock.boids.length;
    }

    public function reduceCrowd(num){
        if( num<can.flock.boids.length)
            can.flock.boids.splice(0, num);
        can.debugRender.peopleID=can.flock.boids.length;
    }

    function dispatch(action){

var mins=(currentScenario.elapsed : thx.unit.time.Millisecond).toMinute();
        DS.dispatch(Type.getClassName(Type.getClass(currentScenario)).split(".")[2]+"/"+mins,action);
    
    }





    
}