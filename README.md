lightmine.js
============

AngularJS based Redmine REST API Client with a Responsive Interface.

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=shoxrocks&url=http://www.dontdrinkandroot.net/github/lightmine.js&title=AngularJS%20based%20Redmine%20REST%20API%20Client%20with%20a%20Responsive%20Interface&language=&tags=github&category=software)

[![Donate](http://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=W9NAXW8YAZ4D6&item_name=lightmine.js%20Donation&currency_code=EUR) 

Prerequisites
-----

* Tested against Redmine 1.4.4 (Shipped with debian 7).

CORS
-----

Redmine does not support proper handling of cross origin resource sharing ([CORS](http://www.w3.org/TR/cors/)). Therefore requests against the Redmine REST API with modern web browsers will usually fail.

### Redmine < 2.0

If you are running redmine on an Apache Webserver with the [Passenger Mod](https://www.phusionpassenger.com/) you can change the Vhost in the following way:

* Enable mod_rewrite
* Enable mod_headers
* Add the following code to the Vhost:

```
RewriteEngine On                  
RewriteCond %{REQUEST_METHOD} OPTIONS 
RewriteRule ^(.*)$ $1 [R=200,L]

Header always set Access-Control-Allow-Origin "*"                   
Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
Header always set Access-Control-Allow-Headers "origin, content-type, accept, authorization, x-requested-with, x-redmine-api-key"
```

If this doesn't work, try the solution suggested [here](http://stackoverflow.com/questions/12194371/how-to-add-response-header-in-vhost-or-passeneger-ruby).

### Redmine >= 2.0

There is a plugin available [here](http://www.redmine.org/plugins/redmine_cors) ([GitHub](https://github.com/mavimo/redmine_cors)) that provides the headers as needed.
