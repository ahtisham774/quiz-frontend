import { useNavigate } from "react-router-dom"

const Hero = () => {
    const navigate = useNavigate()

    const handleStart = () => {
        navigate('/dashboard')
    }


    return (
        <div className="h-full min-h-[calc(100dvh-100px)] relative w-full flex pt-[3%] justify-center ">

            <div className="flex flex-col md:flex-row justify-between w-full max-w-6xl ">
                <div className="p-4">
                    <h1 className="text-[50px] font-semibold text-[#333333] md:max-w-sm leading-[60px]">Challenge
                        Your Knowledge
                        One Quiz at a Time</h1>
                    <p className="text-xl text-[#999999] text-normal mt-4 border-l-4 pl-3 border-l-[#999999]">Discover, Learn, and Compete with Engaging Quizzes Tailored Just for You!</p>
                    <div className="flex gap-4 mt-8">

                        <button onClick={handleStart} className="py-2.5 px-6 bg-primary text-xl font-bold text-white">Start Solving</button>
                    </div>
                </div>
                <div>
                    <img src="/assets/hero_img.png" className="w-full" alt="hero" />

                </div>
            </div>

            <img src="/assets/vector.png" className="absolute hidden lg:block bottom-0 -left-20 w-96" alt="vector" />

        </div>
    )
}

export default Hero