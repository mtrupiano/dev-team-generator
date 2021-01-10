// TODO: Write code to define and export the Engineer class.  HINT: This class should inherit from Employee.

const Employee = require('./Employee.js');

class Engineer extends Employee {

    constructor(name = "", id = -1, email = "") {
        super(name, id, email);
    }

    // Override getRole() function to return 'Engineer'
    getRole() { return "Engineer"; }
}

module.exports = Engineer;