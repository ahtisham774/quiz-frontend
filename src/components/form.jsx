import React from 'react'
import Logo from './logo'
import Field from './field'
import BtnOutline from './btnOutline'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const Form = ({ text1, text2, type, fields, setFields, handleSubmit }) => {

    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate()

    // Redirect if user is already logged in
    if (user) {
        // Redirect to the page they were on before visiting the login page
        return <Navigate to={location.state?.from || '/'} replace />;
    }




    return (
        <div className='grid grid-cols-1 w-full min-h-screen md:grid-cols-2 gap-8 md:gap-0'>
            <div className='w-full h-full p-4 flex flex-col items-center justify-center'>
                <div className='flex w-full items-center flex-col justify-center gap-8'>
                    <Logo />
                    <div className='flex flex-col  justify-center items-center text-[#999999] text-xl font-normal'>
                        <p >{text1}</p>
                        <p >{text2}</p>

                    </div>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full lg:max-w-xl'>
                        {fields.map((field, index) => {
                            return (
                                <Field key={index} type={field.type} isRequired={field.isRequired} value={field.value} onChange={(e) => {
                                    const newFields = [...fields]
                                    newFields[index].value = e.target.value
                                    setFields(newFields)

                                }} placeholder={field.placeholder} />

                            )
                        })}
                        {
                            type === 'login' && <div className='flex justify-between items-center w-full'>
                                <Link to="/forgot-password" className='text-[#999999]'>Forgot Password?</Link>

                                <Link to="/email-verification" className='text-[#999999]'>Verify Email</Link>
                            </div>
                        }

                        {
                            (type == "Verification" || type == "forgotPassword" || type == "resetPassword") &&
                            <button type='submit' className='py-2 px-6 border-2 border-primary bg-primary text-white text-xl font-bold w-fit'>
                                Submit
                            </button>

                        }

                        {
                            (type != "Verification" && type !=  "forgotPassword" && type != "resetPassword") &&

                            <div className='flex items-center gap-5'>
                                <button type='submit' className='py-2 px-6 border-2 border-primary bg-primary text-white text-xl font-bold w-fit'>{
                                    type === 'login' ? 'Login' : 'Signup'
                                }</button>
                                <BtnOutline text={type == "login" ? 'Sign up' : "Login"} css='w-fit' handleClick={() => {
                                    type === 'login' ? navigate('/signup') : navigate('/login')
                                }} />
                            </div>}
                    </form>

                    {
                        (type != "Verification" && type !=  "forgotPassword" && type != "resetPassword") &&

                        <div className='flex items-center justify-center py-4'>
                            <Link to="/guest-mode" className='text-[#999999] hover:underline underline-offset-2'>Continue as Guest</Link>
                        </div>}
                </div>
            </div>
            <div className='bg-[#FAFAFA] w-full h-full flex items-center justify-center'>
                <img src='/assets/login.png' alt='form' className='hidden md:block' />

            </div>
        </div>
    )
}

export default Form