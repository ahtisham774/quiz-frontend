import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/admin/quiz/form";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllQuizzes, updateQuiz } from "../../redux/slices/quiz";
import toast from "react-hot-toast";



const EditQuiz = () => {

    const { id } = useParams();
    const [quiz, setQuiz] = useState({});
    const subTitle = "Edit quiz";
    const { quizzes } = useSelector(state => state.quiz);
    const dispatch = useDispatch()
    const navigate = useNavigate();
    useEffect(() => {
        // Dispatch fetchQuizzes action on component mount
        dispatch(fetchAllQuizzes(""));
    }, [dispatch]);

    useEffect(() => {
        const quiz = quizzes?.find(quiz => quiz._id === id);
        setQuiz(quiz);
    }
        , [quizzes, id])






    const handleSubmit = async (data) => {
        try {
            console.log(data);
            const res = await dispatch(updateQuiz({ id, updatedQuiz:data })).unwrap();
            toast.success(res.message);
            setTimeout(() => {
                navigate("/dashboard/quizzes")
            }, 800)
        }
        catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }


    return (
        <Form subTitle={subTitle} quiz={quiz} handleSubmit={handleSubmit} />
    )
}

export default EditQuiz