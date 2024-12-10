import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import BtnOutline from '../../components/btnOutline'
import { LuEye } from 'react-icons/lu'
import { MdEdit } from 'react-icons/md'
import { RiDeleteBin6Fill } from 'react-icons/ri'
import { AUTH } from '../../API'

import toast from 'react-hot-toast'
import  { motion,AnimatePresence } from 'framer-motion'
import ViewStudent from './viewStudent'

const ITEMS_PER_PAGE = 5

const Students = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${AUTH}/students/all`)
        if (response.ok) {
          const data = await response.json()
          setStudents(data)
          setLoading(false)
        } else {
          console.error('Failed to fetch students')
        }
      } catch (error) {
        console.error('Error fetching students:', error)
      }
    }

    fetchStudents()
  }, [])

  const handleClick = () => {
    navigate('create')
  }

  const toggleAvailability = async student => {
    try {
      fetch(`${AUTH}/students/${student._id}/toggle-status`)
        .then(res => res.json())
        .then(data => {
          toast.success(data.message)
          setStudents(prev =>
            prev.map(s =>
              s._id === student._id ? { ...s, status: data.student.status } : s
            )
          )
        })
        .catch(err => {
          console.error('Error updating student status:', err)
        })
    } catch (error) {
      console.error('Error updating student status::', error)
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(students?.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedStudents = students?.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const handleDelete = async student => {
    try {
      const confirm = window.confirm(
        'Are you sure you want to delete this student?'
      )
      if (!confirm) return
      fetch(`${AUTH}/students/${student._id}/delete`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(data => {
          toast.success(data.message)
          setStudents(prev => prev.filter(s => s._id !== student._id))
        })
        .catch(err => {
          console.error('Error deleting student:', err)
        })
    } catch (error) {
      console.error('Error deleting student:', error)
    }
  }

  const handleRegister = async e => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const response = await fetch(`${AUTH}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
      })
      if (response.ok) {
        const data = await response.json()
        setStudents([...students, data.student])
        setIsModalOpen(false)
        toast.success(data.message)
      } else {
        console.error('Failed to register student')
      }
    } catch (error) {
      console.error('Error registering student:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='w-full flex flex-col gap-5 p-4'>
      <div className='flex lg:items-center justify-between w-full flex-col sm:flex-row gap-3'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-bold text-[#333333]'>Students</h1>
          <p className='text-xl text-[#999999]'>List of all students</p>
        </div>
        <BtnOutline
          text='Register New Student'
          css='bg-primary text-white'
          handleClick={() => setIsModalOpen(true)}
        />
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className='bg-[rgba(0,0,0,0.5)] backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer'
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className='bg-white p-8 rounded-lg max-w-[500px] w-full'
              >
                <h1 className='text-2xl font-bold text-[#333333]'>
                  Register New Student
                </h1>
                <form
                  onSubmit={handleRegister}
                  className='flex flex-col gap-4 mt-4'
                >
                  <input
                    type='text'
                    placeholder='First Name'
                    className='p-3 border border-[#333333] rounded-md'
                    value={student.firstName}
                    required
                    onChange={e =>
                      setStudent({ ...student, firstName: e.target.value })
                    }
                  />
                  <input
                    type='text'
                    placeholder='Last Name'
                    className='p-3 border border-[#333333] rounded-md'
                    value={student.lastName}
                    required
                    onChange={e =>
                      setStudent({ ...student, lastName: e.target.value })
                    }
                  />
                  <input
                    type='email'
                    placeholder='Email'
                    className='p-3 border border-[#333333] rounded-md'
                    value={student.email}
                    required
                    onChange={e =>
                      setStudent({ ...student, email: e.target.value })
                    }
                  />
                  <input
                    type='password'
                    placeholder='Password'
                    className='p-3 border border-[#333333] rounded-md'
                    value={student.password}
                    required
                    onChange={e =>
                      setStudent({ ...student, password: e.target.value })
                    }
                  />
                  <BtnOutline
                    text='Register'
                    type='submit'
                    css='bg-primary text-white'
                  />
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse min-w-full whitespace-nowrap bg-white shadow-md rounded-lg'>
          <thead>
            <tr className='bg-[#FAFAFA] text-left'>
              <th className='p-3 text-xl font-bold'>Sr</th>
              <th className='p-3 text-xl font-bold'>Name</th>
              <th className='p-3 text-xl font-bold'>Email</th>
              <th className='p-3 text-xl font-bold'>Registered On</th>
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
              paginatedStudents?.map((student, index) => (
                <tr key={student._id} className='border-b border-b-[#999999]'>
                  <td className='p-3 text-xl font-normal '>
                    {startIdx + index + 1}
                  </td>
                  <td className='p-3 text-xl font-normal truncate max-w-[300px]'>
                    {student?.firstName} {student?.lastName}
                  </td>
                  <td className='p-3 text-xl font-normal '>{student?.email}</td>
                  <td className='p-3 text-xl font-normal '>
                    {new Date(student?.date_created).toLocaleDateString(
                      'en-US',
                      {
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }
                    )}
                  </td>

                  <td className='p-3 text-xl font-normal '>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        checked={student?.status === 'active'}
                        onChange={() => toggleAvailability(student)}
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
                    <ViewStudent student={student} />
                    <RiDeleteBin6Fill
                      className='size-6 cursor-pointer'
                      onClick={() => handleDelete(student)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex justify-center items-center gap-2 mt-4'>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Students
