const API_URL = "http://127.0.0.1:8000/api";

async function get(endpoint) {
    const res = await fetch(`${API_URL}/${endpoint}`);
    return await res.json();
}

async function post(endpoint, data) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await res.json();
}