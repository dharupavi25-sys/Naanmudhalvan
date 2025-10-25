angular.module('userApp', ['ngMessages'])
.controller('UserFormController', ['$scope', '$window', function($scope, $window) {
    // 1. Initial State
    $scope.user = {};
    $scope.passwordFieldType = 'password';
    $scope.passwordButtonText = 'Show';
    $scope.strengthText = '';
    $scope.strengthClass = '';
    $scope.rememberMe = false;

    // Load credentials if "Remember Me" was checked previously
    $scope.loadCredentials = function() {
        const storedUser = $window.localStorage.getItem('rememberedUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Only load name and email for security reasons, not password
            $scope.user.name = parsedUser.name;
            $scope.user.email = parsedUser.email;
            $scope.rememberMe = true;
        }
    };

    $scope.loadCredentials();

    // 2. Password Strength Indicator
    $scope.checkPasswordStrength = function() {
        const p = $scope.user.password || '';
        const length = p.length;

        // Score based on length, letters, numbers, symbols
        let score = 0;
        if (length >= 8) score += 20;
        if (p.match(/[a-z]/) && p.match(/[A-Z]/)) score += 20; // Mixed case
        if (p.match(/\d/)) score += 20; // Numbers
        if (p.match(/[^a-zA-Z\d\s]/)) score += 20; // Symbols
        if (length > 12) score += 20;

        if (score > 80) {
            $scope.strengthText = 'Strong';
            $scope.strengthClass = 'strong';
        } else if (score > 40) {
            $scope.strengthText = 'Medium';
            $scope.strengthClass = 'medium';
        } else if (p.length > 0) {
            $scope.strengthText = 'Weak';
            $scope.strengthClass = 'weak';
        } else {
            $scope.strengthText = '';
            $scope.strengthClass = '';
        }
    };

    // 3. Show/Hide Password Toggle
    $scope.togglePasswordVisibility = function() {
        if ($scope.passwordFieldType === 'password') {
            $scope.passwordFieldType = 'text';
            $scope.passwordButtonText = 'Hide';
        } else {
            $scope.passwordFieldType = 'password';
            $scope.passwordButtonText = 'Show';
        }
    };

    // 4. Form Submission Logic
    $scope.submitForm = function(isValid) {
        if (isValid) {
            // Save credentials to local storage if 'Remember Me' is checked
            if ($scope.rememberMe) {
                const userToStore = {
                    name: $scope.user.name,
                    email: $scope.user.email
                    // NOTE: NEVER store password in local storage in a real app
                };
                $window.localStorage.setItem('rememberedUser', JSON.stringify(userToStore));
            } else {
                 $window.localStorage.removeItem('rememberedUser');
            }

            alert('Form submitted successfully!\nUser: ' + $scope.user.name + ', Email: ' + $scope.user.email);
            $scope.resetForm(); // Optional: Reset after successful submission
        } else {
            alert('Form has errors. Please correct them.');
        }
    };

    // 5. Reset Form Button
    $scope.resetForm = function(form) {
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        $scope.user = {};
        $scope.strengthText = '';
        $scope.strengthClass = '';
        // Note: Keeping the 'rememberMe' checkbox state across resets for user convenience
    };
}])

// 6. Custom Directive for Password Confirmation (compare-to)
.directive('compareTo', function() {
    return {
        require: 'ngModel',
        scope: {
            otherModelValue: '=compareTo'
        },
        link: function(scope, element, attributes, ngModel) {

            // Validator function
            ngModel.$validators.compareTo = function(modelValue) {
                // Returns true if values match, false otherwise
                return modelValue === scope.otherModelValue;
            };

            // Watch the original password model for changes and re-validate
            scope.$watch('otherModelValue', function() {
                ngModel.$validate();
            });
        }
    };
});