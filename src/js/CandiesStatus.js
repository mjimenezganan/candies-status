/*
 * candies-status
 * https://github.com/mjimenezganan/candies-status
 *
 * Copyright (c) 2016 Universidad Politecnica de Madrid
 * Licensed under the GPL license.
 */

/* exported CandiesStatus */

var CandiesStatus = (function () {

    "use strict";

    /*********************************************************
     ************************CONSTANTS*************************
     *********************************************************/

    /*********************************************************
     ************************VARIABLES*************************
     *********************************************************/

    /********************************************************/
    /**********************CONSTRUCTOR***********************/
    /********************************************************/

    var CandiesStatus = function CandiesStatus() {
        MashupPlatform.wiring.registerCallback('entityInput', processData);
    };


    /*********************************************************
     **************************PRIVATE*************************
     *********************************************************/

    var processData = function processData(event_data) {
        var receivedMsg = JSON.parse(event_data);
        if (receivedMsg.type === "robot") {
            if (receivedMsg.id === "Reactor") {
                if (receivedMsg.state === "ready") {
                    document.getElementById("extremo-brazo").className = '';
                    //$("#extremo-brazo").removeClass("animated").removeClass("picking");
                    $("img[id$='candy']").remove();
                } else if (receivedMsg.state === "busy") {
                    $("#container").append($('<img id="blue-candy" src="images/blue24.png" />'));
                    $("#container").append($('<img id="red-candy" src="images/red24.png" />'));
                    $("#container").append($('<img id="yellow-candy" src="images/yellow24.png" />'));
                    document.getElementById("extremo-brazo").className = 'animated';
                    //$("#extremo-brazo").removeClass("picking").addClass("animated");
                    setTimeout(function () { $("#blue-candy").addClass("animated-candy"); }, 2000);
                    setTimeout(function () { $("#red-candy").addClass("animated-candy"); }, 6000);
                    setTimeout(function () { $("#yellow-candy").addClass("animated-candy"); }, 10000);
                }
            } else if (receivedMsg.id === "Turtlebot") {
                if (receivedMsg.state === "ready") {
                    document.getElementById("turtlebot").className = '';
                    //$("#turtlebot").removeClass("animated").removeClass("picking");
                } else if (receivedMsg.state === "busy") {
                    document.getElementById("turtlebot").className = 'animated';
                    //$("#turtlebot").removeClass("picking").addClass("animated");
                } else if (receivedMsg.state === "waiting") {
                    document.getElementById("turtlebot").className = 'picking';
                    //$("#turtlebot").removeClass("animated").addClass("picking");
                }
            }
        }
    };

    /****************************************/
    /************AUXILIAR FUNCTIONS**********/
    /****************************************/

    /* test-code */
    CandiesStatus.prototype = {
    };

    /* end-test-code */

    return CandiesStatus;

})();
