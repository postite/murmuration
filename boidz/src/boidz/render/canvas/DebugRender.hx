package boidz.render.canvas;

import boidz.IRender;
import js.html.*;


class DebugRender implements IRender {
  public var container(default, null) : DivElement;
  //public var ctx(default, null) : CanvasRenderingContext2D;
  public var clientID(default,set):Int;
  public var actionID(default,set):String;
  public var peopleID(default,set):Int;
  public var scenarioID(default,set):String;
  var client:js.html.HeadingElement;
  var action:js.html.ParagraphElement;
  var peoples:js.html.HeadingElement;
  var scenario:js.html.HeadingElement;
  public function new(container : DivElement) {
    this.container = container;
    container.id="debug";
    client=cast js.Browser.document.createElement("H1");
    action= cast js.Browser.document.createElement("p");
    peoples= cast js.Browser.document.createElement("h2");
    scenario= cast js.Browser.document.createElement("h2");
    scenarioID="rien";
    this.container.appendChild(client);
    this.container.appendChild(action);
    this.container.appendChild(peoples);
    this.container.appendChild(scenario);
  }

  public function toggle(){
   container.style.display = (container.style.display == "none")? "block" : "none";
  }

  function set_clientID(c:Int):Int{
    client.innerText=Std.string('client$c');
    return clientID=c;
  }
  function set_actionID(c:String):String{
    action.innerText=c;
    return actionID=c;
  }
  function set_peopleID(c:Int):Int{
    peoples.innerText=Std.string(c);
    return peopleID=c;
  }
  function set_scenarioID(c:String):String{
    scenario.innerText=Std.string(c);
    return scenarioID=c;
  }

  public function clear() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  public function beforeEach(){
    //this.ctx.save();
  }

  public function afterEach(){
    //this.ctx.restore();
  }
}