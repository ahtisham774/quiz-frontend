import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllLogs } from '../../redux/slices/logs'
import QuestionCard from '../../components/questionCard'

const Log = () => {
  const { id } = useParams()
  const [log, setLog] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const { logs } = useSelector(state => state.log)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // Dispatch fetchLogzes action on component mount
    dispatch(fetchAllLogs())
  }, [dispatch])

  useEffect(() => {
    if (id && logs?.length > 0) {
      const selectedLog = logs?.find(log => log?._id == id)

      if (selectedLog) {
        const log = {
          ...selectedLog.quizId,
          questions: [
            ...selectedLog.quizId.questions.map((question, index) => {
              return {
                ...question,
                userAnswer: selectedLog.questions[index].userAnswer
              }
            })
          ],
          score: selectedLog?.score,
          notes: selectedLog?.notes,
          username:
            selectedLog?.studentId?.firstName +
            ' ' +
            selectedLog?.studentId?.lastName,
          dated: selectedLog?.date_created
        }
        console.log(log)
        setLog(log)
      }
    }
  }, [id, logs])

  const handleNextQuestion = () => {
    if (currentQuestionIndex < log?.questions?.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
    else{
        navigate('/dashboard/my-quizzes')
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  return (
    <div className='w-full flex flex-col gap-5 p-4'>
      <div className='flex items-center justify-between w-full flex-col sm:flex-row gap-3'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-bold text-[#333333]'>Log Details</h1>
          <p className='text-xl text-[#999999]'>View log details</p>
        </div>
        <div className='flex flex-col gap-3'>
          <p className='text-lg text-[#999999] capitalize'>
            Attempted by: {log?.username}
          </p>
          <p className='text-lg text-[#999999]'>
            Date:{' '}
            {new Date(log?.dated).toLocaleDateString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
      {log && (
        <>
          <QuestionCard
            isReview={true}
            handleShowButtons={() => {}}
            name={log?.name}
            index={currentQuestionIndex}
            notes={log?.notes}
            syllabus={log?.syllabus}
            img={log?.questions[currentQuestionIndex]?.img}
            question={log?.questions[currentQuestionIndex]?.question}
            options={log?.questions[currentQuestionIndex]?.options}
            answer={log?.questions[currentQuestionIndex]?.answer - 0}
            selectedOption={
              log?.questions[currentQuestionIndex]?.userAnswer - 0
            }
            alphabets={['A', 'B', 'C', 'D']}
            showTimer={false}
            score={log?.score}
            handleSelectOption={() => {}}
            showNotes={true}
          />
          <div className='flex justify-start gap-5 mt-4'>
            
              <button
                className='py-2 px-4 bg-gray-300'
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
            
            {currentQuestionIndex + 1 > 0 && (
              <p className='font-medium text-xl'>
                {currentQuestionIndex + 1 + ' / ' + log.questions.length}
              </p>
            )}
            <button
              className='py-2.5 px-6 bg-primary text-xl font-bold text-white '
              onClick={handleNextQuestion}
            >
              
                 Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Log
