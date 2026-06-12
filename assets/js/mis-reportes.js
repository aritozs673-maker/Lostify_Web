console.log("MIS REPORTES JS CARGADO");

const API_URL = "http://127.0.0.1:8000/api";

// MENU
function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}

// LOGOUT
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// CARGAR REPORTES
async function cargarMisReportes() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/mis-reportes?user_id=${user.id}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        const data = await res.json();
        const reportes = data.reportes || [];

        const grid = document.getElementById("reportesGrid");
        grid.innerHTML = "";

        if (reportes.length === 0) {
            grid.innerHTML = `
                <div class="empty">
                    <div class="empty-box">
                        <i class="fa-solid fa-clipboard"></i>
                        <h3>Sin reportes aún</h3>
                        <p>Cuando crees tu primer reporte aparecerá aquí.</p>
                        <a href="crear-reporte.html" class="btn-nuevo">
                            <i class="fa-solid fa-plus"></i> Crear Reporte
                        </a>
                    </div>
                </div>
            `;
            return;
        }

        reportes.forEach(reporte => {
            const obj = reporte.objeto || {};

            const imgSrc = obj.imagen
                ? `http://127.0.0.1:8000/storage/${obj.imagen}`
                : "http://127.0.0.1:8000/storage/imagenes/default1.png";

            const esPerdido = (obj.estado?.nombre_estado || "").toLowerCase() === "perdido";
            const estadoClass = esPerdido ? "estado-perdido" : "estado-encontrado";
            const estadoIcono = esPerdido ? "fa-circle-xmark" : "fa-circle-check";

            grid.innerHTML += `
                <div class="reporte-card">
                    <div class="reporte-img">
                        <img src="${imgSrc}" alt="${obj.nombre_obj || 'Objeto'}">
                    </div>
                    <div class="reporte-body">
                        <h3>${obj.nombre_obj || 'Objeto sin nombre'}</h3>
                        <p class="descripcion">${reporte.descripcion || 'Sin descripción'}</p>
                        
                        <div class="reporte-detalles">
                            <span><i class="fa-solid fa-tag"></i> ${obj.categoria?.nombre_cat || 'Sin categoría'}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${obj.ubicacion?.nombre_ubi || 'Sin ubicación'}</span>
                        </div>
                        
                        <div class="reporte-estado">
                            <span class="estado-badge ${estadoClass}">
                                <i class="fa-solid ${estadoIcono}"></i>
                                ${obj.estado?.nombre_estado || 'Estado'}
                            </span>
                        </div>
                    </div>
                    <div class="reporte-actions">
                        <button class="btn-eliminar" onclick="eliminarReporte(${reporte.id})" title="Eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

    } catch (err) {
        console.error(err);
        document.getElementById("reportesGrid").innerHTML = `<p>Error al cargar reportes</p>`;
    }
}

// ELIMINAR
async function eliminarReporte(id) {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("¿Eliminar este reporte?")) return;

    try {
        await fetch(`${API_URL}/reportes/public/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        cargarMisReportes();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar");
    }
}

window.onload = cargarMisReportes;