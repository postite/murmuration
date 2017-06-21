package murmur;
import msignal.Signal;

class DoneSignal extends Signal1<String> {
	
	public function new (){
		super(String);
	}
	static var instance:DoneSignal;
	public static function getInstance():DoneSignal{
		if( instance!=null)return instance;
		return instance= new DoneSignal();
	}
}