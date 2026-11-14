import React, {
    useEffect,
    useState
} from "react";

import AdminLayout from "../../components/admin/AdminLayout";

import {
    getAllDrivers,
    getPendingDrivers,
    verifyDriver,
    rejectDriver,
    deleteDriver
} from "../../api/adminApi";


// ==========================================
// ADMIN DRIVERS
// ==========================================

export default function AdminDrivers() {

    const [drivers, setDrivers] =
        useState([]);

    const [pendingDrivers, setPendingDrivers] =
        useState([]);

    const [activeTab, setActiveTab] =
        useState("all");

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(null);


    // ==========================================
    // LOAD DRIVERS
    // ==========================================

    const loadDrivers = async () => {

        try {

            setLoading(true);
            setError("");

            const allDrivers =
                await getAllDrivers();

            const pending =
                await getPendingDrivers();

            setDrivers(
                Array.isArray(allDrivers)
                    ? allDrivers
                    : []
            );

            setPendingDrivers(
                Array.isArray(pending)
                    ? pending
                    : []
            );

        }
        catch (err) {

            console.error(
                "Failed to load drivers:",
                err
            );

            setError(
                err.message ||
                "Failed to load drivers"
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadDrivers();

    }, []);


    // ==========================================
    // VERIFY
    // ==========================================

    const handleVerify = async (
        driverId
    ) => {

        try {

            setActionLoading(driverId);
            setError("");

            await verifyDriver(driverId);

            await loadDrivers();

        }
        catch (err) {

            setError(
                err.message ||
                "Failed to verify driver"
            );

        }
        finally {

            setActionLoading(null);

        }

    };


    // ==========================================
    // REJECT
    // ==========================================

    const handleReject = async (
        driverId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to reject this driver?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(driverId);
            setError("");

            await rejectDriver(driverId);

            await loadDrivers();

        }
        catch (err) {

            setError(
                err.message ||
                "Failed to reject driver"
            );

        }
        finally {

            setActionLoading(null);

        }

    };


    // ==========================================
    // DELETE DRIVER
    // ==========================================

    const handleDelete = async (
        driverId
    ) => {

        const confirmed =
            window.confirm(
                "Remove this driver permanently?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(driverId);
            setError("");

            await deleteDriver(driverId);

            await loadDrivers();

        }
        catch (err) {

            setError(
                err.message ||
                "Failed to remove driver"
            );

        }
        finally {

            setActionLoading(null);

        }

    };


    // ==========================================
    // DISPLAY LIST
    // ==========================================

    const sourceDrivers =
        activeTab === "pending"
            ? pendingDrivers
            : drivers;


    // ==========================================
    // SEARCH
    // ==========================================

    const filteredDrivers =
        sourceDrivers.filter(
            driver => {

                const value =
                    search
                        .toLowerCase()
                        .trim();

                return (

                    driver.name
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    driver.email
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    driver.phone
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    driver.id
                        ?.toLowerCase()
                        .includes(value)

                );

            }
        );


    // ==========================================
    // STATISTICS
    // ==========================================

    const verifiedCount =
        drivers.filter(
            driver =>
                driver.status === "VERIFIED"
        ).length;


    const onlineCount =
        drivers.filter(
            driver =>
                driver.online ||
                driver.isOnline
        ).length;


    // ==========================================
    // UI
    // ==========================================

    return (

        <AdminLayout>

            <div className="min-h-full bg-slate-50 p-6 lg:p-8">


                {/* ================================== */}
                {/* HEADER */}
                {/* ================================== */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-slate-900">

                        Driver Management

                    </h1>

                    <p className="mt-1 text-slate-500">

                        Manage and verify SmartRide drivers.

                    </p>

                </div>


                {/* ================================== */}
                {/* ERROR */}
                {/* ================================== */}

                {error && (

                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                        ❌ {error}

                    </div>

                )}


                {/* ================================== */}
                {/* STATISTICS */}
                {/* ================================== */}

                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">


                    {/* TOTAL */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <p className="text-sm font-medium text-slate-500">

                            Total Drivers

                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900">

                            {drivers.length}

                        </h2>

                        <p className="mt-2 text-xs text-slate-400">

                            All registered drivers

                        </p>

                    </div>


                    {/* PENDING */}

                    <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">

                        <p className="text-sm font-medium text-amber-600">

                            Pending Verification

                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900">

                            {pendingDrivers.length}

                        </h2>

                        <p className="mt-2 text-xs text-slate-400">

                            Require admin action

                        </p>

                    </div>


                    {/* VERIFIED */}

                    <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">

                        <p className="text-sm font-medium text-emerald-600">

                            Verified Drivers

                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900">

                            {verifiedCount}

                        </h2>

                        <p className="mt-2 text-xs text-slate-400">

                            Approved drivers

                        </p>

                    </div>


                    {/* ONLINE */}

                    <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">

                        <p className="text-sm font-medium text-blue-600">

                            Online Now

                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900">

                            {onlineCount}

                        </h2>

                        <p className="mt-2 text-xs text-slate-400">

                            Currently available

                        </p>

                    </div>

                </div>


                {/* ================================== */}
                {/* TABLE CARD */}
                {/* ================================== */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


                    {/* TOOLBAR */}

                    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">


                        {/* TABS */}

                        <div className="flex rounded-xl bg-slate-100 p-1">

                            <button
                                onClick={() =>
                                    setActiveTab("all")
                                }
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    activeTab === "all"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-900"
                                }`}
                            >

                                All Drivers ({drivers.length})

                            </button>


                            <button
                                onClick={() =>
                                    setActiveTab("pending")
                                }
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    activeTab === "pending"
                                        ? "bg-white text-amber-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-900"
                                }`}
                            >

                                Pending ({pendingDrivers.length})

                            </button>

                        </div>


                        {/* SEARCH */}

                        <input
                            type="text"
                            value={search}
                            onChange={
                                e =>
                                    setSearch(
                                        e.target.value
                                    )
                            }
                            placeholder="Search driver..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 lg:w-80"
                        />

                    </div>


                    {/* ================================== */}
                    {/* LOADING */}
                    {/* ================================== */}

                    {loading ? (

                        <div className="flex min-h-64 items-center justify-center">

                            <div className="text-center">

                                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                                <p className="text-sm text-slate-500">

                                    Loading drivers...

                                </p>

                            </div>

                        </div>

                    ) : filteredDrivers.length === 0 ? (

                        /* ================================== */
                        /* EMPTY */
                        /* ================================== */

                        <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">

                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">

                                🚗

                            </div>

                            <h3 className="text-lg font-semibold text-slate-900">

                                No drivers found

                            </h3>

                            <p className="mt-1 text-sm text-slate-500">

                                No drivers match your current search or filter.

                            </p>

                        </div>

                    ) : (

                        /* ================================== */
                        /* TABLE */
                        /* ================================== */

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[900px] text-left">


                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">

                                            Driver

                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">

                                            Contact

                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">

                                            Status

                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">

                                            Availability

                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">

                                            Action

                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">


                                    {filteredDrivers.map(
                                        driver => {

                                            const driverId =
                                                driver.id ||
                                                driver._id;

                                            const status =
                                                driver.status ||
                                                "UNKNOWN";

                                            const isPending =
                                                status
                                                    .toUpperCase() ===
                                                "PENDING";

                                            const isOnline =
                                                driver.online ||
                                                driver.isOnline;

                                            const isProcessing =
                                                actionLoading ===
                                                driverId;


                                            return (

                                                <tr
                                                    key={driverId}
                                                    className="transition hover:bg-slate-50"
                                                >


                                                    {/* DRIVER */}

                                                    <td className="px-6 py-5">

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">

                                                                {
                                                                    driver.name
                                                                        ?.charAt(0)
                                                                        ?.toUpperCase() ||
                                                                    "D"
                                                                }

                                                            </div>


                                                            <div>

                                                                <p className="font-semibold text-slate-900">

                                                                    {
                                                                        driver.name ||
                                                                        "N/A"
                                                                    }

                                                                </p>

                                                                <p className="text-xs text-slate-400">

                                                                    Driver ID:{" "}

                                                                    {driverId}

                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* CONTACT */}

                                                    <td className="px-6 py-5">

                                                        <p className="text-sm text-slate-700">

                                                            {
                                                                driver.email ||
                                                                "N/A"
                                                            }

                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">

                                                            {
                                                                driver.phone ||
                                                                "N/A"
                                                            }

                                                        </p>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td className="px-6 py-5">

                                                        <span
                                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                                status ===
                                                                "VERIFIED"
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : status ===
                                                                      "REJECTED"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-amber-100 text-amber-700"
                                                            }`}
                                                        >

                                                            {status ===
                                                            "VERIFIED"
                                                                ? "✓ Verified"
                                                                : status ===
                                                                  "REJECTED"
                                                                ? "✕ Rejected"
                                                                : "⏳ Pending"}

                                                        </span>

                                                    </td>


                                                    {/* ONLINE */}

                                                    <td className="px-6 py-5">

                                                        {isOnline ? (

                                                            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">

                                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                                                                Online

                                                            </span>

                                                        ) : (

                                                            <span className="inline-flex items-center gap-2 text-sm text-slate-400">

                                                                <span className="h-2 w-2 rounded-full bg-slate-300" />

                                                                Offline

                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* ACTION */}

                                                    <td className="px-6 py-5 text-right">

                                                        <div className="flex justify-end gap-2">


                                                            {isPending ? (

                                                                <>

                                                                    <button
                                                                        disabled={
                                                                            isProcessing
                                                                        }
                                                                        onClick={() =>
                                                                            handleVerify(
                                                                                driverId
                                                                            )
                                                                        }
                                                                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                                    >

                                                                        {isProcessing
                                                                            ? "Processing..."
                                                                            : "✓ Verify"}

                                                                    </button>


                                                                    <button
                                                                        disabled={
                                                                            isProcessing
                                                                        }
                                                                        onClick={() =>
                                                                            handleReject(
                                                                                driverId
                                                                            )
                                                                        }
                                                                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                                                                    >

                                                                        Reject

                                                                    </button>

                                                                </>

                                                            ) : (

                                                                <button
                                                                    disabled={
                                                                        isProcessing
                                                                    }
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            driverId
                                                                        )
                                                                    }
                                                                    className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                                                                >

                                                                    Remove

                                                                </button>

                                                            )}

                                                        </div>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </AdminLayout>

    );

}