typedef LightPeople={
	x:Float,
	y:Float,
	id:Int,
	color:String,
	vel:Float,
	height:Float,
	state:Int
}

@:enum abstract Color(String) {

	var green="#9FD665";
	var ocre="#E6D67E";
	var blue="#00AAFF";
	var orange="#F27C4E";
	var violet="#8116C9";
	public static function name(c:String){
		return switch(c){
case "#9FD665":"green";
case "#E6D67E":"ocre";
case "#00AAFF":"blue";
case "#F27C4E":"orange";
case "#8116C9":"violet";
case _:"rien";
		}
	}
}
class Api{

	

}