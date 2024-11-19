
const BtnOutline = ({text, css, handleClick}) => {
  return (
    
    <button onClick={handleClick} type="button" className={`py-2 px-6 border-2 border-primary text-xl font-bold text-primary  ${css}`}>{text}</button>
  )
}

export default BtnOutline