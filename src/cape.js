import * as data from "./data.js"

const SINK_UNITS = [
    // ["10 kg", 10000], 
    [".1t", 100000], 
    ["1t", 1000000], 
    ["10t", 10000000], 
    // ["100t", 100000000]
  ]
  
  const PROC_UNITS = [
    ["1", 1], 
    ["10", 10], 
    // ["100x", 100]
  ]

export default function renderCape(craft, dockWith) {
    if (!craft.flags.initializeDock || craft.flags.refreshDock) {
        if (!craft.flags.initializeDock) {
            $("#CAPEDockButton").click(function() {
                let ship = $("#CAPEDockSelector").val()
                if (!craft.dockedWith && !ship) {
                    return
                } else {
                    dockWith("CAPE")
                }
            })
        }
        
        let selector = $("#CAPEDockSelector")
        selector.empty()
        let ships = craft.ships
        ships = ships.map(ship => [ship, data.shipsData[ship].label])
        ships.unshift(["", "Select Ship"])
        ships.forEach(ship => {
            selector.append($('<option>', { 
                value: ship[0],
                text : ship[1],
            }));
        })

        $("#CAPEDock").empty()
        let fields = craft.procsIndex.concat(craft.sinksIndex)
        fields.forEach(field => {
            let labelText = (data.fieldType(field) === "proc") 
            ? data.procsData[field].label
            : data.sinksData[field].label
            let line = $(`<div class="lineItem"></div>`).appendTo($("#CAPEDock"))
            let header = $(`<div>${labelText}</div>`).appendTo(line)
            let buttons = $(`<div></div>`).appendTo(line)
            if (craft.dockedWith) {
                let ship = craft.game.ships[craft.dockedWith]
                let units = (data.fieldType(field) === "proc") ? PROC_UNITS : SINK_UNITS

                units.forEach(unit => {
                    let button = $(`<button>${unit[0]}</button>`).appendTo(buttons)
                        .click(() => ship.increment(field, unit[1]))
                })
            }
        })

        craft.flags.initializeDock = true
        craft.flags.refreshDock = false
    }
}

{/* <div class="lineItem">
<div>People</div>
<div>
    <button>1</button>
    <button>10</button>
    <button>100</button>
</div>
</div> */}