const API_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", () => {
    console.log("FILTRAR OBJETOS JS CARGADO");
    cargarFiltros();
    cargarObjetos();
});

// Toggle Menu
function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}

// Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// Cargar cat/ubicaciones/estados en los selects
async function cargarFiltros() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/filtros/datos`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        console.log("FILTROS DATA:", data);

        if (data.success) {
            // Llenar categorías
            const catSelect = document.getElementById("filtro_categoria");
            data.categorias.forEach(cat => {
                catSelect.innerHTML += `<option value="${cat.id}">${cat.nombre_cat}</option>`;
            });

            // Llenar ubicaciones
            const ubiSelect = document.getElementById("filtro_ubicacion");
            data.ubicaciones.forEach(ubi => {
                ubiSelect.innerHTML += `<option value="${ubi.id}">${ubi.nombre_ubi}</option>`;
            });

            // Llenar estados
            const estSelect = document.getElementById("filtro_estado");
            data.estados.forEach(est => {
                estSelect.innerHTML += `<option value="${est.id}">${est.nombre_estado}</option>`;
            });
        }

    } catch (err) {
        console.error("ERROR CARGANDO FILTROS:", err);
    }
}

// Cargar todos los objetos (sin filtro)
async function cargarObjetos(filtros = {}) {
    const token = localStorage.getItem("token");
    if (!token) return;

    const grid = document.getElementById("resultadosGrid");
    grid.innerHTML = '<div class="loading-spinner"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</div>';

    try {
        // Construir URL con parámetros
        const params = new URLSearchParams(filtros).toString();
        
        const res = await fetch(`${API_URL}/objetos/filtrar?${params}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        console.log("OBJETOS DATA:", data);

        if (data.success) {
            document.getElementById("totalResultados").innerText = data.total;
            mostrarResultados(data.reportes);
        }

    } catch (err) {
        console.error("ERROR CARGANDO OBJETOS:", err);
        grid.innerHTML = '<div class="no-resultados"><p>Error al cargar resultados</p></div>';
    }
}

// Mostrar tarjetas de objetos
function mostrarResultados(reportes) {
    const grid = document.getElementById("resultadosGrid");
    grid.innerHTML = "";

    if (reportes.length === 0) {
        grid.innerHTML = '<div class="no-resultados"><i class="fa-solid fa-face-smile"></i><p>No se encontraron resultados</p></div>';
        return;
    }

    reportes.forEach(reporte => {
        const obj = reporte.objeto || {};
        
        // Imagen del objeto
        const imgSrc = obj.imagen
            ? `http://127.0.0.1:8000/storage/${obj.imagen}`
            : "http://127.0.0.1:8000/storage/imagenes/default1.png";

        // Estado (color)
        const estadoClass = obj.estado?.nombre_estado?.toLowerCase() === "perdido" 
            ? "estado-perdido" 
            : "estado-encontrado";

        grid.innerHTML += `
            <div class="obj-card">
                <div class="obj-img">
                    <img src="${imgSrc}" alt="${obj.nombre_obj || 'Objeto'}">
                    <span class="${estadoClass}">${obj.estado?.nombre_estado || 'Desconocido'}</span>
                </div>
                <div class="obj-info">
                    <h3>${obj.nombre_obj || 'Sin nombre'}</h3>
                    <p class="descripcion">${reporte.descripcion || 'Sin descripción'}</p>
                    <p class="detalle"><i class="fa-solid fa-tag"></i> ${obj.categoria?.nombre_cat || 'Sin categoría'}</p>
                    <p class="detalle"><i class="fa-solid fa-location-dot"></i> ${obj.ubicacion?.nombre_ubi || 'Sin ubicación'}</p>
                    <p class="detalle"><i class="fa-solid fa-calendar"></i> ${new Date(reporte.created_at).toLocaleDateString()}</p>
                </div>
            </div>
        `;
    });
}

// Aplicar filtros
function aplicarFiltros() {
    const filtros = {
        nombre: document.getElementById("filtro_nombre").value,
        categoria_id: document.getElementById("filtro_categoria").value,
        ubicacion_id: document.getElementById("filtro_ubicacion").value,
        estado_id: document.getElementById("filtro_estado").value,
        fecha_desde: document.getElementById("filtro_fecha_desde").value,
        fecha_hasta: document.getElementById("filtro_fecha_hasta").value,
    };

    // Filtrar solo valores no vacíos
    const filtrosLimpios = {};
    Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
            filtrosLimpios[key] = filtros[key];
        }
    });

    cargarObjetos(filtrosLimpios);
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById("filtro_nombre").value = "";
    document.getElementById("filtro_categoria").value = "";
    document.getElementById("filtro_ubicacion").value = "";
    document.getElementById("filtro_estado").value = "";
    document.getElementById("filtro_fecha_desde").value = "";
    document.getElementById("filtro_fecha_hasta").value = "";
    
    cargarObjetos();
}