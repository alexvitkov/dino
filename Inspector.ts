const inspectorDiv = document.getElementById("inspector");
const lookup: {[key: string]: any} = {};


export function bind(name: string, ndim, setter, getter) {
  const labelDiv = document.createElement('div');
  const valueDiv = document.createElement('div');
  valueDiv.classList.add("inspector_hflex");

  const inputs = [];

  const onchange = () => {
    let vec = [];

    for (let i = 0; i < ndim; i++) {
      vec[i] = parseFloat(inputs[i].value);
      if (Number.isNaN(vec[i]))
	return;
    }
    setter(vec);
  }

  for (let i = 0; i < ndim; i++) {
    inputs[i] = document.createElement('input');
    inputs[i].onchange = onchange;
  }

  labelDiv.innerText = name;

  lookup[name] = () => {
    const val = getter();

    for (let i = 0; i < ndim; i++)
      inputs[i].value = val[i].toFixed(3);
  }

  lookup[name]();

  valueDiv.append(...inputs);
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
