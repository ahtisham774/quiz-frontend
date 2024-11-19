import { BASE_URL } from "../API";
const log = '/log'
export const fetchLogs = async () => {

    const response = await fetch(`${BASE_URL}${log}/all`, {
        method: "GET",
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
};


export const fetchStudentLogs = async (id) => {

    const response = await fetch(`${BASE_URL}${log}/get-student-results`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: id }),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
};


export const putLog = async (id, updatedLog) => {

    const response = await fetch(`${BASE_URL}${log}/${id}/update`, {
        method: "PUT",
        body: updatedLog
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
};

export const deleteLog = async (id) => {

    const response = await fetch(`${BASE_URL}${log}/${id}/delete`, {
        method: "DELETE"
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
};
