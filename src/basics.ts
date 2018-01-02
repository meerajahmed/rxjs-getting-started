import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/from";
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import MyObserver from "./observer-class";

/****************** 1.  ways to create observer ********************/
console.log("************ Ways to create Observer ***************");
// 1.1 example of observer from class
let number = [1,4,7];
// producer
let source = Observable.from(number);

// consumer
source.subscribe(new MyObserver());

// we can have multiple subscriber to same observable

// 1.2 example of observer without class

source.subscribe(
    value => {
        console.log(`value ${value}`);
    },
    e => {
        console.log(`error ${e}`);
    },
    () => {
        console.log("complete")
    }
);

/******************* 2. ways to create observable ********************/
console.log("************ Ways to create Observer ***************");
let someArray = [1,3,5, -1];
let generator = Observable.create( observer => {
    for(let value of someArray){
        if( value < 0 ){
            observer.error("Value is less than zero")
        }
        observer.next(value);
    }
    observer.complete();
});

generator.subscribe(
    value => console.log(`value ${value}`),
    e => console.log(`error ${e}`),
    () => console.log("complete")
);

/********************* 3. Observable that produces streams over time **************************/
console.log("******************** Observable that produces streams over time ************************");

let someData = [1,4,7];
let asyncGenerator = Observable.create( observer=> {
    let index = 0;
    let produceValue = () => {
        observer.next(someData[index++]);
        if( index < someData.length ){
            setTimeout(produceValue, 2000);
        } else {
            observer.complete();
        }
    };
    produceValue();
});

/*asyncGenerator.subscribe(
 value => console.log(`value ${value}`),
 e => console.log(`error ${e}`),
 () => console.log("complete")
 );*/
/*********************** 4. Operators  ****************************/
console.log("******************* Operators ***************");

let staticData = [1,4,7];
let aGenerator: any;
aGenerator = Observable.create(observer => {
    let index = 0;
    let produceValue = () => {
        observer.next(staticData[index++]);
        if (index < staticData.length) {
            setTimeout(produceValue, 2000);
        } else {
            observer.complete();
        }
    };
    produceValue();
}).map(n => n * 2)
    .filter(n => n > 4);
// processing pipeline for data


aGenerator.subscribe(
    value => console.log(`value ${value}`),
    e => console.log(`error ${e}`),
    () => console.log("complete")
);