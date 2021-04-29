/* eslint-env browser */
import {Event, Observable} from "./Observable.js";
import Config from "./Config.js";

function initListeners(handler){
  window.addEventListener("online", onOnline.bind(handler));
  window.addEventListener("offline", onOffline.bind(handler));
}

function onOnline(){
  this.notifyAll(new Event(Config.CONNECTION_HANDLER.EVENT.NOW_ONLINE));
}

function onOffline(){
  this.notifyAll(new Event(Config.CONNECTION_HANDLER.EVENT.NOW_OFFLINE));
}

class ConnectionHandler extends Observable{

  constructor(){
    super();
    initListeners(this);
  }

  isConnected(){
    if(window.navigator.onLine){
      return true;
    }
    return false;
  }

}

export default new ConnectionHandler();