
import profile from "/assets/profile.jpg"

const Header = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <header className="sticky top-0 z-10 flex w-full bg-white border-b shadow-lg ">
            <div className="flex flex-grow items-center gap-5 justify-between px-4 py-2 shadow md:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    {/* <!-- Hamburger Toggle BTN --> */}
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSidebarOpen(!sidebarOpen);
                        }}
                        className="z-10 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm   lg:hidden"
                    >
                        <span className="relative block h-[1.50rem] w-[1.50rem] cursor-pointer">
                            <span className="block absolute right-0 h-full w-full">
                                <span
                                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out  ${!sidebarOpen && "!w-full delay-300"
                                        }`}
                                ></span>
                                <span
                                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out  ${!sidebarOpen && "delay-400 !w-full"
                                        }`}
                                ></span>
                                <span
                                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out  ${!sidebarOpen && "!w-full delay-500"
                                        }`}
                                ></span>
                            </span>
                            <span className="absolute right-0 h-full w-full rotate-45">
                                <span
                                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out  ${!sidebarOpen && "!h-0 !delay-[0]"
                                        }`}
                                ></span>
                                <span
                                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out  ${!sidebarOpen && "!h-0 !delay-200"
                                        }`}
                                ></span>
                            </span>
                        </span>
                    </button>

                </div>
                <div className="flex items-center gap-5 justify-between w-full">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-[#333333]">Dashboard</h1>
                        <p className="text-xl text-[#999999]">
                            {new Date().toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            }).replace(",", "")}
                        </p>

                    </div>
                    <img alt="profile" width={29} height={29} className="size-[80px] rounded-full object-cover" src={profile} />
                </div>


            </div>
        </header>
    )
}

export default Header