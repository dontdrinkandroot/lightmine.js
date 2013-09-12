function LoginController($scope, $rootScope, $location, UserService, ConfigurationService, UserService, ProjectService) {
	
	$scope.submitting = false;
	
	var initAppAndRedirect = function(user) {
		
		$rootScope.user = user;
		
		ProjectService.getTopLevelProjects().then(function(projects) {
			$rootScope.topLevelProjects = projects;
			$scope.submitting = false;
			$location.path("/project");
		});
	}
	
	$scope.signIn = function() {
		
		delete $scope.error;
		$scope.submitting = true;
		
		ConfigurationService.setRestServiceBase($scope.baseUrl);
		ConfigurationService.setApiKey($scope.apiKey);
		
		UserService.getCurrent()
			.success(function(data) {
				$.cookie('baseUrl', $scope.baseUrl, { expires: 365 });
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


function ProjectIndexController($scope, $rootScope, $window, $routeParams, $location, ProjectService, IssueService) {
	
	ProjectService.get($routeParams.id).then(function(project) {
		$rootScope.project = project;
	});
	
	IssueService.getAllByProject($routeParams.id)
		.then(function(data) {
			$scope.issues = {
				'entries' : data.issues,
				'pagination' : {
					'offset' : data.offset,
					'total' : data.total_count,
					'limit' : data.limit
				}
			}
		});
	
	$scope.delete = function(id) {
		
		if ($window.confirm('Are you sure you wish to delete the project?')) {
			ProjectService.delete(id).then(function() {
				$location.path("/project");
			});
		}
	}
}


function IssueFormController($scope, ProjectService, IssueService, UserService) {
	
	$scope.submitting = false;
	
	ProjectService.getAllProjects().then(function(projects) {
		$scope.projects = projects;
	});
	
	IssueService.getIssueStatuses().then(function(statuses) {
		$scope.statuses = statuses;
	});
	
	UserService.getAllUsers().then(function(users) {
		$scope.users = users;
	});
	
	$scope.setAssignedTo = function(user) {
		$scope.issue.assigned_to = user;
	}
	
	$scope.setStatus = function(status) {
		$scope.issue.status = status;
	}
	
	$scope.setCategory = function(category) {
		$scope.issue.category = category;
	}
	
	$scope.setProject = function(project) {
		$scope.issue.project = project;
	}
	
	$scope.$watch("issue.project", function() {
		if (angular.isDefined($scope.issue.project)) {
			IssueService.getCategoriesByProject($scope.issue.project.id).then(function(categories) {
				$scope.categories = categories;
			});
		}
	});
	
	$scope.buildSubmission = function() {
		
		var submission = {};
		submission.issue = {};
		
		if ($scope.issue.project && angular.isDefined($scope.issue.project.id)) {
			submission.issue.project_id = $scope.issue.project.id;
		}
		
		if ($scope.issue.tracker && angular.isDefined($scope.issue.tracker.id)) {
			submission.issue.tracker_id = $scope.issue.tracker.id;
		}
		
		if ($scope.issue.status && angular.isDefined($scope.issue.status.id)) {
			submission.issue.status_id = $scope.issue.status.id;
		}
		
		if ($scope.issue.priority && angular.isDefined($scope.issue.priority.id)) {
			submission.issue.priority_id = $scope.issue.priority.id;
		}
		
		if (angular.isDefined($scope.issue.subject)) {
			submission.issue.subject = $scope.issue.subject;
		}
		
		if (angular.isDefined($scope.issue.description)) {
			submission.issue.description = $scope.issue.description;
		}
		
		if ($scope.issue.category && angular.isDefined($scope.issue.category.id)) {
			submission.issue.category_id = $scope.issue.category.id;
		}
		
		if ($scope.issue.fixed_version && angular.isDefined($scope.issue.fixed_version.id)) {
			submission.issue.fixed_version_id = $scope.issue.fixed_version.id;
		}
		
		if ($scope.issue.assigned_to && angular.isDefined($scope.issue.assigned_to.id)) {
			submission.issue.assigned_to_id = $scope.issue.assigned_to.id;
		}
		
		if ($scope.issue.parent_issue && angular.isDefined($scope.issue.parent_issue.id)) {
			submission.issue.parent_issue_id = $scope.issue.parent_issue.id;
		}
		
		if (angular.isDefined($scope.issue.category)) {
			submission.issue.category_id = $scope.issue.category.id;
		}
		
		console.log(submission);
		
		return submission;
	}
}


function IssueCreateController($injector, $scope, ProjectService, IssueService, UserService, $routeParams, $location) {
	
	$scope.issue = {};
	
	ProjectService.get($routeParams.project_id).then(function(project) {
		$rootScope.project = project;
		$scope.issue.project = project;
	});
	
	$scope.submit = function() {
		IssueService.create($scope.buildSubmission()).then(
				function() {
					$scope.submitting = false;
					$location.path("project/" + $scope.issue.project.id);
				},
				function() {
					$scope.submitting = false;
				}
			);
	}
	
	$injector.invoke(IssueFormController, this, {
		$scope: $scope,
		ProjectService: ProjectService,
		IssueService: IssueService,
		UserService: UserService
	});
}
IssueCreateController.prototype = Object.create(IssueFormController.prototype);


function IssueEditController($injector, $scope, ProjectService, IssueService, UserService, $routeParams, $location) {
	
	IssueService.get($routeParams.id).then(function(issue) {
		$scope.issue = issue;
		$rootScope.project = $scope.issue.project;
	});
	
	$scope.submit = function() {
		
		$scope.submitting = true;
		IssueService.edit($routeParams.id, $scope.buildSubmission()).then(
			function() {
				$scope.submitting = false;
				$location.path("project/" + $scope.issue.project.id);
			},
			function() {
				$scope.submitting = false;
			}
		);
	}
	
	$injector.invoke(IssueFormController, this, {
		$scope: $scope,
		ProjectService: ProjectService,
		IssueService: IssueService,
		UserService: UserService
	});
}
IssueEditController.prototype = Object.create(IssueFormController.prototype);