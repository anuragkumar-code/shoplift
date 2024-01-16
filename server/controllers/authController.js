const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = [
{ 
    id: 1, 
    firstname: 'anurag',
    lastname: 'kumar',
    mobile: '7073521003',
    email: 'abc@mail.com',
    passwordHash: '$2b$10$Q6vviK2q.7oAq4cOPe4jsOwASLpSH/IdQhPzFG1UqF4T8vsPjrxhq'    //password
}];

async function registerUser(firstname,lastname,mobile,email, password){

    // console.log(firstname, lastname, mobile, email, password);

    if (users.some(user => user.mobile === mobile)) {
        throw new Error('Mobile number is already registered.');
    }

    if (users.some(user => user.email === email)) {
        throw new Error('Email id is already registered.');
    }

    const saltRounds = 10;
    let hashedPassword;

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            hashedPassword = hash;
        });
    });
 
    const newUser = { id: users.length + 1, firstname:firstname, lastname:lastname, mobile:mobile, email:email, password: hashedPassword };
    users.push(newUser);

    console.log(newUser);

    return newUser;
}

const secretKey = 'my_jwt_key';

async function loginUser(email, password) {
    const user = users.find(user => user.email === email);

    if (!user) {
        throw new Error('User not found.');
    }

    const isPasswordValid = await new Promise((resolve, reject) => {
        bcrypt.compare(password, user.passwordHash, (err, result) => {
            if (err) {
                reject(false);
            } else {
                resolve(true);
            }
        });
    });

    if (!isPasswordValid) {
        throw new Error('Invalid password.');
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

    return { user, token };
}

async function changePassword(email, oldPassword, newPassword){
    const user = users.find(user => user.email === email);

    if (!user) {
        throw new Error('User not found.');
    }

    const isPasswordValid = await new Promise((resolve, reject) => {
        bcrypt.compare(oldPassword, user.passwordHash, (err, result) => {
            if (err) {
                reject(false);
            } else {
                resolve(true);
            }
        });
    });

    if (!isPasswordValid) {
        throw new Error('Incorrect old password.');
    }

    const saltRounds = 10;

    let newHashedPassword;

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(newPassword, salt, function(err, hash) {
            newHashedPassword = hash;
        });
    });

    // Update the user's password in the users array
    user.passwordHash = newHashedPassword;

    console.log('Password changed successfully.');

}



module.exports = {
    registerUser,
    loginUser,
    changePassword
};