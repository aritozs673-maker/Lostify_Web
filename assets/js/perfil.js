const API_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", () => {
    console.log("PERFIL JS CARGADO");
    cargarPerfil();
});

function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

function togglePasswordSection() {
    const passwordFields = document.getElementById('passwordFields');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if(passwordFields.style.display === 'none'){
        passwordFields.style.display = 'block';
        toggleIcon.style.transform = 'rotate(180deg)';
    } else {
        passwordFields.style.display = 'none';
        toggleIcon.style.transform = 'rotate(0deg)';
    }
}

// Cargar datos del perfil
async function cargarPerfil() {
    const token = localStorage.getItem("token");
    const userLocal = JSON.parse(localStorage.getItem("user"));
    
    console.log("TOKEN:", token);
    console.log("USER LOCAL:", userLocal);

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/perfil`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("RESPUESTA PERFIL:", res.status);

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        const data = await res.json();
        console.log("DATA PERFIL:", data);

        if (data.success) {
            const user = data.user;
            
            // Llenar los campos con los datos del usuario
            document.getElementById("name").value = user.name;
            document.getElementById("apellido_paterno").value = user.apellido_paterno;
            document.getElementById("apellido_materno").value = user.apellido_materno || "";
            document.getElementById("email").value = user.email;
            
            console.log("USUARIO CARGADO:", user.name);
        } else {
            console.error("Error:", data.message);
        }

    } catch (err) {
        console.error("ERROR:", err);
    }
}

// Guardar cambios del perfil
document.getElementById("perfilForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const data = {
        name: document.getElementById("name").value,
        apellido_paterno: document.getElementById("apellido_paterno").value,
        apellido_materno: document.getElementById("apellido_materno").value,
        email: document.getElementById("email").value,
        current_password: document.getElementById("current_password").value,
        password: document.getElementById("password").value,
        password_confirmation: document.getElementById("password_confirmation").value,
    };

    
    if (!data.name || !data.apellido_paterno || !data.email) {
        alert("Completa todos los campos requeridos");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/perfil`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        console.log("RESULTADO:", result);

        if (result.success) {
            alert(" Perfil actualizado correctamente");
            
            // update en usuario
            localStorage.setItem("user", JSON.stringify(result.user));
            
            document.getElementById("current_password").value = "";
            document.getElementById("password").value = "";
            document.getElementById("password_confirmation").value = "";
            
            // Ocultar sección de contraseña
            document.getElementById('passwordFields').style.display = 'none';
        } else {
            alert(" Error: " + (result.message || "No se pudo actualizar"));
        }

    } catch (err) {
        console.error(err);
        alert(" Error de conexión");
    }
});