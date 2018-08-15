/*
	ONOS GUI --SOON Main Moudle
 */

(function(){
	'use strict';

	//refs
	var $log;

	//
	var defaltSoonView = 'alarm',
		soonViewId = ['alarm','alarmPre','faultLocate','MLModel','traffic','serviceReroute'];

    function cap(s) {
        return s ? s[0].toUpperCase() + s.slice(1) : s;
    }

	angular.moudle('ovSoon',[])
	.controller('OvSoonCtrl',
		['$log','$scope','$route','$routeParams',

		function(_$log_){
			var self = this;
			$log = _$log_;

			self.$route = $routr;
			self.$routeParams = $routeParams;
			self.$location = $location;

			$log.log('OvSoonCtrl has been created');

			$log.debug('route: ',self.$route);
			$log.debug('routeParams: ',self.$routeParams);
			$log.debug('location: ',self.$location);
	}])
	.config(['$routeProvider',function($routeProvider){
		$routeProvider.
			.otherwise({
				redirecTo: '/' + defaultView
			});

		function soonViewCtrlName(svid){
			return 'OvSoon'+cap(svid)+'Ctrl';
		}

		function soonViewTemplateUrl(svid){
			return 'app/view/'+svid+'/'+svid+'.html';
		}

		soonViewId.foreach(function(svid){
			if(svid){
				$routeProvider.when('/'+svid,{
					controller: soonViewCtrlName(svid),
					controllerAs: 'ctrl',
					templateUrl: soonViewTemplateUrl(svid),
				});
			}
		});
	}])

})