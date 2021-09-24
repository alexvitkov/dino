const inspectorDiv = document.getElementById("inspector");
const lookup: {[key: string]: any} = {};


export function bind1(name: string, callback: (new_value: number) => void, initial_value: number) {
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

export function bind2(name: string, setter, getter) {
  const labelDiv = document.createElement('div');
  const valueDiv = document.createElement('div');
  valueDiv.classList.add("inspector_hflex");

  const ix = document.createElement('input');
  const iy = document.createElement('input');

  labelDiv.innerText = name;

  lookup[name] = () => {
    const val = getter();
    ix.value = val[0].toFixed(3);
    iy.value = val[1].toFixed(3);
  }

  lookup[name]();

  ix.onchange = iy.onchange = () => {
    const x = parseFloat(ix.value);
    const y = parseFloat(iy.value);

    if (!Number.isNaN(x) && !Number.isNaN(y))
      setter([x,y]);
  };

  valueDiv.append(ix, iy);
  inspectorDiv.append(labelDiv, valueDiv);
}

export function bind3(name: string, setter, getter) {
  const labelDiv = document.createElement('div');
  const valueDiv = document.createElement('div');
  valueDiv.classList.add("inspector_hflex");

  const ix = document.createElement('input');
  const iy = document.createElement('input');
  const iz = document.createElement('input');

  labelDiv.innerText = name;

  lookup[name] = () => {
    const val = getter();
    ix.value = val[0].toFixed(3);
    iy.value = val[1].toFixed(3);
    iz.value = val[2].toFixed(3);
  }

  lookup[name]();

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
  if (name in lookup)
    lookup[name]();
}



export function separator() {
  const sep = document.createElement('div');
  sep.classList.add('separator');
  inspectorDiv.append(sep);
}
