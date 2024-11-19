import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useState } from "react";
import Form from "../components/form";
import toast from "react-hot-toast";
import { AUTH } from "../API";


const EmailVerify = () => {
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
            fetch(`${AUTH}/verify/create-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: fields[0].value })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.message) {
                        toast.error(data.message)
                        throw new Error(data.message);
                    }
                    toast.success("Verification Link Sent to this email")
               
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
            toast.error("Error While Verification")

        }

    }



    if (user) {
        return <Navigate to={location.state?.from || '/'} replace />;
    }

    return (
        <Form text1='Welcome Back!' text2='Enter Email for verification' type='Verification' fields={fields} setFields={setFields} handleSubmit={handleSubmit} />

    )
}

export default EmailVerify