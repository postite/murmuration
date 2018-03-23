package socket;

import js.Node;
import js.npm.Express;


import js.npm.SocketIo;

import js.Node;
import js.node.Http;
import js.node.Path;

import js.npm.Express;
import js.npm.express.*;
import js.npm.Jade;
import Api.LightPeople;
import Config.*;

/**
 * @author Matthijs Kamstra aka [mck]
 */
class Server
{

	private var PORT = 3700;
	public static var numClient:Int=0;
	function new()
	{
		trace('Express website (Basic): open browser at $adress' + PORT);
		trace("Stop node.js : CTRL + c");

		var app    = new js.npm.Express();
		var server = js.node.Http.createServer( cast app );
		var io     = new js.npm.socketio.Server(server);

		app.set('views', Node.__dirname + '/views/');
		app.set('view engine', "jade");

		app.use(new Static(Node.__dirname + '/'));
		//app.use(new Morgan('dev'));
		//app.use(new Favicon(Node.__dirname + '/public/favicon.ico'));

		 app.get("/client/:id", function(req : Request, res : Response ){
		
			res.render("page", {bip:"bop",client:req});
		});
		//  app.get("/", function(req : Request, res : Response ){
		
		// 	res.render("page", {bip:"bop",client:2});
		// });
		//   app.get("/3", function(req : Request, res : Response ){
		
		// 	res.render("page", {bip:"bop",client:3});
		// });
		 app.get("/remote",function(req:Request,res:Response){
		 	res.render("rem", {bip:"remote"});
		 });
		 app.get("/rasp1",function(req:Request,res:Response){
		 	res.render("rasp1", {bip:"rasp"});
		 });

		// app.use(BodyParser.json());
		// app.use(BodyParser.urlencoded({ extended: true }));
		// app.use(new MethodOverride()); // can't find it in js-kit AND don't know what it does...
		// app.use(new Static(Path.join(Node.__dirname, 'public')));

		io.on('connection', function (socket) {
			numClient=(numClient+1)%2;

			socket.emit("clientConnect",untyped{clients:numClient});


			//socket.emit('message', {id:0});
			socket.on('send', function (light:LightPeople) {
				io.sockets.emit('message', light);
			});
			socket.on('ctrl', function (arg) {
				io.sockets.emit('control', arg);
			});
			socket.on('walk', function (arg) {
				io.sockets.emit('walking', arg);
			});
		});
		io.on('disconnect', function (socket) {
			numClient=numClient-2;
			trace( "disconnect");
			
		});

		trace ("Listening on port " + PORT);

		server.listen(PORT);

	}

	static public function main()
	{
		var main = new Server();
	}
}