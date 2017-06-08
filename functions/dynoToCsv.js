var AWS = require('aws-sdk');
var docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
var dynamo = new AWS.DynamoDB();
var json2csv = require('json2csv');

exports.handler = function(event, context, callback) {

  var fields = ['activityDate', 'Company', 'Event', 'Who', 'With'];
  var allActivities = docs.query(params, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
  });

  //var params = {
  //  TableName : 'RBActivities'
  //};

  var params = {
    TableName: 'RBActivities',
    IndexName: 'Index',
    KeyConditionExpression: 'HashKey = :hkey and RangeKey > :rkey',
    ExpressionAttributeValues: {
      ':hkey': 'key',
      ':rkey': 2015
    }
  };

  var allActivities = docs.query(params, function(err, data) {
    if (err) console.log(err);
    else {
        console.log(data);
        var csv = json2csv({ data: allActivities, fields: fields });
        console.log("YO");
        console.log(allActivities);
  });
}
