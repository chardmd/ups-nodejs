var https = require('https');
var qs = require('querystring');

var SANDBOX_API = 'wwwcie.ups.com';
var LIVE_API = 'onlinetools.ups.com';

var USE_JSON = false;

var ShipConfirm = function (licenseId, userId, password) {
	this.licenseId = licenseId;
	this.userId = userId;
	this.password = password;

	this.sandbox = true;
};

//Use UPS sandbox
ShipConfirm.prototype.useSandbox = function(bool) {
  	this.sandbox = (bool == true);
};

ShipConfirm.prototype.setJsonResponse = function(bool) {
	USE_JSON = (bool == true);
};

//Make a shipconfirm request
ShipConfirm.prototype.makeRequest = function(options, callback) {

	//set account credentials
	options['licenseId'] = this.licenseId;
	options['userId'] = this.userId;
	options['password'] = this.password;

	var req = https.request({
		host: (this.sandbox) ? SANDBOX_API : LIVE_API,
		path: '/ups.app/xml/ShipConfirm',
		method: 'POST'
	});

	/* build the request data for shipConfirm and write it to
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
    var response = "", err = false, insert;

    response += "<?xml version='1.0' encoding='utf-8'?>";
    response += "<AccessRequest xml:lang='en-US'>";
	
    response += "<AccessLicenseNumber>" + data.licenseId + "</AccessLicenseNumber>";
    response += "<UserId>" + data.userId + "</UserId>";
    response += "<Password>" + data.password + "</Password>";
    
    response += "</AccessRequest>";
	
    response += "<ShipmentConfirmRequest>";
		response += "<Request>";
			
			response += "<RequestAction>";
			response += "ShipConfirm";
			response += "</RequestAction>";
			
			if(!data.validate) return { success: false, error: 'Missing Validation type' };

			response += "<RequestOption>";
			response += data.validate;
			response += "</RequestOption>";
			
		response += "</Request>";
		
		response += "<Shipment>";
			if(!data.shipment) return { success: false, error: 'Missing Shipment' };
			
			if(data.shipment.description) {
				response += "<Description>";
				response += data.shipment.description;
				response += "</Description>";
			}
			
			// TO DO: Add ReturnService
			
			if(!data.shipment.shipper)  return { success: false, error: 'Missing Shipper' };
			var shipper = data.shipment.shipper;
			response += "<Shipper>";
			
				response += "<Name>";
				response += shipper.name;
				response += "</Name>";

				if(shipper.attentionName) {
					response += "<AttentionName>";
					response += shipper.attentionName;
					response += "</AttentionName>";
				}
				
				response += "<ShipperNumber>";
				response += shipper.shipperNumber || '';
				response += "</ShipperNumber>";
				
				if(shipper.phone) {
					response += "<PhoneNumber>";
					response += shipper.phone;
					response += "</PhoneNumber>";
				}
				
				if(!shipper.address)  return { success: false, error: 'Missing Shipper Address' };
				
				response += buildAddress(shipper.address);

			response += "</Shipper>";

			if(!data.shipment.shipTo)  return { success: false, error: 'Missing Ship To' };
			var shipTo = data.shipment.shipTo;
			response += "<ShipTo>";
			
				response += "<CompanyName>";
				response += shipTo.companyName;
				response += "</CompanyName>";

				if(shipTo.attentionName) {
					response += "<AttentionName>";
					response += shipTo.attentionName;
					response += "</AttentionName>";
				}
				
				if(shipTo.phone) {
					response += "<PhoneNumber>";
					response += shipTo.phone;
					response += "</PhoneNumber>";
				}
				
				if(!shipTo.address)  return { success: false, error: 'Missing Ship To Address' };
				
				response += buildAddress(shipTo.address);

			response += "</ShipTo>";

			if(data.shipment.shipFrom) {
				var shipFrom = data.shipment.shipFrom;
				response += "<ShipFrom>";

				if(shipFrom.companyName) {
					response += "<CompanyName>";
					response += shipFrom.companyName;
					response += "</CompanyName>";
				}	

				if(shipFrom.attentionName) {
					response += "<AttentionName>";
					response += shipFrom.attentionName;
					response += "</AttentionName>";
				}
				
				if(shipFrom.phone) {
					response += "<PhoneNumber>";
					response += shipFrom.phone;
					response += "</PhoneNumber>";
				}
					
					response += buildAddress(shipFrom.address);
				response += "</ShipFrom>";
			} 
		
			if(!data.shipment.payment)  return { success: false, error: 'Missing Shipment Payment' };
			var payment = data.shipment.payment;
			
			response += "<PaymentInformation>";
			
				response += "<Prepaid>";
				
					response += "<BillShipper>";
						response += "<AccountNumber>";
						response += payment.accountNumber
						response += "</AccountNumber>";
					response += "</BillShipper>";
					
				response += "</Prepaid>";
			
			response += "</PaymentInformation>";

			if(!data.shipment.service)  return { success: false, error: 'Missing Shipment Service' };
			var service = data.shipment.service;
			response += "<Service>";
			response += "<Code>";
				var code;
				switch(service.code.toLowerCase()) {
					case 'next day air':
						code = '01';
						break;
					case '2nd day air':
						code = '02';
						break;
					case 'ground':
						code = '03';
						break;
					case 'express':
						code = '07';
						break;
					case 'expedited': //worldwide expidited
						code = '08';
						break;
					case 'ups standard':
						code = '11';
						break;
					case '3 day select':
						code = '12';
						break;
					case 'next day air saver':
						code = '13';
						break;
					case 'next day air early am':
						code = '14';
						break;
					case 'express plus':
						code = '54';
						break;
					case '2nd day air am':
						code = '59';
						break;
					case 'ups saver': //ups express saver
						code = '65';
						break;
					case 'first class mail':
						code = 'M2';
						break;
					case 'priority mail':
						code = 'M3';
						break;
					case 'expedited mail innovations':
						code = 'M4';
						break;
					case 'priority mail innovations':
						code = 'M5';
						break;
					case 'economy mail innovations':
						code = 'M6';
						break;
					case 'ups today standard':
						code = '82';
						break;
					case 'ups today dedicated courier':
						code = '83';
						break;
					case 'ups today intercity':
						code = '84';
						break;
					case 'ups today express':
						code = '85';
						break;
					case 'ups today express saver':
						code = '86';
						break;
					case 'ups worldwide express fright':
						code = '96';
						break;
					default:
						 return { success: false, error: 'Invalid service code' };
					break;
				}
				response += code;
			response += "</Code>";
			response += "</Service>";

			// TO DO: ShipmentServiceOptions (note: return label may come from here, pg 26?)
			response += "<ShipmentServiceOptions>";

			if(data.shipment.confirmation) {
				response += "<DeliveryConfirmation>";
				response += "<DCISType>";
					response += (data.shipment.confirmation.type == 'required') ? '1' : '2';
				response += "</DCISType>";
				response += "</DeliveryConfirmation>";
			}
			response += "</ShipmentServiceOptions>";
			
			if(!data.shipment.package)  return { success: false, error: 'Missing Shipment Packages' };
			
			data.shipment.package.forEach(function(val) {
				response += "<Package>";
				insert = buildPackageInternals(val);
				if(insert) response += insert;
				else err = 'Bad Package Internals';
				response += "</Package>";
			});
			
		response += "</Shipment>";

		//TODO: Add alternate label types;
		response += "<LabelSpecification>";
			
			response += "<LabelPrintMethod>";
				response += "<Code>";
				response += 'GIF';
				response += "</Code>";
			response += "</LabelPrintMethod>";
			
			response += "<HTTPUserAgent>";
				response += "Mozilla/4.5";
			response += "</HTTPUserAgent>";

			response += "<LabelImageFormat>";
				response += "<Code>";
				response += 'GIF';
				response += "</Code>";
			response += "</LabelImageFormat>";
			
		response += "</LabelSpecification>";
		
    response += "</ShipmentConfirmRequest>";
    
    return (err) ? {success: false, error: err } : { success: true, body: response };
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

var buildInsurance = function(val) {
	var response = '';
	
	response += "<Type>";
		response += "<Code>";
		response += "01";
		response += "</Code>";
	response += "</Type>";

	response += "<CurrencyCode>";
		response += "USD";
	response += "</CurrencyCode>";

	response += "<MonetaryValue>";
		response += val.value;
	response += "</MonetaryValue>";
	
	return response;
};

var buildAddress = function(val) {
	var response = "";
	
	response += "<Address>";
		response += "<AddressLine1>";
		response += val.address1;
		response += "</AddressLine1>";

		response += "<AddressLine2>";
		response += val.address2 || '';
		response += "</AddressLine2>";

		response += "<AddressLine3>";
		response += val.address3 || '';
		response += "</AddressLine3>";
		
		response += "<City>";
		response += val.city;
		response += "</City>";

		response += "<StateProvinceCode>";
		response += val.state;
		response += "</StateProvinceCode>";

		response += "<PostalCode>";
		response += val.zip;
		response += "</PostalCode>";
		
		response += "<CountryCode>";
		response += val.country;
		response += "</CountryCode>";
	response += "</Address>";
	
	return response;
}

module.exports = ShipConfirm;
