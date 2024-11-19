import { useEffect, useState } from "react"
import { BASE_URL } from "../../API"


const AdminDashboard = () => {

    const [data, setData] = useState([
        {
            title: "Registered Users",
            value: 0
        },
        {
            title: "Quizzes",
            value: 0
        },
        {
            title: "Average Rating",
            value: 0
        }
    ])


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${BASE_URL}/quiz/dashboard`)
                const data = await res.json()
                setData(
                    [
                        {
                            title: "Registered Users",
                            value: data.users
                        },
                        {
                            title: "Quizzes",
                            value: data.quizzes
                        },
                        {
                            title: "Average Rating",
                            value: data.rating
                        }
                    ]

                )

            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])








    return (
        <div className="w-full flex flex-col gap-5 p-4 ">
            <h1 className="text-3xl font-bold flex items-center gap-3">Welcome Back <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.75 21.25C28.75 25.3875 25.3875 28.75 21.25 28.75V26.875C24.375 26.875 26.875 24.375 26.875 21.25H28.75ZM1.25002 8.75C1.25002 4.6125 4.61252 1.25 8.75003 1.25V3.125C5.62502 3.125 3.12502 5.625 3.12502 8.75H1.25002ZM10 5.4L4.26252 11.15C0.237524 15.175 0.237524 21.7125 4.26252 25.7375C8.28753 29.7625 14.825 29.7625 18.85 25.7375L27.6875 16.875C28.3 16.2875 28.3 15.3 27.6875 14.6875C27.5424 14.542 27.37 14.4265 27.1801 14.3478C26.9903 14.269 26.7868 14.2285 26.5813 14.2285C26.3758 14.2285 26.1722 14.269 25.9824 14.3478C25.7926 14.4265 25.6202 14.542 25.475 14.6875L19.95 20.2125L19.0625 19.325L27.2375 11.15C27.85 10.5375 27.85 9.55 27.2375 8.9375C26.625 8.325 25.625 8.325 25 8.9375L17.7375 16.25L16.875 15.3375L25.4625 6.725C26.075 6.1125 26.075 5.125 25.4625 4.5125C24.85 3.9 23.8625 3.9 23.25 4.5125L14.6375 13.125L13.75 12.25L20.625 5.4C21.25 4.7875 21.25 3.8 20.625 3.1875C20 2.575 19.025 2.575 18.4125 3.1875L8.88753 12.7125C9.6341 13.6742 10.0041 14.8753 9.92818 16.0904C9.85224 17.3056 9.33554 18.4512 8.47503 19.3125L7.58753 18.425C8.28978 17.7219 8.68423 16.7688 8.68423 15.775C8.68423 14.7812 8.28978 13.8281 7.58753 13.125L7.15002 12.6875L12.2375 7.6C12.85 6.9875 12.85 6 12.2375 5.3875C11.6125 4.7875 10.625 4.7875 10 5.4Z" fill="#FFCC2C" />
            </svg>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.map((item, index) => (
                    <div key={index} className="bg-white p-4 flex flex-col gap-3 rounded-lg shadow-md border border-[#999999]">
                        <h2 className="text-xl font-bold">{item.title}</h2>
                        <p className="text-3xl font-bold">{item.value}</p>
                    </div>
                ))}
            </div>


        </div>
    )
}

export default AdminDashboard