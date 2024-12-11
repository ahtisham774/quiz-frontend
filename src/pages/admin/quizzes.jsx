import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import BtnOutline from '../../components/btnOutline'
import { LuEye } from 'react-icons/lu'
import { MdEdit } from 'react-icons/md'
import { RiDeleteBin6Fill } from 'react-icons/ri'
import { BASE_URL } from '../../API'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteSingleQuiz,
  fetchAllQuizzes,
  updateQuizAvailability
} from '../../redux/slices/quiz'
import toast from 'react-hot-toast'

const ITEMS_PER_PAGE = 5

const Quizzes = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  // const [quizzes, setQuizzes] = useState([]);
  // const [loading, setLoading] = useState(true);
  const { quizzes, loading } = useSelector(state => state.quiz)
  const dispatch = useDispatch()

  useEffect(() => {
    // Dispatch fetchQuizzes action on component mount
    dispatch(fetchAllQuizzes())
  }, [dispatch])

  const handleClick = () => {
    navigate('create')
  }

  const toggleAvailability = async quiz => {
    try {
      const res = await dispatch(updateQuizAvailability(quiz._id)).unwrap()
      toast.success(res.message)
    } catch (error) {
      console.error('Error updating quiz availability:', error)
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(quizzes?.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedQuizzes = quizzes?.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const handleDelete = async quiz => {
    try {
      const confirm = window.confirm(
        'Are you sure you want to delete this quiz?'
      )
      if (!confirm) return
      const res = await dispatch(deleteSingleQuiz(quiz._id)).unwrap()
      toast.success(res.message)
    } catch (error) {
      console.error('Error deleting quiz:', error)
    }
  }

  return (
    <div className='w-full flex flex-col gap-5 p-4'>
      <div className='flex lg:items-center justify-between w-full flex-col sm:flex-row gap-3'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-bold text-[#333333]'>Quizzes</h1>
          <p className='text-xl text-[#999999]'>List of all quizzes</p>
        </div>
        <BtnOutline
          text='Create Quiz'
          css='bg-primary text-white'
          handleClick={handleClick}
        />
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse min-w-full whitespace-nowrap bg-white shadow-md rounded-lg'>
          <thead>
            <tr className='bg-[#FAFAFA] text-left'>
              <th className='p-3 text-xl font-bold'>Sr</th>
              <th className='p-3 text-xl font-bold'>Quiz</th>
              <th className='p-3 text-xl font-bold'>Topic</th>
              <th className='p-3 text-xl font-bold'>Created Date</th>
              <th className='p-3 text-xl font-bold'>Average Rating</th>
              <th className='p-3 text-xl font-bold'>Available</th>
              <th className='p-3 text-xl font-bold'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='6' className='p-3 text-xl font-normal text-center'>
                  Loading...
                </td>
              </tr>
            ) : (
              paginatedQuizzes?.map((quiz, index) => (
                <tr key={quiz.sr} className='border-b border-b-[#999999]'>
                  <td className='p-3 text-xl font-normal '>
                    {startIdx + index + 1}
                  </td>
                  <td className='p-3 text-xl font-normal truncate max-w-[300px]'>{quiz?.name}</td>
                  <td className='p-3 text-xl font-normal '>{quiz?.topic?.name}</td>
                  <td className='p-3 text-xl font-normal '>
                    {new Date(quiz?.date_created).toLocaleDateString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className='p-3 text-xl font-normal '>
                    {quiz?.avg_rating.toFixed(2)}
                  </td>
                  <td className='p-3 text-xl font-normal '>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        checked={quiz?.is_available}
                        onChange={() => toggleAvailability(quiz)}
                      />
                      <span className='slider'></span>
                    </label>
                    {/* <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-primary"
                                            
                                        />
                                    </label> */}
                  </td>
                  <td className='p-3 text-xl font-normal  flex space-x-3'>
                    <Link to={`view/${quiz?._id}`}>
                      <LuEye className='size-6 cursor-pointer' />
                    </Link>
                    <Link to={`edit/${quiz?._id}`}>
                      <MdEdit className='size-6 cursor-pointer' />
                    </Link>
                    <RiDeleteBin6Fill
                      className='size-6 cursor-pointer'
                      onClick={() => handleDelete(quiz)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-4">
    {/* Previous Button */}
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-3 py-1 rounded-md ${
        currentPage === 1 ? 'bg-gray-200 text-gray-700' : 'bg-primary text-white'
      }`}
    >
      Previous
    </button>

    {/* Page Numbers */}
    {Array.from(
      { length: Math.min(5, totalPages) }, // Show up to 5 pages (including current, before, and after)
      (_, i) => {
        const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4)); // Ensure no out-of-bound index
        const page = startPage + i;

        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {page}
          </button>
        );
      }
    )}

    {/* Next Button */}
    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 rounded-md ${
        currentPage === totalPages
          ? 'bg-gray-200 text-gray-700'
          : 'bg-primary text-white'
      }`}
    >
      Next
    </button>
  </div>
)}

    </div>
  )
}

export default Quizzes
