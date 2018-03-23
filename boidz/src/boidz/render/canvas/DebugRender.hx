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
  public var moduloID(default,set):Int;
  var client:js.html.HeadingElement;
  var action:js.html.ParagraphElement;
  var peoples:js.html.HeadingElement;
  var scenario:js.html.HeadingElement;
  var modulo:js.html.HeadingElement;
  public function new(container : DivElement) {
    this.container = container;
    container.id="debug";
    //client=cast js.Browser.document.createElement("H1");
    client=cast js.Browser.document.createElement("H1");
    action= cast js.Browser.document.createElement("p");
    peoples= cast js.Browser.document.createElement("h2");
    scenario= cast js.Browser.document.createElement("h2");
    modulo= cast js.Browser.document.createElement("h2");
    scenarioID="rien";
    this.container.appendChild(client);
    this.container.appendChild(action);
    this.container.appendChild(peoples);
    this.container.appendChild(scenario);
    this.container.appendChild(modulo);
  }

  public function toggle(){
   container.style.display = (container.style.display == "none")? "block" : "none";
  }

  function set_clientID(c:Int):Int{
    client.innerText=Std.string('client$c');
    return clientID=c;
  }
  function set_moduloID(c:Int):Int{
    modulo.innerText=Std.string(c);
    return moduloID=c;
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
  public function affiche(z:String){
    #if debug
    var aff:js.html.DivElement=cast js.Browser.document.createDivElement();
    aff.className="aff";
    aff.innerText=z;
    container.appendChild(aff);
    aff.style.marginLeft="300px";
    //aff.style.marginTop="300px";
    haxe.Timer.delay(function(){
      aff.remove();
      aff=null;
      },1000);
    #end
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