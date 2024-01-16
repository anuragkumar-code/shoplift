const bcrypt = require('bcrypt');

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
 
    const newUser = { id: users.length + 1, firstname:firstname, lastname:lastname, mobile:mobile, email:email, password: passwordHash };
    users.push(newUser);

    console.log(newUser);

    return newUser;
}



module.exports = {
    registerUser
};