// TODO: Write code to define and export the Employee class

class Employee {
    #name;
    #id;
    #email;

    constructor(name = "", id = -1, email = "") {
        this.name = name;
        this.id = id;
        this.email = email;
        console.log(`Made a new Employee; name = ${name}, id = ${id}, e-mail = ${email}`);
    }

    getName() { return this.name; }

    getId() { return this.id; }

    getEmail() { return this.email; }

    getRole() { return "Employee"; }

}

module.exports = Employee;