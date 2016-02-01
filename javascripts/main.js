
var app = angular.module('geo-ass-one', ['leaflet-directive', 'firebase', 'ngSanitize']);

app.controller("TrailController", [ "$scope", "$http", "$firebase", "leafletData", function($scope, $http, $firebase, leafletData) {
            $scope.showMap = true;
            $scope.showDetails = false;
            angular.extend($scope, {
                center: {
                    lat: 1.352083,
                    lng: 103.899836,
                    zoom: 12
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap (XYZ)',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz',
                            layerOptions: {
                                subdomains: ['a', 'b', 'c'],
                                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                                continuousWorld: true
                            }

                        }
                    },
                    overlays: {}
                }
            });

            $scope.newuser = {};
    
            // Here is where you update your Firebase URL. 
            var theFirebaseURL = "https://cloud-assignment-one.firebaseio.com/";
            
            var ref = new Firebase(theFirebaseURL);
            $scope.trails = $firebase(ref.child("trails")).$asArray(); 
            $scope.edit = false;
            $scope.error = false;
            $scope.incomplete = false;  
            
            $scope.currentUser = null;
            //Check to see if the users is already logged in to Firebase and update currentUser if yes. 
            var authData = ref.getAuth();
              if (authData && authData!={}) {
                  $scope.currentUser = $firebase(ref.child("user").child(authData.uid)).$asObject();
              } else {
                  console.log("User is logged out");
              }
            
            $scope.logout = function(loginProvider){
                $scope.currentUser = null;
            }
            
            $scope.login = function(loginProvider){
              ref.authWithOAuthPopup(loginProvider, function(error, authData) {
                if (error) {
                  console.log("Login Failed!", error);
                } else {
                  console.log("Authenticated successfully with payload:", authData);
                  //Add the user to the users list. 
                  ref.child("user/"+authData.uid).transaction(function(currentValue) {
                      return authData;
                    });
                  $scope.currentUser = $firebase(ref.child("user").child(authData.uid)).$asObject();    
                  $scope.trails = $firebase(ref.child("trails")).$asArray();
                }
              });
            }

            $scope.zoominTrail = function(){
                $scope.center = {
                    lat: 1.348737,
                    lng: 103.95607,
                    zoom: 15
                }
            }

            $scope.exploreTrail = function(trail){
                $scope.showMap = false;
                $scope.showDetails = true;
                $scope.exploring = trail;
            }

            $scope.returnMap = function(){
                $scope.showMap = true;
            }



            // Get the countries geojson data from a JSON
            $http.get("json/cycling-paths-default-crs.geojson").success(function(data, status) {
                console.log(data);
                angular.extend($scope, {
                    geojson: {
                        data: data,
                        style: {
                            weight: 3,
                            opacity: 1,
                            color: '#ff0000'
                        }
                    }
                });
            });

        }]);

app.controller('RatingController', RatingController)
    .directive('starRating', starRating);

  function RatingController() {
    this.rating1 = 5;
    this.rating2 = 2;
    this.isReadonly = true;
    this.rateFunction = function(rating) {
      console.log('Rating selected: ' + rating);
    };
  }

  function starRating() {
    return {
      restrict: 'EA',
      template:
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
        '    <i class="fa fa-star"></i>' + // or &#9733
        '  </li>' +
        '</ul>',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function(scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 5;
        }
        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        scope.toggle = function(index) {
          if (scope.readonly == undefined || scope.readonly === false){
            scope.ratingValue = index + 1;
            scope.onRatingSelect({
              rating: index + 1
            });
          }
        };
        scope.$watch('ratingValue', function(oldValue, newValue) {
          if (newValue) {
            updateStars();
          }
        });
      }
    };
  }