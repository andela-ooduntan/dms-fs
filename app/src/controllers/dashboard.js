(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('DashBoardCtrl', ['$rootScope', '$scope', '$mdMedia',
      '$state', '$stateParams', '$mdSidenav',
      'Auth', 'Roles', 'Token', 'Utils',
      function($rootScope, $scope, $mdMedia, $state, $stateParams,
        $mdSidenav, Auth, Roles, Token, Utils) {

        $scope.init = function() {

          $scope.newButton = $stateParams.groupid ? true : false;
          // check if user is logged in or redirect to login
          if (!$rootScope.activeUser) {
            $state.go('home.login');
          } else {
            // check for state name and stateParams
            $scope.groups = $rootScope.activeUser.groupId;
            // if user is a not member of a group and not superadmin
            //  redirect to group
            // check if current state is superadmin
            $scope.$watch(function() {
              return $state.current.name;

            }, function(name) {
              if (name === 'dashboard.admin.group' ||
                name === 'dashboard.admin.user') {
                $scope.groupName = 'Admin';
              } else {

                if ($scope.groups.length > 0 &&
                  (name !== 'dashboard.admin.group' ||
                    name !== 'dashboard.admin.user')) {
                  // get group name
                  $scope.groupName = window.
                  _.filter($rootScope.activeUser.groupId, {
                    _id: parseInt($stateParams.groupid)
                  })[0].title;
                }
              }
            });

            // initialize form for user update
            $scope.updateForm = {};
            // set active group
            $rootScope.activeGroup = $stateParams.groupid;

            // get user role check for admin privileges
            $scope.userRole = window._.filter($rootScope.activeUser.roles, {
              'groupId': [parseInt($stateParams.groupid)]
            });

            // check for super admin
            $scope.superAdmin = window._.filter($rootScope.activeUser.roles, {
              title: 'superAdmin'
            });
          }
        };

        // Set Selected group
        $scope.toggle = function(id) {
          $rootScope.activeGroup = id;

          Auth.setToken(Token.get()[0], id);
          // reload state for groups
          $state.go('dashboard.list', {
            id: $rootScope.activeUser._id,
            groupid: id
          }, {
            reload: true
          });
        };

        // check selected items
        $scope.isSelected = function(id) {
          var checked = $stateParams.groupid ?
            parseInt($stateParams.groupid) === id : false;
          return checked;
        };

        // Load roles in a group
        $scope.loadRoles = function() {
          Roles.query({
            groupid: $stateParams.groupid
          }, function(role) {
            $scope.roles = role;
          }, function() {
            Utils.showAlert('ev', 'Error', 'Error retrieving group data');
          });
        };

        // Log out user and delete token
        $scope.logout = function() {
          $rootScope.activeUser = null;
          $rootScope.activeGroup = null;
          Auth.logout();
          $state.go('home.features');
        };

        // Menu button action
        $scope.menuAction = function(ev) {
          if (ev === 'logout') {
            $scope.logout();
          }
          if (ev === 'Set') {
            $rootScope.openSideNav('right');
          }
          if (ev === 'Join') {
            $state.go('dashboard.group', {
              id: $rootScope.activeUser._id
            });
          }
        };

        // menu control
        $scope.openMenu = function($mdOpenMenu, ev) {
          $mdOpenMenu(ev);
        };

        // Header menu
        $scope.menu = [{
          name: 'Join Group',
          icon: 'fa fa-group fa-2x',
          click: 'Join'
        }, {
          name: 'User Profile',
          icon: 'fa fa-cog fa-2x',
          click: 'Set'
        }, {
          name: 'Log Out',
          icon: 'fa fa-sign-out fa-2x',
          click: 'logout'
        }];

        $scope.init();

      }

    ]);
})();
