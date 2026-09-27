let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

function guardar() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

function actualizarContador() {
  const contador = document.getElementById("contador");

  contador.textContent =
    clientes.length === 1
      ? "1 cliente"
      : clientes.length + " clientes";

  const totalResumen = document.getElementById("totalResumen");
  const telefonosResumen = document.getElementById("telefonosResumen");

  if (totalResumen) {
    totalResumen.textContent = clientes.length;
  }

  if (telefonosResumen) {
    const conTelefono = clientes.filter(function(cliente) {
      return cliente.telefono && cliente.telefono.trim() !== "";
    }).length;

    telefonosResumen.textContent = conTelefono;
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

    li.appendChild(nombre);
    li.appendChild(telefono);

    if (cliente.nota) {
      const nota = document.createElement("div");
      nota.textContent = "📝 " + cliente.nota;
      nota.style.marginBottom = "12px";
      nota.style.color = "#666";
      li.appendChild(nota);
    }

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

      const numeroWhatsApp =
        numero.startsWith("0")
          ? "212" + numero.substring(1)
          : numero;

      window.open(
        "https://wa.me/" + numeroWhatsApp,
        "_blank"
      );
    };

    li.appendChild(editar);
    li.appendChild(eliminar);
    li.appendChild(whatsapp);

    lista.appendChild(li);
  });

  actualizarContador();
}

function agregarCliente() {
  const nombreInput = document.getElementById("nombre");
  const telefonoInput = document.getElementById("telefono");
  const notaInput = document.getElementById("nota");

  const nombre = nombreInput.value.trim();
  const telefono = telefonoInput.value.trim();
  const nota = notaInput ? notaInput.value.trim() : "";

  if (!nombre || !telefono) {
    alert("Completa los datos");
    return;
  }

  clientes.push({
    nombre: nombre,
    telefono: telefono,
    nota: nota
  });

  guardar();

  nombreInput.value = "";
  telefonoInput.value = "";

  if (notaInput) {
    notaInput.value = "";
  }

  mostrar();
}

function editarCliente(indice) {
  const cliente = clientes[indice];

  const nuevoNombre = prompt("Nombre:", cliente.nombre);
  if (nuevoNombre === null) return;

  const nuevoTelefono = prompt("Teléfono:", cliente.telefono);
  if (nuevoTelefono === null) return;

  const nuevaNota = prompt(
    "Nota:",
    cliente.nota || ""
  );

  if (nuevaNota === null) return;

  if (!nuevoNombre.trim() || !nuevoTelefono.trim()) {
    alert("Completa los datos");
    return;
  }

  cliente.nombre = nuevoNombre.trim();
  cliente.telefono = nuevoTelefono.trim();
  cliente.nota = nuevaNota.trim();

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
  const texto = document.getElementById("buscar").value
    .toLowerCase()
    .trim();

  const resultados = clientes.filter(function(cliente) {
    return (
      cliente.nombre.toLowerCase().includes(texto) ||
      cliente.telefono.includes(texto) ||
      (cliente.nota || "").toLowerCase().includes(texto)
    );
  });

  mostrar(resultados);
}

function ordenarClientes() {
  clientes.sort(function(a, b) {
    return a.nombre.localeCompare(b.nombre);
  });

  guardar();
  mostrar();
}

function guardarCopia() {
  const datos = JSON.stringify(clientes, null, 2);

  const archivo = new Blob([datos], {
    type: "application/json"
  });

  const url = URL.createObjectURL(archivo);

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "mis-clientes-backup.json";
  enlace.click();

  URL.revokeObjectURL(url);
}

function restaurarCopia(event) {
  const archivo = event.target.files[0];

  if (!archivo) return;

  const lector = new FileReader();

  lector.onload = function(e) {
    try {
      const datos = JSON.parse(e.target.result);

      if (!Array.isArray(datos)) {
        throw new Error("Formato inválido");
      }

      clientes = datos;
      guardar();
      mostrar();

      alert("Copia restaurada correctamente");
    } catch (error) {
      alert("El archivo no es válido");
    }
  };

  lector.readAsText(archivo);
}

mostrar();
