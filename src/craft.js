import * as data from "./data.js"
import updateSystem from "./updateSystem.js"
// import renderAtmosphere from "./atmosphere.js"
import renderCape from "./cape.js"
import { getEta, renderNavigation } from "./navigation.js"

export default class Craft {
    constructor(name, game) {
        this.name = name
        this.game = game
        this.type = data.craftType(name)
        this.data = (this.type === "ship") ? data.shipsData[name] : data.basesData[name]
        this.volume = this.data.volume
        this.flags = this.data.flags
        this.dockedWith = null
        this.payload = 0

        if (this.type === "ship") {
            this.location = null
            this.trip = null
        }

        if (this.type === "base") {
            this.ships = []
        }

        // Initialize empty system
        this.procsIndex = (this.data.procsIndex) ? this.data.procsIndex : []
        this.procsQty = (this.data.procsQty) ? this.data.procsQty : []
        this.sinksIndex = (this.data.sinksIndex) ? this.data.sinksIndex : []
        this.sinksBal = (this.data.sinksBal) ? this.data.sinksBal : []
    }

    step(dT) {
        // Initialize
        if (!this.flags.initialized) {
            this.flags.refreshFlows = true
            this.flags.initialized = true

            if (this.type === "ship") this.arrive("CAPE")
        }

        if (this.name !== "CAPE") updateSystem(this, dT)

        if (this.flags.renderCape) renderCape(this, this.game.dockWith)
        if (this.flags.renderNavigation) renderNavigation(this)
        // if (this.flags.renderAtmosphere) renderAtmosphere(this)
    }

    set(field, amount, preserve = false) {
        let fieldType = data.fieldType(field)
        let index = (fieldType === "proc") ? this.procsIndex.slice() : this.sinksIndex.slice()
        let values = (fieldType === "proc") ? this.procsQty.slice() : this.sinksBal.slice()
        let netAmount = parseInt(amount)
        
        if (!index.includes(field)) {
            index.push(field)
            values.push(netAmount)
            fieldType === "proc" ? this.procsIndex = index : this.sinksIndex = index
    
        } else {
            if (!preserve) {
                netAmount = netAmount -values[index.indexOf(field)]
                values[index.indexOf(field)] = netAmount
            } else {
                values[index.indexOf(field)] += netAmount
            }
        }
    
        if (fieldType === "proc") {
            this.procsQty = values
            this.flags.refreshFlows = true
        } else {
            this.sinksBal = values
        }

        let unitMass = (fieldType === "proc") ? data.procsData[field].weight : 1
        this.payload += netAmount * unitMass
        console.log(this.payload)
    }
    
    increment(field, amount) {
        this.set(field, amount, true)
    }

    launch = (destination) => {
        if (!this.game.bases[destination]) {
          this.game.addCraft(destination)
        }
        let origin = this.game.bases[this.location]
        let tripTime = getEta(origin.name, destination)
        this.trip = {
            origin: origin.name,
            destination: destination,
            tripTime: tripTime,
            eta: "",
            progress: 0,
        }
        this.location = null
        this.flags.refreshNavigation = true
    
        origin.ships.splice(origin.ships.indexOf(this.name), 1)
        origin.flags.refreshDock = true
    }
    
    // updatePosition = (dT) => {
    //     let container = document.getElementById(this.name)
    //     if (this.trip) {
    //       let dP = dT / this.trip.tripTime
    //       let newProgress = this.trip.progress + dP
    //       if (newProgress >= 1) {
    //         this.arrive(this.trip.destination)
    //       } else {
    //         this.trip.progress = newProgress
    //         let origin = document.getElementById(this.trip.origin).offsetTop
    //         let destination = document.getElementById(this.trip.destination).offsetTop
    //         let position = origin + (destination - origin) * newProgress
    //         container.style = "top: " + position + "px;"
    //       }
    //     } else {
    //       let position = document.getElementById(this.location).offsetTop
    //       container.style = "top: " + position + "px;"
    //     }
    //     this.flags.updatePosition = false
    //   }
      
    arrive = (destination) => {
        this.location = destination
        this.trip = null
    
        let newBase = this.game.bases[this.location]
        newBase.ships.push(this.name)
        newBase.flags.refreshDock = true
    
        // let base = document.getElementById(this.location)
        // let ship = document.getElementById(this.name)
        // ship.style = "top: " + base.offsetTop + "px"
    
        this.flags.refreshNavigation = true
    }
    
    //   unloadAll = () => {
    
    //     dockFields(this).forEach(field => {
    //       let item = field[0]
    //       let amount = field[1]
    //       this.game.transfer(this.name, this.dockedWith, item, amount)
    //     })
    //   }

}