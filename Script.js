
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

function guardar() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

function actualizarContador() {
  const contador = document.getElementById("contador");

  if (clientes.length === 1) {
    contador.textContent = "1 cliente";
  } else {
    contador.textContent = clientes.length + " clientes";
  }
}

function mostrar(listaClientes = clientes) {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  listaClientes.forEach(function(cliente) {
    const indice = clientes.indexOf(cliente);

    const li = document.createElement("li");

    li.appendChild(
      document.createTextNode(
        cliente.nombre + " - " + cliente.telefono + " "
      )
    );

    const editar = document.createElement("button");
    editar.textContent = "Editar";
    editar.onclick = function() {
      editarCliente(indice);
    };

    const eliminar = document.createElement("button");
    eliminar.textContent = "Eliminar";
    eliminar.onclick = function() {
      eliminarCliente(indice);
    };

    li.appendChild(editar);
    li.appendChild(eliminar);

    lista.appendChild(li);
  });

  actualizarContador();
}

function agregarCliente() {
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();

  if (!nombre || !telefono) {
    alert("Completa los datos");
    return;
  }

  clientes.push({
    nombre: nombre,
    telefono: telefono
  });

  guardar();

  document.getElementById("nombre").value = "";
  document.getElementById("telefono").value = "";

  mostrar();
}

function editarCliente(indice) {
  const cliente = clientes[indice];

  const nuevoNombre = prompt("Nombre:", cliente.nombre);
  if (nuevoNombre === null) return;

  const nuevoTelefono = prompt("Teléfono:", cliente.telefono);
  if (nuevoTelefono === null) return;

  cliente.nombre = nuevoNombre.trim();
  cliente.telefono = nuevoTelefono.trim();

  guardar();
  mostrar();
}

function eliminarCliente(indice) {
  clientes.splice(indice, 1);
  guardar();
  mostrar();
}

function buscarClientes() {
  const texto = document.getElementById("buscar").value.toLowerCase();

  const resultados = clientes.filter(function(cliente) {
    return (
      cliente.nombre.toLowerCase().includes(texto) ||
      cliente.telefono.includes(texto)
    );
  });

  mostrar(resultados);
}

mostrar();
