class Student {
    constructor(age, name, grade) {
        this.Age = age;
        this.Grade = grade;
        this.Name = name;
    }

    static GetAverageGrade(students) {
        let avg = 0;
        for (let i = 0; i <= students.length - 1; i++) {
            avg += students[i].Grade;
        }
        return avg / students.length;
    }
}

class BankAccount {
    constructor(accNumber, balance) {
        this.AccountNumber = accNumber;
        this.Balance = balance;
    }

    Deposit(amount) {
        this.Balance += amount;
        return this.Balance;
    }

    Withdraw(amount) {
        this.Balance -= amount;
        return this.Balance;
    }
}

function studentTest() {
    let s0 = new Student(18, "S0", 7);
    let s1 = new Student(19, "S1", 8);
    let s2 = new Student(21, "S2", 10);
    let s3 = new Student(22, "S3", 5);
    let s4 = new Student(20, "S4", 6);
    let s5 = new Student(19, "S5", 10);
    let s6 = new Student(21, "S6", 7);
    let s7 = new Student(21, "S7", 8);
    let s8 = new Student(22, "S8", 7);
    let s9 = new Student(21, "S9", 6);

    return Student.GetAverageGrade([s0, s1, s2, s3, s4, s5, s6, s7, s8, s9]);
}

function bankTest() {
    let bankAccount = new BankAccount("1234", 12000);
    console.log(`Initial state: ${bankAccount.Balance}`);

    bankAccount.Withdraw(550);
    console.log(`Withdrew 550: ${bankAccount.Balance}`);

    bankAccount.Withdraw(1750);
    console.log(`Withdrew 1750: ${bankAccount.Balance}`);

    bankAccount.Deposit(11500);
    console.log(`Deposited 11500: ${bankAccount.Balance}`);
}