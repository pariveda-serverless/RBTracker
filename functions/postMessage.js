var AWS = require('aws-sdk');
var docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
var token = "uk4pWPlX1Q6LqelLK4b0q8QY";
const dynamo = new AWS.DynamoDB();

exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event, null, '  '));
    dynamo.listTables(function(err, data) {
      console.log(JSON.stringify(data, null, '  '));
    });

    var tableName = "ActivitiesTable";
    var body = JSON.parse(event.body);
    var timeStamp = "" + new Date().getTime().toString();
    var activityDate = new Date().toString();
    //var requestToken = params.token;

    /*if (requestToken != token) {
        console.error("Request token (" + requestToken + ") does not match exptected token for Slack");
        context.fail("Invalid request token");
    }*/

    docs.put({
        "TableName": "RBActivities",
        "Item" : {
            "activityId": timeStamp,
            "activityDate": activityDate,
            "activitySource": body.activitySource,
            "activityWith": body.activityWith,
            "activityType": body.activityType,
            "company": body.company
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
