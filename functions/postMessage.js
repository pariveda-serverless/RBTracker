console.log('Loading event');
var AWS = require('aws-sdk');
var docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
//const docs = new AWS.DynamoDB.DocumentClient;
const dynamo = new AWS.DynamoDB();
//const docs = dynamo.DocumentClient();
//var docs = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    console.log(JSON.stringify(event, null, '  '));
    dynamo.listTables(function(err, data) {
      console.log(JSON.stringify(data, null, '  '));
    });

    var tableName = "ActivitiesTable";
    var datetime = new Date().getTime().toString();
    var body = JSON.parse(event.body);

    //dynamo.DocClient.put({
    docs.put({
        "TableName": "RBActivities",
        "Item" : {
            "activityDate": {"S": body.activityDate },
            "activitySource": {"S": body.activitySource},
            "activityWith": {"S": body.activityWith},
            "activityType": {"S": body.activityType}
        }
    }, function(err, data) {
        if (err) {
            context.done('error','putting item into dynamodb failed: '+err);
        }
        else {
            console.log('great success: '+JSON.stringify(data, null, '  '));
        }
    });
};
