// Variables a usar para eventos click //
const listaCursos = document.querySelector('#lista-cursos');
//contenedor de lista del carrito
const listaCarrito = document.querySelector('#lista-carrito tbody');
//boton para eliminar cursos del carrito
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
// arreglo vacio que se irá llenando
let articulosCarrito = [];

//Listado de eventos//
registrarEventListeners(); //Para evitar que queden en la ventana global
function registrarEventListeners() {
	//Cuando se agrega un curso presionando "Agregar al carrito"
	listaCursos.addEventListener('click', agregarCurso);

	//Elimina cursos del carrito
	listaCarrito.addEventListener('click', eliminarCurso);

	//Muestra los cursos de localStorage
	document.addEventListener('DOMContentLoaded', () => {
		articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
		carritoHTML();
	});

	//Vaciar el carrito
	vaciarCarritoBtn.addEventListener('click', () => {
		articulosCarrito = [];
		limpiarHTML();
	});
}

//Funciones//
function agregarCurso(e) {
	e.preventDefault();

	if (e.target.classList.contains('agregar-carrito')) {
		const cursoSeleccionado = e.target.parentElement.parentElement;
		leerDatosCurso(cursoSeleccionado);
	}
}

//Lee el contenido HTML al que le dimos click y extrae la información del curso
function leerDatosCurso(curso) {
	console.log(curso);

	//Se crea un objeto con el contenido del curso actual
	const infoCurso = {
		imagen: curso.querySelector('img').src,
		titulo: curso.querySelector('h4').textContent,
		precio: curso.querySelector('.precio span').textContent,
		id: curso.querySelector('a').getAttribute('data-id'),
		cantidad: 1,
	}

	//Revisa si un elemento ya existe en el carrito
	const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);

	if (existe) {
		//Actualizamos la cantidad
		const cursos = articulosCarrito.map((curso) => {
			if (curso.id === infoCurso.id) {
				curso.cantidad++;				
				return curso; //retorna el curso con la cantidad actualizada.
			} else {
				return curso; //retorna los objetos que no son duplicados.
			}
		});
	} else {
		//Agrega elementos al arreglo del carrito
		articulosCarrito = [...articulosCarrito, infoCurso];
	}

	console.log(articulosCarrito);

	carritoHTML();
}

function eliminarCurso(e) {
	if (e.target.classList.contains('borrar-curso')) {
		const cursoId = e.target.getAttribute('data-id');

		//si la cantidad es mayor a 1 entonces cantidad--
		articulosCarrito.forEach(curso => {
			if (curso.id === cursoId) {
				if (curso.cantidad > 1) {
					//actualizamos la cantidad
					curso.cantidad--;
					(curso.precio - curso.precio);
					//se muestra el html con el cambio
					carritoHTML();
				} else {
					//Elimina del arreglo de articulosCarrito por el data-id 
					articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
					//Iterar sobre el carrito y mostrar su HTML
					carritoHTML();
				}
			}
		})
	}
}

//Muestra el carrito de compras en el HTML
function carritoHTML() {

	//Limpiar el HTML
	limpiarHTML();

	//Recorre el carrito y genera el HTML
	articulosCarrito.forEach((curso) => {
		//destructuring de objeto curso
		const { imagen, titulo, precio, cantidad, id } = curso;
		//Agregamos un <tr> al <tbody>
		const row = document.createElement('tr');
		row.innerHTML = `
		<td>
			<img src="${imagen}" width = "100"> 
		</td>
		<td> ${titulo} </td>
		<td> ${precio} </td>
		<td> ${cantidad} </td>
		<td>
			<a href="#" class="borrar-curso" data-id="${id}"> X </a>
		</td>
		`;

		//Agrega el HTML del carrito en el tbody
		listaCarrito.appendChild(row);
	});

	//Agregar el carrito de compras al storage
	sincronizarStorage();
}

function sincronizarStorage() {
	localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
} 

//Elimina los cursos del tbody
function limpiarHTML() {

	//Forma lenta (No recomendada)
	//listaCarrito.innerHTML = '';

	//Forma recomendada
	while (listaCarrito.firstChild) {
		listaCarrito.removeChild(listaCarrito.firstChild);
	}
}