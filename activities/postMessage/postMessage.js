var AWS = require('aws-sdk');
var docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
var token = "uk4pWPlX1Q6LqelLK4b0q8QY";
var qs = require('querystring');
const dynamo = new AWS.DynamoDB();

exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event, null, '  '));
    dynamo.listTables(function(err, data) {
      console.log(JSON.stringify(data, null, '  '));
    });

    var tableName = "RBActivities";
    var body = event.body;
    var inputParams = qs.parse(body);
    var timestamp = "" + new Date().getTime().toString();

    docs.put({
        TableName: tableName,
        Item : {
            activityId: timestamp,
            activityDate: body.activityDate,
            activitySource: body.activitySource,
            activityWith: body.activityWith,
            activityType: body.activityType
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
