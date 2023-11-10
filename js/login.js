const mail = document.getElementById('floatingInput');
const divmail = document.getElementById('mailInputError');
const pass = document.getElementById('floatingPassword');
const divpass = document.getElementById('passInputError');

document.addEventListener('DOMContentLoaded', () => {
	mail.value = '';
	pass.value = '';
	mail.style.borderColor = 'grey';
	pass.style.borderColor = 'grey';

	document.getElementById('formLogin').addEventListener('submit', (e) => {
		e.preventDefault();

		if (mail.value == '') {
			mail.style.borderColor = 'red';
			mostrarError('No puede estar vacio', 1);
		}
		if (pass.value == '') {
			pass.style.borderColor = 'red';
			mostrarError('No puede estar vacio', 2);
		}
		if (mail.value != '' && pass.value != '') {
			let usuario = mail.value;
			console.log('Usuario');
			localStorage.setItem('userID', usuario);
			window.location.href = 'principal.html';
		}
	});
});

function mostrarError(mensaje, tipo) {
	if (tipo == 1) {
		const mailError = document.createElement('p');
		mailError.textContent = mensaje;
		mailError.classList.add('text-red-500');
		divmail.appendChild(mailError);
	} else if (tipo == 2) {
		const passError = document.createElement('p');
		passError.textContent = mensaje;
		passError.classList.add('text-red-500');
		divpass.appendChild(passError);
	}
}
