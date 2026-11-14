import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getCustomerRide
} from "../../api/rideApi";

import {
    createPaymentOrder,
    verifyPayment
} from "../../api/paymentApi";


export default function PaymentPage() {

    const {
        rideId
    } = useParams();


    const navigate =
        useNavigate();


    const [
        ride,
        setRide
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        paying,
        setPaying
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    useEffect(() => {

        const loadRide =
            async () => {

                try {

                    const data =
                        await getCustomerRide(
                            rideId
                        );

                    setRide(data);

                }
                catch (err) {

                    setError(
                        err.message
                    );

                }
                finally {

                    setLoading(
                        false
                    );

                }

            };


        loadRide();

    }, [rideId]);


    const handlePayment =
        async () => {

            try {

                setPaying(true);

                setError("");


                const token =
                    localStorage.getItem(
                        "token"
                    );


                const order =
                    await createPaymentOrder(
                        rideId,
                        token
                    );


                /*
                 * Razorpay frontend integration
                 *
                 * Backend must return:
                 * orderId
                 * amount
                 * currency
                 *
                 */


                if (
                    !window.Razorpay
                ) {

                    throw new Error(
                        "Razorpay SDK not loaded"
                    );

                }


                const options = {

                    key:
                        order.keyId,

                    amount:
                        order.amount,

                    currency:
                        order.currency ||
                        "INR",

                    order_id:
                        order.orderId,


                    name:
                        "SmartRide",


                    description:
                        `Payment for ride ${rideId}`,


                    handler:
                        async (
                            response
                        ) => {

                            try {

                                await verifyPayment(

                                    {

                                        rideId:
                                            rideId,

                                        razorpayOrderId:
                                            response.razorpay_order_id,

                                        razorpayPaymentId:
                                            response.razorpay_payment_id,

                                        razorpaySignature:
                                            response.razorpay_signature

                                    },

                                    token

                                );


                                alert(
                                    "Payment successful"
                                );


                                navigate(
                                    `/customer/rides/${rideId}`
                                );

                            }
                            catch (err) {

                                setError(
                                    err.message
                                );

                            }

                        }

                };


                const razorpay =
                    new window.Razorpay(
                        options
                    );


                razorpay.open();

            }
            catch (err) {

                setError(
                    err.message ||
                    "Payment failed"
                );

            }
            finally {

                setPaying(false);

            }

        };


    if (loading) {

        return (
            <div>
                Loading payment...
            </div>
        );

    }


    if (!ride) {

        return (
            <div>
                Ride not found
            </div>
        );

    }


    return (

        <div>

            <h1>
                💳 Ride Payment
            </h1>


            <p>

                Ride ID:
                {" "}
                {ride.id}

            </p>


            <p>

                Amount:
                {" "}₹
                {ride.estimatedFare}

            </p>


            {error && (

                <p
                    style={{
                        color: "red"
                    }}
                >

                    {error}

                </p>

            )}


            <button

                onClick={
                    handlePayment
                }

                disabled={
                    paying
                }

            >

                {paying
                    ? "Processing..."
                    : `Pay ₹${ride.estimatedFare}`
                }

            </button>

        </div>

    );

}