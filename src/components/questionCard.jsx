import { useState } from 'react'
import { Link } from 'react-router-dom'
import TimeLeft from './timeLeft'

const QuestionCard = ({
  isReview,
  index,
  name,
  hint,
  notes,
  img,
  syllabus,
  question,
  options,
  answer,
  selectedOption,
  alphabets,
  showTimer,
  timer,
  score,
  handleSelectOption,
  showNotes,
  handleShowButtons,
  handleQuizEnd,
  handleNotes,
  children
}) => {
  const [showSyllabus, setShowSyllabus] = useState(false)

  const handleShow = () => {
    setShowSyllabus(!showSyllabus)
    handleShowButtons(prev => !prev)
  }

  return (
    <div className='flex flex-col gap-4 w-full h-full'>
      <div className='w-full flex items-center flex-col gap-2 justify-center'>
        <h2 className='text-5xl font-semibold'>{name}</h2>
        {isReview && (
          <button
            onClick={handleShow}
            className='underline underline-offset-1 border-none outline-none text-primary text-xl text-center'
          >
            Syllabus covered in this quiz
          </button>
        )}
      </div>
      {showSyllabus ? (
        <div className='flex flex-col gap-4 w-full'>
          <h3 className='text-2xl font-semibold'>Syllabus Covered</h3>
          {/* <ol className="text-lg list-inside list-decimal text-[#999999]">
                            {syllabus && syllabus.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ol> */}
          <p className='whitespace-pre-line text-[#999999]'>{syllabus}</p>
        </div>
      ) : (
        <>
          <div className='flex justify-between flex-wrap-reverse gap-3'>
            <h3 className='text-2xl font-semibold'>Question {index + 1}</h3>

            {showTimer ? (
              timer != 0 &&
              timer != 'undefined' && (
                <TimeLeft handleEnd={handleQuizEnd} time={timer} />
              )
            ) : (
              <p className='text-xl'>
                <span className='font-bold'>Obtained Marks:</span> {score}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-4 w-full h-full'>
            <p className='text-xl'>{question}</p>
            {img && (
              <div className='flex items-center justify-center md:w-1/3 md:h-1/2'>
                <img
                  src={img}
                  alt=''
                  className='max-w-full h-full object-cover'
                />
              </div>
            )}
            <div className='flex items-start justify-between h-full  flex-col md:flex-row gap-8 w-full'>
              <div className='flex flex-col gap-4 flex-1 w-full md:max-w-xl md:min-w-max 2xl:max-w-3xl'>
                {options.map((option, index) => (
                  <button
                    key={index}
                    className={`p-4 text-left border-2 border-[#999999] rounded-lg ${
                      isReview
                        ? index === answer
                          ? 'bg-green-500' // green for the correct answer
                          : selectedOption === index
                          ? 'bg-red-500' // red for the incorrect selected answer
                          : 'bg-white'
                        : selectedOption === index
                        ? 'bg-[#fcf0b3]'
                        : 'bg-white'
                    }`}
                    onClick={() => handleSelectOption(index)}
                    disabled={isReview}
                  >
                    <div className='flex items-center gap-2'>
                      <span className='font-bold'>{alphabets[index]}.</span>
                      {option}
                    </div>
                  </button>
                ))}
              

                {children}
              </div>

              <div className='flex flex-col justify-between h-full gap-3 w-full md:max-w-sm 2xl:max-w-xl'>
                {hint != '' &&
                  hint != undefined &&
                  isReview &&
                  selectedOption != answer && (
                    <div className='w-full  border transition-all border-[#999999] rounded-lg flex flex-col items-center gap-3 h-fit p-4'>
                      <h4 className='text-xl font-semibold'>Feedback</h4>
                      <q className='italic font-medium'>{hint}</q>
                    </div>
                  )}

                {showNotes && (
                  <div className='w-full  border transition-all border-[#999999] rounded-lg flex flex-col items-center gap-3 h-fit p-4'>
                    <h4 className='text-xl font-semibold'>
                      Notes writing Area
                    </h4>
                    <textarea
                      readOnly={isReview}
                      value={notes}
                      onChange={e => handleNotes(e.target.value)}
                      className='w-full outline-none border-none resize-none'
                      rows={8}
                    ></textarea>
                  </div>
                )}
                {!isReview && (
                  <Link
                    to='/dashboard'
                    className='py-2.5 px-6 w-fit self-end  bg-primary text-xl font-bold text-white'
                  >
                    Back to Home
                  </Link>
                )}
              </div>
            </div>
          </div>
          {selectedOption !== null && isReview && (
            <div className='flex items-center gap-4'>
              <p
                className={`text-xl font-semibold ${
                  selectedOption === answer ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {selectedOption === answer
                  ? `Your answer ${alphabets[selectedOption]} is correct!`
                  : selectedOption != -1 ? `Your answer ${alphabets[selectedOption]} is incorrect! The correct answer is ${alphabets[answer]}`
                  : `The correct answer is ${alphabets[answer]}`
                }
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default QuestionCard
