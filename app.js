const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const Employee = require("./lib/Employee");
const managerPrompt = require("./prompts/managerPrompt.json");
const internPrompt = require("./prompts/internPrompt.json");
const { restoreDefaultPrompts } = require("inquirer");

const newManager = new Manager("Joe", 5, "joe@gmail.com", 20);
const newIntern = new Intern("Mark", 22, "mark@gmail.com", "UW");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)


const mngrInput = async function() {
    const answers = await inquirer.prompt(managerPrompt);

    if (answers.mngrID < 1 || answers.mngrID.isNaN() || answers.mngrOfficeNum < 1) {
        if (answers.mngrID < 1 || answers.mngrID.isNaN()) {
            console.log("ERR: Invalid input for manager employee ID number.");
        } else {
            console.log("ERR: Invalid input for manager office number.");
        }
        mngrInput(); 
        return; 
    }

    if (answers.mngrName === "" || answers.mngrEmail === "") { 
        if (answers.mngrName === "") {
            console.log("ERR: Invalid input for manager name.");
        } else {
            console.log("ERR: Invalid input for manager e-mail.");
        }
        mngrInput(); 
        return;
    }
    
    const output = await internInput( [ new Manager(answers.mngrName,
                                                    answers.mngrID,
                                                    answers.mngrEmail,
                                                    answers.mngrOfficeNum) ] );
    
    console.log(output);
    
    const htmlStr = render(output);

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFile(outputPath, htmlStr, (err) => {
        if (err) { console.log(err); }
    });
}

const engineerInput = async function(input = []) {
    const answers = await inquirer.prompt(engineerPrompt);

    if (answers.id < 1) {
        console.log("ERR: Invalid input for employee ID number.");
        engineerInput(input);
        return;
    } 
}

const internInput = async function(input = []) {

    const answers = await inquirer.prompt(internPrompt);

    if (answers.id < 1 || answers.id.isNaN()) {
        console.log("ERR: Invalid input for employee ID number.");
        await internInput(input);
        return input; 
    }

    if (answers.name === "" || answers.email === "" || answers.school === "") {
        if (answers.name === "") {
            console.log("ERR: Invalid input for employee name.");
        } else {
            console.log("ERR: Invalid input for employee e-mail.");
        }
        await internInput(input);
        return input;
    }

    input.push(new Intern(answers.name, answers.id, answers.email, answers.school));

    const addAnother = await inquirer.prompt([{
        type: "confirm",
        message: "Add another intern?",
        name: "addAnother"
    }]);

    if (addAnother.addAnother) {
        await internInput(input); 
    }

    return input;
    
}

mngrInput();

// const employeeList = mngrInput();


// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!
// const htmlStr = render(employeeList);

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// if (!fs.existsSync(OUTPUT_DIR)) {
//     fs.mkdirSync(OUTPUT_DIR);
// }

// fs.writeFile(outputPath, htmlStr, (err) =>  {
//     if (err) { console.log(err); }
// });

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
