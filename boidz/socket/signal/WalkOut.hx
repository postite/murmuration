package socket.signal;

import msignal.Signal;
class WalkOut extends Signal2<String,Dynamic>{

	 static var _instance:WalkOut;
	public function new(){
	super(String,Dynamic);
	}

	public static function getInstance():WalkOut{
		if (_instance == null)
			 _instance=new WalkOut();
		return _instance;
	}
}