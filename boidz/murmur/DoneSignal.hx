package murmur;
import msignal.Signal;

class DoneSignal extends Signal0 {
	
	static var instance:DoneSignal;
	public static function getInstance():DoneSignal{
		if( instance!=null)return instance;
		return instance= new DoneSignal();
	}
}