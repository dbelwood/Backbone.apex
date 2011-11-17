#Backbone.apex

##Why
Writing javascript applications is one thing, writing them to integrate with salesforce.com can be daunting.  This library seeks to resolve that by providing a simple method for adding Apex REST communication support to your Backbone.js application.

##Usage
Currently, this library replaces the standard Backbone.sync function with a salesforce-flavoured version.  Adding this functionality is accomplised in two steps.

### Step 1
Include the script in your html source
```<apex:includeScript value="{!URLFOR($Resource.assets, '/js/backbone.salesforce.js')}"/>```

* In this example I'm including it in a Visualforce page.

###Step 2
Reference the url root of your Apex Rest Resource in the model/collection definitions:
Model:

```
class Account extends Backbone.Model
	urlRoot: 'accounts'
```

Collection:
```
class Accounts extends Backbone.Collection
		model: Account
		url: 'accounts'
		parse: (resp, xhr) ->
			_.each(resp, (result) ->
				delete result.attributes
			, @)
			resp
```

2 notes here.
1. I'm writing my code in CoffeeScript like all the cool kids do (this just compiles down to nicer JavaScript than I care to manually write.)
2. The 'parse' method in the collection is important as the results returned by the Apex REST web service includes an 'attributes' array in the JSON which collides with the 'attributes' associative array that Backbone.js uses to maintain state.

TODO - wrap these idiosyncracies in a Salesforce.Model and Salesforce.Collection