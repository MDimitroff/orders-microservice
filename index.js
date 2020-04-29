var AWS = require('aws-sdk');
var express = require('express');
var datetime = require('node-datetime');

// Set up server
var app = express();
app.use(express.json());

// Set up aws
AWS.config.update({
    region: 'eu-central-1'
    // accessKeyId: 'AKIAUBFFK6SOG24HUIFW',
    // secretAccessKey: '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'
});

// Define route
app.post('/api/orders', (req, resp) => {
    /*
    Request's body looks like this
    {
        'username': 'johndoe',
        'item': 'printer',
        'quantity': 1
    }
    */
    if(!req.body['username'] || !req.body['quantity'] || !req.body['item']) {
        resp.send('Incorrect input data. Provide username, item and quantity');
    } 

    // Set current date
    var dateObj = datetime.create();
    req.body['date'] = dateObj.format('d.m.Y H:M:S');

    var record = {
        TableName: 'orders',
        Item: req.body
    };

    var dynamoClient = new AWS.DynamoDB.DocumentClient();
    dynamoClient.put(record, (err, data) => {
        if (err) {
            resp.send("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            resp.send('Item addded'); 
        }        
    });
});

// Start to listen
app.listen(3000, () => {
    console.log('App successfully started listening on port 3000');
});