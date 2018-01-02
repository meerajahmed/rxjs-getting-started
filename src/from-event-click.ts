import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/retryWhen";
import "rxjs/add/operator/scan";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/delay";

let output = document.getElementById("output");
let button = document.getElementById("button");

let emitter = Observable.fromEvent(button, "click");

/*emitter.subscribe(
    value => load("/src/movies.json"),
    e => console.log(e),
    () => console.log("complete")
);*/


/*emitter.map(e => load("src/movies.json"))
    .subscribe( o => console.log(o));*/
// still subscribing to click observer

// flatMap -> mergeMap(now) lets us subscribe to observer of load() but continue subscription to click emitter

emitter.mergeMap(e => load("src/movies.json"))
    .subscribe(
        renderMovies,
        e => console.log(e),
        () => console.log("complete")
    );

// now we have removed the render movie code that was early nested in load call
// we can have any number of subscribes

// un subscribe request to server
let subscription = load("src/movies.json")
    .subscribe(renderMovies,
        e => console.log(`error: ${e}`),
        () => console.log("complete!")
    );
console.log(subscription);
subscription.unsubscribe();


// load method will make ajax call only if there are any subscriber
function load(url: string){
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();
        let onLoad = () => {
            if( xhr.status === 200 ){
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete();
            } else {
                observer.error(xhr.statusText)
            }
        };
        xhr.addEventListener('load', onLoad);
        xhr.open("GET", url);
        xhr.send();
        // un subscribe logic
        return () => {
            // cancel async operation here
            // put clean up code here
            // this function is also called when ever the retryWhen() is executed
            xhr.removeEventListener("load", onLoad);
            xhr.abort(); // if there is current request to server then cancel that request
        };

    }).retryWhen(retryStrategy({attempts: 3, delay: 1000}));
    // in case of error retry previous operation as per the strategy
}

// retry network failed operations
function retryStrategy({attempts = 4, delay = 1000}) {
    return function (errors) {
        return errors.scan((acc, value) => {
            console.log(acc, value);
            return acc + 1;
        }, 0)
            .takeWhile(acc => acc < attempts)
            .delay(delay);
    }
}

function renderMovies(movies){
    movies.forEach(m => {
        let div = document.createElement("DIV");
        div.innerText = m.title;
        output.appendChild(div);
    });
}
