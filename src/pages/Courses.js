import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get('https://lms-backend-xpwc.onrender.com/api/courses/');
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="p-8">Loading courses...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="border rounded-lg p-4 shadow">
            <h2 className="font-bold text-xl mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-3">{course.description.substring(0, 150)}...</p>
            <p className="text-sm text-gray-500 mb-3">Instructor: {course.instructor}</p>
            <p className="text-sm text-gray-500 mb-3">{course.lessons.length} lessons</p>
            <Link
              to={`/courses/${course.id}`}
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              View Course
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}