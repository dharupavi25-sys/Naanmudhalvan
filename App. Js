var app = angular.module("userApp", []);

app.controller("userController", function ($scope) {
    $scope.user = {};
    $scope.successMessage = "";

    $scope.register = function () {
        if ($scope.userForm.$valid && $scope.user.password === $scope.user.confirmPassword) {
            $scope.successMessage = "Registration Successful!";
            $scope.user = {};
            $scope.userForm.$setPristine();
            $scope.userForm.$setUntouched();
        }
    };
});
