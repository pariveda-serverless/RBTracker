var AWS = require('aws-sdk');
var docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
var dynamo = new AWS.DynamoDB();var json2csv = require('json2csv');

var params = {
  TableName : 'RBActivities'
};

var documentClient = new AWS.DynamoDB.DocumentClient();

var fields = ['activityDate', 'Company', 'Event', 'Who', 'With'];
var allActivities = documentClient.query(params, function(err, data) {
  if (err) console.log(err);
  else console.log(data);
});

var csv = json2csv({ data: allActivities, fields: fields });

console.log(csv);
 //
