var services = angular.module('LightmineApp.services', ['ngResource']);

services.service('ConfigurationService', function($http) {

	var _restServiceBase;
	var _apiKey;
	
	this.getRestServiceBase = function() {
		return _restServiceBase;
	}
	
	this.setRestServiceBase = function(url) {
		_restServiceBase = url;
	}
	
	this.getApiKey = function() {
		return _apiKey;
	}
	
	this.setApiKey = function(apiKey) {
		_apiKey = apiKey;
		$http.defaults.headers.common['X-Redmine-API-Key'] = apiKey;
	}
});


services.service('UserService', function($http, ConfigurationService) {
	
	this.getCurrent = function() {
		return $http.get(ConfigurationService.getRestServiceBase() + "/users/current.json");
	}
});


services.service('ProjectService', function($http, ConfigurationService) {
	
	this.getAll = function() {
		return $http.get(ConfigurationService.getRestServiceBase() + "/projects.json");
	}
	
	this.get = function(projectId) {
		return $http.get(ConfigurationService.getRestServiceBase() + "/projects/" + projectId + ".json");
	}
});


services.service('IssueService', function($http, ConfigurationService) {
	
	this.getAllByProject = function(projectId) {
		return $http.get(ConfigurationService.getRestServiceBase() + "/issues.json?project_id=" + projectId);
	}
});