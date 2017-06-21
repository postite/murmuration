package murmur;
import msignal.Signal;

class DoneSignal extends Signal2<String,String> {
	
	public function new (){
		super(String,String);
	}
	static var instance:DoneSignal;
	public static function getInstance():DoneSignal{
		if( instance!=null)return instance;
		return instance= new DoneSignal();
	}
}