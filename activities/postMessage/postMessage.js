var AWS = require('aws-sdk');
var docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
var token = "uk4pWPlX1Q6LqelLK4b0q8QY";
var qs = require('querystring');
//const dynamo = new AWS.DynamoDB();

exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event, null, '  '));

    var inputParams = qs.parse(event.body);
    var timestamp = "" + new Date().getTime().toString();
    var requestToken = inputParams.token;

    if (requestToken != token) {
        console.error("Request token (" + requestToken + ") does not match exptected token for Slack");
        context.fail("Invalid request token");
    }

    var slackValues = inputParams.text.split('%2C');
    slackValues = inputParams.text.split(',');

    var activityDate = new Date().toString();
    var activityWith = slackValues[0] !== null ? slackValues[0].toString() : "";
    var company = slackValues[1] !== null ? slackValues[1].toString() : "";
    var activityType =  slackValues[2] !== null ? slackValues[2].toString() : "";

    docs.put({
        TableName: process.env.ACTIVITIES_TABLE,
        Item : {
            timestamp: timestamp,
            //channelName: inputParams.channel_name,
            rawText: inputParams.text,
            //responseURL: inputParams.response_url,
            userName: inputParams.user_name,
            activityDate: activityDate,
            With: activityWith,
            Company: company,
            EventType: activityType
        }
    }, function(err, data) {
        if (err) {
            callback(err + " " + body.timestamp, null);
        }
        else {
            console.log('great success: '+JSON.stringify(data, null, '  '));
            var response = {
                statusCode: 200,
                body: JSON.stringify(data)
            };
            callback(null, response);
        }
    });

};
