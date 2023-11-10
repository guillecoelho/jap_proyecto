const form = document.getElementById('formPerfil');
const mail = document.getElementById('campoMail');
const nom1 = document.getElementById('campoNombre1');
const nom2 = document.getElementById('campoNombre2');
const ap1 = document.getElementById('campoApellido1');
const ap2 = document.getElementById('campoApellido2');
const tel = document.getElementById('campoTelefono');

document.addEventListener('DOMContentLoaded', () => {
	if (localStorage.getItem('userID') == undefined) {
		location.href = 'index.html';
	}

	cargarUser();

	cargarCampos();
});

form.addEventListener('submit', (e) => {
	if (form.checkValidity()) {
		let usuario = {
			pNombre: nom1.value,
			sNombre: nom2.value,
			pApellido: ap1.value,
			sApellido: ap2.value,
			mail: mail.value,
			telefono: tel.value,
		};

		if (mail.value != localStorage.getItem('userID')) {
			localStorage.setItem('userID', mail.value);
		}
		localStorage.setItem('datosUser', JSON.stringify(usuario));
	} else {
		e.preventDefault();
	}
});

function cargarCampos() {
	mail.value = localStorage.getItem('userID');

	let datos = JSON.parse(localStorage.getItem('datosUser'));

	if (datos != undefined) {
		nom1.value = datos.pNombre;
		nom2.value = datos.sNombre;
		ap1.value = datos.pApellido;
		ap2.value = datos.sApellido;
		tel.value = datos.telefono;
	}
}
