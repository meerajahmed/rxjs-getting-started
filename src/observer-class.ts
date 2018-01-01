import {Observer} from "rxjs/Observer";
export default class MyObserver implements Observer<number> {
    next(value){
        console.log(`value ${value}`);
    }
    error(e){
        console.log(`error ${e}`);
    }
    complete(){
        console.log("complete");
    }
}