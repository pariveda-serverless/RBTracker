var AWS = require('aws-sdk');
var docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
var dynamo = new AWS.DynamoDB();
var token = "uk4pWPlX1Q6LqelLK4b0q8QY";
var qs = require('querystring');


exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event, null, '  '));
    dynamo.listTables(function(err, data) {
      console.log(JSON.stringify(data, null, '  '));
    });

    var tableName = "ActivitiesTable";
    var body = event.body;
    var params = qs.parse(body);
    var requestToken = params.token;
    var timeStamp = "" + new Date().getTime().toString();
    var activityDate = new Date().toString();
    var slackUserAuthorized = false; // We need to explicitly authorize the username in the payload from Slack.
    //var body = JSON.parse(event.body);

    if (requestToken != token) {
        console.error("Request token (" + requestToken + ") does not match exptected token for Slack");
        context.fail("Invalid request token");
    }

    //text=Test+Tester%2C+Meeting%2C+TestCompany
    var slackValues = params.text.split('%2C');
    slackValues = params.text.split(',');

    docs.put({
        "TableName": "RBActivities",
        "Item" : {
            "activityId": timeStamp,
            "activityDate": activityDate,
            "activitySource": params.user_name,
            "activityWith": slackValues[0].toString(),
            "activityType": slackValues[1].toString(),
            "company": slackValues[2].toString()
        }
    }, function(err, data) {
        if (err) {
            callback(err + " " + body.timestamp, null);
        }
        else {
            console.log('great success: '+JSON.stringify(data, null, '  '));
            callback(null, 'success');
        }
    });
};
