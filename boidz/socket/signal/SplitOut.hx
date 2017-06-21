package socket.signal;

import msignal.Signal;
class SplitOut extends Signal2<String,Dynamic>{

	 static var _instance:SplitOut;
	public function new(){
	super(String,Dynamic);
	}

	public static function getInstance():SplitOut{
		if (_instance == null)
			 _instance=new SplitOut();
		return _instance;
	}
}