var https = require('https');
var qs = require('querystring');

var SANDBOX_API = 'wwwcie.ups.com';
var LIVE_API = 'onlinetools.ups.com';

var USE_JSON = false;

var VoidShipment = function (licenseId, userId, password) {
	this.licenseId = licenseId;
	this.userId = userId;
	this.password = password;

	this.sandbox = true;
};

//Use UPS sandbox
VoidShipment.prototype.useSandbox = function(bool) {
  	this.sandbox = (bool == true);
};

VoidShipment.prototype.setJsonResponse = function(bool) {
	USE_JSON = (bool == true);
};

//Make a shipAccept request
VoidShipment.prototype.makeRequest = function(options, callback) {

	//set account credentials
	options['licenseId'] = this.licenseId;
	options['userId'] = this.userId;
	options['password'] = this.password;

	var req = https.request({
		host: (this.sandbox) ? SANDBOX_API : LIVE_API,
		path: '/ups.app/xml/Void',
		method: 'POST'
	});

	/* build the request data for void shipment and write it to
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
    response += "<VoidShipmentRequest>";
		response += "<Request>";
			
			response += "<RequestAction>";
			response += "1";
			response += "</RequestAction>";
			
		response += "</Request>";

		response += "<ExpandedVoidShipment>";
			response += "<ShipmentIdentificationNumber>";

				if (!data.tracking) return { success: false, error: 'Missing tracking number' };
					response += data.tracking.toUpperCase();
					
			response += "</ShipmentIdentificationNumber>";
		response += "</ExpandedVoidShipment>";

    response += "</VoidShipmentRequest>";
    return (err) ? {success: false, error: err } : { success: true, body: response };

};

module.exports = VoidShipment;
