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
const engineerPrompt = require("./prompts/engineerPrompt.json");
const { restoreDefaultPrompts } = require("inquirer");

/**
 * Construct a manager employee based on user input (via inquirer); will also
 * trigger the prompts to create engineers and interns (if any).
 */
const mngrInput = async function() {
    const answers = await inquirer.prompt(managerPrompt);

    // Validate numeric inputs
    if (answers.id < 1 || answers.officeNum < 1) {
        if (answers.mngrID < 1) {
            console.log("ERR: Invalid input for manager employee ID number.");
        } else {
            console.log("ERR: Invalid input for manager office number.");
        }
        mngrInput(); 
        return; 
    }

    // Validate string inputs
    if (answers.name === "" || answers.email === "") { 
        if (answers.mngrName === "") {
            console.log("ERR: Invalid input for manager name.");
        } else {
            console.log("ERR: Invalid input for manager e-mail.");
        }
        mngrInput(); 
        return;
    }

    const output = [new Manager(answers.name, answers.id, answers.email, answers.officeNum)];
    
    // Ask if there are any engineer employees to add
    const anyEngineersPrompt = await inquirer.prompt([{
        type:"confirm",
        message: "Are there any engineers on your team?",
        name: "anyEngineers"
    }]);

    // If there are engineer employees to add, run the engineer prompt~~
    // Otherwise, ask if there are any intern employees to add and run that prompt
    if (anyEngineersPrompt.anyEngineers) {
        await engineerInput(output);  
    } else {
        const anyInternsPrompt = await inquirer.prompt([{
            type: "confirm",
            message: "Are there any interns on your team?",
            name: "anyInterns"
        }]);

        if (anyInternsPrompt.anyInterns) {
            await internInput(output); 
        } 
    }
    
    // Render all of the constructed employees to an HTML file and save that to
    // the 'output' directory
    const htmlStr = render(output);

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFile(outputPath, htmlStr, (err) => {
        if (err) { console.log(err); }
    });
}

/**
 * Recursive function to collect input for creating engineer employees
 *
 * @param {*} input     Array to store constructed employees
 */
const engineerInput = async function( input = [] ) {

    const answers = await inquirer.prompt(engineerPrompt);

    // Validate numeric input
    if (answers.id < 1) {
        console.log("ERR: Invalid input for employee ID number.");
        await engineerInput(input);
        return input;
    } 

    // Validate string inputs
    if (answers.name === "" || answers.email === "" || answers.school === "") {
        if (answers.name === "") {
            console.log("ERR: Invalid input for employee name.")
        } 

        await engineerInput(input);
        return input;
    }

    input.push(new Engineer(answers.name, answers.id, answers.email, answers.github));

    // Prompt to add another engineer
    const addAnother = await inquirer.prompt([{
        type: "confirm",
        message: "Add another engineer?",
        name: "addAnother"
    }]);

    if (addAnother.addAnother) {
        await engineerInput(input);
        return;
    }

    // Prompt to add any interns
    const anyInternsPrompt = await inquirer.prompt([{
        type: "confirm",
        message: "Are there any interns on your team?",
        name: "anyInterns"
    }]);

    if (anyInternsPrompt.anyInterns) {
        await internInput(input);
    }

    return input;
}

/**
 * Recursive function to collect input for creating intern employees
 * 
 * @param {*} input     Array to store constructed employees
 */
const internInput = async function( input = [] ) {

    const answers = await inquirer.prompt(internPrompt);

    // Validate numeric input
    if (answers.id < 1) {
        console.log("ERR: Invalid input for employee ID number.");
        await internInput(input);
        return input; 
    }

    // Validate string inputs
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

    // Prompt to add another intern
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