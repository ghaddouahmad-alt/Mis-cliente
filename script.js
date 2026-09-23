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

    const nombre = document.createElement("div");
    nombre.textContent = "👤 " + cliente.nombre;
    nombre.style.fontWeight = "bold";
    nombre.style.fontSize = "18px";
    nombre.style.marginBottom = "8px";

    const telefono = document.createElement("div");
    telefono.textContent = "📞 " + cliente.telefono;
    telefono.style.marginBottom = "12px";

    const editar = document.createElement("button");
    editar.textContent = "✏️ Editar";
    editar.onclick = function() {
      editarCliente(indice);
    };

    const eliminar = document.createElement("button");
    eliminar.textContent = "🗑️ Eliminar";
    eliminar.onclick = function() {
      eliminarCliente(indice);
    };

    const whatsapp = document.createElement("button");
    whatsapp.textContent = "🟢 WhatsApp";
    whatsapp.onclick = function() {
      const numero = cliente.telefono.replace(/\D/g, "");
      window.open("https://wa.me/" + numero, "_blank");
    };

    li.appendChild(nombre);
    li.appendChild(telefono);
    li.appendChild(editar);
    li.appendChild(eliminar);
    li.appendChild(whatsapp);

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
  const cliente = clientes[indice];

  const confirmar = confirm(
    "¿Seguro que quieres eliminar a " + cliente.nombre + "?"
  );

  if (!confirmar) {
    return;
  }

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

function abrirWhatsApp(telefono) {
  const numero = telefono.replace(/\D/g, "");

  window.open("https://wa.me/" + numero, "_blank");
}

mostrar();
function hacerCopia() {
  const datos = JSON.stringify(clientes, null, 2);
  const archivo = new Blob([datos], { type: "application/json" });

  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(archivo);
  enlace.download = "mis-clientes-backup.json";
  enlace.click();

  URL.revokeObjectURL(enlace.href);
}

function importarCopia(evento) {
  const archivo = evento.target.files[0];

  if (!archivo) return;

  const lector = new FileReader();

  lector.onload = function() {
    try {
      clientes = JSON.parse(lector.result);
      guardar();
      mostrar();
      alert("Copia restaurada correctamente");
    } catch (error) {
      alert("El archivo de copia no es válido");
    }
  };

  lector.readAsText(archivo);
}
