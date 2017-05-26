// create an IAM Lambda role with access to dynamodb
// Launch Lambda in the same region as your dynamodb region
// (here: us-east-1)
// dynamodb table with hash key = user and range key = datetime

console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = function(event, context) {
    console.log(JSON.stringify(event, null, '  '));
    dynamodb.listTables(function(err, data) {
      console.log(JSON.stringify(data, null, '  '));
    });

    var tableName = "chat";
    var datetime = new Date().getTime().toString();

    dynamodb.putItem({
        "TableName": ActivitiesTable,
        "Item" : {
            "activityDate": {"S": datetime },
            "activitySource": {"S": ""},
            "activityWith": {"S": ""},
            "activityType": {"S": ""}
        }
    }, function(err, data) {
        if (err) {
            context.done('error','putting item into dynamodb failed: '+err);
        }
        else {
            console.log('great success: '+JSON.stringify(data, null, '  '));
            context.done('K THX BY');
        }
    });
};
