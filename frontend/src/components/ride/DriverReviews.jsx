import { useEffect, useState } from "react";

import {
    getDriverRatings
} from "../../api/ratingApi";


export default function DriverReviews({
    driverId
}) {

    const [ratings, setRatings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadRatings = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getDriverRatings(
                        driverId
                    );

                setRatings(
                    data || []
                );

            } catch (err) {

                setError(
                    err.message ||
                    "Unable to load reviews"
                );

            } finally {

                setLoading(false);

            }

        };


        if (driverId) {

            loadRatings();

        }

    }, [driverId]);


    if (loading) {

        return (
            <p>
                Loading reviews...
            </p>
        );

    }


    if (error) {

        return (
            <p>
                {error}
            </p>
        );

    }


    if (ratings.length === 0) {

        return (
            <div>

                <h3>
                    Ratings & Reviews
                </h3>

                <p>
                    No reviews yet.
                </p>

            </div>
        );

    }


    return (

        <div>

            <h3>
                Ratings & Reviews
            </h3>


            {ratings.map(
                (rating) => (

                    <div
                        key={rating.id}
                        style={{
                            border:
                                "1px solid #ddd",

                            padding:
                                "15px",

                            marginBottom:
                                "10px"
                        }}
                    >

                        <div>

                            <strong>
                                {"★".repeat(
                                    rating.rating
                                )}
                            </strong>

                        </div>


                        {rating.comment && (

                            <p>
                                {rating.comment}
                            </p>

                        )}


                        <small>

                            {rating.createdAt
                                ? new Date(
                                    rating.createdAt
                                ).toLocaleString()
                                : ""}

                        </small>

                    </div>

                )
            )}

        </div>

    );

}