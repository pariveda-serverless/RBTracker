console.log('Loading event');
var AWS = require('aws-sdk');
var docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

exports.handler = function(event, context) {
    console.log(JSON.stringify(event, null, '  '));
    docs.listTables(function(err, data) {
      console.log(JSON.stringify(data, null, '  '));
    });

    var tableName = "ActivitiesTable";
    var datetime = new Date().getTime().toString();

    dynamodbDocClient.put({
        "TableName": ActivitiesTable,
        "Item" : {
            "activityDate": {"S": event.body.activityDate },
            "activitySource": {"S": event.body.activitySource},
            "activityWith": {"S": event.body.activityWith},
            "activityType": {"S": event.body.activityType}
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
