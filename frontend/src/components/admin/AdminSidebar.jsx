import {
    NavLink
} from "react-router-dom";

import {
    LayoutDashboard,
    CarFront,
    Users,
    MapPin,
    Star,
    BarChart3,
    ShieldCheck
} from "lucide-react";


export default function AdminSidebar() {

    const menu = [

        {
            path:
                "/admin/dashboard",

            icon:
                LayoutDashboard,

            label:
                "Dashboard"
        },

        {
            path:
                "/admin/drivers",

            icon:
                CarFront,

            label:
                "Drivers"
        },

        {
            path:
                "/admin/customers",

            icon:
                Users,

            label:
                "Customers"
        },

        {
            path:
                "/admin/rides",

            icon:
                MapPin,

            label:
                "Rides"
        },

        {
            path:
                "/admin/ratings",

            icon:
                Star,

            label:
                "Ratings"
        },

        {
            path:
                "/admin/analytics",

            icon:
                BarChart3,

            label:
                "Analytics"
        }

    ];


    return (

        <aside
            className="
                hidden
                w-64
                shrink-0
                flex-col
                border-r
                border-slate-200
                bg-white
                lg:flex
            "
        >

            {/* ================================== */}
            {/* BRAND */}
            {/* ================================== */}

            <div
                className="
                    flex
                    h-20
                    items-center
                    gap-3
                    border-b
                    border-slate-200
                    px-6
                "
            >

                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-600
                        text-white
                        shadow-sm
                    "
                >

                    <CarFront
                        size={23}
                    />

                </div>


                <div>

                    <h2
                        className="
                            text-lg
                            font-bold
                            tracking-tight
                            text-slate-900
                        "
                    >

                        SmartRide

                    </h2>


                    <p
                        className="
                            text-[9px]
                            font-bold
                            tracking-[0.18em]
                            text-slate-400
                        "
                    >

                        ADMIN PANEL

                    </p>

                </div>

            </div>


            {/* ================================== */}
            {/* MENU */}
            {/* ================================== */}

            <nav
                className="
                    flex-1
                    overflow-y-auto
                    px-4
                    py-6
                "
            >

                <p
                    className="
                        mb-3
                        px-3
                        text-[10px]
                        font-bold
                        tracking-[0.15em]
                        text-slate-400
                    "
                >

                    MAIN MENU

                </p>


                <div className="space-y-1">

                    {menu.map(
                        item => {

                            const Icon =
                                item.icon;


                            return (

                                <NavLink
                                    key={
                                        item.path
                                    }
                                    to={
                                        item.path
                                    }
                                    className={({
                                        isActive
                                    }) =>
                                        `
                                        group
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        px-3
                                        py-3
                                        text-sm
                                        font-medium
                                        transition-all
                                        ${
                                            isActive
                                                ? `
                                                    bg-blue-50
                                                    text-blue-700
                                                `
                                                : `
                                                    text-slate-500
                                                    hover:bg-slate-50
                                                    hover:text-slate-900
                                                `
                                        }
                                        `
                                    }
                                >

                                    {({
                                        isActive
                                    }) => (

                                        <>

                                            <span
                                                className={`
                                                    flex
                                                    h-9
                                                    w-9
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    transition
                                                    ${
                                                        isActive
                                                            ? "bg-blue-600 text-white shadow-sm"
                                                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                                    }
                                                `}
                                            >

                                                <Icon
                                                    size={18}
                                                />

                                            </span>


                                            <span>

                                                {item.label}

                                            </span>


                                            {isActive && (

                                                <span
                                                    className="
                                                        ml-auto
                                                        h-1.5
                                                        w-1.5
                                                        rounded-full
                                                        bg-blue-600
                                                    "
                                                />

                                            )}

                                        </>

                                    )}

                                </NavLink>

                            );

                        }
                    )}

                </div>

            </nav>


            {/* ================================== */}
            {/* FOOTER */}
            {/* ================================== */}

            <div
                className="
                    border-t
                    border-slate-200
                    p-4
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        bg-slate-50
                        px-3
                        py-3
                    "
                >

                    <div
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-emerald-100
                            text-emerald-600
                        "
                    >

                        <ShieldCheck
                            size={17}
                        />

                    </div>


                    <div>

                        <p
                            className="
                                text-xs
                                font-semibold
                                text-slate-700
                            "
                        >

                            System Online

                        </p>

                        <p
                            className="
                                text-[10px]
                                text-slate-400
                            "
                        >

                            All services operational

                        </p>

                    </div>

                </div>

            </div>

        </aside>

    );

}