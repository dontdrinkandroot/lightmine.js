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


services.service('ProjectService', function($http, $q, ConfigurationService) {
	
	var projectService = this;
	
	var projectMap = undefined;
	var topLevelProjects = undefined;
	var loadPromise = undefined;
	
	this.loadProjects = function() {
		
		if (loadPromise !== undefined) {
			return loadPromise;
		}
		
		var deferredLoad = $q.defer();
		
		if (topLevelProjects !== undefined) {
			
			deferredLoad.resolve(topLevelProjects);
			
		} else {
			
			$http.get(ConfigurationService.getRestServiceBase() + "/projects.json?limit=1000").then(function(response) {
				
				projectMap = {};
				topLevelProjects = new Array();
				
				/* First pass, hash projects */
				for (var i = 0; i < response.data.projects.length; i++) {
					projectMap[response.data.projects[i].id] = response.data.projects[i];
				}
				
				/* Second pass, assign subprojects */
				for (var i = 0; i < response.data.projects.length; i++) {
					var project = response.data.projects[i];
					if (project.parent !== undefined) {
						var parent = projectMap[project.parent.id];
						if (parent.children === undefined) {
							parent.children = new Array();
						}
						parent.children.push(project);
					} else {
						topLevelProjects.push(project);
					}
				}
				
				deferredLoad.resolve(topLevelProjects);
			});
		}
		
		loadPromise = deferredLoad.promise;
		
		return loadPromise;
	};
	
	this.getTopLevelProjects = function() {
		
		return projectService.loadProjects().then(function(projects) {
			return topLevelProjects;
		});
	}
	
	this.get = function(id) {
		return projectService.loadProjects().then(function(projects) {
			return projectMap[id];
		});
	}
});


services.service('IssueService', function($http, ConfigurationService) {
	
	this.getAllByProject = function(projectId) {
		return $http.get(ConfigurationService.getRestServiceBase() + "/issues.json?project_id=" + projectId);
	}
});