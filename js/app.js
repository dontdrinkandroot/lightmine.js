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
		templateUrl : 'partials/project/issues.html',
		controller : ProjectIssuesController
	});
	
	$routeProvider.when('/project/:id/issues', {
		templateUrl : 'partials/project/issues.html',
		controller : ProjectIssuesController
	});
	
	$routeProvider.when('/project/:id/versions', {
		templateUrl : 'partials/project/versions.html',
		controller : ProjectVersionsController
	});
	
	$routeProvider.when('/issue/:id/edit', {
		templateUrl : 'partials/issue/edit.html',
		controller : IssueEditController
	});
	
	$routeProvider.when('/issue/create', {
		templateUrl : 'partials/issue/create.html',
		controller : IssueCreateController
	});
	
	$routeProvider.otherwise({
		redirectTo : 'project'
	});
	
	$locationProvider.hashPrefix('!');
}])

.run(function($rootScope, $location, UserService, ProjectService, ConfigurationService) {
	
	var requestedPath = $location.path();
	var baseUrl = $.cookie('baseUrl');
	var apiKey = $.cookie('apiKey');
	
	/* Try login based on cookie */
	if (baseUrl !== undefined && apiKey !== undefined) {
		
		ConfigurationService.setRestServiceBase(baseUrl);
		ConfigurationService.setApiKey(apiKey);
		
		UserService.getCurrent()
			.success(function(data) {
				
				$rootScope.user = data.user;
				
				ProjectService.getTopLevelProjects().then(function(projects) {
					$rootScope.topLevelProjects = projects;
				});
			})
			.error(function(data, status, headers, config) {
				$location.path('/login');
			});
		
	} else {
		
		$location.path('/login');
	}
	
});