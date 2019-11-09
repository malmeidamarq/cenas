'use strict';
var app = angular.module('app', []);

app.controller('indexCtrl', function ($scope, $http, $filter) {

    /*******************************************************
     * Default Variables
     *******************************************************/
    $scope.allApps = [];
    $scope.filterApps = ['All'];
    $scope.categories = ['All'];
    $scope.curPage = 1;
    $scope.filteredItems = [];
    $scope.isLoading = false;
    $scope.itemsPerPage = 4;
    $scope.maxSize = 3;
    $scope.totalPrice = 0;
    $scope.totalFilteredLength = 0;
    $scope.defaultCategory ='All';
    $scope.selected = 0;


    /*******************************************************
     * Get all apps inside on json file and creates an
     * array with more information
     *******************************************************/
    $scope.getAllApps = function(){
        $scope.isLoading = true;
        $http.get('../json/apps.json').success(function (data){

            data.forEach(function (row) {

                row.categories.map(function(elem) {
                    if($scope.categories.indexOf(elem) === -1){
                        $scope.categories.push(elem);
                    }
                });

                $scope.totalPrice = 0;

                row.subscriptions.map(function(elem) {
                    $scope.totalPrice += elem.price;
                });

                $scope.allApps.push({
                    id : row.id,
                    name : row.name,
                    description : row.description,
                    categories : row.categories,
                    subscriptions : row.subscriptions,
                    price : $scope.totalPrice

                });
            });

            $scope.allApps = $filter('orderBy')($scope.allApps, 'price');
            var begin = (($scope.curPage - 1) * $scope.itemsPerPage),
                end = begin + $scope.itemsPerPage;
            $scope.filteredItems = $scope.allApps.slice(begin, end);
            $scope.changeCategory($scope.defaultCategory);
            $scope.select(0);
        });

        $scope.isLoading = false;
    };


    /*******************************************************
     * Pagination
     *******************************************************/
    $scope.numOfPages = function () {

        if($scope.totalFilteredLength == 0){
            return Math.ceil($scope.filterApps.length / $scope.itemsPerPage);
        }else{
            return Math.ceil($scope.totalFilteredLength / $scope.itemsPerPage);
        }
    };

    /*******************************************************
     * Pagination and search watch
     *******************************************************/
    $scope.$watchGroup(['curPage + numPerPage','search'],
        function(newValue, oldValue) {
            if (newValue[0] && oldValue[0] && newValue[0] != oldValue[0]) {
                var start = (($scope.curPage - 1) * $scope.itemsPerPage),
                    end = start + $scope.itemsPerPage;
                $scope.filteredItems = $scope.filterApps.slice(start, end);
            }

            if(newValue[1] && newValue[1]!='') {
                var start = (($scope.curPage - 1) * $scope.itemsPerPage),
                    end = start + $scope.itemsPerPage;
                $scope.totalFilteredLength = $filter('filter')($scope.filterApps, newValue[1]).length;
                $scope.filteredItems= $filter('filter')($scope.filterApps, newValue[1]).slice(start, end);
            }

        });


    /*******************************************************
     * Filter apps when change the category
     *******************************************************/
    $scope.changeCategory = function(category) {
        $scope.filteredItems = [];
        $scope.filterApps = [];

        if(category == 'All'){
            $scope.filteredItems = $scope.filterApps = $scope.allApps;
        } else {
            $scope.allApps.forEach(function (elem) {
                elem.categories.map(function (e) {
                    if (e == category) {
                        $scope.filteredItems.push(elem);
                        $scope.filterApps.push(elem);
                    }
                });
            });
        }
        var start = (($scope.curPage - 1) * $scope.itemsPerPage),
            end = start + $scope.itemsPerPage;
        $scope.filteredItems = $scope.filteredItems.slice(start, end);

    };

    $scope.select= function(index) {
        $scope.selected = index;
    };

    $scope.getAllApps();

});
