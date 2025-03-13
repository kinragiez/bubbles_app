const readline = require('readline');

let rl;

function createInterface() {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

const menuOptions = [
    '1. Local Chat',
    '2. Friends List',
    '3. Group Chat',
    '4. World Chat',
    '5. End Program'
];

function displayMenu() {
    console.clear();
    console.log('Please choose an option:');
    menuOptions.forEach(option => console.log(option));
}

function handleUserInput(input) {
    const choice = input.trim();
    if (['1', '2', '3', '4', '5'].includes(choice)) {
        if (choice === '5') {
            console.log('Goodbye!');
            rl.close();
        } else {
            console.log(`You selected: ${menuOptions[parseInt(choice) - 1]}`);
            console.log('Feature in development.');
            console.log('Returning to menu...');
            setTimeout(showMenu, 2000); // Wait for 2 seconds before showing the menu again
        }
    } else {
        console.log('Invalid choice, please try again.');
        setTimeout(promptUser, 1000);
    }
}

function promptUser() {
    displayMenu();
    rl.question('Enter your choice: ', handleUserInput);
}

function showMenu() {
    createInterface();
    promptUser();
}

module.exports = { showMenu };