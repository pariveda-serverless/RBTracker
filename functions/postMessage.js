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

    if (requestToken != token) {
        console.error("Request token (" + requestToken + ") does not match exptected token for Slack");
        context.fail("Invalid request token");
    }

    if(params.text){
      var slackValues = params.text.split('%2C');
      slackValues = params.text.split(',');

      var timeStamp = "" + new Date().getTime().toString();
      var activityDate = new Date().toString();
      var activityWith = slackValues[0] !== null ? slackValues[0].toString() : "";
      var company = slackValues[1] !== null ? slackValues[1].toString() : "";
      var activityType =  slackValues[2] !== null ? slackValues[2].toString() : "";

      docs.put({
          TableName: 'Activities',
          Item : {
              activityId: timeStamp,
              activityDate: activityDate,
              Who: params.user_name,
              With: activityWith,
              Company: company,
              Event: activityType
          }
      }, function(err, data) {
          const response = {
              statusCode: 200,
              body: JSON.stringify(data)
          };

          if (err) {
              callback(err + " " + body.timestamp, null);
          }
          else {
              console.log('great success: '+JSON.stringify(data, null, '  '));
              callback(null, response);
          }
      });
    }
};
