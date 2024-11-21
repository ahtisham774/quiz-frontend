import { useEffect, useState } from 'react'
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
      name: quiz?.name,
      syllabus: quiz?.syllabus?.toString(),
      instructions: quiz?.instructions,
      time: quiz?.time,
      is_available: quiz?.is_available,
      questions: quiz?.questions || []
    })
    setIsTimerShow(quiz?.time ? true : false)
  }, [quiz])

  // const handleImportQuestions = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //         const reader = new FileReader();
  //         reader.onload = (e) => {
  //             const data = new Uint8Array(e.target.result);
  //             const workbook = XLSX.read(data, { type: "array" });
  //             const sheetName = workbook.SheetNames[0];
  //             const worksheet = workbook.Sheets[sheetName];
  //             const questionsData = XLSX.utils.sheet_to_json(worksheet);

  //             // Map the data to question format
  //             const importedQuestions = questionsData.map((row) => ({
  //                 question: row["Question"],
  //                 img: "", // Assuming no images in the file
  //                 is_required: false,
  //                 options: [row["A"], row["B"], row["C"], row["D"]],
  //                 answer:
  //                     row["ANS"] === "A"
  //                         ? 0
  //                         : row["ANS"] === "B"
  //                             ? 1
  //                             : row["ANS"] === "C"
  //                                 ? 2
  //                                 : 3

  //                 ,
  //             }));

  //             // Add imported questions to formData
  //             setFormData((prevData) => ({
  //                 ...prevData,
  //                 questions: [...prevData.questions, ...importedQuestions],
  //             }));
  //         };
  //         reader.readAsArrayBuffer(file);
  //         setIsImported(true);
  //     }
  // };
  // async function readDocx(arrayBuffer) {
  //     return new Promise((resolve, reject) => {
  //         mammoth.convertToHtml({ arrayBuffer })
  //             .then((result) => {
  //                 const html = result.value; // HTML content from DOCX
  //                 const questions = [];
  //                 const tempDiv = document.createElement("div");
  //                 tempDiv.innerHTML = html; // Convert HTML string to DOM

  //                 let currentQuestion = null;

  //                 // Parse the HTML content for questions and options
  //                 const paragraphs = tempDiv.querySelectorAll("p");

  //                 paragraphs.forEach((p) => {
  //                     const text = p.textContent.trim();

  //                     // Check for questions and options
  //                     if (text.startsWith("Q") && text.includes(".")) {
  //                         console.log("THis is question", text)
  //                         if (currentQuestion) {
  //                             questions.push(currentQuestion);
  //                         }
  //                         currentQuestion = { question: text.replace(/^Q\d+\./, "").trim(), options: [], img: "", answer: null };
  //                     } else if (text.startsWith("A:")) {

  //                         currentQuestion.options[0] = text.substring(2).trim();
  //                     } else if (text.startsWith("B:")) {
  //                         currentQuestion.options[1] = text.substring(2).trim();
  //                     } else if (text.startsWith("C:")) {
  //                         currentQuestion.options[2] = text.substring(2).trim();
  //                     } else if (text.startsWith("D:")) {
  //                         currentQuestion.options[3] = text.substring(2).trim();
  //                     } else if (text.startsWith("Answer:")) {
  //                         currentQuestion.answer = ["A", "B", "C", "D"].indexOf(text.split(":")[1].trim());
  //                         questions.push(currentQuestion);
  //                     }

  //                     // Check for images in the paragraph
  //                     const img = p.querySelector("img");
  //                     if (img && img.src) {
  //                         console.log(currentQuestion, img.src);
  //                         if (currentQuestion) {
  //                             currentQuestion.img = img.src; // Store image URL
  //                         }
  //                     }
  //                 });

  //                 // Push the last question
  //                 if (currentQuestion) {
  //                     questions.push(currentQuestion);
  //                 }

  //                 resolve(questions);
  //             })
  //             .catch((err) => reject(err));
  //     });
  // }

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

          // Trim headers before converting to JSON
          const questionsData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1
          })
          const headers = questionsData[0].map(header => header.trim())
          const rows = questionsData.slice(1)

          // Convert rows into a usable JSON format
          const sanitizedData = rows.map(row =>
            headers.reduce((acc, header, index) => {
              acc[header] = row[index]
              return acc
            }, {})
          )

          // Map the data to question format
          const importedQuestions = sanitizedData.map(row => ({
            question: row['Question'],
            img: '', // Assuming no images in the file
            is_required: false,
            options: [row['A'], row['B'], row['C'], row['D']],
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

          // Add imported questions to formData
          console.log(importedQuestions)
          setFormData(prevData => ({
            ...prevData,
            questions: [...prevData.questions, ...importedQuestions]
          }))
        }
        reader.readAsArrayBuffer(file)
      }

      // else if (fileType === "docx") {
      //     // Handle .docx files
      //     const reader = new FileReader();
      //     reader.onload = async (e) => {
      //         const arrayBuffer = e.target.result;
      //         const docxData = await readDocx(arrayBuffer);

      //         // Add imported questions to formData
      //         setFormData((prevData) => ({
      //             ...prevData,
      //             questions: [...prevData.questions, ...docxData],
      //         }));
      //     };
      //     reader.readAsArrayBuffer(file);
      // }
      else {
        alert('Unsupported file type! Please upload an .xlsx or .docx file.')
      }

      setIsImported(true)
    }
  }

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: '',
          img: '',
          hint: '',
          is_required: false,
          options: ['', '', '', ''],
          answer: '0'
        }
      ]
    })
    setIsImported(true)
  }

  const onSubmit = e => {
    e.preventDefault()
    const data = new FormData()
    console.log(formData)

    // Append main quiz details to FormData
    data.append('name', formData.name)
    data.append('syllabus', formData.syllabus)
    data.append('instructions', formData.instructions)
    data.append('time', formData.time)

    // Prepare the questions array for JSON.stringify, including image filenames or null
    const questionsWithImageNames = formData.questions.map(
      (question, index) => {
        // Append each image file to Data if it exists
        if (question.img && question.img.name) {
          data.append(`img`, question.img, question.img.name)
        }

        // Return the question data, with the image property as the filename or null
        return {
          question: question.question,
          is_required: question.is_required,
          options: question.options,
          hint: question.hint,
          answer: question.answer,
          img: question.img ? question.img.name : null // Include filename or null
        }
      }
    )

    // Append the questions JSON string to Data
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
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
        <textarea
          id='syllabus'
          className='p-2 px-4 border border-[#999999] rounded-md outline-none resize-none'
          placeholder='Syllabus Covered by this quiz'
          rows={6}
          value={formData.syllabus}
          onChange={e => setFormData({ ...formData, syllabus: e.target.value })}
        />
        <textarea
          id='instructions'
          className='p-2 px-4 border border-[#999999] rounded-md outline-none resize-none'
          placeholder='Instructions for the quiz'
          rows={6}
          value={formData.instructions}
          onChange={e =>
            setFormData({ ...formData, instructions: e.target.value })
          }
        />

        <div className='flex items-center gap-2 py-4'>
          <input
            type='checkbox'
            id='timer'
            className='size-5 accent-white  '
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
            onChange={e => setFormData({ ...formData, time: e.target.value })}
          />
        )}

        <div className='flex flex-col py-4 gap-5'>
          {formData?.questions?.map((question, index) => (
            <div key={index} className='flex flex-col gap-5'>
              <div className='w-full flex flex-col gap-3'>
                <h1 className='text-xl font-bold'>Question {index + 1}</h1>
                <input
                  type='text'
                  id={`question${index + 1}`}
                  className='p-2 px-4 border border-[#999999] rounded-md outline-none'
                  placeholder='Question Title'
                  value={question.question || ''}
                  onChange={e => {
                    let newQuestions = [...formData.questions]
                    newQuestions[index].question = e.target.value
                    setFormData({ ...formData, questions: newQuestions })
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
                    setFormData(prevData => {
                      return {
                        ...prevData,
                        questions: prevData.questions.map((q, i) => {
                          if (i === index) {
                            return { ...q, hint: e.target.value }
                          }
                          return q
                        })
                      }
                    })
                  }}
                />
              </div>

              <div>
                <input
                  type='file'
                  id={`img${index + 1}`}
                  accept='image/*'
                  onChange={e => {
                    let newQuestions = [...formData.questions]
                    newQuestions[index] = {
                      ...newQuestions[index],
                      img: e.target.files[0]
                    }
                    setFormData({ ...formData, questions: newQuestions })
                  }}
                />
                {question.img && (
                  <div className='relative w-full lg:w-1/2 h-[20rem] py-3'>
                    <button
                      className='absolute top-0 right-0 bg-white p-1 rounded-full'
                      onClick={() => {
                        let newQuestions = [...formData.questions]
                        newQuestions[index].img = null
                        setFormData({ ...formData, questions: newQuestions })
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
                        src={`${question.img}`}
                        alt='Uploaded Image'
                        className='w-full h-full object-cover'
                      />
                      // <img
                      //     src={URI + question.img}
                      //     alt="uploaded image"
                      //     className="w-full h-full object-cover"
                      // />
                    )}
                    {/* <img src={URL.createObjectURL(question.img)} alt="question" className="max-w-full h-full object-cover" /> */}
                  </div>
                )}
              </div>

              <div className='w-full flex flex-col gap-3'>
                <h1 className='text-xl font-bold'>Add Choices</h1>
                <div className='flex flex-col gap-3'>
                  {question?.options?.map((option, opIndex) => (
                    <div
                      key={opIndex}
                      className='flex items-center w-full gap-2'
                    >
                      <input
                        type='text'
                        id='option'
                        className='p-2 px-4 border border-[#999999] w-full rounded-md outline-none'
                        placeholder='Option'
                        value={option}
                        onChange={e => {
                          let newQuestions = [...formData.questions]
                          newQuestions[index].options[opIndex] = e.target.value
                          setFormData({ ...formData, questions: newQuestions })
                        }}
                      />
                      <input
                        type='radio'
                        id='answer'
                        className='size-5 accent-primary'
                        checked={question.answer == opIndex}
                        onChange={() => {
                          let newQuestions = [...formData.questions]
                          newQuestions[index].answer = opIndex
                          setFormData({ ...formData, questions: newQuestions })
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className='flex items-center gap-2 w-full justify-between'>
                <label htmlFor='required' className='text-xl font-bold'>
                  Required
                </label>
                <label className='switch'>
                  <input
                    type='checkbox'
                    checked={question.is_required == 'true'}
                    onChange={e => {
                      let newQuestions = [...formData.questions]
                      console.log(e.target.checked, newQuestions[index])
                      newQuestions[index] = {
                        ...newQuestions[index],
                        is_required: e.target.checked ? 'true' : 'false'
                      }
                      setFormData({ ...formData, questions: newQuestions })
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
          {formData?.questions?.length > 0 && (
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

export default Form
