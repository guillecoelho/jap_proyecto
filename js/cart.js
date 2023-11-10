const cartUrl = CART_INFO_URL + '25801.json';

let carrito = [];
let subtotales = [];

let form = document.getElementById('formCompra');

document.addEventListener('DOMContentLoaded', () => {
	cargarUser();

	cargarDatos();
});

let estado;
let estadoPago = undefined;
let camposPago;

document.getElementById('selPago').addEventListener('click', () => {
	if (document.getElementById('premiumRadio').checked) {
		estado = 1;
	} else if (document.getElementById('expressRadio').checked) {
		estado = 2;
	} else {
		estado = 3;
	}

	document.getElementById('inputBanco').disabled = false;
	document.getElementById('inputTarjeta').disabled = false;
	document.getElementById('inputCodseg').disabled = false;
	document.getElementById('inputVen').disabled = false;

	if (estadoPago != undefined) {
		if (estadoPago) {
			document.getElementById('credito').checked = true;
			document.getElementById('inputBanco').disabled = true;
			document.getElementById('inputTarjeta').value = camposPago.tar;
			document.getElementById('inputCodseg').value = camposPago.cod;
			document.getElementById('inputVen').value = camposPago.ven;
		} else {
			document.getElementById('bancaria').checked = true;
			document.getElementById('inputTarjeta').disabled = false;
			document.getElementById('inputCodseg').disabled = false;
			document.getElementById('inputVen').disabled = false;
			document.getElementById('inputBanco').value = camposPago.cuenta;
		}
	}
});

document.getElementById('cerrarModal').addEventListener('click', () => {
	if (document.getElementById('credito').checked) {
		document.getElementById('estadoPago').innerHTML = 'Tarjeta de credito';
		camposPago = {
			tar: document.getElementById('inputTarjeta').value,
			cod: document.getElementById('inputCodseg').value,
			ven: document.getElementById('inputVen').value,
		};
		if (camposPago.tar == '' || camposPago.cod == '' || camposPago.cen == '') {
			document.getElementById('alertaPago').innerHTML =
				'No pueden haber campos vacios';
		} else {
			document.getElementById('alertaPago').innerHTML = '';
		}
	} else if (document.getElementById('bancaria').checked) {
		document.getElementById('estadoPago').innerHTML = 'Transferencia Bancaria';
		camposPago = {
			cuenta: document.getElementById('inputBanco').value,
		};
		if (camposPago.cuenta == '') {
			document.getElementById('alertaPago').innerHTML =
				'No pueden haber campos vacios';
		} else {
			document.getElementById('alertaPago').innerHTML = '';
		}
	}

	if (estado == 1) {
		document.getElementById('premiumRadio').checked = true;
	} else if (estado == 2) {
		document.getElementById('expressRadio').checked = true;
	} else {
		document.getElementById('standardRadio').checked = true;
	}
});

document.getElementById('credito').addEventListener('change', () => {
	document.getElementById('inputBanco').disabled = true;
	document.getElementById('inputTarjeta').disabled = false;
	document.getElementById('inputCodseg').disabled = false;
	document.getElementById('inputVen').disabled = false;

	estadoPago = true;
});

document.getElementById('bancaria').addEventListener('change', () => {
	document.getElementById('inputBanco').disabled = false;
	document.getElementById('inputTarjeta').disabled = true;
	document.getElementById('inputCodseg').disabled = true;
	document.getElementById('inputVen').disabled = true;

	estadoPago = false;
});

form.addEventListener(
	'submit',
	(event) => {
		if (!form.checkValidity()) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			document.getElementById('success-alert').classList.remove('d-none');
		}

		form.classList.add('was-validated');
	},
	false
);

async function cargarDatos() {
	await getJSONData(cartUrl).then(function (resultObj) {
		if (resultObj.status === 'ok') {
			carrito = resultObj.data.articles;
		}
	});

	await agregarLista(carrito);
}

function agregarLista(carrito) {
	let itemsCarrito = '';

	let cont = 0;
	for (item of carrito) {
		itemsCarrito += `
          <tr>
               <th scope="row"><img src="${
									item.image
								}" style="width: 100px;height: auto;"></th>
                    <td>${item.name}</td>
                    <td id="costo">${item.currency} ${item.unitCost}</td>
                    <td><input id="${cont}" type="text" value="${
			item.count
		}" class="w-25 subtotal"></td>
                    <th id="sub_${cont}">${item.currency} ${
			item.unitCost * item.count
		}</th>
          </tr>
          `;
		subtotales[cont] = item.unitCost * item.count;
		cont++;
	}

	let listado = `
     <h4>Articulos a comprar</h4>
     <div class="table-responsive">
          <table class="table">
               <thead>
               <tr>
                    <th scope="col"></th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Costo</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Subtotal</th>
               </tr>
               </thead>
               <tbody>
                    ${itemsCarrito}
               </tbody>
          </table>
     </div>
     `;

	document.getElementById('listaCarrito').innerHTML += listado;

	document.querySelectorAll('.subtotal').forEach((item) => {
		item.addEventListener('input', () => {
			if (item.value >= 0) {
				subTotal(item.value, item.id, carrito[item.id]);
			}
		});
	});

	document.querySelectorAll('.form-check-input').forEach((it) => {
		it.addEventListener('change', () => {
			costosFinales();
		});
	});

	costosFinales();
}

function subTotal(value, id, item) {
	let subt = `${item.currency} ${item.unitCost * value}`;
	if (value != '') {
		document.getElementById('sub_' + id).innerHTML = subt;
		subtotales[id] = item.unitCost * value;
		costosFinales();
	} else {
		document.getElementById('sub_' + id).innerHTML = 'Esperando Cantidad';
	}
}

function costosFinales() {
	let subCosto = subtotales.reduce((a, b) => a + b, 0);
	let envio = 0;

	document.getElementById(
		'subCostos'
	).innerHTML = `${carrito[0].currency} ${subCosto}`;

	if (document.getElementById('premiumRadio').checked) {
		envio = subCosto * 0.15;
	} else if (document.getElementById('expressRadio').checked) {
		envio = subCosto * 0.07;
	} else {
		envio = subCosto * 0.05;
	}

	document.getElementById(
		'cosCostos'
	).innerHTML = `${carrito[0].currency} ${envio}`;

	document.getElementById('totalCostos').innerHTML = `${carrito[0].currency} ${
		subCosto + envio
	}`;
}
