import { useNavigate } from "react-router-dom";


function UserProfile() {

    const navigate =
        useNavigate();


    const role =
        localStorage.getItem("role");


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");

    };


    return (

        <div>

            <h1>
                My Profile
            </h1>


            <p>

                Role:

                {" "}

                {role}

            </p>


            <button
                onClick={() =>
                    navigate(-1)
                }
            >
                Back
            </button>


            <button
                onClick={handleLogout}
            >
                Logout
            </button>

        </div>

    );

}


export default UserProfile;