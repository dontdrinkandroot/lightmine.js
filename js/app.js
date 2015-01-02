'use strict';

angular.module('LightmineApp', [ 'LightmineApp.filters', 'LightmineApp.services', 'LightmineApp.directives', 'ngRoute', 'restangular'])

    .config([ '$httpProvider', '$routeProvider', '$locationProvider', function ($httpProvider, $routeProvider, $locationProvider) {

        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: LoginController
        });

        $routeProvider.when('/project', {
            templateUrl: 'partials/project/list.html',
            controller: ProjectListController
        });

        $routeProvider.when('/project/:id', {
            templateUrl: 'partials/project/issues.html',
            controller: ProjectIssuesController
        });

        $routeProvider.when('/project/:id/issues', {
            templateUrl: 'partials/project/issues.html',
            controller: ProjectIssuesController
        });

        $routeProvider.when('/project/:id/versions', {
            templateUrl: 'partials/project/versions.html',
            controller: ProjectVersionsController
        });

        $routeProvider.when('/issue/:id/edit', {
            templateUrl: 'partials/issue/edit.html',
            controller: IssueEditController
        });

        $routeProvider.when('/issue/create', {
            templateUrl: 'partials/issue/create.html',
            controller: IssueCreateController
        });

        $routeProvider.when('/user/issues', {
            templateUrl: 'partials/user/issues.html',
            controller: UserIssuesController
        });

        $routeProvider.otherwise({
            redirectTo: 'project'
        });

        $locationProvider.hashPrefix('!');
    }])

    .run(function ($rootScope, $location, Restangular) {

        Restangular.setRequestSuffix('.json');
        Restangular.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
            /* Redmine does wrap the responses, so we need to extract them in oder to "restangularize" */
            if (what === "issues") {
                if (operation === "get") {
                    return data.issue;
                }
            }
            console.log("Umodified Response", data, operation, what, url, response, deferred);
            return data;
        });
        Restangular.addRequestInterceptor(function (element, operation, what, url) {
            console.log("Unmodified Request", element, operation, what, url);
            return element;
        });

        /* Remember path that was originally requested so we can redirect there after login */
        $rootScope.requestedPath = $location.path();
        $location.path("/login");
    });