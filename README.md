lightmine.js
============

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=shoxrocks&url=https://github.com/dontdrinkandroot/lightmine.js&title=Lightmine.js&language=&tags=github&category=software)

AngularJS based Redmine REST API Client with a Responsive Interface.

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

There is a plugin available [here](http://www.redmine.org/plugins/redmine_cors), that is supposed to address the issue. However I have not tested if the plugin is working. Any feedback is welcome.
