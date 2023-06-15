
function _sum(left, right) {
    cliLogTimestamped("DEFAULT", left + right);
    //return left + right;
}

function _sumNested(left, right) {
    function _text(s) {
        cliLogTimestamped("DEFAULT", s);
    }

    _text(left + right);
}

class Car {
    constructor(model, year) {
        this._year = year;
        this._model = model;
        this._speed = 0;
    }

    accelerate() {
        this._speed += 10;
    }

    getModel() {
        return this._model;
    }

    setModel(model) {
        this._model = model;
    }
};

class A {
    helloA() {
        cliLogTimestamped("DEFAULT", "Hello from A");
    }
}
class B extends A {
}

function cliRunFunc() {
    let _b = new B();
    _b.helloA();

    return;
    let car = new Car("Octavia", 2019);/*
    cliLogTimestamped("", car._year);
    cliLogTimestamped("", car._speed);
    cliLogTimestamped("", car._model);*/
    cliPrintDictionary(car, "");
    car.accelerate();
    cliPrintDictionary(car, "");
    cliLogTimestamped("DEFAULT", `Model: <i>${car.getModel()}</i>`);
    car.setModel("Golf");
    cliLogTimestamped("DEFAULT", `Model: <i>${car.getModel()}</i>`);

    return;
    // 09 May '29 ^^^
    // objects
    let person = {
        name: "Test",
        age: 25,
        hobbies: ["Running", "Swimming", "Reading"],
        sayHello: function () {
            return "Hello";
        }
    };

    // nested functions
    let a = Math.PI;
    let b = Math.E;

    _sumNested(a, b);
    _text("123");
    _sumNested(person.name, person.hobbies[0]);
    return;
    //person.sayHello();
    //cliPrintDictionary(person, "");
    cliLogTimestamped('DEFAULT', `
        ${person.sayHello()}, my name is ${person.name}.
        I am ${person.age} years old and my favourite hobby is ${person.hobbies[1]}.`);
    return;

    // functions
    _sum("Hello ", "World!");
    return;

    /// 18 Apr. '23 ^^^
    //splice
    let numbers = [1, 2, 3, 4, 5];
    let deleted = numbers.splice(2, 2, 8, 9);

    cliLog("DEFAULT", `numbers: ${numbers}`);
    cliLog("DEFAULT", `deleted: ${deleted}`);

    return;
    let myArray = [];
    for (let i = 1; i <= 10; i++) {
        myArray.push(i);
    }

    // foreach
    myArray.forEach(num => {
        cliLog("DEFAULT", num)
    });

    let oddArray = [];

    myArray.forEach(x => {
        if (x % 2 != 0) {
            oddArray.push(x);
        }
    });

    cliLog("DEFAULT", `oddArray: ${oddArray}`);

    return;
    // filter
    let evenArray = myArray.filter(num => num % 2 == 0);

    cliLog("DEFAULT", `myArray: ${myArray}`);
    cliLog("DEFAULT", `evenArray: ${evenArray}`);
}
