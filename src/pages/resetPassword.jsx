import { useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import Form from "../components/form";
import { AUTH } from "../API";
import toast from "react-hot-toast";


const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate(); // For navigation after login
    const [fields, setFields] = useState([
        {
            type: "password",
            placeholder: "Enter your password",
            name: "password",
            value: "",
            isRequired: true,
        },
        {
            type: "password",
            placeholder: "Enter confirm password",
            name: "password",
            value: "",
            isRequired: true,
        }

    ])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (token) {
                if (fields[0].value !== fields[1].value) {
                    toast.error("Passwords do not match")
                    return
                }

                fetch(`${AUTH}/verify/reset-password/${token}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ password: fields[0].value })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.err) {
                            toast.error(data.err)
                            throw new Error(data.err);
                        }
                        toast.success(data.message)

                        setFields(
                            fields.map((field, index) => {

                                return { ...field, value: '' }

                            }
                            )
                        )
                        setTimeout(() => {
                            navigate('/login')
                        }, 1500)

                    })
            }
        }
        catch (err) {
            console.log(err)
            toast.error("Error While Resetting Password")

        }



    }


    return (

        <Form text1='Welcome Back!' text2='Reset Your Password' type='resetPassword' fields={fields} setFields={setFields} handleSubmit={handleSubmit} />



    )
}

export default ResetPassword