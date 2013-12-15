var https = require('https');
var qs = require('querystring');

var SANDBOX_API = 'wwwcie.ups.com';
var LIVE_API = 'onlinetools.ups.com';

var USE_JSON = false;

var TimeInTransit = function (licenseId, userId, password) {
	this.licenseId = licenseId;
	this.userId = userId;
	this.password = password;

	this.sandbox = true;
};

//Use UPS sandbox
TimeInTransit.prototype.useSandbox = function(bool) {
  	this.sandbox = (bool == true);
};

TimeInTransit.prototype.setJsonResponse = function(bool) {
	USE_JSON = (bool == true);
};

//Make a time in transit request
TimeInTransit.prototype.makeRequest = function(options, callback) {

	//set account credentials
	options['licenseId'] = this.licenseId;
	options['userId'] = this.userId;
	options['password'] = this.password;

	var req = https.request({
		host: (this.sandbox) ? SANDBOX_API : LIVE_API,
		path: '/ups.app/xml/TimeInTransit',
		method: 'POST'
	});

	/* build the request data for Time in Transit and write it to
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
	
   response += "<?xml version='1.0' encoding='utf-8'?>"
    response += "<TimeInTransitRequest xml:lang='en-US'>";
    response += "<Request>";
    response += "<TransactionReference>";

	if(!data.customerContext) return { success: false, error: 'Missing Customer Context' };

    response += "<CustomerContext>"
    	response += data.customerContext;
    response += "</CustomerContext>";

    response += "<XpciVersion>1.0002</XpciVersion>";

    response += "</TransactionReference>";
    response += "<RequestAction>TimeInTransit</RequestAction>";
    response += "</Request>";

    response += "<TransitFrom>";
    response += "<AddressArtifactFormat>";
	    response += "<PoliticalDivision2>" + data.transitFrom.fromDivision2 + "</PoliticalDivision2>";
	    response += "<PoliticalDivision1>" + data.transitFrom.fromDivision1 + "</PoliticalDivision1>";
	    response += "<Country>" + data.transitFrom.fromCountry + "</Country>";
	    response += "<CountryCode>" + data.transitFrom.fromCountryCode + "</CountryCode>";
    response += "</AddressArtifactFormat>";
    response += "</TransitFrom>";

    response += "<TransitTo>";
    response += "<AddressArtifactFormat>";
	    response += "<PoliticalDivision2>" + data.transitTo.toDivision2 + "</PoliticalDivision2>";
	    response += "<CountryCode>" + data.transitTo.toCountryCode + "</CountryCode>";
	    response += "<PostcodePrimaryLow>" + data.transitTo.postCode + "</PostcodePrimaryLow>";
	    response += "<ResidentialAddressIndicator>" + data.transitTo.addressIndicator + "</ResidentialAddressIndicator>";
    response += "</AddressArtifactFormat>";
    response += "</TransitTo>";

	response +="<ShipmentWeight>";
	response += "<UnitOfMeasurement>";
	response += "<Code>" + data.shipmentWeight.code + "</Code>";
	response += "<Description>" + data.shipmentWeight.description + "</Description>";
	response += "</UnitOfMeasurement>";
	response += "<Weight>" + data.shipmentWeight.weight + "</Weight>";
	response +="</ShipmentWeight>";

	response += "<TotalPackagesInShipment>" + data.totalPackageShipment + "</TotalPackagesInShipment>";

	response +=  "<InvoiceLineTotal>";
    response +=  "<CurrencyCode>" + data.invoiceLineTotal.currencyCode + "</CurrencyCode>";
    response +=  "<MonetaryValue>" + data.invoiceLineTotal.monetaryValue + "</MonetaryValue>";
    response += "</InvoiceLineTotal>";

   response += "<PickupDate>" + data.pickupDate + "</PickupDate>";
   response += "<DocumentsOnlyIndicator />";
   response += "</TimeInTransitRequest>";

   return { success: true, body: response };


};

module.exports = TimeInTransit;
