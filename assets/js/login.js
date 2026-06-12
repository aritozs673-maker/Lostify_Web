console.log("LOGIN.JS CARGADO");

const API_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM LISTO");

    const form = document.getElementById("loginForm");
    const errorBox = document.getElementById("errorBox");

    if (!form) {
        console.error("NO EXISTE FORM");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // ← Evitar que se refresque la página

        console.log("CLICK LOGIN - INICIANDO");

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        console.log("Email:", email);

        if (!email || !password) {
            errorBox.style.display = "block";
            errorBox.innerText = "Por favor completa todos los campos";
            return;
        }

        try {
            console.log("HACIENDO PETICIÓN...");

            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            console.log("RESPUESTA LOGIN:", data);

            if (!response.ok) {
                errorBox.style.display = "block";
                errorBox.innerText = data.message || "Error en el login";
                return;
            }

            // Guardar usuario
            localStorage.setItem("user", JSON.stringify(data.user));

            // Guardar token (si viene)
            if (data.token) {
                localStorage.setItem("token", data.token);
                console.log("TOKEN GUARDADO:", data.token);
            } else {
                console.warn("NO VIENE TOKEN EN LA RESPUESTA");
            }

            console.log("LOGIN EXITOSO");

            // Redireccionar
            window.location.href = "dashboard.html";

        } catch (err) {
            console.error("ERROR:", err);
            errorBox.style.display = "block";
            errorBox.innerText = "Error de conexión";
        }
    });
});