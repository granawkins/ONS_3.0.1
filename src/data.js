// ------------------------------------
// ------------   CRAFTS   ------------
// -------- ( BASES and SHIPS) --------
// ------------------------------------

export const shipsData = {
    SS1: {
        label: "Space Shuttle 1",
        location: "CAPE",
        flags: {
            renderNavigation: true,
        },
        routes: {
            CAPE: {
              LEO: {
                payload: 2.75e7,
                LO2: 6e8,
                LH2: 1e8,
                MMH: 2e6,
                N2O4: 3e6,
              },
            },
            LEO: {
              CAPE: {
                payload: 1.4e7,
                MMH: 2e6,
                N2O4: 3e6,
              },
              GSO: {
                payload: 2.3e6,
                MMH: 2e6,
                N2O4: 3e6,
              }
            },
          },
    },
    HLLV1: {
        label: "Heavy Lift Launch Vehicle 1",
        location: "CAPE",
        flags: {},
    }
}

export const basesData = {
    CAPE: {
        label: "Cape Canaveral, FL",
        procsIndex: ["human"],
        procsQty: [Infinity,],
        sinksIndex: ["waPot", "hF", "LO2", "LH2", "MMH", "N2O4"],
        sinksBal: [Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
        flags: {
            renderCape: true,
            refreshDock: true,
        },
    },
    LEO: {
        label: "Low Earth Orbit",
        startingFields: ["labor"],
        flags: {},
    }
}

export const craftType = (craft) => {
    if (shipsData[craft]) {
        return "ship"
    } else if (basesData[craft]) {
        return "base"
    }
}

// ------------------------------------
// ------------   FIELDS   ------------
// -------- ( PROCS and SINKS) --------
// ------------------------------------
export const sinksData = {
    // Atmosphere
    N2: {label: "Nitrogen"},
    O2: {label: "Oxygen"},
    H2O: {label: "Water Vapor"},
    CO2: {label: "Carbon Dioxide"},
    
    // Life Support / Cargo
    waPot: {label: "Potable Water"},
    waGr: {label: "Gray Water"},
    hF: {label: "Human Food"},
    waWst: {label: "Waste Water"},
    wst: {label: "Solid Waste"},
    
    // Economy
    labor: {label: "Labor Hours"},
    
    // Propellant
    LO2: {label: "LO2"}, // Liquid Oxygen
    LH2: {label: "LH2"}, // Liquid Hydrogen
    MMH: {label: "MMH"}, // Monomethylhydrozine
    N2O4: {label: "N2O4"}, // Dinitrogen Tetroxide  
}

export const procsData = {
    human: {
        label: "Humans",
        flows: [
            ["Respiration", [["O2", 686]], [["CO2", 1]]], // in/amt, out/ratio
            ["Hydration",   [["waPot", 2000]], [["waWst", 1]]],
            ["Bathing",   [["waPot", 8000]], [["waWst", 1]]],
            ["Metabolism",   [["hF", 2564]], [["waWst", 1], ["labor", .003]]],
            ["Domestic",    [["waGr", 5e4]], [["waWst", 1]]]
        ],
        weight: 100000,
    },
    cond: {
        label: "Condenser",
        flows: [
            ["Operate", [["H2O", 1.74e5]], [["waPot", 1]]],
        ],
        weight: 100000,
    },
    recyc: {
        label: "Recycler",
        flows: [
            ["Operate", [["waWst", 2.34e5], ["wst", 2.1e4]], [["waGr", 1]]],
        ],
        weight: 100000,
    },
}

export const fieldType = (field) => {
    if (sinksData[field]) {
        return "sink"
    } else if (procsData[field]) {
        return "proc"
    }
}