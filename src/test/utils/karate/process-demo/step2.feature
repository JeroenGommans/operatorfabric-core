Feature: Process Cards


Scenario: Step1 


    * def getCard = 
    """
    function() {

      startDate = new Date().valueOf() + 2*60*60*1000;

		var card = {
			"publisher" : "api_test",
			"processVersion" : "1",
			"process"  :"api_test",
			"processId" : "processProcess",
			"state": "processState",
			"recipient" : {
						"type" : "GROUP",
						"identity" : "TSO1"
					},
			"severity" : "INFORMATION",
			"startDate" : startDate,
			"summary" : {"key" : "defaultProcess.summary"},
			"title" : {"key" : "process.title"},
			"data" : {"state":"calcul1","stateName":"CALCUL1"},
		}

	return JSON.stringify(card);

      }
    """
    * def card = call getCard 



Given url opfabPublishCardUrl + 'cards' 

And request card  
And header Content-Type = 'application/json'
When method post
Then status 201
And match response.count == 1



