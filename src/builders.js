export const addMenu = (id, label_text, container, position=null) => {
    let wrapper =   $(`<div id=${id + "Wrapper"}></div>`)
    let line =     $(`<div id=${id + "Line"} class=${"line"}></div>`).appendTo(wrapper)
    let leftBlock = $(`<div></div>`).appendTo(line)
        .css("display", "inline-flex")
    let arrow =     $(`<i class="arrow"></i>`).appendTo(leftBlock)
    let title =     $(`<span class="menuHeader">${label_text}</span>`).appendTo(leftBlock)
        .click(function(){$("#"+id).slideToggle()})
    let content =   $(`<div id=${id} class="menu"></div>`).appendTo(wrapper)
    
    if (position) {
        let before = container.childNodes[position]
        container.insertBefore(wrapper.get(0), before)
    } else {
        container.append(wrapper.get(0))
    }
    return document.getElementById(id)
}

export const addLine = (id, label_text, container, level) => {
    let line = $(`<div id=${id + "Line"} class="line"></div>`)
    let title = $(`<div id=${id}>${label_text}</div>`).appendTo(line)

    container.appendChild(line.get(0))
    return document.getElementById(id + "Line")
}

export const addFlexValue = (id, unit, container, type) => {
    let wrapper = $(`<div id=${id + "ValueContainer"} class="flexItem"></div>`)
    let value = $(`<span id=${id + "Value"}>${"N"}</span>`).appendTo(wrapper)
    let units = $(`<span id=${id + "Units"}>${unit}</span>`).appendTo(wrapper)
        .css("font-size", "0.6em")
    
    container.appendChild(wrapper.get(0))
    return document.getElementById(id + "Value")
}
  
export const addFlexButton = (id, label_text, location, color) => {
    let button = $(`<button id=${id + "Button"}>${label_text}</button>`)
        .css("color", color).css("border-color", color)
    
    location.appendChild(button.get(0))
    return document.getElementById(id + "Button")
}
  
export const addFlexSelector = (id, location, options) => {
    let selector = $(`<select id=${id + "Selector"}></select>`)
    options.forEach(option => {
        selector.append(`<option value=${option[1]}>${option[0]}</option>`)
    })

    location.appendChild(selector.get(0))
    return document.getElementById(id + "Selector")
}
  
export const addFlexText = (id, text, location) => {
    let textItem = $(`<span id=${id + "Text"} class="flexItem">${text}</span>`)

    location.appendChild(textItem.get(0))
    return document.getElementById(id + "Text")
}