function LoginController($scope, $rootScope, $location, $cookies, UserService, ConfigurationService, UserService) {
	
	$scope.submitting = false;
	$scope.baseUrl = $cookies.baseUrl;
	$scope.apiKey = $cookies.apiKey;
	
	/* Try login based on cookie */
	if ($scope.baseUrl !== undefined && $scope.apiKey !== undefined) {
		
		ConfigurationService.setRestServiceBase($scope.baseUrl);
		ConfigurationService.setApiKey($scope.apiKey);
		$scope.submitting = true;
		
		UserService.getCurrent()
			.success(function(data) {
				$scope.submitting = false;
				$rootScope.user = data.user;
				$location.path("/project");
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
				$scope.submitting = false;
				$rootScope.user = data.user;
				$location.path("/project");
			})
			.error(function(data, status, headers, config) {
				$scope.error = "Login failed with status " + status;
				$scope.submitting = false;
			});
	}
	
}


function ProjectListController($scope, ProjectService) {
	
	ProjectService.getAll()
		.success(function(data) {
			$scope.projects = data.projects;
			$scope.pagination = {
				'offset' : data.offset,
				'total' : data.total_count,
				'limit' : data.limit
			}
		})
		.error(function(data, status, headers, config) {
		});
}


function ProjectIndexController($scope, $routeParams, ProjectService, IssueService) {
	
	ProjectService.get($routeParams.id)
		.success(function(data) {
			$scope.project = data.project;
		})
		.error(function(data, status, headers, config) {
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