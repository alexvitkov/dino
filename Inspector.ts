

const inspectorDiv = document.getElementById("inspector");

const reverseLookup = {};



function formatValue(value: any): any {
  if (value instanceof Float32Array) {
    return Array.from(value).map(v => v.toFixed(3));
  }

  else if (Array.isArray(value)) {
    return value.map(formatValue);
  }

  else if (typeof value === 'number') {
    return Number.isInteger(value) ? value : value.toFixed(3);
  }

  return value;
}


export function set(name: string, value) {
  var index: number;

  if (name in reverseLookup) {
    index = reverseLookup[name];
  }
  else {
    const labelDiv = document.createElement('div');
    const valueDiv = document.createElement('div');

    labelDiv.innerText = name;
    inspectorDiv.append(labelDiv, valueDiv);

    index = inspectorDiv.children.length - 1;
    reverseLookup[name] = index;
  }

  (inspectorDiv.children.item(index) as HTMLElement).innerText = formatValue(value);
}
