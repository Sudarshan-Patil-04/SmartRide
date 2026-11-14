import {
    ArrowUpRight
} from "lucide-react";


export default function StatCard({
    icon,
    title,
    value,
    subtitle,
    onClick
}) {

    const clickable =
        Boolean(onClick);


    return (

        <div
            onClick={
                onClick
            }
            className={`
                group
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-all
                ${
                    clickable
                        ? `
                            cursor-pointer
                            hover:-translate-y-0.5
                            hover:border-blue-200
                            hover:shadow-md
                        `
                        : ""
                }
            `}
        >

            {/* ================================== */}
            {/* TOP */}
            {/* ================================== */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                "
            >

                {/* ICON */}

                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-xl
                    "
                >

                    {icon}

                </div>


                {/* ACTION */}

                {clickable && (

                    <div
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-300
                            transition
                            group-hover:bg-blue-50
                            group-hover:text-blue-600
                        "
                    >

                        <ArrowUpRight
                            size={17}
                        />

                    </div>

                )}

            </div>


            {/* ================================== */}
            {/* VALUE */}
            {/* ================================== */}

            <div className="mt-5">

                <h2
                    className="
                        text-3xl
                        font-bold
                        tracking-tight
                        text-slate-900
                    "
                >

                    {value}

                </h2>


                <p
                    className="
                        mt-1
                        text-sm
                        font-semibold
                        text-slate-700
                    "
                >

                    {title}

                </p>


                {subtitle && (

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-400
                        "
                    >

                        {subtitle}

                    </p>

                )}

            </div>

        </div>

    );

}