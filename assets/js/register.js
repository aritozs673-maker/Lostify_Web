const API_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", () => {
    console.log("REGISTER.JS CARGADO");
});

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    console.log("CLICK REGISTRO - INICIANDO");

    const name = document.getElementById("name").value;
    const apellido_paterno = document.getElementById("apellido_paterno").value;
    const apellido_materno = document.getElementById("apellido_materno").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const password_confirmation = document.getElementById("password_confirmation").value;

    const errorBox = document.getElementById("errorBox");
    const successBox = document.getElementById("successBox");

    errorBox.style.display = "none";
    successBox.style.display = "none";

    
    //Validar que solo tenga letras
    const soloLetrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    
    if (!soloLetrasRegex.test(name)) {
        errorBox.innerText = "El nombre solo debe contener letras";
        errorBox.style.display = "block";
        return;
    }
    
    if (!soloLetrasRegex.test(apellido_paterno)) {
        errorBox.innerText = "El apellido paterno solo debe contener letras";
        errorBox.style.display = "block";
        return;
    }
    
    if (apellido_materno && !soloLetrasRegex.test(apellido_materno)) {
        errorBox.innerText = "El apellido materno solo debe contener letras";
        errorBox.style.display = "block";
        return;
    }

    // Validar email institucional
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(univalle\.edu|est\.univalle\.edu)$/;
    
    if (!emailRegex.test(email)) {
        errorBox.innerText = "Solo se aceptan emails institucionales (@univalle.edu o @est.univalle.edu)";
        errorBox.style.display = "block";
        return;
    }

    if (password !== password_confirmation) {
        errorBox.innerText = "Las contraseñas no coinciden";
        errorBox.style.display = "block";
        return;
    }

    if (password.length < 6) {
        errorBox.innerText = "La contraseña debe tener al menos 6 caracteres";
        errorBox.style.display = "block";
        return;
    }


    try {
        console.log("ENVIANDO DATOS...");

        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: name,
                apellido_paterno: apellido_paterno,
                apellido_materno: apellido_materno,
                email: email,
                password: password,
                password_confirmation: password_confirmation
            })
        });

        const data = await response.json();

        console.log("RESPUESTA:", data);

        if (!response.ok) {
            if (data.errors) {
                const firstError = Object.values(data.errors)[0][0];
                errorBox.innerText = firstError;
            } else {
                errorBox.innerText = data.message || data.error || "Error al registrar";
            }
            errorBox.style.display = "block";
            return;
        }

        successBox.innerText = "Cuenta creada correctamente. Redirigiendo...";
        successBox.style.display = "block";

        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 2000);

    } catch (err) {
        console.error("ERROR:", err);
        errorBox.innerText = "Error de conexión";
        errorBox.style.display = "block";
    }
});