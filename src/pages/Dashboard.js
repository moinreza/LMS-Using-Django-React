import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await axios.get('https://lms-backend-xpwc.onrender.com/api/enrollments/');
        setEnrollments(data);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) {
    return <div className="p-8">Loading your courses...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h1>
      <h2 className="text-xl font-semibold mb-4">Your Enrolled Courses</h2>
      
      {enrollments.length === 0 ? (
        <p>You haven't enrolled in any courses yet. <Link to="/courses" className="text-indigo-600">Browse courses</Link></p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="border rounded-lg p-4 shadow">
              <h3 className="font-bold text-lg mb-2">{enrollment.course.title}</h3>
              <p className="text-gray-600 mb-3">{enrollment.course.description.substring(0, 100)}...</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${(enrollment.completed_lessons.length / enrollment.course.lessons.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {enrollment.completed_lessons.length} of {enrollment.course.lessons.length} lessons completed
              </p>
              <Link 
                to={`/courses/${enrollment.course.id}`}
                className="mt-3 inline-block text-indigo-600 hover:underline"
              >
                Continue Learning
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}