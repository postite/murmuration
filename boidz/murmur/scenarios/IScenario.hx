package murmur.scenarios;

interface IScenario  {

	public var elapsed:Float;
	public var enabled:Bool;
	public var fini:msignal.Signal.Signal0;
	public function wakeup():Void;
	public function execute():Void;
	public function kill():Void;
	
		
}