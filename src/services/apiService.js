import { BASE_URL } from "../API";
import { getAuthHeaders } from "../functions/hooks";


// Function to get headers
const GetHeaders = (type) => getAuthHeaders({ type });
const quiz = '/quiz'

// Fetch all quizzes
export const fetchQuizzes = async (topic) => {

    const response = await fetch(`${BASE_URL}${quiz}/all?topic=${topic}`, {
        method: "GET",
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
};
export const fetchGuestQuiz = async (topic) => {

    const response = await fetch(`${BASE_URL}${quiz}/guest?topic=${topic}`, {
        method: "GET",
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
};

// Add a new quiz
export const postQuiz = async (newQuiz) => {

    const response = await fetch(`${BASE_URL}${quiz}/create`, {
        method: "POST",

        body: newQuiz,
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
};

// Update a quiz
export const putQuiz = async (id, updatedQuiz) => {

    const response = await fetch(`${BASE_URL}${quiz}/${id}/update`, {
        method: "PUT",
        body: updatedQuiz
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
};

// Update availability of a quiz
export const updateAvailability = async (id) => {

    const response = await fetch(`${BASE_URL}${quiz}/${id}/toggle-availability`, {
        method: "GET"
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
};

// Delete a quiz
export const deleteQuiz = async (id) => {

    const response = await fetch(`${BASE_URL}${quiz}/${id}/delete`, {
        method: "DELETE"
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
};
