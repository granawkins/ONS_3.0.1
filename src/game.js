import Controller from "./controller.js"
import * as data from "./data.js"
import Craft from "./craft.js"
import renderCape from "./cape.js"

export default class Game {
    constructor() {
        this.frame = 0
        this.date = 157766400000 // January 1, 1975 00:00
        this.flags = {}
        this.ships = {}
        this.bases = {}
        this.history = {}
        this.dockWith = this.dockWith.bind(this)
    }

    addCraft(name) {
        let type = data.craftType(name)
        $('#'+name).css("display", "flex")
        this[type + "s"][name] = new Craft(name, this)
    }

    step(dT) {
        // Initialize
        if (!this.flags.initialized) {
            let startingCrafts = ["CAPE", "SS1"]
            startingCrafts.forEach(craft => this.addCraft(craft))
            this.flags.initialized = true
        }

        // Updates
        this.frame += 1
        this.date += dT * 86400000

        for (let base in this.bases) {this.bases[base].step(dT)}
        for (let ship in this.ships) {this.ships[ship].step(dT)}
    }

    dockWith(baseName) {
        let base = this.bases[baseName]
    
        // DOCK
        if (!base.dockedWith) {
            let selector = $("#" + baseName + "DockSelector")
            if (!selector.val()) return
            let shipName = selector.val()
            let ship = this.ships[shipName]
            base.dockedWith = shipName
            ship.dockedWith = baseName
            base.flags.refreshDock = true
            ship.flags.refreshDock = true
            ship.flags.refreshNavigation = true

            $("#" + baseName + "DockButton").html("Undock")
            selector.css("color", "lightgray")
            
        // UNDOCK
        } else {
          let shipName = base.dockedWith
          let ship = this.ships[shipName]
          base.dockedWith = null
          ship.dockedWith = null
          base.flags.refreshDock = true
          ship.flags.refreshDock = true
          ship.flags.refreshNavigation = true

          $("#" + baseName + "DockButton").html("Dock")
          let selector = $("#" + baseName + "DockSelector")
          selector.css("color", "black")
          selector.val("")
      }
    }
}