import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuEye } from 'react-icons/lu'
const ViewStudent = ({ student }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='border-none outline-none ring-0 focus:ring-0'
      >
        <LuEye className='size-6 ' />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 !z-50  bg-black bg-opacity-50 flex items-center justify-center'
          >
            <div className='bg-white max-w-xl max-h-[80dvh] rounded-lg p-8 flex flex-col w-full gap-5'>
              <div className='flex justify-between items-center w-full gap-8 '>
                <h1 className='text-2xl font-bold'>Student Details</h1>
                <button
                  onClick={() => setIsOpen(false)}
                  className='border-none outline-none ring-0 focus:ring-0'
                >
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M6 18L18 6M6 6l12 12'
                    ></path>
                  </svg>
                </button>
              </div>

              <div className='flex flex-col items-center gap-4 '>
                <div className='flex flex-wrap gap-2 w-full items-start'>
                  <p className='text-lg font-bold'>Name</p>
                  <p className='text-lg'>
                    {student?.firstName} {student?.lastName}{' '}
                  </p>
                </div>
                <div className='flex flex-wrap gap-2 w-full items-start'>
                  <p className='text-lg font-bold'>Email</p>
                  <p className='text-lg'>{student?.email}</p>
                </div>
                <div className='flex flex-wrap gap-2 w-full items-start'>
                  <p className='text-lg font-bold'>Status</p>
                  <p className='text-lg'>{student?.status}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ViewStudent
