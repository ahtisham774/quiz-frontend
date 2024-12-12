import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { fetchAllQuizzes, fetchGuestQuizzes } from '../redux/slices/quiz'
import { BASE_URL } from '../API'
import { useAuth } from '../context/useAuth'
import Select from 'react-select'

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([])

  const [error, setError] = useState(null)
  const { user } = useAuth()
  const [visibleCount, setVisibleCount] = useState(6) // State to control number of visible cards
  const { quizzes: data, loading } = useSelector(state => state.quiz)
  const dispatch = useDispatch()
  const pathname = useLocation().pathname
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState({
    value: '',
    label: 'All Topics'
  })
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/topics/all`)
        if (response.ok) {
          const data = await response.json()
          setTopics(
            data.map(topic => ({
              value: topic._id,
              label: topic.name
            }))
          ) // Normalize data format
        } else {
          console.error('Failed to fetch options')
        }
      } catch (error) {
        console.error('Error fetching options:', error)
      }
    }

    fetchOptions()
  }, [])

  useEffect(() => {
    // Dispatch fetchQuizzes action on component mount
    dispatch(fetchAllQuizzes(selectedTopic?.value || null))
  }, [selectedTopic?.value, dispatch, pathname])

  useEffect(() => {
    // show the quizzes with the is_available flag set to true
    if (data) {
      const filteredQuizzes = data.filter(quiz => quiz.is_available === true)
      setQuizzes(filteredQuizzes)
    }
  }, [data])

  // Function to load more cards
  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 6)
  }

  return (
    <div className='w-full flex items-center justify-center p-4 lg:p-12'>
      <div className='flex flex-col w-full gap-8 lg:max-w-6xl'>
        <div className='flex flex-col gap-3 w-full justify-center items-center'>
          <h1 className='text-5xl font-bold'>Available Quizzes</h1>
          <p className='text-[#999999] text-xl'>
            Choose any topic and start quiz
          </p>
        </div>

        <div className='flex items-center justify-center w-full'>
          <Select
            isClearable
            options={topics}
            value={selectedTopic}
            onChange={setSelectedTopic}
            placeholder='Select Topic'
            className='w-full'
          />
        </div>

        {loading ? (
          <div className='flex items-center justify-center'>
            <p className='text-2xl font-semibold'>Loading...</p>
          </div>
        ) : error ? (
          <div className='flex items-center justify-center'>
            <p className='text-2xl font-semibold'>Error: {error.message}</p>
          </div>
        ) : quizzes?.length === 0 ? (
          <div className='flex items-center justify-center'>
            <p className='text-2xl font-semibold'>No Quizzes Available</p>
          </div>
        ) : (
          <>
            <div className='flex flex-col gap-5 w-full'>
              {quizzes?.slice(0, visibleCount)?.map((quiz, index) => {
                return (
                  <Link
                    to={`quiz/${quiz._id}`}
                    key={index}
                    className={`bg-white w-fit  flex items-center justify-center  ${
                      !user &&
                      (quiz.is_for_try
                        ? 'pointer-events-auto cursor-pointer'
                        : 'pointer-events-none cursor-not-allowed text-slate-400')
                    } animate-fade-in`}
                    style={{ opacity: 1 }}
                  >
                    <h1 className='text-2xl font-semibold text-center'>
                      {quiz.name}
                    </h1>
                  </Link>
                )
              })}
            </div>
            {visibleCount < quizzes.length && (
              <div className='flex justify-center mt-4'>
                <button
                  onClick={loadMore}
                  className='py-2.5 px-6 bg-primary text-xl font-bold text-white'
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
