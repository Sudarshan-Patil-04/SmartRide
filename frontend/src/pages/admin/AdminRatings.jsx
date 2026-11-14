import {
    useEffect,
    useState
} from "react";

import AdminLayout from "../../components/admin/AdminLayout";

import {
    getAllRatings
} from "../../api/adminApi";


export default function AdminRatings() {

    const [ratings, setRatings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD RATINGS
    // ==========================================

    const loadRatings = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getAllRatings();

            setRatings(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (error) {

            console.error(
                "Failed to load ratings:",
                error
            );

            setError(
                error.message ||
                "Failed to load ratings"
            );

        }
        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadRatings();

    }, []);


    // ==========================================
    // AVERAGE RATING
    // ==========================================

    const averageRating =
        ratings.length > 0

            ? (
                ratings.reduce(
                    (
                        total,
                        rating
                    ) =>

                        total +
                        Number(
                            rating.rating || 0
                        ),

                    0
                )
                /
                ratings.length
            ).toFixed(1)

            : "0.0";


    // ==========================================
    // RATING DISTRIBUTION
    // ==========================================

    const getRatingCount = (
        ratingValue
    ) => {

        return ratings.filter(
            rating =>
                Number(
                    rating.rating
                ) === ratingValue
        ).length;

    };


    // ==========================================
    // DATE FORMAT
    // ==========================================

    const formatDate = (
        date
    ) => {

        if (!date) {
            return "Date unavailable";
        }

        try {

            return new Date(
                date
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        }
        catch {

            return "Date unavailable";

        }

    };


    // ==========================================
    // STARS
    // ==========================================

    const renderStars = (
        rating
    ) => {

        const value =
            Number(rating) || 0;

        return (

            <div className="flex items-center gap-0.5">

                {[1, 2, 3, 4, 5].map(
                    star => (

                        <span
                            key={star}
                            className={
                                star <= value
                                    ? "text-yellow-400 text-lg"
                                    : "text-gray-300 text-lg"
                            }
                        >
                            ★
                        </span>

                    )
                )}

            </div>

        );

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <AdminLayout>

                <div className="space-y-6">

                    <div>

                        <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse" />

                        <div className="h-4 w-80 bg-gray-100 rounded mt-3 animate-pulse" />

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div className="h-40 bg-white rounded-2xl border border-gray-100 animate-pulse" />

                        <div className="h-40 bg-white rounded-2xl border border-gray-100 animate-pulse" />

                    </div>


                    <div className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />

                </div>

            </AdminLayout>

        );

    }


    return (

        <AdminLayout>

            <div className="space-y-7">

                {/* ==================================
                    HEADER
                ================================== */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center text-xl">

                                ⭐

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold text-gray-900">

                                    Ratings & Reviews

                                </h1>

                                <p className="text-sm text-gray-500 mt-1">

                                    Monitor customer feedback
                                    and service quality.

                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        onClick={loadRatings}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
                    >

                        ↻ Refresh

                    </button>

                </div>


                {/* ==================================
                    ERROR
                ================================== */}

                {error && (

                    <div className="flex items-center gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">

                        <span className="text-lg">
                            ⚠️
                        </span>

                        <span className="text-sm font-medium">
                            {error}
                        </span>

                    </div>

                )}


                {/* ==================================
                    SUMMARY
                ================================== */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">


                    {/* AVERAGE */}

                    <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

                        <p className="text-sm font-medium text-gray-500">

                            Average Rating

                        </p>


                        <div className="flex items-end gap-3 mt-3">

                            <h2 className="text-5xl font-bold text-gray-900">

                                {averageRating}

                            </h2>


                            <div className="pb-1">

                                {renderStars(
                                    Math.round(
                                        Number(
                                            averageRating
                                        )
                                    )
                                )}

                                <p className="text-xs text-gray-400 mt-1">

                                    Based on {ratings.length}
                                    {" "}
                                    reviews

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* TOTAL REVIEWS */}

                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

                        <p className="text-sm font-medium text-gray-500">

                            Total Reviews

                        </p>


                        <div className="flex items-center gap-4 mt-4">

                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl">

                                💬

                            </div>


                            <div>

                                <h2 className="text-3xl font-bold text-gray-900">

                                    {ratings.length}

                                </h2>

                                <p className="text-xs text-gray-400">

                                    Customer feedback

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* RATING DISTRIBUTION */}

                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

                        <p className="text-sm font-medium text-gray-500 mb-3">

                            Rating Distribution

                        </p>


                        <div className="space-y-2">

                            {[5, 4, 3, 2, 1].map(
                                value => {

                                    const count =
                                        getRatingCount(
                                            value
                                        );

                                    const percentage =
                                        ratings.length > 0
                                            ? (
                                                count /
                                                ratings.length
                                            ) * 100
                                            : 0;


                                    return (

                                        <div
                                            key={value}
                                            className="flex items-center gap-2"
                                        >

                                            <span className="w-8 text-xs text-gray-500">

                                                {value}★

                                            </span>


                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">

                                                <div
                                                    className="h-full bg-yellow-400 rounded-full transition-all"
                                                    style={{
                                                        width:
                                                            `${percentage}%`
                                                    }}
                                                />

                                            </div>


                                            <span className="w-6 text-right text-xs text-gray-400">

                                                {count}

                                            </span>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    </div>

                </div>


                {/* ==================================
                    REVIEWS HEADER
                ================================== */}

                <div>

                    <div className="flex items-center justify-between mb-4">

                        <div>

                            <h2 className="text-lg font-bold text-gray-900">

                                Customer Reviews

                            </h2>

                            <p className="text-sm text-gray-500">

                                Recent feedback from
                                SmartRide customers.

                            </p>

                        </div>

                    </div>


                    {/* ==================================
                        EMPTY STATE
                    ================================== */}

                    {ratings.length === 0 && (

                        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">

                            <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">

                                ⭐

                            </div>


                            <h3 className="mt-5 text-lg font-semibold text-gray-900">

                                No reviews yet

                            </h3>


                            <p className="text-sm text-gray-500 mt-2">

                                Customer reviews will
                                appear here once they
                                start rating rides.

                            </p>

                        </div>

                    )}


                    {/* ==================================
                        REVIEWS GRID
                    ================================== */}

                    {ratings.length > 0 && (

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                            {ratings.map(
                                (
                                    rating,
                                    index
                                ) => (

                                    <div
                                        key={
                                            rating.id ||
                                            rating._id ||
                                            index
                                        }
                                        className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition"
                                    >

                                        {/* TOP */}

                                        <div className="flex items-start justify-between gap-3">

                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm">

                                                    {
                                                        (
                                                            rating.customerName ||
                                                            rating.userName ||
                                                            "C"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()
                                                    }

                                                </div>


                                                <div>

                                                    <p className="text-sm font-semibold text-gray-900">

                                                        {
                                                            rating.customerName ||
                                                            rating.userName ||
                                                            "Customer"
                                                        }

                                                    </p>

                                                    <p className="text-xs text-gray-400">

                                                        {
                                                            formatDate(
                                                                rating.createdAt
                                                            )
                                                        }

                                                    </p>

                                                </div>

                                            </div>


                                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-50 text-gray-500">

                                                Review #{index + 1}

                                            </span>

                                        </div>


                                        {/* RATING */}

                                        <div className="mt-4 flex items-center gap-2">

                                            {renderStars(
                                                rating.rating
                                            )}

                                            <span className="text-sm font-semibold text-gray-700">

                                                {
                                                    Number(
                                                        rating.rating ||
                                                        0
                                                    ).toFixed(1)
                                                }

                                            </span>

                                        </div>


                                        {/* COMMENT */}

                                        <div className="mt-4">

                                            <p className="text-sm leading-6 text-gray-600">

                                                "
                                                {
                                                    rating.comment ||
                                                    "No comment provided."
                                                }
                                                "

                                            </p>

                                        </div>


                                        {/* FOOTER */}

                                        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">

                                            <span className="text-xs text-gray-400">

                                                Customer feedback

                                            </span>


                                            <span className="text-yellow-400">

                                                ★

                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </AdminLayout>

    );

}