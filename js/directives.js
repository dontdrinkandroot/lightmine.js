var directives = angular.module('LightmineApp.directives', []);

directives.directive('spinner', function () {
    return {
        scope: {
            scopeVar: "=spinner"
        },
        restrict: 'A',
        replace: false,
        template: '<img src="images/spinner.gif" />',
        link: function ($scope, elm, attrs) {

            $scope.$watch("scopeVar", function () {
                if ($scope.scopeVar !== undefined) {
                    elm.hide();
                } else {
                    elm.show();
                }
            });
        }
    };
});

directives.directive('lmPriority', function () {
    return {
        scope: {
            priority: "=lmPriority"
        },
        restrict: 'A',
        link: function ($scope, $elm, $attrs) {

            $scope.$watch("priority", function () {
                var icon = '';
                var color = 'inherit';
                switch ($scope.priority.name) {
                    case 'Low':
                        color = '#bfbfbf';
                        icon = '<span class="fa fa-fw fa-arrow-down"></span>';
                        break;
                    case 'Normal':
                        icon = '<span class="fa fa-fw fa-circle-thin"></span>';
                        break;
                    case 'High':
                        color = '#ff8040';
                        icon = '<span class="fa fa-fw fa-arrow-up"></span>';
                        break;
                    case 'Urgent':
                        color = '#ff4000';
                        icon = '<span class="fa fa-fw fa-lightbulb-o"></span>';
                        break;
                    case 'Immediate':
                        color = '#ff0000';
                        icon = '<span class="fa ra-fw fa-warning"></span>';
                        break;
                }
                $elm.html('<span style="color: ' + color + '">' + icon + ' ' + $scope.priority.name + '</span>');
            });
        }
    };
});