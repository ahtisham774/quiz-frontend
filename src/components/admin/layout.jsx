import { useState } from "react";
import Header from "./dashboard/header";
import Sidebar from "./dashboard/sidebar";

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
            <div className="flex w-full">                
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="relative flex flex-1 flex-col w-full">
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <main className="w-full">
                        <div className="w-full p-4 md:p-6 2xl:p-10">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default Layout