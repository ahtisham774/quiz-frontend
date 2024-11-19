// AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import { AUTH } from '../API';
import toast from 'react-hot-toast';

// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('quizToken') || null);
  const [loading, setLoading] = useState(true);

  // Check localStorage for user token and role
  useEffect(() => {
    const role = localStorage.getItem('quizRole');

    // Fetch the current user if token exists
    const fetchUser = async () => {


      try {
        const response = await fetch(`${AUTH}/user/me`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role }),
        });

        if (response.ok) {
          const userData = await response.json();
          setUser({
            _id: userData._id,
            email: userData.email,
            username: `${userData.firstName} ${userData.lastName}`,
            role: userData.role,
          });
          setLoading(false)
        } else {
          setUser(null);
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
        setLoading(false)
      }
    };

    fetchUser();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      fetch(`${AUTH}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            toast.error(data.message)
            throw new Error(data.message);
          }
          const { token, role } = data
          localStorage.setItem('quizToken', token);
          localStorage.setItem('quizRole', role);
          toast.success("Login Successful");
          setToken(token);
        })
        .catch(err => console.log(err))

      // if (!response.ok) {
      //   console.log(response.json())
      //   toast.error(response.message);
      //   throw new Error('Login failed');
      // }

      // const { token, role } = await response.json();

      // // Set the user data and save to localStorage
      // localStorage.setItem('quizToken', token);
      // localStorage.setItem('quizRole', role);
      // toast.success("Login Successful");
      // setToken(token);

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function to clear the user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('quizToken');
    localStorage.removeItem('quizRole');
  };

  if (loading) {
    return <div className='fixed w-screen min-h-screen h-full grid place-items-center'>
      <div className="animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-primary"></div>
    </div>
  }

  return (
    <AuthContext.Provider value={{ user, login, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
