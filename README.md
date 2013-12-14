A collection of UPS API converted to NodeJS module
=======================

Hey boys and girls, this is a very simple NodeJS module for UPS API, so simple, even your grandmother can use it! :-)

The UPS-NODE-JS is a tool to allow you to communicate with the UPS servers very easily. This allows us to send our information, like addresses and weight and receive shipping rates and other information from UPS. UPS provides access to there web API for free so developers can interact with their services to provide UPS information through their own custom apps. Whether it be through your web based ecommerce system to accurately determine shipping costs or display tracking information through your website.


But before we start, you need to have an access to UPS API. Getting access to the UPS developer tools is pretty easy. The first thing you will want to do is:

[Register for UPS Online Tools] (https://www.ups.com/servlet/registration?loc=en_US&returnto=http%3A%2F%2Fwww.ups.com%2Fe_comm_access%2FlaServ%3Floc%3Den_US)



so are you ready? let's see it in action.

### 1) How Shipping Services Work

An all encompassing tool for enterprises. This allows you to actually ship things and printed labels. The process to use the Shipping API consists of two phases, the ship confirm phase followed by the ship accept phase. 

### ShipConfirm

##### Initialization

    var ShipConfirm = require('./lib/shipConfirm');

    var confirmShipment = new ShipConfirm(<API licenseId>, <API userId>, <API password>);
    
##### Switch to Sandbox

    confirmShipment.useSandbox(true);
    
##### Response as JSON

    confirmShipment.setJsonResponse(true);
    
##### Start making Request.

    confirmShipment.makeRequest({
      "validate": "nonvalidate",
      "shipment": {
          "description": "Shipment to Philippines",
          "shipper": {
              "name": "RP Republic",
              "attentionName": "Jose Rizal",
        //More request parameters
    }, function(err, data) {
      if (err) {
        console.error(err);
      }
    
      if (data) {
        //Enjoy playing the data :)
      	console.log(data);
      }
    });
    
### ShipAccept

##### Initialization

    var ShipAccept = require('./lib/shipAccept');

    var acceptShipment = new ShipAccept(<API licenseId>, <API userId>, <API password>);
    
##### Switch to Sandbox

    acceptShipment.useSandbox(true);
    
##### Response as JSON

    acceptShipment.setJsonResponse(true);
    
##### Start making Request.

    confirmShipment.makeRequest({
      "digest" : "rO0ABXNyACpjb20udXBzLmVjaXMuY29yZS5zaGlwbWVudHMuU2hpcG1lbnREaWdlc...."
    }, function(err, data) {
      if (err) {
        console.error(err);
      }
    
      if (data) {
        //Enjoy playing the data :)
      	console.log(data);
      }
    });


    
    
[List of allowed parameters can be found in the UPS Developers Guide] (https://www.ups.com/upsdeveloperkit)
