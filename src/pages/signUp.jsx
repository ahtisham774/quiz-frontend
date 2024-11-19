import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Form from "../components/form"
import toast from "react-hot-toast"
import { AUTH } from "../API"

const SignUp = () => {
    const [fields, setFields] = useState([
        {
            type: "text",
            placeholder: "Enter first name",
            name: "firstName",
            value: "",
        },
        {
            type: "text",
            placeholder: "Enter second name",
            name: "lastName",
            value: "",
        },
        {
            type: "email",
            placeholder: "Enter your email address",
            name: "email",
            value: "",
            isRequired: true,
        },
        {
            type: "password",
            placeholder: "Enter your password",
            name: "password",
            value: "",
            isRequired: true,
        },
    ])

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Prepare data from fields
        const data = fields.reduce((acc, field) => {
            acc[field.name] = field.value
            return acc
        }, {})

        try {
            const response = await fetch(`${AUTH}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const res = await response.json()
                toast.success(res.message)
                // setTimeout(() => {
                //     navigate("/login")
                // }, 1500)
            } else if (response.status === 409) {
                toast.error("User already exists")
            } else {
                const errorData = await response.json()
                toast.error(errorData.message || "An error occurred during registration")
            }
        } catch (error) {
            toast.error("An error occurred during registration")
        }
    }

    return (
        <Form
            text1="Register Now"
            text2="Create your account"
            type="signup"
            fields={fields}
            setFields={setFields}
            handleSubmit={handleSubmit}
        />
    )
}

export default SignUp
