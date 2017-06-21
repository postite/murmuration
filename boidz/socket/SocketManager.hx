package socket;
import msignal.Signal;

import  js.browser.SocketIo;
import  js.browser.SocketIo.Socket;
import Config.*;
import Api.LightPeople;
class SocketManager {

	public var connected:Signal1<{width:Int,height:Int,clientID:Int}>= new Signal1();
	public static  var emitSignal=new Signal2<String,Dynamic>();
	public static var walkSignal= new Signal2<String,Dynamic>();
	public static var ctrlSignal= new Signal2<String,Dynamic>();
	var _messages=[];
	var clientId:Int;
	private var _socket : Socket;
	public var dims={width:0,height:0,clientID:0};
	public function new() {
		var window= js.Browser.window;
		var document= js.Browser.document;
		window.onload = function() {
			dims.width=window.outerWidth;
			dims.height=window.outerHeight;
		connect();
		}

		//murmur.SplitBoundaries.outBounds.add(sendMessage);
		socket.signal.SplitOut.getInstance().add(sendMessage);
		socket.signal.WalkOut.getInstance().add(sendWalk);
		socket.signal.ControlSignal.getInstance().add(sendControl);
		//murmur.Walk.outBounds.add(sendWalk);
	}

	function sendControl(type:String,value:Dynamic){
		trace( 'sendControl');
		_socket.emit("ctrl",{type:type,value:value});
	}

	function sendWalk(dir:String,sprite:Dynamic){
		trace( "sendWalk");
		_socket.emit('walk',{dir:dir,sprite:sprite});
	}
	public function sendMessage(dir:String,boid:Dynamic){
		//trace( "ok boid");
		
		_socket.emit('send', {dir:dir,data:boid});
	}

	public function connect(){
		_messages   = [];
		////_socket     = SocketIo.connect('http://localhost:3700');
		//_socket     = SocketIo.connect('http://192.168.1.34:3700'); //maison
		//_socket     = SocketIo.connect('http://172.20.10.3:3700'); //iphone
		//_socket     = SocketIo.connect('http://192.168.0.26:3700'); //exprmntl
		_socket     = SocketIo.connect(adress); //exprmntl
		
		
		_socket.on('message', function (args:{dir:String,data:Dynamic})
		{
			if(args.data != null)
			{
				//_messages.push(data);
				//for( a in _messages)
					//trace(Color.name(data.color));
				emitSignal.dispatch(args.dir,args.data);
			} else {
				trace("There is a problem: " + args.data);
			}
		});
		_socket.on("walking",function(args:{dir:String,sprite:Dynamic}){
			trace( "yo walk");
			walkSignal.dispatch(args.dir,args.sprite);
		});
		_socket.on("control",function(args:{type:String,value:Dynamic}){
			trace( "yo control");
			ctrlSignal.dispatch(args.type,args.value);
		});
		
		_socket.on("clientConnect",function(data){
				this.clientId=data.clients;
				trace( "clientId="+this.clientId);
				dims.clientID=clientId;
				//displayClient();
				//start();
				connected.dispatch(dims);
		});		
	}

	private function displayClient(){
    js.Browser.document.querySelector("#clientId").innerHTML="clientID="+clientId;
  	}



}