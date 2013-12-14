A collection of UPS API converted to NodeJS module
=======================

This is a very simple NodeJS module for UPS API, so simple, even your grandmother can use it. 

are you ready? let's see it in action.

### 1) How Shipping Services Work

The process to use the Shipping API consists of two phases, the ship confirm phase followed by the ship accept phase.

#### ShipConfirm

##### Initialization

    var ShipConfirm = require('./lib/shipConfirm');

    var confirmShipment = new ShipConfirm(<API licenseId>, <API userId>, <API password>);
    
##### Switch to sandbox

    confirmShipment.useSandbox(true);
    
##### Response as JSON

    confirmShipment.setJsonResponse(true);
    
##### Start making request.

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
    
    
[List of allowed parameters can be found in the UPS Developers Guide] (https://www.ups.com/upsdeveloperkit)
