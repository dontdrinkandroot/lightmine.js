var filters = angular.module('LightmineApp.filters', []);

filters.filter('userName', function() {
	return function(input) {
		
		if (input !== undefined) {
			
			var retString = "";
			
			if (input.name) {
				retString += input.name;
			} else {
				retString += input.firstname + " " + input.lastname;
			}
			
			if (input.login) {
				retString += " (" + input.login + ")";
			}
			
			return retString;
		}
		
		return "";
	};
});