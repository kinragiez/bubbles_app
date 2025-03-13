const readline = require('readline');
const fs = require('fs');
const { encrypt, decrypt } = require('./enc');
const { showMenu } = require('./menu');

let rl;

function createInterface() {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

const ACCOUNTS_FILE = 'accounts.json';

function readAccounts() {
    if (!fs.existsSync(ACCOUNTS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
    return JSON.parse(data);
}

function writeAccounts(accounts) {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
}

function generateRandomHex() {
    return Math.random().toString(36).slice(-8);
}

function welcomeScreen() {
    console.clear();
    createInterface();
    rl.question('Welcome! Choose an option: (1) Login (2) Register\n', (option) => {
        console.clear();
        rl.close();
        if (option === '1') {
            login();
        } else if (option === '2') {
            register();
        } else {
            console.log('Invalid option. Please try again.');
            welcomeScreen();
        }
    });
}

function login() {
    console.clear();
    createInterface();
    rl.question('Enter your nametag: ', (nametag) => {
        const accounts = readAccounts();
        const user = accounts.find(acc => acc.Nametag === nametag);
        rl.close();
        if (!user) {
            console.log('User does not exist. Please try again or register.');
            createInterface();
            rl.question('Do you want to register instead? (y/n): ', (answer) => {
                console.clear();
                rl.close();
                if (answer.toLowerCase() === 'y') {
                    register();
                } else {
                    console.log('Goodbye!');
                }
            });
        } else {
            createInterface();
            rl.question('Enter your password: ', (password) => {
                console.clear();
                rl.close();
                if (decrypt(user.Password) === password) {
                    console.log(`Welcome back, ${nametag}!`);
                    showMenu();
                } else {
                    console.log('Login information was not correct. Please try again.');
                    createInterface();
                    rl.question('Do you want to register instead? (y/n): ', (answer) => {
                        console.clear();
                        rl.close();
                        if (answer.toLowerCase() === 'y') {
                            register();
                        } else {
                            console.log('Goodbye!');
                        }
                    });
                }
            });
        }
    });
}

function register() {
    console.clear();
    createInterface();
    rl.question('Create a nametag (1 to 12 characters): ', (nametag) => {
        if (nametag.length < 1 || nametag.length > 12) {
            console.log('Nametag must be between 1 and 12 characters. Please try again.');
            rl.close();
            register();
            return;
        }
        const accounts = readAccounts();
        const userExists = accounts.some(acc => acc.Nametag === nametag);
        rl.close();
        if (userExists) {
            console.log('Nametag already exists. Please try again.');
            register();
        } else {
            const password = generateRandomHex();
            const encryptedPassword = encrypt(password);
            accounts.push({ Nametag: nametag, Password: encryptedPassword });
            writeAccounts(accounts);
            console.log(`Welcome, ${nametag}! Your password is ${password}`);
            createInterface();
            rl.question('Please save your password. Type "yes" to confirm you have saved it: ', (confirmation) => {
                console.clear();
                rl.close();
                if (confirmation.toLowerCase() === 'yes') {
                    console.log('Thank you! You can now login with your nametag and password.');
                    login();
                } else {
                    console.log('Please save your password and try again.');
                    login();
                }
            });
        }
    });
}

module.exports = { welcomeScreen };