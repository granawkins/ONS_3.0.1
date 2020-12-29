import * as data from "./data.js"
import * as helpers from "./helpers.js"

export const ROUTES = {
    CAPE: {
        LEO: {dV: 8600, dT: 0.5}
    },
    LEO: {
        CAPE: {dV: 8600, dT: 0.5},
        LPO: {dV: 4084, dT: 14},
        L5: {dV: 4084, dT: 14},
        GSO: {dV: 3839, dT: 7},
    },
    GSO: {
        LEO: {dV: 3839, dT: 7},
        L5: {dV: 1737, dT: 7},
        LPO: {dV: 1737, dT: 7},
    },
    L5: {
        LPO: {dV: 686, dT: 7},
        LEO: {dV: 4084, dT: 14},
        GSO: {dV: 1737, dT: 7},
    },
    LPO: {
        LEO: {dV: 4084, dT: 14},
        L5: {dV: 686, dT: 7},
        GSO: {dV: 1737, dT: 7},
        LS: {dV: 2195, dT: 0.5},
    },
    LS: {
        LPO: {dV: 1859, dT: 0.5}
    }
  }

export function renderNavigation (craft) {
    if (!craft.flags.initializeNavigation || craft.flags.refreshNavigation) {

        if (!craft.flags.initializeNavigation) {

            // Add toggle on init to specify class; else launch/select triggers slideToggle
            $("#" + craft.name + "Navigation").click(function( event ) {
                if (event.target.classList.contains("menuHeader")) {
                    $("#" + craft.name + "NavigationMenu").slideToggle()
                }
            });

            // Update trip details for selection
            $("#" + craft.name + "DestinationSelector").change(function( event ) {
                let destination = $("#" + craft.name + "DestinationSelector").val()
                if (destination) {
                    let route = ROUTES[craft.location][destination]
                    let menu = $("#" + craft.name + "NavigationMenu")
                    menu.empty()
                    
                    const addLine = ([label, value]) => {
                        let line = $(`<div class="lineItem"></div>`).appendTo(menu)
                        $(`<div>${label}</div>`).appendTo(line)
                        $(`<div>${value}</div>`).appendTo(line)
                    }

                    addLine(["Duration:", route.dT + " Days"])
                    addLine(["Delta-V:", route.dV + "m/s"])
                    
                    let shipRoute = craft.data.routes[craft.location][destination]
                    Object.keys([shipRoute]).forEach(param => {
                        addLine([param + ":", helpers.massUnits(shipRoute[param])])
                    })
                }
            })
        }

        if (craft.dockedWith) {
            $("#" + craft.name + "DestinationSelector").css("color", "lightgray")
            $("#" + craft.name + "LaunchButton").css("color", "lightgray")
        } else {
            $("#" + craft.name + "DestinationSelector").css("color", "black")
            $("#" + craft.name + "LaunchButton").css("color", "black")
        }

        if (craft.location) {
            let selector = $("#" + craft.name + "DestinationSelector")
            selector.empty()
            let destinations = Object.keys(craft.data.routes[craft.location])
            destinations = destinations.map(dest => [dest, data.basesData[dest].label])
            destinations.unshift(["", "Select Destination"])
            destinations.forEach(base => {
                selector.append($('<option>', { 
                    value: base[0],
                    text : base[1],
                }));
            })
        }

        craft.flags.initializeNavigation = true;
        craft.flags.refreshNavigation = false
    }
}
  
export const getEta = (origin, destination) => {
    if (!ROUTES[origin] || !ROUTES[origin][destination]) {return null}
    var deltaTime = ROUTES[origin][destination].dT
    return deltaTime
}