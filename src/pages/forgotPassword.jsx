import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { AUTH } from "../API";
import toast from "react-hot-toast";
import {  Navigate } from "react-router-dom";
import Form from "../components/form";

const ForgotPassword = () => {
    const { user } = useAuth();
    const [fields, setFields] = useState([
        {
            type: "email",
            placeholder: "Enter your email address",
            name: "email",
            value: "",
            isRequired: true,
        },
    ])


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Send email verification
            fetch(`${AUTH}/verify/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: fields[0].value })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.err) {
                        toast.error(data.err)
                        throw new Error(data.err);
                    }
                    toast.success("Reset Link Sent to this email")

                    setFields(
                        fields.map((field, index) => {
                            if (index === 0) {
                                return { ...field, value: '' }
                            }
                        }
                        )
                    )

                })
        }
        catch (err) {
            console.log(err)
            toast.error("Error While Resetting Password")

        }

    }



    if (user) {
        return <Navigate to={location.state?.from || '/'} replace />;
    }

    return (
        <Form text1='Welcome Back!' text2='Enter Email to reset password' type='forgotPassword' fields={fields} setFields={setFields} handleSubmit={handleSubmit} />

    )
}

export default ForgotPassword