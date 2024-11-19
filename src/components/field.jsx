

const Field = ({type, value,  onChange,isRequired, placeholder}) => {
  return (
    <input type={type} value={value} required={isRequired} onChange={onChange} placeholder={placeholder} className='w-full h-12 px-4 border-2 border-[#999999] border-l-primary border-l-4 focus:outline-none focus:border-primary' />
    
  )
}

export default Field