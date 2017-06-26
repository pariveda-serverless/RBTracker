var AWS = require('aws-sdk');
var docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
var dynamo = new AWS.DynamoDB();
var json2csv = require('json2csv');

exports.handler = function(event, context, callback) {

  var fields = ['activityDate', 'Company', 'Event', 'Who', 'With'];
  var params = {
          TableName : "RBActivities"
      };


  docs.scan(params, function(err, data) {
    if (err) console.log(err);
    else {
        /*console.log(data.Items[0]);
        console.log(data.Items[1]);*/

        data.Items.forEach(function(element){
          console.log(element);
        });

        var csv = json2csv({ data: data.Items[0], fields: fields });
        console.log(csv);
      }
   });
}
