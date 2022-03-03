require("dotenv").config();

var request = require('request');
var client_id = process.env.REACT_APP_CLIENT_ID;
var client_secret = process.env.REACT_APP_CLIENT_SECRET;

export async function testToken() {
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    return new Promise((resolve,reject) => {
        request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            resolve(body.access_token)
        }
    });})

}

export async function makeReq(id, access_token) {

    id = id.slice(0,-1);


    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    return new Promise((resolve,reject) => {
        request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var token = body.access_token;
            var options = {
                url: "https://api.spotify.com/v1/tracks?ids="+id,
                headers: { 'Authorization': 'Bearer ' + token },
                json: true
            };

            request.get(options, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    resolve(body);
                };
            })
        };
    })
})}