import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";


export default function CustomerProfile() {

    const navigate =
        useNavigate();

    const [user, setUser] =
        useState(null);


    useEffect(() => {

        const savedUser =
            localStorage.getItem("user");


        if (!savedUser) {

            navigate("/login");

            return;

        }


        try {

            setUser(
                JSON.parse(savedUser)
            );

        }
        catch {

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "token"
            );

            navigate("/login");

        }

    }, []);


    if (!user) {

        return (
            <div>
                Loading profile...
            </div>
        );

    }


    return (

        <div style={styles.page}>

            <div style={styles.container}>

                <button
                    onClick={() =>
                        navigate(
                            "/customer/dashboard"
                        )
                    }
                >
                    ← Dashboard
                </button>


                <div style={styles.card}>

                    <h1>
                        👤 Customer Profile
                    </h1>


                    <div style={styles.row}>
                        <strong>
                            Name
                        </strong>

                        <span>
                            {user.name}
                        </span>
                    </div>


                    <div style={styles.row}>
                        <strong>
                            Email
                        </strong>

                        <span>
                            {user.email}
                        </span>
                    </div>


                    <div style={styles.row}>
                        <strong>
                            Role
                        </strong>

                        <span>
                            {user.role}
                        </span>
                    </div>


                    <div style={styles.row}>
                        <strong>
                            User ID
                        </strong>

                        <span>
                            {user.id}
                        </span>
                    </div>

                </div>

            </div>

        </div>

    );

}


const styles = {

    page: {
        minHeight: "100vh",
        background: "#f4f6f8"
    },

    container: {
        maxWidth: "800px",
        margin: "auto",
        padding: "40px 20px"
    },

    card: {
        marginTop: "20px",
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow:
            "0 3px 12px rgba(0,0,0,0.08)"
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 0",
        borderBottom:
            "1px solid #e5e7eb"
    }

};