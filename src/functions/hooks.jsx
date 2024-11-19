import { useEffect, useState } from "react";

export const getAuthHeaders = ({ type = "application/json" }) => {
    const token = localStorage.getItem("quizToken")
    return {
        'Content-Type': type,
        'Authorization': `Bearer ${token}`
    };
};



// GET request hook
export const useGet = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const headers = getAuthHeaders();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers,
                });
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, headers]);

    return { data, loading, error };
};

// POST request hook
export const usePost = (url) => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const headers = getAuthHeaders();

    const postData = async (body) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            const result = await res.json();
            setResponse(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { response, loading, error, postData };
};

// PUT request hook
export const usePut = (url) => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const headers = getAuthHeaders();

    const putData = async (body) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url, {
                method: 'PUT',
                headers,
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            const result = await res.json();
            setResponse(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { response, loading, error, putData };
};

// DELETE request hook
export const useDelete = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const headers = getAuthHeaders();

    const deleteData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url, {
                method: 'DELETE',
                headers,
            });
            if (!res.ok) throw new Error(`Error: ${res.status}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, deleteData };
};
