var AWS = require('aws-sdk');
var docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
var dynamo = new AWS.DynamoDB();
var json2csv = require('json2csv');
var box = require('box-node-sdk');

const encryptedBoxPassphrase = process.env['BOX_PASSPHRASE'];
let decryptedBoxPassphrase;
const encryptedBoxPrivateKey = process.env['BOX_PRIVATE_KEY'];
let decryptedBoxPrivateKey;
const encryptedBoxClientSecret = process.env['BOX_CLIENT_SECRET'];
let decryptedBoxClientSecret;

function processEvent(event, context, callback) {

  console.log('decrypted values', {
    decryptedBoxPassphrase: decryptedBoxPassphrase,
    decryptedBoxClientSecret: decryptedBoxClientSecret,
    decryptedBoxPrivateKey: decryptedBoxPrivateKey
  });

  var boxSdk = new box({
    clientID: process.env.BOX_CLIENT_ID,
    clientSecret: decryptedBoxClientSecret,
    appAuth: {
      publicKeyID: process.env.BOX_PUBLIC_KEY_ID,
      keyID: process.env.BOX_PUBLIC_KEY_ID,
      // TODO RH: Get key from config (was not working initially)
      privateKey: "-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIj4OPmz3JfwwCAggA\nMBQGCCqGSIb3DQMHBAjD/Op6cdiRvQSCBMgCEL4x+dcTLjzx8xVp5xjKV6zB8+ff\n5TYFDD2k+TXst9i2ngRjbz1ndDY31bidw4xZjawlMgYTW5W1QNYBAdXl9s8v91++\n4WiMcGwueGdUSycEHIBlnAz9kvZipTOU9xDeK65aGd93UY4877deEe8lZMhOwKW4\nFi492f2a98AeCZOpr/iLK9/rCtTREmeqT5iPa8fke4Kd/V27vYIAe1e2H9EnvwF+\npNmYCQI4JjZF7rq6iW2udFn8iyRokB7Qyzr+90hDPLprIfPW0nG4XLo4TckAOLag\nMNI2SSzslJz7sGwx1FK2wKhkkVdSyihZfM3lrUJsGmzV3TN24q54YYVSd5AU2RFE\nYxyCq9hXU7KYbyPdfYRAl0I5Cqjn/IF4koLvGPj3JNQnFBUPbc/zcUY9hIT2com8\nFXnrdsoHNI6MZnLYn2P7Mv9A1NGwoS6IT6WUuS7jzBGviPC5mQxFjK9C6jR7Bt6j\nq+9+q90tcnRfBfyFEW3jEej6pncOh4r0j+O6WJ7DOSrz7cxAjZh9ZJKInhqjHsJf\nhsq6l4GBRuRuLR+/JGHeu6TzibJ9rQgbjIrYTOfyBZHkPJVR2S9oEFQ1/riWKojk\nIjU6VU/d5rsqPrwLsXAQOSjo8xo7olgO/wg+H9ehHXvikCnuVaorSTtHrK6g+Iwr\nwBrSs6SIMlEqUiZjAEsDeGSvNoQer0ITq5M+EGMkF0/RrtpDbu5AwbBvNKFZtn+o\n9IVmhpON3eWpktSZAbDglO5oYbgvdTBKgBzZEM1O5ldswk2kf/e4aGesiOmdo9fe\nKeMlx3R+xjiBeLCyWe+2izPHOzoA6pVRuhgqa6A2FiSrsofvEv+Hs6Hvd0sRKb7R\n/WNGEpA6JTsZHorPrgfQWOJl+VBufWyJf3iS5zrYPvGSGtysX99L19TqFkbc8kZH\nH8wEOezylUHaA8indPNZy+JeJfIbYDAOv97qqp0d3alqkiGSVnzDVDz1U1yQQ16i\nKyaj9/AG1/pwnajSfBzQSonEWLqLAc/RxoCcFbtU8LMjFI68bSWfoHwUwWjWfvw2\nUr/k0/if7YsgRj24bKuOgf6eVfqvHO6cN34vCQIP+IgXW0eV3BFZJnVo9gLqV+Aq\nZg2dv2kzWfaDFBH/pYH+48U6h9UEuiRVVCfZkp80uajHakqqPHHS1N6F3k3f+SXH\nyfaxt2rLGZr+Nwhrt/mhgILsIkJjoKEiV42LlTMDxbExatGk/yO4fULoi0QQ3Q61\nzRte6FLyr0L9gk/3Tp13d/H+v8xok1BpAV8jP5PmQf4KkERrXWZZXUK/cFZOTuQ/\naAnxM8F73Wk7cRBWVQLr7//t8xZH/X/euBN3sb3TwZpDdpXH88CtawRAI2MoiIPu\nWDhzOmUNgt0Di4/NmpzaJfZBLTr/39nquJnm9evdK1QRSHwQfW7D7lbQoSMdLh3+\nuK9BMwh7EhD5e7ewhbQFVsSThN+SpMqVvNlBcH7n5xOeCuGox4Lucy9xks0le0s7\nwP6rTQ2L53ne3WzKmC6BTttrA+IfpgNcdHWxbA6Zf5LvdiofatoTQgkGO9qhBe6H\nQyDiFwcuNDwXeYD1pkdJ4H/o5edMMgJun3rokngYg0IR4hmmySVJf3P8A6BLzFeh\ntRI=\n-----END ENCRYPTED PRIVATE KEY-----\n",
      passphrase: decryptedBoxPassphrase
    }
  });
  var boxServiceAccountClient = boxSdk.getAppAuthClient('enterprise', process.env.BOX_ENTERPRISE_ID);
  var boxAppUserClient = boxSdk.getAppAuthClient('user', process.env.BOX_APP_USER_ID);

  var fields = ['activityDate', 'contact', 'company', 'event', 'level', 'name', 'office'];
  var params = {
    TableName : process.env.ACTIVITIES_TABLE
  };

  docs.scan(params, function(err, data) {
    if (err) {
      console.log('ERROR RETRIEVING DYNAMODB DATA: ' + err);
    }
    else {
        var csv = json2csv({ data: data.Items, fields: fields });
        // boxAppUserClient.files.uploadFile(
        //   process.env.BOX_PARENT_FOLDER_ID, 
        //   'FeedTheFunnel Data.csv', 
        //   csv, 
        //   function(err, data) {
        //     if (err) {
        //       console.log('ERROR WRITING BOX FILE: ' + err);
        //     }
        //     else {
        //       var response = {
        //           statusCode: 200,
        //           body: "Box file written"
        //       };
        //       callback(null, response);
        //     }
        //   }
        // );

        boxAppUserClient.folders.get(
          process.env.BOX_PARENT_FOLDER_ID,
          {fields: 'name'}, 
          function(err, data) {
            if (err) {
              console.log('ERROR GETTING BOX FOLDER INFO: ' + err + "; " + data);
            }
            else {
              console.log('box folder info', data);
              var response = {
                  statusCode: 200,
                  body: "Box file written"
              };
              callback(null, response);
            }
          }
        );
      }
   });
}

function tryDecryptBoxPassphrase(event, context, callback) {
    if (decryptedBoxPassphrase) {
        tryDecryptBoxPrivateKey(event, context, callback);
    } else {
      const kms = new AWS.KMS();
      kms.decrypt({ CiphertextBlob: new Buffer(encryptedBoxPassphrase, 'base64') }, (err, data) => {
          if (err) {
              console.log('Decrypt error:', err);
              return callback(err);
          }
          decryptedBoxPassphrase = data.Plaintext.toString('ascii');
          tryDecryptBoxPrivateKey(event, context, callback);
      });
    }
}

function tryDecryptBoxPrivateKey(event, context, callback) {
    if (decryptedBoxPrivateKey) {
        tryDecryptBoxClientSecret(event, context, callback);
    } else {
      const kms = new AWS.KMS();
      kms.decrypt({ CiphertextBlob: new Buffer(encryptedBoxPrivateKey, 'base64') }, (err, data) => {
          if (err) {
              console.log('Decrypt error:', err);
              return callback(err);
          }
          decryptedBoxPrivateKey = data.Plaintext.toString('ascii');
          tryDecryptBoxClientSecret(event, context, callback);
      });
    }
}

function tryDecryptBoxClientSecret(event, context, callback) {
    if (decryptedBoxClientSecret) {
        processEvent(event, context, callback);
    } else {
      const kms = new AWS.KMS();
      kms.decrypt({ CiphertextBlob: new Buffer(encryptedBoxClientSecret, 'base64') }, (err, data) => {
          if (err) {
              console.log('Decrypt error:', err);
              return callback(err);
          }
          decryptedBoxClientSecret = data.Plaintext.toString('ascii');
          processEvent(event, context, callback);
      });
    }
}

exports.handler = (event, context, callback) => {
  tryDecryptBoxPassphrase();
};