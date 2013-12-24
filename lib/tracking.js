var https = require('https');
var qs = require('querystring');

var SANDBOX_API = 'wwwcie.ups.com';
var LIVE_API = 'onlinetools.ups.com';

var USE_JSON = false;

var Tracking = function (licenseId, userId, password) {
	this.licenseId = licenseId;
	this.userId = userId;
	this.password = password;

	this.sandbox = true;
};

//Use UPS sandbox
Tracking.prototype.useSandbox = function(bool) {
  	this.sandbox = (bool == true);
};

Tracking.prototype.setJsonResponse = function(bool) {
	USE_JSON = (bool == true);
};

//Make a tracking request
Tracking.prototype.makeRequest = function(options, callback) {

	//set account credentials
	options['licenseId'] = this.licenseId;
	options['userId'] = this.userId;
	options['password'] = this.password;

	var req = https.request({
		host: (this.sandbox) ? SANDBOX_API : LIVE_API,
		path: '/ups.app/xml/Track',
		method: 'POST'
	});

	/* build the request data for tracking and write it to
		the request body
	*/
	var requestData = buildRequestData(options);
	var content = requestData.body;
	req.write(content);

	req.on('response', function(res) {
	
		var responseData = '';
		var useJsonResponse = this.json;
			
		res.on('data', function(data) {
			data = data.toString();
			responseData += data;
		});

		res.on('end', function() {

			if (USE_JSON) {
				var parseString = require('xml2js').parseString;
				parseString(responseData, function (err, result) {
					callback(result);	
				});
			} else {
				// xml reponse
				callback(responseData);
			}
		});
	});

	req.end();

};

function buildRequestData(data) {

	var response = "", err = false;

    response += "<?xml version='1.0' encoding='utf-8'?>";
    response += "<AccessRequest xml:lang='en-US'>";
    response += "<AccessLicenseNumber>" + data.licenseId + "</AccessLicenseNumber>";
    response += "<UserId>" + data.userId + "</UserId>";
    response += "<Password>" + data.password + "</Password>";
    response += "</AccessRequest>";

	response += "<?xml version='1.0' encoding='utf-8'?>";
	response += "	<TrackRequest xml:lang='en-US'>";
	response += "	  <Request>";
	response += "	    <TransactionReference>";

	if(!data.customerContext) return { success: false, error: 'Missing Customer Context' };
	response += "	      <CustomerContext>" + data.customerContext + "</CustomerContext>";

	response += "	       <XpciVersion>1.0</XpciVersion>";
	response += "	    </TransactionReference>";
	response += "	    <RequestAction>Track</RequestAction>";
	response += "	    <RequestOption>activity</RequestOption>";
	response += "	  </Request>";

	if(!data.trackingNumber) return { success: false, error: 'Missing Tracking Number' };
	response += "	  <TrackingNumber>" + data.trackingNumber + "</TrackingNumber>";

	response += "	</TrackRequest>";

	return { success: true, body: response };

};

module.exports = Tracking;