const API_BASE_URL =
    "http://localhost:8080";


// ==========================================
// GENERIC API REQUEST
// ==========================================

export async function apiRequest(
    endpoint,
    options = {}
) {

    const token =
        localStorage.getItem("token");


    const headers = {

        "Content-Type":
            "application/json",

        ...(options.headers || {})

    };


    if (token) {

        headers.Authorization =
            `Bearer ${token}`;

    }


    const response =
        await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );


    const text =
        await response.text();


    let data = null;


    if (text) {

        try {

            data =
                JSON.parse(text);

        }
        catch {

            data = text;

        }

    }


    if (!response.ok) {

        let message =
            "Something went wrong";


        if (
            typeof data === "object" &&
            data !== null
        ) {

            message =
                data.message ||
                data.error ||
                message;

        }
        else if (
            typeof data === "string"
        ) {

            message = data;

        }


        throw new Error(
            message
        );

    }


    return data;

}