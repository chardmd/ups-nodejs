UPS-NodeJS: An easy to use NodeJS module for integrating UPS APIs
=======================

Each UPS API has a corresponding manual which mostly contains hundreds of pages long and reading every book is quite pain in the ass. Unfortunately there is no provided example written in Node.JS.

Check it out boys and girls and see it for yourself. [UPS Developers Guide] (https://www.ups.com/upsdeveloperkit)

### Why use UPS-NodeJS?

#### Dead Simple

Forget about those boring hundred of pages manuals. This is a very simple NodeJS module for integrating UPS APIs. It's so simple, _even your grandmother can do it_!

#### Supports JSON Request and Response

Direct UPS APIs still use plain old XML for their web services. But don't you worry ma' friend,
Ups-Node-JS supports JSON.

#### How to start?

Before we start, you need to have an access to UPS API. Getting access to the UPS developer tools is pretty easy. The first thing you'll want to do is:

[Register for UPS Online Tools] (https://www.ups.com/servlet/registration?loc=en_US&returnto=http%3A%2F%2Fwww.ups.com%2Fe_comm_access%2FlaServ%3Floc%3Den_US)


#### What are the available APIs?

|    API                 | Status        |
|------------------------|---------------|
| shipConfirm            | available     |
| shipAccept             | available     |
| addressValidation      | available     |
| voidShipment           | available     |
| timeInTransit          | available     |
| ratingServiceSelection | available     |
| tracking               | available     |

#### Start Rocking!

so are you ready? let's see it in action.

## 1) How Shipping Services Work

Shipping Services give your applications many ways to manage the shipment of small packages to their destination. UPS offers a range of delivery time frames from same day to standard ground transportation. Shipments may be within the United States or international, and they may range from letter documents to large packages. 

The process to use the Shipping API consists of two phases, the ship confirm phase followed by the ship accept phase. 

### ShipConfirm

##### Initialization

    var ShipConfirm = require('ups_node').ShipConfirm;

    var confirmShipment = new ShipConfirm(<API licenseId>, <API userId>, <API password>);
    
##### Switch to Sandbox

    confirmShipment.useSandbox(true);
    
##### Response as JSON

    confirmShipment.setJsonResponse(true);
    
##### Start making a Request

    confirmShipment.makeRequest({
      validate: "nonvalidate",
      shipment: {
          description: "Shipment to Philippines",
          shipper: {
            name: "Metro Inc Limited",
            attentionName: "John Doe",
            phone: "12311",
            shipperNumber: "A123B89",
            phone: "1212311",
            address: {
              address1: "Flat 9999",
              address2: "Sun West Center Mall",
              address3: "25 West Yip Street",
              city: "Miami",
              state: "HK",
              country: "HK",
              zip: "75093"
            }
        },
        shipTo: {
            companyName: "Company Name",
            attentionName: "Pedro Calunsod",
            phone: "12321341",
            address : {
              address1: "999 Warrior St.",
              address2: "Maria Cons. Subd. Shiper",
              address3: "Stage, Valley",
              city: "Stage City",
              state: "PH",
              country: "PH",
              zip: "2010"
            }
        },
        payment : {
          accountNumber : "A123B89"
        },
        service : {
          code : "expedited" 
        },
        package : [
          {
            code : "02",
            weight : "1"
          },
          {
            code : "02",
            weight : "1"
          }
         ]
        }
     });
    
### ShipAccept

##### Initialization

    var ShipAccept = require('ups_node').ShipAccept;

    var acceptShipment = new ShipAccept(<API licenseId>, <API userId>, <API password>);
    
##### Switch to Sandbox

    acceptShipment.useSandbox(true);
    
##### Response as JSON

    acceptShipment.setJsonResponse(true);
    
##### Start making a Request

    confirmShipment.makeRequest({
         digest : "rO0ABXNyACpjb20udXBzLmVjaXMuY29yZS5zaGlwbWVudHMuU2hpcG1lbnREaWdlc...."
    }, function(err, data) {
      if (err) {
        console.error(err);
      }
    
      if (data) {
        //Enjoy playing the data :)
      	console.log(data);
      }
    });
    

## 2) UPS Address Validation Tool

Customers can validate the accuracy of their address at the regional level. The API can help reduce costly returns, provide better service to customers, and more accurately determine shipping costs. When the Address Validation API finds close matches for a given input combination, a postal code range may be associated with each match.
    
##### Start making a Request

    addressValidation.makeRequest({
            customerContext : "Customer Data",
            city : "Miami",
            stateProvinceCode: "FL"
    }, function(err, data) {
      if (err) {
        console.error(err);
      }
    
      if (data) {
        //Enjoy playing the data :)
      	console.log(data);
      }
    });

## 3) Cancellations (Voids)

No matter which UPS shipping system you use, voiding an unshipped package is easy.

##### Start making Request

    voidShipment.makeRequest({
            tracking : "123123123ASDF23.."
    }, function(err, data) {
      if (err) {
        console.error(err);
      }
    
      if (data) {
        //Enjoy playing the data :)
        console.log(data);
      }
    });

## 4) Time in Transit Operation

Find out what services you can ship with to a certain area. It can determine the delivery time for various UPS services. The API lets you compare the speed of delivery of different services so that you can select the service most appropriate for your shipment.

##### Start making a Request

    timeInTransit.makeRequest({ 
            customerContext: "Walter White",
            transitFrom: {
                fromCountryCode: "US",
                fromCountry: "New York",
                fromDivision1: "Breaking Bad City",
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

## 5) Rating Services

The Rating API gives applications the ability to look up rates for UPS services and compare the cost of service alternatives.

        rating.makeRequest({
            customerContext: "Rating and Service",
            pickUpType: {
                code: "07",
                description: "Rate"
            },
            shipment: {
                description: "Rate Description",
                name: "Name",
                phoneNumber: "1234567890",
                shipperNumber: "Ship Number",
                shipper: {
                    address: {
                        addressLine: "Address Line",
                        city: "City",
                        StateProvinceCode: "NJ",
                        PostalCode: "07430",
                        countryCode: "US"
                    }
                },
                shipTo: {
                    companyName: "Company Name",
                    phoneNumber: "1234567890",
                    address: {
                        addressLine: "Address Line",
                        city: "Corado",
                        postalCode: "00646",
                        countryCode: "PR"
                    }
                },
                shipFrom: {
                    companyName: "Company Name",
                    attentionName: "Attention Name",
                    phoneNumber: "1234567890",
                    faxNumber: "1234567890",
                    address: {
                        addressLine: "Address Line",
                        city: "Boca Raton",
                        stateProvinceCode: "FL",
                        postalCode: "33434",
                        countryCode: "US"
                    }
                },
                service: {
                    code: "03"
                },
                paymentInformation: {
                    accountNumber: "Ship Number"
                },
                package: [
                    {
                        code: "02",
                        weight: "1"
                    },
                    {
                        code: "02",
                        weight: "1"
                    }
                ],
                schedule: {
                    pickUpDay: "02",
                    method: "02"
                }
            }
        }, function(err, data) {
          if (err) {
            console.error(err);
          }

          if (data) {

            console.log(data);
          }
        });


## 5) Tracking Services

The Tracking API gives client applications access to UPS tracking information. With this service, clients query UPS to determine the up-to-the-minute status of a shipment or a package, including its delivery status and the time and location of the latest transit scan.

      tracking.makeRequest({
          customerContext: "Customer Data",
          trackingNumber : "123123123ASDF23"
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

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
