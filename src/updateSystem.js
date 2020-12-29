import * as data from "./data.js"

export default function updateSystem (craft, dT) {
    let procsIndex = craft.procsIndex
    let procsQty = craft.procsQty
    let sinksIndex = craft.sinksIndex.slice()
    let sinksBal = craft.sinksBal.slice()
    let netFlows = (craft.netFlows) ? craft.netFlows.slice() : []
    
    // Test for negative balance
    let testBal = sumArrays(sinksBal, netFlows);

    // Recalculate NetFlows 
    if (craft.flags.refreshFlows || (testBal.some(b => b < 0))) {
        let outputs = refreshNetFlows(
            procsIndex, procsQty, sinksIndex, sinksBal, dT
        );
        craft.sinksBal = outputs[0]
        craft.procsRates = outputs[1]
        craft.sinksIndex = outputs[2]
        craft.netFlows = sumArrays(outputs[0], sinksBal.map(s => -s))
        craft.flags.refreshFlows = false
        
    // Or just repeat previous update
    } else {
        craft.sinksBal = testBal
    }
}

// Recursive function to recalculate net flows;
// If sink balance isn't enough, earlier procs get priority
const refreshNetFlows = (
    procsIndex, procsQty, sinksIndex, sinksBal, dT, procsRates=[], i=0
) => {
    if (i === procsIndex.length) {
        return [sinksBal, procsRates, sinksIndex];
    } else {
        let outputs = refreshProcess(
            procsIndex[i], procsQty[i], data.procsData[procsIndex[i]].flows, sinksIndex, sinksBal, dT
        )
        let newSinksBal = outputs[0]
        let procRate = outputs[1]
        let newSinksIndex = outputs[2]
        procsRates.push(procRate)
        return refreshNetFlows(procsIndex, procsQty, newSinksIndex, newSinksBal, dT, procsRates, i+1);
    }
}

// Use data files to recalculate flows
const refreshProcess = (
  proc, qty, data, sinksIndex, sinksBal, dT, procRates=[], j=0
) => {
  if (j === data.length) {
    return [sinksBal, procRates, sinksIndex]
  } else {
    let [subprocess, inFlows, outFlows] = data[j]
    let newSinksIndex = sinksIndex.slice()
    let newSinksBal = sinksBal.slice()

    // check for/add new sinks to state
    inFlows.concat(outFlows).forEach(function(flow) {
      let sink = flow[0]
      if (!newSinksIndex.includes(sink)) {
        newSinksIndex.push(sink)
        newSinksBal.push(0)
      }
    })

    // Find the limiting input
    let minLimit = 1
    inFlows.forEach(function(inFlow) {
      let [sink, amt] = inFlow
      let available = newSinksBal[newSinksIndex.indexOf(sink)]
      let target = amt * qty * dT
      let limit = (target <= available) ? 1 : Math.max(available / target, 0)
      minLimit = Math.min(minLimit, limit)
    })
    minLimit = Math.round(minLimit*100)/100
    procRates.push([subprocess, minLimit])
    
    // Calculate inputs to minumum
    let inFlowMass = 0
    inFlows.forEach(function(inFlow) {
      let [sink, amt] = inFlow
      let s = newSinksIndex.indexOf(sink)
      let available = newSinksBal[s]
      let flow = Math.round(amt * qty * dT * minLimit)
      inFlowMass += flow
      let newBalance = available - flow
      newSinksBal[s] = newBalance
    })

    // Add outflows
    outFlows.forEach(function(outFlow) {
      let [sink, scalar] = outFlow
      let s = newSinksIndex.indexOf(sink)
      let available = newSinksBal[s]
      let flow = Math.round(scalar * inFlowMass *1000)/1000
      let newBalance = Math.max(available+flow, 0)
      newSinksBal[s] = newBalance
    })
    return refreshProcess(proc, qty, data, newSinksIndex, newSinksBal, dT, procRates, j+1)
  }
}

export function sumArrays(array1, array2) {
    let output = [];
    for (let i in array1) {
      if (!array2[i]) {
        output.push(array1[i]);
      } else {
        output.push(array1[i] + array2[i]);
      }
    }
    return output;
}