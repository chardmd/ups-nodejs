var https = require('https');
var qs = require('querystring');

var SANDBOX_API = 'wwwcie.ups.com';
var LIVE_API = 'onlinetools.ups.com';

var USE_JSON = false;

var AddressValidation = function (licenseId, userId, password) {
	this.licenseId = licenseId;
	this.userId = userId;
	this.password = password;

	this.sandbox = true;
};

//Use UPS sandbox
AddressValidation.prototype.useSandbox = function(bool) {
  	this.sandbox = (bool == true);
};

AddressValidation.prototype.setJsonResponse = function(bool) {
	USE_JSON = (bool == true);
};

//Make a shipAccept request
AddressValidation.prototype.makeRequest = function(options, callback) {

	//set account credentials
	options['licenseId'] = this.licenseId;
	options['userId'] = this.userId;
	options['password'] = this.password;

	var req = https.request({
		host: (this.sandbox) ? SANDBOX_API : LIVE_API,
		path: '/ups.app/xml/AV',
		method: 'POST'
	});

	/* build the request data for address validation and write it to
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

	var response = "";

    response += "<?xml version='1.0' encoding='utf-8'?>";
    response += "<AccessRequest xml:lang='en-US'>";
	
    response += "<AccessLicenseNumber>" + data.licenseId + "</AccessLicenseNumber>";
    response += "<UserId>" + data.userId + "</UserId>";
    response += "<Password>" + data.password + "</Password>";
    
    response += "</AccessRequest>";
	
    response += "<?xml version='1.0' encoding='UTF-8'?>";
	response += "<AddressValidationRequest xml:lang='en-US'>";
	response += "<Request>";
	response += "<TransactionReference>";

	if(!data.customerContext) return { success: false, error: 'Missing customer context' };

	response += "<CustomerContext>" + data.customerContext + "</CustomerContext>";

	response += "<XpciVersion>1.0001</XpciVersion>";
	response += "</TransactionReference>";
	response += "<RequestAction>AV</RequestAction>";
	response += "</Request>";
	response += "<Address>";

	if(!data.city) return { success: false, error: 'Missing City' };
	response += "<City>" + data.city + "</City>";

	if(!data.stateProvinceCode) return { success: false, error: 'Missing State Province Code' };
	response += "<StateProvinceCode>" + data.stateProvinceCode + "</StateProvinceCode>";

	response += "</Address>";
	response += "</AddressValidationRequest>";
	
	return { success: true, body: response };

};

module.exports = AddressValidation;
