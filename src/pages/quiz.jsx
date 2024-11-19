import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import BtnOutline from "../components/btnOutline";
import QuestionCard from "../components/QuestionCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllQuizzes } from "../redux/slices/quiz";
import { useAuth } from "../context/useAuth";
import { BASE_URL } from "../API";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Quiz = () => {
    const [quiz, setQuiz] = useState(null);
    const [notes, setNotes] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [state, setState] = useState("")
    const { user } = useAuth();


    const [answers, setAnswers] = useState([]);

    const [score, setScore] = useState(0);
    const alphabets = ["A", "B", "C", "D"];
    const { id } = useParams();
    const [showButtons, setShowButtons] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const { quizzes: data } = useSelector(state => state.quiz);
    const dispatch = useDispatch();
    const [isNotSelect, setIsNotSelect] = useState(true);


    useEffect(() => {
        // Dispatch fetchQuizzes action on component mount
        dispatch(fetchAllQuizzes());
    }, [dispatch]);

    useEffect(() => {
        if (id && data.length > 0) {  // Only runs when data is populated
            const quizData = data.find(q => q._id === id);
            if (quizData) {
                setQuiz(quizData);
                const questionIndexFromQuery = parseInt(searchParams.get('q')) || 0;

                setCurrentQuestionIndex(questionIndexFromQuery);
            } else {
                console.warn("Quiz not found for the given id");
            }
        }
    }, [id, data, searchParams]);


    useEffect(() => {
        if (searchParams.get('state') == "feedback" || searchParams.get('state') == "review") {
            try {
                fetch(`${BASE_URL}/result/get-results`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        quizId: id,
                        studentId: user._id
                    })
                }
                )
                    .then(response => response.json())
                    .then(d => {

                        setQuiz({ ...d.quizId, notes: d.notes });
                        setAnswers(d.questions);
                        setScore(d.score);

                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            }
            catch (error) {
                console.error(error);
            }

        }
    }, [searchParams])

    useEffect(() => {
        if (searchParams.get('state')) {
            setState(searchParams.get('state'));
        }

    }, [searchParams])

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handleStartQuiz = () => {

        setSearchParams({ state: "start", q: currentQuestionIndex });
    };

    const handleNextQuestion = () => {

        if (selectedOption == null) {
            setIsNotSelect(false);
            return;
        }


        if (currentQuestionIndex < quiz?.questions?.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSearchParams(
                searchParams => {

                    searchParams.set('q', currentQuestionIndex + 1)
                    return searchParams;
                }
            )
            setSelectedOption(answers[currentQuestionIndex + 1]?.userAnswer || null);


        } else {
            showResults();
        }
        setIsNotSelect(true);
    };



    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setSearchParams(
                searchParams => {

                    searchParams.set('q', currentQuestionIndex - 1)
                    return searchParams;
                }
            )
            setSelectedOption(answers[currentQuestionIndex - 1]?.userAnswer || null);
        }
    };
    const handleDownloadPDF = () => {
        const doc = new jsPDF();


        // Title and metadata
        doc.setFontSize(18);
        doc.text("Quiz Notes Report", 105, 20, { align: "center" });


        // Student name and date
        doc.setFontSize(12);
        doc.text(`Student: ${user?.username || "N/A"}`, 20, 40);
        doc.text(`Quiz: ${quiz?.name || "N/A"}`, 20, 50);
        doc.text(`Date: ${new Date(quiz?.date_created).toLocaleDateString("en-US", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            year: "numeric",
            month: "short",
            day: "numeric",
        })}`, 20, 60);

        // Notes section
        doc.setFontSize(14);
        doc.text("Notes", 20, 80);
        doc.setFontSize(12);

        doc.text(`Score: ${score}/${quiz?.questions?.length}`, 20, 70);
        doc.text(notes || quiz?.notes || "No notes written.", 20, 90, { maxWidth: 170, lineHeightFactor: 1.5 });

        // Add table for questions and answers if desired
        const questionData = answers.map((answer, index) => [
            index + 1,
            quiz?.questions[index]?.question || "",
            alphabets[answer.userAnswer],
            answer.isCorrect ? "Correct" : "Incorrect"
        ]);

        doc.autoTable({
            head: [["#", "Question", "Your Answer", "Result"]],
            body: questionData,
            startY: 150,
            theme: "grid"
        });

        doc.save(`Quiz_Notes_${quiz?.date_created}.pdf`);
    };
    const handleSelectOption = (option) => {
        setIsNotSelect(true);
        const currentQuestion = quiz.questions[currentQuestionIndex];

        const isCorrect = option == currentQuestion.answer;


        setAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            newAnswers[currentQuestionIndex] = {
                question: currentQuestion._id,
                userAnswer: option,
                isCorrect
            };
            return newAnswers;
        }
        )
        setSelectedOption(option);
    };

    const showResults = () => {

        if (user && searchParams.get('state') == "start") {



            const studentId = user._id;
            const quizId = quiz._id;

            const questions = answers
            const score = answers.filter(answer => answer.isCorrect).length;

            const data = {
                studentId,
                quizId,
                notes,
                questions,
                score

            }

            try {
                fetch(`${BASE_URL}/result/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
                )
                    .then(response => response.json())
                    .then(d => {
                        toast.success(d.message)
                        setScore(score);
                        setSearchParams({ state: "feedback" });
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            } catch (error) {
                console.error(error);
            }
        }
        else {
            const score = answers.filter(answer => answer.isCorrect).length;
            setScore(score);
            setSearchParams({ state: "feedback" });
        }

    };

    const handleReviewAnswers = () => {
        setSearchParams({ state: "review", q: currentQuestionIndex });

    };


    return (
        quiz &&
        <div className="w-full p-6 lg:px-24">

            {state == "" ? (
                <div className="flex flex-col items-start gap-6">
                    <h2 className="text-3xl font-bold">Instructions</h2>
                    <p className="text-lg text-[#999999]">Read the instructions carefully.</p>
                    {/* <ol className="text-lg list-inside list-decimal text-[#999999]">
                        {quiz && quiz.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                        ))}
                    </ol> */}
                    <p className="whitespace-pre-line text-[#999999]">{quiz.instructions}</p>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="instructionsCheckbox"
                            className="size-5 accent-primary "
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="instructionsCheckbox" className="text-lg text-[#999]">
                            I have read all the instructions carefully
                        </label>
                    </div>
                    <button
                        className={`py-2.5 px-6 bg-primary text-xl font-bold text-white transition-all ${!isChecked ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!isChecked}
                        onClick={handleStartQuiz}
                    >
                        Start Quiz
                    </button>
                </div>
            ) : state == "start" ? (
                <>
                    <QuestionCard
                        name={quiz.name}
                        img={quiz.questions[currentQuestionIndex]?.img}
                        index={currentQuestionIndex}
                        hint={quiz.questions[currentQuestionIndex]?.hint}
                        question={quiz.questions[currentQuestionIndex].question}
                        options={quiz.questions[currentQuestionIndex].options}
                        answer={quiz.questions[currentQuestionIndex].answer - 0}
                        selectedOption={selectedOption}
                        alphabets={alphabets}
                        showTimer={true}
                        timer={user ? quiz?.time : 0}
                        notes={quiz?.notes}
                        score={score}
                        handleSelectOption={handleSelectOption}
                        showNotes={true}
                        handleQuizEnd={showResults}
                        handleNotes={
                            (value) =>
                                setNotes(value)
                        }
                    >
                        <div className="flex justify-start items-center gap-5 mt-4">
                            {
                                currentQuestionIndex > 0 && <button
                                     className="py-2.5 px-6 bg-gray-300 text-xl font-semibold"
                                    onClick={handlePreviousQuestion}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    Previous
                                </button>}
                                {
                                    currentQuestionIndex > 0 &&
                                    <p className="font-medium text-xl">
                                        {
                                            currentQuestionIndex + 1 + " / "+ quiz.questions.length 
                                        }
                                
                                    </p>
                                }
                            <button
                                className="py-2.5 px-6 bg-primary text-xl font-bold text-white "
                                onClick={handleNextQuestion}

                            >
                                {
                                    currentQuestionIndex === quiz.questions.length - 1 ? "Submit" : "Next"
                                }
                            </button>


                        </div>
                        {
                            !isNotSelect && <div className="flex justify-start mt-4">
                                <p className="text-red-500 text-lg font-semibold jiggle">Please select an option to proceed</p>
                            </div>
                        }
                    </QuestionCard>
                </>
            ) : state == "feedback" ? (
                <div className="flex flex-col items-center gap-5 bg-cover bg-center bg-no-repeat" style={{ background: 'url(/assets/congrats.gif)' }}>
                    <img src="/assets/congrats.png" alt="Quiz Finished" className="w-full h-auto max-w-sm" />
                    <h2 className="text-3xl font-bold">Your Score</h2>
                    <p className="text-6xl text-primary font-bold">{score}/ {
                        quiz?.questions?.length
                    }</p>
                    <div className="flex gap-4">
                        <button className="py-2.5 px-6 bg-primary text-xl font-bold text-white transition-all" onClick={handleReviewAnswers}>
                            Review Answers
                        </button>
                        <button className="py-2.5 px-6 border-2 border-primary text-xl font-bold text-primary transition-all" onClick={handleDownloadPDF}>
                            Download Notes
                        </button>
                        {/* {
                            !pathname.includes("guest-mode") &&
                            <BtnOutline text="feedBack" handleClick={() => Navigate('feedback')} />} */}

                    </div>
                </div>

            ) : state == "review" ? (
                <>
                    <QuestionCard
                        isReview={true}
                        handleShowButtons={setShowButtons}
                        name={quiz.name}
                        hint={quiz.questions[currentQuestionIndex]?.hint}
                        notes={quiz?.notes || notes}
                        index={currentQuestionIndex}
                        syllabus={quiz.syllabus}
                        img={quiz.questions[currentQuestionIndex]?.img}
                        question={quiz.questions[currentQuestionIndex].question}
                        options={quiz.questions[currentQuestionIndex].options}
                        answer={quiz.questions[currentQuestionIndex].answer - 0}
                        selectedOption={
                            answers[currentQuestionIndex]?.userAnswer - 0
                        }
                        alphabets={alphabets}
                        showTimer={false}
                        timer={quiz?.time}
                        score={score}
                        handleSelectOption={handleSelectOption}
                        showNotes={true}
                    >
                        {
                            showButtons &&
                            <div className="flex justify-start items-center gap-5 mt-4">
                                <button
                                    className="py-2.5 px-6 bg-gray-300 text-xl font-semibold"
                                    onClick={handlePreviousQuestion}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    Previous
                                </button>
                                {
                                    currentQuestionIndex+1 > 0 &&
                                    <p className="font-medium text-xl">
                                        {
                                            currentQuestionIndex + 1 + " / "+ quiz.questions.length 
                                        }
                                
                                    </p>
                                }
                                <button
                                    className="py-2.5 px-6 bg-primary text-xl font-bold text-white "
                                    onClick={handleNextQuestion}

                                >
                                    Next
                                </button>
                            </div>}
                    </QuestionCard>
                </>
            ) : null
            }
        </div >
    );
};

export default Quiz;
