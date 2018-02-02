'use strict';

// I wish Node liked ES6 imports more ;)
const bodyParser = require('body-parser');
const express = require('express');
const redis = require('redis');
const config = require('./config');

// Pulled these out to make the code cleaner
const validators = require('./validators');

// Setting up my app to receive JSON and route using express
const app = express();
app.use(bodyParser.json());

// Setting up our DB in Redis
const client = redis.createClient(config.redisPort, config.redisHost);
client.on('connect', () => {
    console.log('redis client connected');
});

// Wasn't quite sure how to handle validation but figured at the very least, do the following
app.post('/', (req, res) => {
    const {
        name,
        password,
        email,
    } = req.body;

    // We can check if they have the necessary parameters in the body
    // Note I don't account for if they have additional parameters
    if (!name || !password || !email) {
        return res.send({
            status: 500,
            message: 'Missing parameters',
        });
    }

    if (!validators.validateName(name)) {
        return res.send({
            status:501, 
            message: 'Invalid Name', 
        });
    }

    if (!validators.validateEmail(email)) {
        return res.send({
            status: 502,
            message: 'Invalid Email',
        });
    }

    if (!validators.validatePassword(password)) {
        return res.send({
            status: 503,
            message: 'Password too short',
        });
    }
    
    // I wasn't quite sure what we wanted to do here 
    // but I figured email is unique and we'd set the rest
    // Also never used redis before but it was pretty easy to figure out
    client.hmset(email, {
        name,
        password,
    });

    // Checking the values were actually stored
    // This is the the type of thing I'd probably delete before hitting prod
    /* client.hgetall(email, function (err, results) {
        if (err) {
            console.log('User not stored');
        }
        else {
            console.log(results);
        }
    }); */
    res.sendStatus(200);
});

app.listen(config.expressPort, () => console.log(`Server running on port ${config.expressPort}`));