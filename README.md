Ups-Node-JS: An easy to use NodeJS module for integrating UPS APIs
=======================

Every UPS API has a corresponding manual which contains hundred of pages long and reading each books is a pain in the ass. And unfortunately there is no provided example written on Node.js

Check it out boys and girls and see it for yourself. [UPS Developers Guide] (https://www.ups.com/upsdeveloperkit)

### Why use Ups-Node-JS?

#### Dead Simple

Forget about those boring long and hundred of pages manuals. this is a very simple NodeJS module for UPS API. It's so simple, even your grandmother can do it!

#### Supports JSON Request and Response

Direct UPS APIs still uses plain old XML for their web services. But don't you worry my friend,
Ups-Node-JS supports JSON.

#### How to start?

Before we start, you need to have an access to UPS API. Getting access to the UPS developer tools is pretty easy. The first thing you will want to do is:

[Register for UPS Online Tools] (https://www.ups.com/servlet/registration?loc=en_US&returnto=http%3A%2F%2Fwww.ups.com%2Fe_comm_access%2FlaServ%3Floc%3Den_US)

#### Is this stable?

As of current writing, this is still in beta stage. Feel free to play around. I'll be happy to merge your changes.

#### Start Rocking!

so are you ready? let's see it in action.

### 1) How Shipping Services Work

Shipping Services give your applications many ways to manage the shipment of small packages to their destination. UPS offers a range of delivery time frames from same day to standard ground transportation. Shipments may be within the United States or international, and they may range from letter documents to large packages. 

The process to use the Shipping API consists of two phases, the ship confirm phase followed by the ship accept phase. 

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
    

...to be continue.
