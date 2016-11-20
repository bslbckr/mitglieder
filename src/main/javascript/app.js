/**
funktioniert alles nur, wenn postgREST auf port 3000 lauscht.
*/
/**jslint node: true */
'use strict';
var angular = require('angular'),
    app = angular.module('members', [require('angular-resource')])
        .controller('MemberController', ['$scope', '$log', '$http','$resource', function ($scope, $log, $http, $resource) {
	    var Stammdaten = $resource("http://localhost:3000/stammdaten");
            return {
                "clickedMe": function (member) {
                    this.logger.info("clicked on member with id=" + member.id);
                    if (this.activeMember === member.id) {
                        this.activeMember = null;
                    } else {
                        this.activeMember = member.id;
			if (!member.kontaktdaten) {
			    $http({
				url: "http://localhost:3000/kontaktdaten?id=eq."+member.id,
				method: "GET"
			    }).success(function(data, status, headers, config) {
				member.kontaktdaten = data;
			    }).error(function(data, status, headers, config) {
				logger.error("loading Kontaktdaten for member (id="+member.id+") failed. "+status);
			    });
			}
                    }
                    this.logger.info("...activerMember=" + this.activeMember);
                },
                "activeMember": null,
                "logger": $log,
		"http": $http,
                "$onInit": function () {
                    this.logger.info("MemberController loaded ...");
		    Stammdaten.query(function(data) {
			$scope.members = data;
		    });
                }
            };
        }]);
