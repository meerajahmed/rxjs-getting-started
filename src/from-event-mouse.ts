import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/operator/map"
import "rxjs/add/operator/delay"
import "./from-event.css"

let circle = document.getElementById("circle");

// wire up event handler from DOM element
let emitter = Observable.fromEvent(document, "mousemove")
    .map((e: MouseEvent) => {
            return {
                x: e.clientX,
                y: e.clientY
            }
        })
    .delay(300);

emitter.subscribe(
    (value) => {
        circle.style.left = value.x + "px";
        circle.style.top = value.y + "px";
    },
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);