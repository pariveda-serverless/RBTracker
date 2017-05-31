var AWS = require('aws-sdk');
var docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const dynamo = new AWS.DynamoDB();


exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event, null, '  '));
    dynamo.listTables(function(err, data) {
      console.log(JSON.stringify(data, null, '  '));
    });

    var tableName = "ActivitiesTable";
    var datetime = new Date().getTime().toString();
    var body = JSON.parse(event.body);
    var timestamp = "" + new Date().getTime().toString();

    //dynamo.DocClient.put({
    docs.put({
        "TableName": "RBActivities",
        "Item" : {
            "activityId": timestamp,
            "activityDate": body.activityDate,
            "activitySource": body.activitySource,
            "activityWith": body.activityWith,
            "activityType": body.activityType
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
