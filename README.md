#Swivel
Swivel is a proof of concept for a data visualization tool that enables viewing tiles of data and grouping them into "buckets".

The goal is to write an HTML5 tool for splunking through chunks of data.

<a href="http://swivel.minidoc.tv">Visit a working example</a>.


#Getting Started 
thin --debug --rackup config.ru start 

#Running Tests 
rake jasmine

#Installation
Swivel relies on a simple Sinatra back end, jasmine unit tests, backboneJS, underscoreJS, D3, jQuery UI (for the range control), jQuery, and bootstrap CSS.

running it requires creating a config.yml file with the following:
    key: XXXXXXXXXXXXXXXXXXXXXX

(where XXXX... is your API Key for the Guardian newspaper)

#Requirements
- a free API Key from the Guardian newspaper: http://content.guardianapis.com  

#TODO

Much needs to be done: 
- zoom support
- ability to sort (we have tests for this, but the toolbar and views are not implemented)
- better inspector for the Guardian sample
- ability to drill down or drill up on date buckets (e.g. go from day to month to year bucketing)
- investigate looking at using a canvas-based implementation (with a framework like KineticJS) for performance improvements on larger data sets.
