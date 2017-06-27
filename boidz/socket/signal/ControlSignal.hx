package socket.signal;

import msignal.Signal;
class ControlSignal extends Signal2<String,Dynamic>{

	 static var _instance:ControlSignal;
	public var complete:Signal2<String,Dynamic>;
	public function new(){
	super(String,Dynamic);
	complete=new Signal2();
	}

	public static function getInstance():ControlSignal{
		if (_instance == null)
			 _instance=new ControlSignal();
		return _instance;
	}
}