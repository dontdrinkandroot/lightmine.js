function LoginController($scope, $rootScope, $location, UserService, ConfigurationService, UserService, ProjectService) {
	
	$scope.submitting = false;
	$scope.baseUrl = $.cookie('baseUrl');
	$scope.apiKey = $.cookie('apiKey');
	
	var initAppAndRedirect = function(user) {
		
		$rootScope.user = user;
		
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
				initAppAndRedirect(data.user);
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
				$.cookie('baseUrl', $scope.baseUrl);
				$.cookie('apiKey', $scope.apiKey, { expires: 365 });
				initAppAndRedirect(data.user);
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