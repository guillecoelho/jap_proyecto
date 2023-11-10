const ORDER_ASC_BY_NAME = 'AZ';
const ORDER_DESC_BY_NAME = 'ZA';
const ORDER_BY_PROD_COUNT = 'Cant.';
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

const url_prod = `https://japceibal.github.io/emercado-api/cats_products/${localStorage.getItem(
	'catID'
)}.json`;

let currentProductList;

document.addEventListener('DOMContentLoaded', function (e) {
	cargarListaProductos();

	cargarUser();

	document.getElementById('sortAsc').addEventListener('click', () => {
		sortAndShowProducts(ORDER_ASC_BY_NAME, currentProductList);
	});

	document.getElementById('sortDesc').addEventListener('click', () => {
		sortAndShowProducts(ORDER_DESC_BY_NAME, currentProductList);
	});

	document.getElementById('sortByCount').addEventListener('click', () => {
		sortAndShowProducts(ORDER_BY_PROD_COUNT, currentProductList);
	});

	document.getElementById('rangeFilterCount').addEventListener('click', () => {
		minCount = document.getElementById('rangeFilterCountMin').value;
		maxCount = document.getElementById('rangeFilterCountMax').value;

		currentProductsArray = currentProductList.products;

		showProductsList();
	});

	document.getElementById('clearRangeFilter').addEventListener('click', () => {
		document.getElementById('rangeFilterCountMin').value = '';
		document.getElementById('rangeFilterCountMax').value = '';

		minCount = undefined;
		maxCount = undefined;

		cargarListaProductos();
	});
});

function cargarListaProductos() {
	getJSONData(url_prod).then(function (resultObj) {
		if (resultObj.status === 'ok') {
			currentProductList = resultObj.data;
			mostrarDatosMain();
		}
	});
}

// PARTE 2
function mostrarDatosMain() {
	let mainHTML = `
     <h2>Productos</h2>
     <p class="lead">
          Verás aquí todos los productos de la categoría <strong>${currentProductList.catName}</strong>.
     </p>
     `;

	document.getElementById('mainHead').innerHTML = mainHTML;

	let htmlContentToAppend = '';
	for (let i = 0; i < currentProductList.products.length; i++) {
		let product = currentProductList.products[i];
		htmlContentToAppend += `
          <div onclick="setProdID(${product.id})" class="list-group-item list-group-item-action cursor-active">
               <div class="row">
                    <div class="col-3">
                         <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                         <div class="d-flex w-100 justify-content-between">
                              <h4 class="mb-1">${product.name} - USD ${product.cost}</h4>
                              <small class="text-muted">${product.soldCount} artículos</small>
                         </div>
                         <p class="mb-1">${product.description}</p>
                    </div>
               </div>
          </div>
          `;

		document.getElementById('prod-list-container').innerHTML =
			htmlContentToAppend;
	}
}

// PARTE 3

function sortProducts(criteria, array) {
	let result = [];
	if (criteria === ORDER_ASC_BY_NAME) {
		result = array.sort(function (a, b) {
			return a.cost - b.cost;
		});
	} else if (criteria === ORDER_DESC_BY_NAME) {
		result = array.sort(function (a, b) {
			return b.cost - a.cost;
		});
	} else if (criteria === ORDER_BY_PROD_COUNT) {
		result = array.sort(function (a, b) {
			let aCount = parseInt(a.soldCount);
			let bCount = parseInt(b.soldCount);

			if (aCount > bCount) {
				return -1;
			}
			if (aCount < bCount) {
				return 1;
			}
			return 0;
		});
	}

	return result;
}

function sortAndShowProducts(sortCriteria, currentProductList) {
	currentSortCriteria = sortCriteria;

	if (currentProductList != undefined) {
		currentProductsArray = currentProductList.products;
	}

	currentProductsArray = sortProducts(
		currentSortCriteria,
		currentProductsArray
	);

	//Muestro las categorías ordenadas
	showProductsList();
}

function showProductsList() {
	let htmlContentToAppend = '';
	for (let i = 0; i < currentProductsArray.length; i++) {
		let product = currentProductsArray[i];

		if (
			(minCount == undefined ||
				(minCount != undefined && parseInt(product.cost) >= minCount)) &&
			(maxCount == undefined ||
				(maxCount != undefined && parseInt(product.cost) <= maxCount))
		) {
			htmlContentToAppend += `
               <div onclick="setProdID(${product.id})" class="list-group-item list-group-item-action cursor-active">
               <div class="row">
                    <div class="col-3">
                         <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                         <div class="d-flex w-100 justify-content-between">
                              <h4 class="mb-1">${product.name} - USD ${product.cost}</h4>
                              <small class="text-muted">${product.soldCount} artículos</small>
                         </div>
                         <p class="mb-1">${product.description}</p>
                    </div>
               </div>
          </div>
               `;
		}

		document.getElementById('prod-list-container').innerHTML =
			htmlContentToAppend;
	}
}

function setProdID(id) {
	localStorage.setItem('prodId', id);
	window.location = 'product-info.html';
}
