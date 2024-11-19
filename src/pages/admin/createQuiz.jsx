
import Form from "../../components/admin/quiz/form";

import { useDispatch } from "react-redux";
import { addQuiz } from "../../redux/slices/quiz";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const CreateQuiz = () => {

  const dispatch = useDispatch();

  const subTitle = "Create new quiz";
  const navigate = useNavigate();


  const handleSubmit = async (data) => {
    try {
  
      const res = await dispatch(addQuiz(data)).unwrap();
      toast.success(res.message);
      setTimeout(() => {
        navigate("/dashboard/quizzes")
      }, 800)



    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  }



  return (
    <Form subTitle={subTitle} quiz={null} handleSubmit={handleSubmit} />
  )
}

export default CreateQuiz