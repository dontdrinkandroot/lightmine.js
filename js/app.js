'use strict';

angular.module('LightmineApp', [ 'LightmineApp.filters', 'LightmineApp.services', 'LightmineApp.directives' ])

.config([ '$httpProvider', '$routeProvider', '$locationProvider', function($httpProvider, $routeProvider, $locationProvider) {
	
	$routeProvider.when('/login', {
		templateUrl : 'partials/login.html',
		controller : LoginController
	});
	
	$routeProvider.when('/project', {
		templateUrl : 'partials/project/list.html',
		controller : ProjectListController
	});
	
	$routeProvider.when('/project/:id', {
		templateUrl : 'partials/project/index.html',
		controller : ProjectIndexController
	});
	
	$routeProvider.otherwise({
		redirectTo : 'project'
	});
	
	$locationProvider.hashPrefix('!');
}])

.run(function($location) {
	$location.path('/login');
});