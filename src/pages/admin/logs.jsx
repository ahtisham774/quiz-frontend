import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { LuEye } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { deleteSingleLog, fetchAllLogs } from "../../redux/slices/logs";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 5;

const Logs = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    // const [logs, setLogs] = useState([
    //     {
    //         user: { id: 1, username: "John Doe", email: "john@gmail.com" },
    //         id: 1,
    //         quiz: { id: 1, name: "Quantum Mechanics" },
    //         date_created: new Date().toISOString(),
    //         score: 7,
    //     },
    //     {
    //         user: { id: 2, username: "Jane Smith", email: "jane@gmail.com" },
    //         id: 2,
    //         quiz: { id: 2, name: "Relativity" },
    //         date_created: new Date().toISOString(),
    //         score: 8,
    //     },
    //     // Additional log entries
    // ]);
    const { logs, loading } = useSelector(state => state.log);
    const dispatch = useDispatch();


    useEffect(() => {
        // Dispatch fetchQuizzes action on component mount
        dispatch(fetchAllLogs());
    }, [dispatch]);
    // const [loading, setLoading] = useState(true);


    // Filter logs based on the search query
    const filteredLogs = logs?.filter(item => item?.quizId != null && item?.studentId != null).filter(log =>
        (log?.studentId?.firstName + ' ' +
            log?.studentId?.lastName).toLowerCase().includes(search.toLowerCase()) ||
        log?.quizId?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
        log?.score?.toString().includes(search)
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredLogs?.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedLogs = filteredLogs?.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = async (log) => {
        try {

            const confirm = window.confirm("Are you sure you want to delete this Log?");
            if (!confirm) return;
            const res = await dispatch(deleteSingleLog(log._id)).unwrap();
            toast.success(res.message);

        }
        catch (error) {
            console.error("Error deleting quiz:", error);
        }
    }

    return (
        <div className="w-full flex flex-col gap-5 p-4">
            <div className="flex lg:items-center justify-between w-full flex-col sm:flex-row gap-3">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-[#333333]">Logs</h1>
                    <p className="text-xl text-[#999999]">List of all logs</p>
                </div>
                <div className="flex items-center lg:justify-end py-4">
                    <input
                        type="text"
                        placeholder="Filter by username, quiz or score"
                        className="p-2 px-4 border border-[#999999] rounded-md outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse whitespace-nowrap bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-[#FAFAFA] text-left">
                            <th className="p-3 text-xl font-bold">Sr</th>
                            <th className="p-3 text-xl font-bold">Username</th>
                            <th className="p-3 text-xl font-bold">Quiz</th>
                            <th className="p-3 text-xl font-bold">Dated</th>
                            <th className="p-3 text-xl font-bold">Score</th>
                            <th className="p-3 text-xl font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-3 text-xl font-normal text-center">Loading...</td>
                            </tr>
                        ) : paginatedLogs && paginatedLogs?.length > 0 ? (
                            paginatedLogs?.map((log, index) => (
                                <tr key={log.id} className="border-b border-b-[#999999]">
                                    <td className="p-3 text-xl font-normal ">{startIdx + index + 1}</td>
                                    <td className="p-3 text-xl font-normal capitalize">{log?.studentId?.firstName + " " + log?.studentId?.lastName}</td>

                                    <td className="p-3 text-xl font-normal whites">{log?.quizId?.name}</td>
                                    <td className="p-3 text-xl font-normal ">
                                        {new Date(log?.date_created).toLocaleDateString("en-US", {
                                            hour: "numeric",
                                            minute: "numeric",
                                            second: "numeric",
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="p-3 text-xl font-normal ">{log?.score}</td>
                                    <td className="p-3 text-xl font-normal flex space-x-3">
                                        <Link to={`${log?._id}`}>
                                            <LuEye className="size-6 cursor-pointer" />
                                        </Link>
                                        <MdEdit className="size-6 cursor-pointer" />
                                        <RiDeleteBin6Fill onClick={() => handleDelete(log)} className="size-6 cursor-pointer" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-3 text-xl font-normal text-center">No logs found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded-md ${currentPage === i + 1
                                ? "bg-primary text-white"
                                : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Logs;
