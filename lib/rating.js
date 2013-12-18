var https = require('https');
var qs = require('querystring');

var SANDBOX_API = 'wwwcie.ups.com';
var LIVE_API = 'onlinetools.ups.com';

var USE_JSON = false;

var Rating = function (licenseId, userId, password) {
	this.licenseId = licenseId;
	this.userId = userId;
	this.password = password;

	this.sandbox = true;
};

//Use UPS sandbox
Rating.prototype.useSandbox = function(bool) {
  	this.sandbox = (bool == true);
};

Rating.prototype.setJsonResponse = function(bool) {
	USE_JSON = (bool == true);
};

//Make a shipAccept request
Rating.prototype.makeRequest = function(options, callback) {

	//set account credentials
	options['licenseId'] = this.licenseId;
	options['userId'] = this.userId;
	options['password'] = this.password;

	var req = https.request({
		host: (this.sandbox) ? SANDBOX_API : LIVE_API,
		path: '/ups.app/xml/Rate',
		method: 'POST'
	});

	/* build the request data for rating and write it to
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
	response += "	<RatingServiceSelectionRequest xml:lang='en-US'>";
	response += "	  <Request>";
	response += "	    <TransactionReference>";

	if (!data.customerContext) return { success: false, error: 'Missing Customer Context'};

	response += "	      <CustomerContext>Rating and Service</CustomerContext>";
	response += "	      <XpciVersion>1.0</XpciVersion>";
	response += "	    </TransactionReference>";
	response += "		<RequestAction>Rate</RequestAction>";
	response += "	  </Request>";

	if (!data.pickUpType)  return { success: false, error: 'Missing Pickup Type' };
	var pickUpType = data.pickUpType;

	response += "	    <PickupType>";
	response += "	  	<Code>" + pickUpType.code + "</Code>";
	response += "	  	<Description>" + pickUpType.description + "</Description>";
	response += "	    </PickupType>";


	if (!data.shipment) return { success: false, error: 'Missing Shipment'};
	var shipment = data.shipment;

	response += "	  <Shipment>";
	response += "	    	<Description>" + shipment.description + "</Description>";
	response += "	    <Shipper>";
	response += "	      <Name>" + shipment.name + "</Name>";
	response += "	      <PhoneNumber>" + shipment.phoneNumber + "</PhoneNumber>";
	response += "	      <ShipperNumber>" + shipment.shipperNumber + "</ShipperNumber>";

	if (!data.shipment.shipper.address) return { success: false, error: 'Missing shipment address' };
	var shipperAddress = data.shipment.shipper.address;

	response += "	      <Address>";
	response += "	        <AddressLine1>" + shipperAddress.addressLine + "</AddressLine1>";
	response += "	        <City>" + shipperAddress.city + "</City>";
	response += "	        <StateProvinceCode>" + shipperAddress.StateProvinceCode + "</StateProvinceCode>";
	response += "	        <PostalCode>" + shipperAddress.PostalCode + "</PostalCode>";
	response += "	        <CountryCode>" + shipperAddress.countryCode + "</CountryCode>";
	response += "	      </Address>";
	response += "	    </Shipper>";

	if (!data.shipment.shipTo) return { success: false, error: 'Missing ShipTo' };
	var shipTo = data.shipment.shipTo;

	response += "	    <ShipTo>";
	response += "	      <CompanyName>" + shipTo.companyName  + "</CompanyName>";
	response += "	      <PhoneNumber>" + shipTo.phoneNumber + "</PhoneNumber>";
	response += "	      <Address>";
	response += "	        <AddressLine1>" + shipTo.address.addressLine + "</AddressLine1>";
	response += "	        <City>" + shipTo.address.city + "</City>";
	response += "	        <PostalCode>" + shipTo.address.postalCode + "</PostalCode>";
	response += "	        <CountryCode>" + shipTo.address.countryCode + "</CountryCode>";
	response += "	      </Address>";
	response += "	    </ShipTo>";

	if (!data.shipment.shipFrom) return { success: false, error: 'Missing shipFrom' };
	var shipFrom = data.shipment.shipFrom;

	response += "	    <ShipFrom>";
	response += "	      <CompanyName>" + shipFrom.companyName + "</CompanyName>";
	response += "	      <AttentionName>" + shipFrom.attentionName + "</AttentionName>";
	response += "	      <PhoneNumber>" + shipFrom.phoneNumber + "</PhoneNumber>";
	response += "	      <FaxNumber>" + shipFrom.faxNumber + "</FaxNumber>";
	response += "	      <Address>";
	response += "	        <AddressLine1>" + shipFrom.address.addressLine + "</AddressLine1>";
	response += "			<City>" + shipFrom.address.city + "</City>";
	response += "	        <StateProvinceCode>" + shipFrom.address.stateProvinceCode + "</StateProvinceCode>";
	response += "	        <PostalCode>" + shipFrom.address.postalCode + "</PostalCode>";
	response += "	        <CountryCode>" + shipFrom.address.countryCode + "</CountryCode>";
	response += "	      </Address>";
	response += "	    </ShipFrom>";

	if (!data.shipment.service) return { success: false, error: 'Missing shipment service' };
	var service = data.shipment.service;

	response += "	  	<Service>";
	response += "	    		<Code>" + service.code + "</Code>";
	response += "	  	</Service>";

	if (!data.shipment.paymentInformation) return { success: false, error: 'Missing Payment Information' };
	var paymentInformation = data.shipment.paymentInformation;

	response += "	  	<PaymentInformation>";
	response += "		      	<Prepaid>";
	response += "	        		<BillShipper>";
	response += "	          			<AccountNumber>" + paymentInformation.accountNumber + "</AccountNumber>";
	response += "	        		</BillShipper>";
	response += "	      		</Prepaid>";
	response += "	  	</PaymentInformation>";

	if(!data.shipment.package)  return { success: false, error: 'Missing Shipment Packages' };


	data.shipment.package.forEach(function(val) {
		response += "<Package>";
		insert = buildPackageInternals(val);
		if(insert) response += insert;
		else err = 'Bad Package Internals';
		response += "</Package>";
	});

	if (!data.shipment.schedule) return { success: false, error: 'Missing Shipment Schedule'};

	var schedule = data.shipment.schedule;

	response += "	    <ShipmentServiceOptions>";
	response += "	      <OnCallAir>";
	response += "			<Schedule>";
	response += "				<PickupDay>" + schedule.pickUpDay + "</PickupDay>";
	response += "				<Method>" + schedule.method + "</Method>";
	response += "			</Schedule>";
	response += "	      </OnCallAir>";
	response += "	    </ShipmentServiceOptions>";
	response += "	  </Shipment>";
	response += "	</RatingServiceSelectionRequest>";

	console.log(response);

	return { success: true, body: response };

};

var buildPackageInternals = function(val) {
	var response = '';
	
	if(val.description) {
		response += "<Description>";
		response += val.description;
		response += "</Description>";
	}
	
	response += "<PackagingType>";
		response += "<Code>";
			response += val.code || '02';
		response += "</Code>";
	response += "</PackagingType>";
	
	response += "<PackageWeight>";
		response += "<Weight>";
		response += val.weight || '1';
		response += "</Weight>";
	response += "</PackageWeight>";
	
	//TODO: Insurance
	if(val.insurance) {
		response += "<PackageServiceOptions>";
			response += "<InsuredValue>";
			response += buildInsurance(val.insurance);
			response += "</InsuredValue>";
		response += "</PackageServiceOptions>";
	}
	return response;
};

module.exports = Rating;