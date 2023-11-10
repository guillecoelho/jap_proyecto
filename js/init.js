const CATEGORIES_URL = 'https://japceibal.github.io/emercado-api/cats/cat.json';
const PUBLISH_PRODUCT_URL =
	'https://japceibal.github.io/emercado-api/sell/publish.json';
const PRODUCTS_URL = 'https://japceibal.github.io/emercado-api/cats_products/';
const PRODUCT_INFO_URL = 'https://japceibal.github.io/emercado-api/products/';
const PRODUCT_INFO_COMMENTS_URL =
	'https://japceibal.github.io/emercado-api/products_comments/';
const CART_INFO_URL = 'https://japceibal.github.io/emercado-api/user_cart/';
const CART_BUY_URL = 'https://japceibal.github.io/emercado-api/cart/buy.json';
const EXT_TYPE = '.json';
const userNameNav = document.getElementById('nav-user');

let showSpinner = function () {
	document.getElementById('spinner-wrapper').style.display = 'block';
};

let hideSpinner = function () {
	document.getElementById('spinner-wrapper').style.display = 'none';
};

let getJSONData = function (url) {
	let result = {};
	showSpinner();
	return fetch(url)
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw Error(response.statusText);
			}
		})
		.then(function (response) {
			result.status = 'ok';
			result.data = response;
			hideSpinner();
			return result;
		})
		.catch(function (error) {
			result.status = 'error';
			result.data = error;
			hideSpinner();
			return result;
		});
};

let cargarUser = function () {
	userNameNav.innerHTML += `
	<div class="container-fluid">
	<div class="dropdown d-flex justify-content-end">
	<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
		${localStorage.getItem('userID')}
	</button>
		<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
			<div class="dropdown-item d-flex justify-content-between">
				<a href="cart.html">Mi carrito</a>
			</div>
			<div class="dropdown-item d-flex justify-content-between">
				<a href="my-profile.html">Mi perfil</a>
			</div>
			<div onclick="logout()" class="dropdown-item d-flex justify-content-between">
				<a href="index.html">Cerrar Sesión</a>
			</div>
		</div>
		</div>
	</div>
	`;
};

let logout = function () {
	localStorage.removeItem('userID');
	//window.location = 'index.html';
};
