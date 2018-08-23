/*
 ONOS GUI -- soon view navgation module
 */

(function(){
    'use strict';

    var $log,$location,$window;
    function soonNavTo(path){
        var url;
        if(!path){
            $log.warn('Not a valid soon navigation path');
        }
        $location.url('/'+path);
        url = $location.absUrl();
        $log.log('Navigating to '+url);
        $window.location.href = url;
    }

    angular.module('ovSoonNav',[])
        .controller('OvSoonNavCtrl',
            ['$log','$scope',function(_$log_){
                $log = _$log_;
                $log.log('SoonNavCtrl has been created');
            }
        ])
        .factory('SoonNavService',['$log','$location','$window',
            function(_$log_,_$location_,_$window_){
                $log = _$log_;
                $location = _$location_;
                $window = _$window_;

                return {
                    soonNavTo:soonNavTo,
                };
            }]
        );
    }()
);