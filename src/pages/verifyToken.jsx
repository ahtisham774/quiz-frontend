import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AUTH } from "../API";
import toast from "react-hot-toast";

const VerifyToken = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (token) {
            fetch(`${AUTH}/verify/${token}`)
                .then(res => res.json())
                .then(data => {
                    if (data.isVerified) {
                        setIsVerified(true);
                        toast.success(data.message);
                        setMessage(data.message)
                    } else {
                        toast.error(data.message);
                        setMessage(data.message)
                    }
                })
                .catch(err => {
                    console.log(err);
                    toast.error("Something went wrong");
                })
                .finally(() => setLoading(false));
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen">
            {loading ? (
                <div className="text-4xl text-primary flex items-center">
                    Verifying Email
                    <span className="ml-2 animate-pulse">...</span>
                </div>
            ) : isVerified ? (
                <div className="text-center">
                    <h1 className="text-4xl text-green-600 font-bold mb-4">Congratulations! You are verified.</h1>
                    <Link
                        to="/login"
                        className="py-2 px-6 border-2 border-primary bg-primary text-white text-xl font-bold w-fit"
                    >
                        Login
                    </Link>
                </div>
            ) : (
                <div className="text-center gap-3 flex flex-col items-center justify-center">
                    <div className="text-4xl text-red-600">{message}</div>
                    <Link
                        to="/email-verification"
                        className="py-2 px-6 border-2 border-primary bg-primary text-white text-xl font-bold w-fit"
                    >
                        Send Link
                    </Link>
                </div>

            )}
        </div>
    );
};

export default VerifyToken;
