
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import BtnOutline from '../../btnOutline'
import { IoCloseSharp } from 'react-icons/io5'
import * as XLSX from 'xlsx'
import { BASE_URL, URI } from '../../../API'

const Form = ({ subTitle, quiz, handleSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    syllabus: '',
    instructions: '',
    time: '',
    is_available: false,
    questions: []
  })
  const [isTimerShow, setIsTimerShow] = useState(false)
  const [isImported, setIsImported] = useState(false)

  useEffect(() => {
    setFormData({
      name: quiz?.name || '',
      syllabus: quiz?.syllabus?.toString() || '',
      instructions: quiz?.instructions || '',
      time: quiz?.time || '',
      questions: quiz?.questions ? [...quiz.questions] : []
    })
    setIsTimerShow(quiz?.time ? true : false)
  }, [quiz])

  const handleImportQuestions = event => {
    const file = event.target.files[0]
    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase()

      if (fileType === 'xlsx') {
        const reader = new FileReader()
        reader.onload = e => {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]

          const questionsData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1
          })
          const headers = questionsData[0].map(header => header.trim())
          const rows = questionsData.slice(1)

          const sanitizedData = rows.map(row =>
            headers.reduce((acc, header, index) => {
              acc[header] = row[index]
              return acc
            }, {})
          )

          const importedQuestions = sanitizedData.map(row => ({
            question: row['Question'] || '',
            img: '',
            is_hide: false,
            options: [
              row['A'] || '',
              row['B'] || '',
              row['C'] || '',
              row['D'] || ''
            ],
            hint: row['Guidance notes'] || '',
            answer:
              row['ANS'] === 'A'
                ? 0
                : row['ANS'] === 'B'
                ? 1
                : row['ANS'] === 'C'
                ? 2
                : 3
          }))

          setFormData(prevData => ({
            ...prevData,
            questions: [...prevData.questions, ...importedQuestions]
          }))
        }
        reader.readAsArrayBuffer(file)
      } else {
        alert('Unsupported file type! Please upload an .xlsx file.')
      }

      setIsImported(true)
    }
  }

  const handleAddQuestion = () => {
    setFormData(prevData => ({
      ...prevData,
      questions: [
        ...prevData.questions,
        {
          question: '',
          img: '',
          hint: '',
          is_hide: false,
          options: ['', '', '', ''],
          answer: 0
        }
      ]
    }))
    setIsImported(true)
  }

  const handleDeleteQuestion = index => {
    const confirm = window.confirm(
      'Are you sure you want to delete this question?'
    )
    if (!confirm) {
      return
    }
    setFormData(prevData => ({
      ...prevData,
      questions: prevData.questions.filter((_, i) => i !== index)
    }))
  }

  const onSubmit = e => {
    e.preventDefault()
    const data = new FormData()

    data.append('name', formData.name)
    data.append('syllabus', formData.syllabus)
    data.append('instructions', formData.instructions)
    data.append('time', formData.time)

    const questionsWithImageNames = formData.questions.map(
      (question, index) => {
        if (question.img && question.img.name) {
          data.append(`img`, question.img, question.img.name)
        }

        return {
          question: question.question,
          is_hide: question.is_hide || false,
          options: question.options,
          hint: question.hint,
          answer: question.answer,
          img: question.img ? question.img.name : null
        }
      }
    )

    data.append('questions', JSON.stringify(questionsWithImageNames))
    handleSubmit(data)
  }

  return (
    <div className='w-full flex flex-col gap-5 p-4'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-bold text-[#333333]'>Quiz</h1>
        <p className='text-xl text-[#999999]'>{subTitle}</p>
      </div>
      <form
        onSubmit={onSubmit}
        className='flex flex-col gap-3 max-w-4xl w-full'
      >
        <input
          type='text'
          id='name'
          className='p-2 px-4 border border-[#999999] rounded-md outline-none'
          placeholder='Quiz Title'
          required
          value={formData.name}
          onChange={e =>
            setFormData(prevData => ({ ...prevData, name: e.target.value }))
          }
        />
        <textarea
          id='syllabus'
          className='p-2 px-4 border border-[#999999] rounded-md outline-none resize-none'
          placeholder='Syllabus Covered by this quiz'
          rows={6}
          value={formData.syllabus}
          onChange={e =>
            setFormData(prevData => ({ ...prevData, syllabus: e.target.value }))
          }
        />
        <textarea
          id='instructions'
          className='p-2 px-4 border border-[#999999] rounded-md outline-none resize-none'
          placeholder='Instructions for the quiz'
          rows={6}
          value={formData.instructions}
          onChange={e =>
            setFormData(prevData => ({
              ...prevData,
              instructions: e.target.value
            }))
          }
        />

        <div className='flex items-center gap-2 py-4'>
          <input
            type='checkbox'
            id='timer'
            className='size-5 accent-white'
            checked={isTimerShow}
            onChange={e => setIsTimerShow(e.target.checked)}
          />
          <label htmlFor='timer' className='text-lg text-[#999]'>
            Add timer to quiz
          </label>
        </div>
        {isTimerShow && (
          <input
            type='number'
            id='time'
            className='p-2 px-4 border border-[#999999] rounded-md outline-none max-w-xs'
            placeholder='Enter time'
            value={formData.time}
            onChange={e =>
              setFormData(prevData => ({ ...prevData, time: e.target.value }))
            }
          />
        )}

        <div className='flex flex-col py-4 gap-5'>
          {formData.questions.map((question, index) => (
            <div
              key={index}
              className='flex flex-col gap-5 border p-4 rounded-md relative'
            >
              <button
                type='button'
                className='absolute top-2 right-2 text-red-500'
                onClick={() => handleDeleteQuestion(index)}
              >
                <IoCloseSharp className='text-xl' />
              </button>
              <div className='w-full flex flex-col gap-3'>
                <h1 className='text-xl font-bold'>Question {index + 1}</h1>
                <input
                  type='text'
                  id={`question${index + 1}`}
                  className='p-2 px-4 border border-[#999999] rounded-md outline-none'
                  placeholder='Question Title'
                  value={question.question || ''}
                  onChange={e => {
                    setFormData(prevData => ({
                      ...prevData,
                      questions: prevData.questions.map((q, i) =>
                        i === index ? { ...q, question: e.target.value } : q
                      )
                    }))
                  }}
                />
              </div>
              <div className='w-full flex flex-col gap-3'>
                <h1 className='text-xl font-bold'>Hint {index + 1}</h1>
                <input
                  type='text'
                  className='p-2 px-4 border border-[#999999] rounded-md outline-none'
                  placeholder='Hint'
                  value={question.hint || ''}
                  onChange={e => {
                    setFormData(prevData => ({
                      ...prevData,
                      questions: prevData.questions.map((q, i) =>
                        i === index ? { ...q, hint: e.target.value } : q
                      )
                    }))
                  }}
                />
              </div>

              <div>
                <input
                  type='file'
                  id={`img${index + 1}`}
                  accept='image/*'
                  onChange={e => {
                    setFormData(prevData => ({
                      ...prevData,
                      questions: prevData.questions.map((q, i) =>
                        i === index ? { ...q, img: e.target.files[0] } : q
                      )
                    }))
                  }}
                />
                {question.img && (
                  <div className='relative w-full lg:w-1/2 h-[20rem] py-3'>
                    <button
                      type='button'
                      className='absolute top-0 right-0 bg-white p-1 rounded-full'
                      onClick={() => {
                        setFormData(prevData => ({
                          ...prevData,
                          questions: prevData.questions.map((q, i) =>
                            i === index ? { ...q, img: null } : q
                          )
                        }))
                      }}
                    >
                      <IoCloseSharp className='text-xl text-red-500' />
                    </button>
                    {question.img && question.img?.name ? (
                      <img
                        src={URL.createObjectURL(question.img)}
                        alt='uploaded image'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <img
                        src={`${URI + question.img}`}
                        alt='Uploaded Image'
                        className='w-full h-full object-cover'
                      />
                    )}
                  </div>
                )}
              </div>

              <div className='w-full flex flex-col gap-3'>
                <h1 className='text-xl font-bold'>Add Choices</h1>
                <div className='flex flex-col gap-3'>
                  {question.options.map((option, opIndex) => (
                    <div
                      key={opIndex}
                      className='flex items-center w-full gap-2'
                    >
                      <input
                        type='text'
                        className='p-2 w-full px-4 border border-[#999999] rounded-md outline-none'
                        placeholder={`Option ${String.fromCharCode(
                          65 + opIndex
                        )}`}
                        value={option || ''}
                        onChange={e => {
                          setFormData(prevData => ({
                            ...prevData,
                            questions: prevData.questions.map((q, i) =>
                              i === index
                                ? {
                                    ...q,
                                    options: q.options.map((opt, j) =>
                                      j === opIndex ? e.target.value : opt
                                    )
                                  }
                                : q
                            )
                          }))
                        }}
                      />
                      <input
                        type='radio'
                        id={`answer${index}-${opIndex}`}
                        name={`answer${index}`}
                        className='size-5 accent-primary'
                        checked={question.answer == opIndex}
                        onChange={() => {
                          setFormData(prevData => ({
                            ...prevData,
                            questions: prevData.questions.map((q, i) =>
                              i === index ? { ...q, answer: opIndex } : q
                            )
                          }))
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className='flex items-center gap-2 w-full justify-between'>
                <label
                  htmlFor={`required${index}`}
                  className='text-xl font-bold'
                >
                  Hide
                </label>
                <label className='switch'>
                  <input
                    type='checkbox'
                    id={`required${index}`}
                    checked={question.is_hide == true}
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        questions: prevData.questions.map((q, i) =>
                          i === index
                            ? { ...q, is_hide: e.target.checked }
                            : q
                        )
                      }))
                    }}
                  />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className='flex items-center justify-between w-full flex-wrap gap-3'>
          <BtnOutline
            text='Add Question'
            css='bg-primary text-white outline-none'
            handleClick={handleAddQuestion}
          />
          {!isImported && quiz == null && (
            <div>
              <input
                type='file'
                accept='.xlsx, .xls'
                onChange={handleImportQuestions}
                style={{ display: 'none' }}
                id='fileInput'
              />
              <label
                htmlFor='fileInput'
                className='py-2 px-6 border-2 border-primary text-xl cursor-pointer font-bold bg-primary text-white outline-none '
              >
                Import Questions
              </label>
            </div>
          )}
          {formData.questions.length > 0 && (
            <button
              type='submit'
              className='py-2 px-6 border-2 border-primary text-xl font-bold text-primary'
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

Form.propTypes = {
  subTitle: PropTypes.string,
  quiz: PropTypes.shape({
    name: PropTypes.string,
    syllabus: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    instructions: PropTypes.string,
    time: PropTypes.string,
    is_available: PropTypes.bool,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string,
        img: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        is_hide: PropTypes.bool,
        options: PropTypes.arrayOf(PropTypes.string),
        hint: PropTypes.string,
        answer: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    )
  }),
  handleSubmit: PropTypes.func.isRequired
}

export default Form
