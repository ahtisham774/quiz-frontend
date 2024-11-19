import  { useState } from 'react'
import Form from '../components/form'
import { useAuth } from '../context/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'


const Login = () => {
    const {login} = useAuth()
    const location = useLocation(); // Get the current location
    const navigate = useNavigate(); // For navigation after login
    const [fields, setFields] = useState([
        {
            type: "email",
            placeholder: "Enter your email address",
            name: "email",
            value: "",
            isRequired:true,
        },
        {
            type: "password",
            placeholder: "Enter your password",
            name: "password",
            value: "",
            isRequired:true,
        }

    ])

    const handleSubmit = async  (e) => {
        e.preventDefault()
        
        await  login(fields[0].value, fields[1].value)
        const redirectPath = location.state?.from || '/dashboard';
        navigate(redirectPath, { replace: true });
    }



    return (

        <Form text1='Welcome Back!' text2='Login to your account' type='login' fields={fields} setFields={setFields}  handleSubmit={handleSubmit} />



    )
}

export default Login