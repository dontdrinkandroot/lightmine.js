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


function ProjectVersionsController($scope, $rootScope, $routeParams, ProjectService) {
	
	ProjectService.get($routeParams.id).then(function(project) {
		$rootScope.project = project;
	});
	
	ProjectService.getVersions($routeParams.id).then(function(versions) {
		$scope.versions = versions;
	});
}


function ProjectIssuesController($scope, $rootScope, $window, $routeParams, $location, ProjectService, IssueService) {
	
	ProjectService.get($routeParams.id).then(function(project) {
		$rootScope.project = project;
	});
	
	$scope.loadIssues = function() {
	
		delete $scope.issues;
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
	}
	
	$scope.deleteIssue = function(issue) {
		
		if ($window.confirm('Are you sure you wish to delete the issue?')) {
			IssueService.delete(issue.id).then(function() {
				$scope.loadIssues();
			});
		}
	}
	
	$scope.delete = function(id) {
		
		if ($window.confirm('Are you sure you wish to delete the project?')) {
			ProjectService.delete(id).then(function() {
				$location.path("/project");
			});
		}
	}
	
	$scope.loadIssues();
}


function IssueFormController($scope, ProjectService, IssueService, UserService) {
	
	$scope.submitting = false;
	
	ProjectService.getAllProjects().then(function(projects) {
		$scope.projects = projects;
	});
	
	IssueService.getIssueStatuses().then(function(statuses) {
		$scope.statuses = statuses;
	});
	
	ProjectService.getTrackers().then(function(trackers) {
		$scope.trackers = trackers;
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
	
	$scope.setVersion = function(version) {
		$scope.issue.fixed_version = version;
	}
	
	$scope.setTracker = function(tracker) {
		$scope.issue.tracker = tracker;
	}
	
	$scope.$watch("issue.project", function() {
		
		if (angular.isDefined($scope.issue) && angular.isDefined($scope.issue.project)) {
			
			/* Reset category if not initial assignment */
			if (angular.isDefined($scope.categories)) {
				delete $scope.issue.category;
			}
			
			/* Reset version if not initial assignment */
			if (angular.isDefined($scope.versions)) {
				delete $scope.issue.fixed_version;
			}
			
			IssueService.getCategoriesByProject($scope.issue.project.id).then(function(categories) {
				$scope.categories = categories;
			});
			
			ProjectService.getVersions($scope.issue.project.id).then(function(versions) {
				$scope.versions = versions;
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
		} else {
			submission.issue.category_id = null;
		}
		
		if ($scope.issue.assigned_to && angular.isDefined($scope.issue.assigned_to.id)) {
			submission.issue.assigned_to_id = $scope.issue.assigned_to.id;
		} else {
			submission.issue.assigned_to_id = null;
		}
		
		if ($scope.issue.parent_issue && angular.isDefined($scope.issue.parent_issue.id)) {
			submission.issue.parent_issue_id = $scope.issue.parent_issue.id;
		} else {
			submission.issue.parent_issue_id = null;
		}
		
		if (angular.isDefined($scope.issue.category) && angular.isDefined($scope.issue.category.id)) {
			submission.issue.category_id = $scope.issue.category.id;
		} else {
			submission.issue.category_id = null;
		}
		
		if (angular.isDefined($scope.issue.fixed_version) && angular.isDefined($scope.issue.fixed_version.id)) {
			submission.issue.fixed_version_id = $scope.issue.fixed_version.id;
		} else {
			submission.issue.fixed_version_id = null;
		}
		
		if (angular.isDefined($scope.issue.tracker) && angular.isDefined($scope.issue.tracker.id)) {
			submission.issue.tracker_id = $scope.issue.tracker.id;
		} else {
			submission.issue.tracker_id = null;
		}
		
		return submission;
	}
}


function IssueCreateController($injector, $scope, ProjectService, IssueService, UserService, $routeParams, $location, $rootScope) {
	
	$scope.issue = {};
	
	ProjectService.get($routeParams.project_id).then(function(project) {
		$rootScope.project = project;
		$scope.issue.project = project;
	});
	
	$scope.submit = function() {
		
		$scope.submitting = true;
		delete $scope.errors;
		IssueService.create($scope.buildSubmission()).then(
				function() {
					$scope.submitting = false;
					$location.path("project/" + $scope.issue.project.id);
				},
				function(response) {
					$scope.errors = response.data.errors;
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


function IssueEditController($injector, $scope, ProjectService, IssueService, UserService, $routeParams, $location, $rootScope) {
	
	IssueService.get($routeParams.id).then(function(issue) {
		$scope.issue = issue;
		$rootScope.project = $scope.issue.project;
	});
	
	$scope.submit = function() {
		
		$scope.submitting = true;
		delete $scope.errors;
		IssueService.update($routeParams.id, $scope.buildSubmission()).then(
			function() {
				$scope.submitting = false;
				$location.path("project/" + $scope.issue.project.id);
			},
			function(response) {
				$scope.errors = response.data.errors;
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