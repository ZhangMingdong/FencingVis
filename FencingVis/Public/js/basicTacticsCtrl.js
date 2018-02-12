var mainApp = angular.module("myApp", ['ngRoute']);

mainApp.controller('basicTacticsCtrl', function ($scope, $http,$window) {

    $scope.basicTacticsData={
        selected_bout:-1
        , bouts_data:[
            {result:"b"}
            ,{result:"b"}
            ,{result:"r"}
            ,{result:"r"}
            ,{result:"rr"}
            ,{result:"rr"}
            ,{result:"a1"}
            ,{result:"a1"}
            ,{result:"a3"}
            ,{result:"a3"}
            ,{result:"ra"}
            ,{result:"ra"}
        ]
    }
    $scope.attack=function(option) {
        $scope.basicTacticsData.selected_bout=($scope.basicTacticsData.selected_bout==1)?2:1;
    }
    $scope.reposte=function(option) {
        $scope.basicTacticsData.selected_bout=($scope.basicTacticsData.selected_bout==3)?4:3;
    }
    $scope.antiReposte=function(option) {
        $scope.basicTacticsData.selected_bout=($scope.basicTacticsData.selected_bout==5)?6:5;
    }
    $scope.oneStepAttack=function(option) {
        $scope.basicTacticsData.selected_bout=($scope.basicTacticsData.selected_bout==7)?8:7;
    }
    $scope.threeStepAttack=function(option) {
        $scope.basicTacticsData.selected_bout=($scope.basicTacticsData.selected_bout==9)?10:9;
    }
    $scope.retreatAttack=function(option) {
        $scope.basicTacticsData.selected_bout=($scope.basicTacticsData.selected_bout==11)?12:11;
    }
});



