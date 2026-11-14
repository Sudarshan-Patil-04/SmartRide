import { useState } from "react";
import { createRating } from "../../api/ratingApi";


export default function RatingModal({
    rideId,
    onClose,
    onSuccess
}) {

    const [rating, setRating] = useState(0);

    const [comment, setComment] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        if (rating < 1 || rating > 5) {

            setError(
                "Please select a rating"
            );

            return;
        }


        try {

            setLoading(true);


            const result =
                await createRating(
                    rideId,
                    rating,
                    comment
                );


            if (onSuccess) {
                onSuccess(result);
            }


            if (onClose) {
                onClose();
            }

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                "Unable to submit rating"
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="rating-modal-overlay">

            <div className="rating-modal">

                <h2>
                    Rate Your Ride
                </h2>


                <p>
                    How was your experience?
                </p>


                <div className="rating-stars">

                    {[1, 2, 3, 4, 5].map(
                        (star) => (

                            <button
                                key={star}
                                type="button"
                                onClick={() =>
                                    setRating(star)
                                }
                                className={
                                    star <= rating
                                        ? "star active"
                                        : "star"
                                }
                            >
                                ★
                            </button>

                        )
                    )}

                </div>


                <textarea
                    value={comment}
                    onChange={(e) =>
                        setComment(
                            e.target.value
                        )
                    }
                    placeholder="Write a review..."
                    rows="4"
                />


                {error && (

                    <p className="rating-error">
                        {error}
                    </p>

                )}


                <div className="rating-actions">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? "Submitting..."
                            : "Submit Rating"
                        }
                    </button>

                </div>

            </div>

        </div>
    );
}