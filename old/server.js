const express = require('express');
const bodyParser = require('body-parser');
const { encrypt, decrypt } = require('./enc');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/login', (req, res) => {
    const { nametag, password } = req.body;
    const accounts = readAccounts();
    const user = accounts.find(acc => acc.Nametag === nametag);
    if (!user) {
        res.send('User does not exist. Please try again or register.');
    } else {
        if (decrypt(user.Password) === password) {
            res.send('Login successful! <a href="/menu">Go to Menu</a>');
        } else {
            res.send('Login information was not correct. Please try again.');
        }
    }
});

app.post('/register', (req, res) => {
    const { nametag } = req.body;
    if (nametag.length < 1 || nametag.length > 12) {
        res.send('Nametag must be between 1 and 12 characters. Please try again.');
        return;
    }
    const accounts = readAccounts();
    const userExists = accounts.some(acc => acc.Nametag === nametag);
    if (userExists) {
        res.send('Nametag already exists. Please try again.');
    } else {
        const password = generateRandomHex();
        const encryptedPassword = encrypt(password);
        accounts.push({ Nametag: nametag, Password: encryptedPassword });
        writeAccounts(accounts);
        res.send(`Welcome, ${nametag}! Your password is ${password}. Please save your password. <a href="/">Go to Login</a>`);
    }
});

app.get('/menu', (req, res) => {
    res.sendFile(__dirname + '/menu.html');
});

app.get('/end', (req, res) => {
    res.send('Goodbye!');
    process.exit();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});