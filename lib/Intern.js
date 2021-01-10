// TODO: Write code to define and export the Intern class.  HINT: This class should inherit from Employee.

const Employee = require('./Employee.js');

class Intern extends Employee {
    constructor(name = "", id = -1, email = "") {
        super(name, id, email);
    }

    getRole() { return "Intern"; }
}

module.exports = Intern;