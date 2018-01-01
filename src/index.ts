

import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/from";

let number = [1,4,7];
let source = Observable.from(number);

class MyObservable {
    next(value){
        console.log(`value ${value}`);
    }
    error(e){
        console.log(`error ${e}`);
    }
    complete(){
        console.log("complete")
    }
}

source.subscribe(new MyObservable());