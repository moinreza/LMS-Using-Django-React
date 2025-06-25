import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user enrollments
        const { data } = await axios.get('https://lms-backend-xpwc.onrender.com/api/enrollments/');
        setEnrollments(data);
        
        // Set form data
        setFormData({
          name: user.name,
          email: user.email
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('https://lms-backend-xpwc.onrender.com/api/auth/user/', formData);
      // In a real app, you would update the user context here
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {editMode ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600">Name</p>
                <p className="text-lg">{user.name}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">Your Enrolled Courses</h2>
        {enrollments.length === 0 ? (
          <p>You haven't enrolled in any courses yet.</p>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">{enrollment.course.title}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${(enrollment.completed_lessons.length / enrollment.course.lessons.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {enrollment.completed_lessons.length} of {enrollment.course.lessons.length} lessons completed
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}