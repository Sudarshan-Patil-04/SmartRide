import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    Search,
    Users,
    Eye,
    Trash2,
    RefreshCw,
    UserRound,
    Mail,
    Phone,
    AlertCircle
} from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";

import {
    getAllCustomers,
    deleteCustomer
} from "../../api/adminApi";


export default function AdminCustomers() {

    const navigate =
        useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [customers, setCustomers] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD CUSTOMERS
    // =====================================================

    const loadCustomers =
        async () => {

            try {

                setLoading(true);

                setError("");


                const data =
                    await getAllCustomers();


                setCustomers(
                    Array.isArray(data)
                        ? data
                        : []
                );

            }
            catch (error) {

                console.error(
                    "Failed to load customers:",
                    error
                );


                setError(
                    error?.message ||
                    "Unable to load customers."
                );

            }
            finally {

                setLoading(false);

            }

        };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(
        () => {

            loadCustomers();

        },
        []
    );


    // =====================================================
    // DELETE CUSTOMER
    // =====================================================

    const handleDelete =
        async (
            customerId
        ) => {

            const confirmed =
                window.confirm(
                    "Remove this customer?"
                );


            if (!confirmed) {

                return;

            }


            try {

                await deleteCustomer(
                    customerId
                );


                await loadCustomers();

            }
            catch (error) {

                console.error(
                    "Failed to delete customer:",
                    error
                );


                alert(
                    error?.message ||
                    "Unable to remove customer."
                );

            }

        };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredCustomers =
        customers.filter(
            customer => {

                const value =
                    search
                        .toLowerCase()
                        .trim();


                return (

                    customer.name
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    customer.email
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    customer.phone
                        ?.toLowerCase()
                        .includes(value)

                );

            }
        );


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <AdminLayout>

            <div className="
                min-h-full
                bg-slate-100
                p-4
                sm:p-6
                lg:p-8
            ">


                {/* ================================================= */}
                {/* PAGE HEADER */}
                {/* ================================================= */}

                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-4
                    mb-8
                ">

                    <div>

                        <div className="
                            flex
                            items-center
                            gap-3
                            mb-2
                        ">

                            <div className="
                                w-11
                                h-11
                                rounded-xl
                                bg-purple-100
                                text-purple-600
                                flex
                                items-center
                                justify-center
                            ">

                                <Users
                                    size={24}
                                />

                            </div>


                            <div>

                                <h1 className="
                                    text-2xl
                                    sm:text-3xl
                                    font-bold
                                    text-slate-800
                                ">

                                    Customers

                                </h1>

                            </div>

                        </div>


                        <p className="
                            text-sm
                            text-slate-500
                            ml-0
                            sm:ml-14
                        ">

                            Manage and monitor
                            SmartRide customers.

                        </p>

                    </div>


                    {/* CUSTOMER COUNT */}

                    <div className="
                        bg-white
                        border
                        border-slate-200
                        rounded-xl
                        px-5
                        py-3
                        shadow-sm
                    ">

                        <p className="
                            text-xs
                            font-medium
                            text-slate-500
                        ">

                            Total Customers

                        </p>


                        <p className="
                            text-xl
                            font-bold
                            text-slate-800
                            mt-1
                        ">

                            {customers.length}

                        </p>

                    </div>

                </div>


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {error && (

                    <div className="
                        mb-6
                        bg-red-50
                        border
                        border-red-200
                        rounded-xl
                        p-4
                        flex
                        items-start
                        gap-3
                    ">

                        <AlertCircle
                            size={20}
                            className="
                                text-red-600
                                shrink-0
                                mt-0.5
                            "
                        />


                        <div>

                            <p className="
                                font-semibold
                                text-red-700
                            ">

                                Unable to load customers

                            </p>


                            <p className="
                                text-sm
                                text-red-600
                                mt-1
                            ">

                                {error}

                            </p>

                        </div>

                    </div>

                )}


                {/* ================================================= */}
                {/* MAIN CARD */}
                {/* ================================================= */}

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    shadow-sm
                    overflow-hidden
                ">


                    {/* ================================================= */}
                    {/* TOOLBAR */}
                    {/* ================================================= */}

                    <div className="
                        p-4
                        sm:p-5
                        border-b
                        border-slate-200
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-4
                    ">


                        {/* SEARCH */}

                        <div className="
                            relative
                            w-full
                            sm:max-w-md
                        ">

                            <Search
                                size={18}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />


                            <input
                                type="text"
                                placeholder="Search customer..."
                                value={search}
                                onChange={
                                    e =>
                                        setSearch(
                                            e.target.value
                                        )
                                }
                                className="
                                    w-full
                                    pl-10
                                    pr-4
                                    py-2.5
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    text-sm
                                    text-slate-700
                                    placeholder:text-slate-400
                                    outline-none
                                    focus:border-purple-400
                                    focus:ring-2
                                    focus:ring-purple-100
                                    transition
                                "
                            />

                        </div>


                        {/* REFRESH */}

                        <button
                            onClick={
                                loadCustomers
                            }
                            disabled={
                                loading
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-4
                                py-2.5
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                text-sm
                                font-medium
                                text-slate-700
                                hover:bg-slate-50
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >

                            <RefreshCw
                                size={17}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh

                        </button>

                    </div>


                    {/* ================================================= */}
                    {/* LOADING */}
                    {/* ================================================= */}

                    {loading ? (

                        <div className="
                            min-h-[300px]
                            flex
                            flex-col
                            items-center
                            justify-center
                            text-slate-500
                        ">

                            <RefreshCw
                                size={30}
                                className="
                                    animate-spin
                                    text-purple-600
                                    mb-3
                                "
                            />


                            <p className="
                                text-sm
                                font-medium
                            ">

                                Loading customers...

                            </p>

                        </div>

                    ) : filteredCustomers.length === 0 ? (

                        /* ================================================= */
                        /* EMPTY STATE */
                        /* ================================================= */

                        <div className="
                            min-h-[300px]
                            flex
                            flex-col
                            items-center
                            justify-center
                            px-6
                            text-center
                        ">

                            <div className="
                                w-14
                                h-14
                                rounded-full
                                bg-slate-100
                                text-slate-400
                                flex
                                items-center
                                justify-center
                                mb-4
                            ">

                                <UserRound
                                    size={27}
                                />

                            </div>


                            <h3 className="
                                text-lg
                                font-semibold
                                text-slate-700
                            ">

                                No customers found

                            </h3>


                            <p className="
                                text-sm
                                text-slate-500
                                mt-1
                            ">

                                {search
                                    ? "Try a different search."
                                    : "No customers are registered yet."
                                }

                            </p>

                        </div>

                    ) : (

                        /* ================================================= */
                        /* TABLE */
                        /* ================================================= */

                        <div className="
                            overflow-x-auto
                        ">

                            <table className="
                                w-full
                                min-w-[760px]
                            ">

                                <thead>

                                    <tr className="
                                        bg-slate-50
                                        border-b
                                        border-slate-200
                                    ">

                                        <th className="
                                            px-6
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        ">

                                            Customer

                                        </th>


                                        <th className="
                                            px-6
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        ">

                                            Email

                                        </th>


                                        <th className="
                                            px-6
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        ">

                                            Phone

                                        </th>


                                        <th className="
                                            px-6
                                            py-4
                                            text-right
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        ">

                                            Actions

                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="
                                    divide-y
                                    divide-slate-100
                                ">

                                    {filteredCustomers.map(
                                        customer => (

                                            <tr
                                                key={
                                                    customer.id
                                                }
                                                className="
                                                    hover:bg-slate-50
                                                    transition
                                                "
                                            >


                                                {/* CUSTOMER */}

                                                <td className="
                                                    px-6
                                                    py-4
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    ">

                                                        <div className="
                                                            w-10
                                                            h-10
                                                            rounded-full
                                                            bg-purple-100
                                                            text-purple-700
                                                            flex
                                                            items-center
                                                            justify-center
                                                            font-bold
                                                        ">

                                                            {(
                                                                customer.name ||
                                                                "C"
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}

                                                        </div>


                                                        <div>

                                                            <p className="
                                                                font-semibold
                                                                text-slate-700
                                                            ">

                                                                {
                                                                    customer.name ||
                                                                    "Unknown"
                                                                }

                                                            </p>


                                                            <p className="
                                                                text-xs
                                                                text-slate-400
                                                                mt-0.5
                                                            ">

                                                                Customer

                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* EMAIL */}

                                                <td className="
                                                    px-6
                                                    py-4
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-sm
                                                        text-slate-600
                                                    ">

                                                        <Mail
                                                            size={16}
                                                            className="
                                                                text-slate-400
                                                            "
                                                        />

                                                        {
                                                            customer.email ||
                                                            "N/A"
                                                        }

                                                    </div>

                                                </td>


                                                {/* PHONE */}

                                                <td className="
                                                    px-6
                                                    py-4
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-sm
                                                        text-slate-600
                                                    ">

                                                        <Phone
                                                            size={16}
                                                            className="
                                                                text-slate-400
                                                            "
                                                        />

                                                        {
                                                            customer.phone ||
                                                            "N/A"
                                                        }

                                                    </div>

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="
                                                    px-6
                                                    py-4
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        justify-end
                                                        gap-2
                                                    ">

                                                        {/* VIEW */}

                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/customers/${customer.id}`
                                                                )
                                                            }
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-2
                                                                px-3
                                                                py-2
                                                                rounded-lg
                                                                bg-blue-50
                                                                text-blue-600
                                                                text-sm
                                                                font-medium
                                                                hover:bg-blue-100
                                                                transition
                                                            "
                                                        >

                                                            <Eye
                                                                size={16}
                                                            />

                                                            View

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    customer.id
                                                                )
                                                            }
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-2
                                                                px-3
                                                                py-2
                                                                rounded-lg
                                                                bg-red-50
                                                                text-red-600
                                                                text-sm
                                                                font-medium
                                                                hover:bg-red-100
                                                                transition
                                                            "
                                                        >

                                                            <Trash2
                                                                size={16}
                                                            />

                                                            Remove

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>


                {/* ================================================= */}
                {/* FOOTER INFO */}
                {/* ================================================= */}

                {!loading &&
                    filteredCustomers.length > 0 && (

                        <div className="
                            mt-4
                            text-sm
                            text-slate-500
                        ">

                            Showing{" "}

                            <span className="
                                font-semibold
                                text-slate-700
                            ">

                                {filteredCustomers.length}

                            </span>

                            {" "}of{" "}

                            <span className="
                                font-semibold
                                text-slate-700
                            ">

                                {customers.length}

                            </span>

                            {" "}customers

                        </div>

                    )}

            </div>

        </AdminLayout>

    );

}