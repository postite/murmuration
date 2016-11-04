package crowded;
class CrowdService {


	public static var server:String="http://localhost:2000";

	public function new() {
		
	}


	public function getSimpleList() {
		var req= haxe.Http.requestUrl(server+"/dynamicQuery");
		return haxe.Json.parse(req);

	}


}