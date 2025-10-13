var app = angular.module("userApp", []);

app.controller("userController", function ($scope) {
  $scope.user = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    remember: false
  };

  $scope.showPassword = false;
  $scope.passwordStrength = "";
  $scope.successMessage = "";

  // Load saved data if "Remember Me" checked
  if (localStorage.getItem("userData")) {
    $scope.user = JSON.parse(localStorage.getItem("userData"));
  }

  // Toggle show/hide password
  $scope.togglePassword = function () {
    $scope.showPassword = !$scope.showPassword;
  };

  // Password strength checker
  $scope.checkStrength = function (password) {
    if (!password) {
      $scope.passwordStrength = "";
      return;
    }

    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) {
      $scope.passwordStrength = "Weak";
    } else if (strength === 2 || strength === 3) {
      $scope.passwordStrength = "Medium";
    } else {
      $scope.passwordStrength = "Strong";
    }
  };

  // Register function
  $scope.register = function () {
    if ($scope.userForm.$valid && $scope.user.password === $scope.user.confirmPassword) {
      $scope.successMessage = "Registration Successful!";

      // Save data in localStorage if Remember Me checked
      if ($scope.user.remember) {
        localStorage.setItem("userData", JSON.stringify($scope.user));
      } else {
        localStorage.removeItem("userData");
      }

      $scope.user.password = "";
      $scope.user.confirmPassword = "";
      $scope.userForm.$setPristine();
      $scope.userForm.$setUntouched();
    }
  };

  // Reset form
  $scope.resetForm = function () {
    $scope.user = {};
    $scope.passwordStrength = "";
    $scope.successMessage = "";
    $scope.userForm.$setPristine();
    $scope.userForm.$setUntouched();
  };
});
