
var app = angular.module('geo-ass-one', ['leaflet-directive', 'firebase', 'ngSanitize']);

app.controller("TrailController", [ "$scope", "$http", "$firebase", function($scope, $http, $firebase) {
            angular.extend($scope, {
                center: {
                    lat: 1.352083,
                    lng: 103.819836,
                    zoom: 12
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap (XYZ)',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    },
                    overlays: {
                        wms: {
                            name: 'EEUU States (WMS)',
                            type: 'wms',
                            visible: true,
                            url: 'http://suite.opengeo.org/geoserver/usa/wms',
                            layerParams: {
                                layers: 'usa:states',
                                format: 'image/png',
                                transparent: true
                            }
                        }
                    }
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





            // Get the countries geojson data from a JSON
            $http.get("json/path-one.geojson").success(function(data, status) {
                angular.extend($scope, {
                    geojson: {
                        data: data,
                        style: {
                            fillColor: "green",
                            weight: 2,
                            opacity: 1,
                            color: 'white',
                            dashArray: '3',
                            fillOpacity: 0.7
                        }
                    }
                });
            });

            // Get the countries geojson data from a JSON
            $http.get("json/JPN.geo.json").success(function(data, status) {
                angular.extend($scope, {
                    geojson: {
                        data: data,
                        style: {
                            fillColor: "green",
                            weight: 2,
                            opacity: 1,
                            color: 'white',
                            dashArray: '3',
                            fillOpacity: 0.7
                        }
                    }
                });
            });

            // $http.get("json/trails.json").success(function(data, status) {
            //     $scope.trails = data.trails;
            // });
        }]);
