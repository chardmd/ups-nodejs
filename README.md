Ups-Node-JS: An easy to use NodeJS module for integrating UPS APIs
=======================

Every UPS API has a corresponding manual which contains hundred of pages long and reading each books is a pain in the ass. And unfortunately there is no provided example written on Node.js

Check it out boys and girls and see it for yourself. [UPS Developers Guide] (https://www.ups.com/upsdeveloperkit)

### Why use Ups-Node-JS?

#### Dead Simple

Forget about those boring hundred of pages manuals. this is a very simple NodeJS module for UPS API. It's so simple, even your grandmother can do it!

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

### How to Install

Run this [npm](http://npmjs.org/) command to install

    npm install ups_node

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
    
##### Start making a Request

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
    
##### Start making a Request

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
    

### 2) UPS Address Validation Tool

Customers can validate the accuracy of their address at the regional level. The API can help reduce costly returns, provide better service to customers, and more accurately determine shipping costs. When the Address Validation API finds close matches for a given input combination, a postal code range may be associated with each match.
    
##### Start making a Request

    addressValidation.makeRequest({
            "customerContext" : "Customer Data",
            "city" : "Miami",
            "stateProvinceCode": "FL"
    }, function(err, data) {
      if (err) {
        console.error(err);
      }
    
      if (data) {
        //Enjoy playing the data :)
      	console.log(data);
      }
    });

### 3) Cancellations (Voids)

No matter which UPS shipping system you use, voiding an unshipped package is easy.

##### Start making Request

    voidShipment.makeRequest({
            "tracking" : "123123123ASDF23.."
    }, function(err, data) {
      if (err) {
        console.error(err);
      }
    
      if (data) {
        //Enjoy playing the data :)
        console.log(data);
      }
    });

### 4) Time in Transit Operation

Find out what services you can ship with to a certain area. It can determine the delivery time for various UPS services. The API lets you compare the speed of delivery of different services so that you can select the service most appropriate for your shipment.

##### Start making a Request

    timeInTransit.makeRequest({ 
        "customerContext": "Walter White",
        "transitFrom": {
            "fromCountryCode": "US",
            "fromCountry": "New York",
            "fromDivision1": "Breaking Bad City",
            // more parameters here
        }, function(err, data) {
          if (err) {
            console.error(err);
          }
        
          if (data) {
            //Enjoy playing the data :)
            console.log(data);
          }
        });

License
=======================

Copyright (c) Richard Dimalanta (richard.dimalanta@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
