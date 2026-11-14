import {
    useEffect,
    useState
} from "react";

import AdminSidebar
    from "./AdminSidebar";

import AdminTopbar
    from "./AdminTopbar";


export default function AdminLayout({
    children
}) {

    const [user, setUser] =
        useState(null);


    useEffect(() => {

        const savedUser =
            localStorage.getItem(
                "user"
            );


        if (!savedUser) {
            return;
        }


        try {

            setUser(
                JSON.parse(
                    savedUser
                )
            );

        }
        catch (error) {

            console.error(
                "Failed to parse admin user:",
                error
            );

            localStorage.removeItem(
                "user"
            );

        }

    }, []);


    return (

        <div
            className="
                flex
                min-h-screen
                bg-slate-50
            "
        >

            {/* SIDEBAR */}

            <AdminSidebar />


            {/* MAIN */}

            <div
                className="
                    flex
                    min-w-0
                    flex-1
                    flex-col
                "
            >

                {/* TOPBAR */}

                <AdminTopbar
                    user={user}
                />


                {/* PAGE CONTENT */}

                <main
                    className="
                        flex-1
                        overflow-x-hidden
                    "
                >

                    {children}

                </main>

            </div>

        </div>

    );

}