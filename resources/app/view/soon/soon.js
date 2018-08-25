/*
	ONOS GUI --SOON Main Moudle
 */

(function(){
	'use strict';

	//refs
	var $log;

	//
	var defaultSoonView = 'soon/alarmPre',
		soonViewId = ['alarm','alarmPre','faultLocate','MLModel','traffic','serviceReroute'],
		soonModuleDependencies = ['ngRoute','ovSoonNav','ovSoonAlarmPre'];

    function cap(s) {
        return s ? s[0].toUpperCase() + s.slice(1) : s;
    }

	angular.module('ovSoon',soonModuleDependencies)
	.controller('OvSoonCtrl',
		['$log','$scope','$route','$routeParams',

		function(_$log_,$route,$routeParams,$location){
			var self = this;
			$log = _$log_;

			self.$route = $route;
			self.$routeParams = $routeParams;
			self.$location = $location;

			$log.log('OvSoonCtrl has been created');

			$log.debug('route: ',self.$route);
			$log.debug('routeParams: ',self.$routeParams);
			$log.debug('location: ',self.$location);
	}])
	.config(['$routeProvider',function($routeProvider){
		$routeProvider
			.otherwise({
				redirectTo: '/' + defaultSoonView
			});

		function soonViewCtrlName(vid){
			return 'OvSoon'+cap(vid)+'Ctrl';
		}

		function soonViewTemplateUrl(vid){
			return 'app/view/soon/'+vid+'/'+vid+'.html';
		}

		soonViewId.forEach(function(vid){
			if(vid){
				$routeProvider.when('/'+vid,{
					controller: soonViewCtrlName(vid),
					controllerAs: 'ctrl',
					templateUrl: soonViewTemplateUrl(vid)
				});
			}
		});
	}]);

}());