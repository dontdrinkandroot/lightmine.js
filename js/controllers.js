function LoginController($scope, $rootScope, $location, $cookies, UserService, ConfigurationService, UserService, ProjectService) {
	
	$scope.submitting = false;
	$scope.baseUrl = $cookies.baseUrl;
	$scope.apiKey = $cookies.apiKey;
	
	var initAppAndRedirect = function() {
		
		ProjectService.getTopLevelProjects().then(function(projects) {
			$rootScope.projects = projects;
			$scope.submitting = false;
			$location.path("/project");
		});
	}
	
	/* Try login based on cookie */
	if ($scope.baseUrl !== undefined && $scope.apiKey !== undefined) {
		
		ConfigurationService.setRestServiceBase($scope.baseUrl);
		ConfigurationService.setApiKey($scope.apiKey);
		$scope.submitting = true;
		
		UserService.getCurrent()
			.success(function(data) {
				$rootScope.user = data.user;
				initAppAndRedirect();
			})
			.error(function(data, status, headers, config) {
				$scope.submitting = false;
			});
	}
	
	$scope.signIn = function() {
		
		delete $scope.error;
		$scope.submitting = true;
		
		ConfigurationService.setRestServiceBase($scope.baseUrl);
		ConfigurationService.setApiKey($scope.apiKey);
		
		UserService.getCurrent()
			.success(function(data) {
				$cookies.baseUrl = $scope.baseUrl;
				$cookies.apiKey = $scope.apiKey;
				$rootScope.user = data.user;
				initAppAndRedirect();
			})
			.error(function(data, status, headers, config) {
				$scope.error = "Login failed with status " + status;
				$scope.submitting = false;
			});
	}
	
}


function ProjectListController($scope, ProjectService) {
}


function ProjectIndexController($scope, $routeParams, ProjectService, IssueService) {
	
	ProjectService.get($routeParams.id).then(function(project) {
		$scope.project = project;
	});
	
	IssueService.getAllByProject($routeParams.id)
		.success(function(data) {
			$scope.issues = {
				'entries' : data.issues,
				'pagination' : {
					'offset' : data.offset,
					'total' : data.total_count,
					'limit' : data.limit
				}
			}
		})
		.error(function(data, status, headers, config) {
		});
}


function NavigationController($scope, ProjectService) {
}