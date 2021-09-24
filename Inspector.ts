

const inspectorDiv = document.getElementById("inspector");
const reverseLookup = {};

const v3lookup: {[key: string]: any} = {};


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

export function bind(name: string, callback: (new_value: number) => void, initial_value: number) {
  const labelDiv = document.createElement('div');
  const valueDiv = document.createElement('input');

  labelDiv.innerText = name;
  valueDiv.value = initial_value.toString();

  valueDiv.onchange = () => {
    const f = parseFloat(valueDiv.value);
    if (!Number.isNaN(f))
      callback(f);
  };

  inspectorDiv.append(labelDiv, valueDiv);
}

export function bind_v3(name: string, setter, getter) {
  const labelDiv = document.createElement('div');
  const valueDiv = document.createElement('div');
  valueDiv.classList.add("inspector_hflex");

  const ix = document.createElement('input');
  const iy = document.createElement('input');
  const iz = document.createElement('input');

  labelDiv.innerText = name;

  v3lookup[name] = () => {
    const val = getter();
    ix.value = val[0].toFixed(3);
    iy.value = val[1].toFixed(3);
    iz.value = val[2].toFixed(3);
  }

  v3lookup[name]();

  ix.onchange = iy.onchange = iz.onchange = () => {
    const x = parseFloat(ix.value);
    const y = parseFloat(iy.value);
    const z = parseFloat(iz.value);

    if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z))
      setter([x,y,z]);
  };

  valueDiv.append(ix, iy, iz);
  inspectorDiv.append(labelDiv, valueDiv);
}

export function update(name: string) {
  if (name in v3lookup)
    v3lookup[name]();
}
