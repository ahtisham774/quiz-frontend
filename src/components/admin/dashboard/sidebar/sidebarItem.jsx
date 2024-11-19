
import { Link, useLocation } from "react-router-dom";

const SidebarItem = ({ item, pageName, setPageName }) => {
    const handleClick = () => {
        const updatedPageName =
            pageName !== item.name.toLowerCase() ? item.name.toLowerCase() : "";
        return setPageName(updatedPageName);
    };

    const pathname = useLocation().pathname;

    const isActive = (item) => {
        if (item.route === pathname) return true;
       
        return false;
    };

    const isItemActive = isActive(item);
    return (
        <>
            <li className="w-full">

                <Link
                    to={item.route}
                    onClick={handleClick}
                    className={`${isItemActive ? "bg-[#ffca2c1a] " : ""} group relative flex items-center 2xl:text-lg gap-4 rounded-sm px-4 py-2 font-medium  duration-300 ease-in-out hover:bg-[#ffca2c1a] `}
                >
                    <span className="text-center flex items-center justify-center w-[20px]">{item.icon}</span>
                    <span className="text-xl font-bold">{item.name}</span>
                    
                </Link>
            </li>
        </>
    )
}

export default SidebarItem