const API_URL =
    "http://localhost:8080/api/auth";


// ==========================================
// REGISTER
// ==========================================

export async function registerUser(
    registerData
) {

    const response =
        await fetch(
            `${API_URL}/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        registerData
                    )
            }
        );


    const text =
        await response.text();


    console.log(
        "Register Status:",
        response.status
    );


    console.log(
        "Register Response:",
        text
    );


    let data = {};


    if (text) {

        try {

            data =
                JSON.parse(text);

        } catch (error) {

            throw new Error(
                text
            );
        }
    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            data.error ||
            "Registration failed"
        );
    }


    return data;
}


// ==========================================
// LOGIN
// ==========================================

export async function loginUser(
    loginData
) {

    const response =
        await fetch(
            `${API_URL}/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        loginData
                    )
            }
        );


    const text =
        await response.text();


    console.log(
        "Login Status:",
        response.status
    );


    console.log(
        "Login Response:",
        text
    );


    let data = {};


    if (text) {

        try {

            data =
                JSON.parse(text);

        } catch (error) {

            throw new Error(
                text
            );
        }
    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            data.error ||
            "Login failed"
        );
    }


    return data;
}