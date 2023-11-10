const info = PRODUCT_INFO_URL + `${localStorage.getItem('prodId')}.json`;
const come =
	PRODUCT_INFO_COMMENTS_URL + `${localStorage.getItem('prodId')}.json`;
const contInfo = document.getElementById('infoProd');

let infoProd = [];
let comeProd = [];

document.addEventListener('DOMContentLoaded', () => {
	cargarUser();
	cargarDatos();
	console.log(info);
});

async function cargarDatos() {
	await getJSONData(info).then(function (resultObj) {
		if (resultObj.status === 'ok') {
			infoProd = resultObj.data;
		}
	});

	await getJSONData(come).then(function (resultObj) {
		if (resultObj.status === 'ok') {
			comeProd = resultObj.data;
		}
	});

	let rowImagenes = '';

	for (let i = 0; i < infoProd.images.length; i++) {
		if (i == 0) {
			rowImagenes += `
               <div class="carousel-item active">
                    <img src="${infoProd.images[i]}" class="d-block w-100">
               </div>
               `;
		} else {
			rowImagenes += `
               <div class="carousel-item">
                    <img src="${infoProd.images[i]}" class="d-block w-100">
               </div>
               `;
		}
	}

	let comentarios = '';

	for (let i = 0; i < comeProd.length; i++) {
		comentarios += `
          <li class="list-group-item">
               <p><span class="fw-bold">${comeProd[i].user}</span> - ${comeProd[i].dateTime} - `;
		for (let j = 0; j < comeProd[i].score; j++) {
			comentarios += `
               <span class="fa fa-star checked"></span>
               `;
		}
		for (let j = comeProd[i].score; j < 5; j++) {
			comentarios += `
               <span class="fa fa-star"></span>
               `;
		}
		comentarios += `
               </p>
               <p>${comeProd[i].description}</p>
          </li>`;
	}

	let prodRelacionados = '';

	for (let i = 0; i < infoProd.relatedProducts.length; i++) {
		prodRelacionados += `
          <div class="col-md-auto cursor-active" onclick="setProdID(${infoProd.relatedProducts[i].id})">
               <figure class="figure">
                    <img src="${infoProd.relatedProducts[i].image}" class="figure-img imgIlust rounded" alt="Img de ${infoProd.relatedProducts[i].name}">
                    <figcaption class="figure-caption fs-5">${infoProd.relatedProducts[i].name}</figcaption>
               </figure>
          </div>
          `;
	}

	let htmlContentToAppend = `
     <div class="col">
          <div class="row p-4">
               <h1>${infoProd.name}</h1>
          </div>
          <hr>
          <div class="row">
               <p><span class="fw-bold">Precio</span> <br>
               ${infoProd.currency} ${infoProd.cost}</p>
          </div>
          <div class="row">
               <p><span class="fw-bold">Descripción</span> <br>
               ${infoProd.description}</p>
          </div>
          <div class="row">
               <p><span class="fw-bold">Categoría</span> <br>
               ${infoProd.category}</p>
          </div>
          <div class="row">
               <p><span class="fw-bold">Cantidad de vendidos</span> <br>
               ${infoProd.soldCount}</p>
          </div>
          <div class="row">
               <p><span class="fw-bold">Imagenes ilustrativas</span></p>
          </div>
          <div class="row d-flex gap-3 flex-wrap justify-content-around align-content-between">
               <div id="carouselExampleControls" class="carousel slide w-50" data-bs-ride="carousel">
                    <div class="carousel-inner">
                    ${rowImagenes}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls"
                    data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls"
                    data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                    </button>
               </div>
          </div>
          <hr>
          <div class="row p-3">
               <h4>Comentarios</h4>
               <ul class="list-group" id="ulComentarios">
                    ${comentarios}
               </ul>
          </div>
          <div class="row p-3">
               <div class="col-5">
                    <h4>Comentar</h4>
                    <form>
                         <div class="form-floating p-2">
                              <textarea class="form-control" id="coment"></textarea>
                              <label for="coment">Tu opinión</label>
                         </div>
                         <div class="input-group mb-3 p-2">
                              <label class="input-group-text" for="selectPunt">Puntuación</label>
                              <select class="form-select" id="selectPunt">
                                   <option value="1" selected>1</option>
                                   <option value="2">2</option>
                                   <option value="3">3</option>
                                   <option value="4">4</option>
                                   <option value="5">5</option>
                              </select>
                         </div>
                         <div class="mx-auto text-center">
                              <button type="button" class="btn btn-primary" onclick="comentarDat()">Enviar</button>
                         </div>
                    </form>
               </div>
          </div>
          <hr>
          <div class="row p-3">
               <h4>Productos Relacionados</h4>
               ${prodRelacionados}
          </div>
     </div>`;

	contInfo.innerHTML += htmlContentToAppend;
}

function comentarDat() {
	const coment = document.getElementById('coment').value;
	const punt = document.getElementById('selectPunt').value;

	let fecha = new Date();

	const dia = fecha.getDate();
	const mes = fecha.getMonth() + 1;
	const anio = fecha.getFullYear();
	const hora = fecha.getHours();
	const min = fecha.getMinutes();
	const sec = fecha.getSeconds();

	fecha = `${anio} - ${mes} - ${dia} ${hora}:${min}:${sec}`;

	let liComentario = `<li class="list-group-item">
     <p><span class="fw-bold">${localStorage.getItem(
				'userID'
			)}</span> - ${fecha} - `;
	for (let j = 0; j < punt; j++) {
		liComentario += `
     <span class="fa fa-star checked"></span>
     `;
	}
	for (let j = punt; j < 5; j++) {
		liComentario += `
     <span class="fa fa-star"></span>
     `;
	}
	liComentario += `
     </p>
          <p>${coment}</p>
     </li>`;

	document.getElementById('ulComentarios').innerHTML += liComentario;
}

function setProdID(id) {
	localStorage.setItem('prodId', id);
	window.location = 'product-info.html';
}
