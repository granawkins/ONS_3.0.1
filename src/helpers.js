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

export function massUnits(v) {
    if (typeof(v) !== "number") {return v}
    let value, label
    if (v > 999999999) {
      value = Math.round(v/10000000)/100
      label = "Mt" 
    } else if (v > 999999) {
      value = Math.round(v/10000)/100
      label = "t" 
    } else if (v > 999) {
      value = Math.round(v/10)/100
      label = "kg" 
    } else {
      value = Math.round(v)
      label = "g"
    }
    value = value.toString()
    if (value.length > 3) {value = value.slice(0, 3)}
    if (value[2] === ".") {value = value.slice(0, 2)}
    return(value+label)
  }