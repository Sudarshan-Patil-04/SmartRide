import {
    useNavigate
} from "react-router-dom";

import {
    LogOut,
    CircleCheck
} from "lucide-react";


export default function AdminTopbar({
    user
}) {

    const navigate =
        useNavigate();


    const handleLogout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "driver"
        );

        navigate(
            "/login"
        );

    };


    const adminName =
        user?.name ||
        "Administrator";


    const avatar =
        adminName
            .charAt(0)
            .toUpperCase();


    return (

        <header
            className="
                sticky
                top-0
                z-30
                flex
                h-20
                items-center
                justify-between
                border-b
                border-slate-200
                bg-white/95
                px-6
                backdrop-blur
                lg:px-8
            "
        >

            {/* ================================== */}
            {/* SYSTEM STATUS */}
            {/* ================================== */}

            <div className="flex items-center gap-3">

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-emerald-200
                        bg-emerald-50
                        px-3
                        py-1.5
                    "
                >

                    <span className="relative flex h-2.5 w-2.5">

                        <span
                            className="
                                absolute
                                inline-flex
                                h-full
                                w-full
                                animate-ping
                                rounded-full
                                bg-emerald-400
                                opacity-60
                            "
                        />

                        <span
                            className="
                                relative
                                inline-flex
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-emerald-500
                            "
                        />

                    </span>


                    <span
                        className="
                            text-xs
                            font-semibold
                            text-emerald-700
                        "
                    >

                        System Operational

                    </span>

                </div>

            </div>


            {/* ================================== */}
            {/* RIGHT */}
            {/* ================================== */}

            <div className="flex items-center gap-4">


                {/* USER */}
                <div
                    className="
                        hidden
                        items-center
                        gap-3
                        sm:flex
                    "
                >

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-100
                            font-bold
                            text-blue-700
                        "
                    >

                        {avatar}

                    </div>


                    <div className="leading-tight">

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-slate-900
                            "
                        >

                            {adminName}

                        </p>


                        <div
                            className="
                                mt-1
                                flex
                                items-center
                                gap-1
                            "
                        >

                            <CircleCheck
                                size={12}
                                className="text-blue-600"
                            />

                            <span
                                className="
                                    text-[10px]
                                    font-bold
                                    tracking-wider
                                    text-slate-400
                                "
                            >

                                ADMINISTRATOR

                            </span>

                        </div>

                    </div>

                </div>


                {/* DIVIDER */}

                <div
                    className="
                        hidden
                        h-8
                        w-px
                        bg-slate-200
                        sm:block
                    "
                />


                {/* LOGOUT */}

                <button
                    onClick={
                        handleLogout
                    }
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-slate-600
                        transition
                        hover:border-red-200
                        hover:bg-red-50
                        hover:text-red-600
                    "
                >

                    <LogOut
                        size={16}
                    />

                    <span className="hidden sm:inline">

                        Logout

                    </span>

                </button>

            </div>

        </header>

    );

}