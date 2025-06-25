import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseResponse = await axios.get(`https://lms-backend-xpwc.onrender.com/api/courses/${id}/`);
        setCourse(courseResponse.data);
        
        // Check if user is enrolled
        if (user) {
          try {
            const enrollmentsResponse = await axios.get('https://lms-backend-xpwc.onrender.com/api/enrollments/');
            const userEnrollment = enrollmentsResponse.data.find(e => e.course.id === parseInt(id));
            setEnrollment(userEnrollment);
          } catch (error) {
            // User not enrolled
            setEnrollment(null);
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const enrollInCourse = async () => {
    try {
      await axios.post('https://lms-backend-xpwc.onrender.com/api/enrollments/', { course_id: id });
      // Refresh enrollment status
      const enrollmentsResponse = await axios.get('https://lms-backend-xpwc.onrender.com/api/enrollments/');
      const userEnrollment = enrollmentsResponse.data.find(e => e.course.id === parseInt(id));
      setEnrollment(userEnrollment);
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  const markLessonCompleted = async (lessonId) => {
    try {
      await axios.post(`https://lms-backend-xpwc.onrender.com/api/enrollments/${enrollment.id}/complete_lesson/`, {
        lesson_id: lessonId
      });
      // Refresh enrollment status
      const enrollmentsResponse = await axios.get('https://lms-backend-xpwc.onrender.com/api/enrollments/');
      const userEnrollment = enrollmentsResponse.data.find(e => e.course.id === parseInt(id));
      setEnrollment(userEnrollment);
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading course details...</div>;
  }

  if (!course) {
    return <div className="p-8">Course not found</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-2">Instructor: {course.instructor}</p>
        <p className="text-gray-700">{course.description}</p>
        
        {!enrollment ? (
          <button
            onClick={enrollInCourse}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Enroll in this Course
          </button>
        ) : (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${(enrollment.completed_lessons.length / course.lessons.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {enrollment.completed_lessons.length} of {course.lessons.length} lessons completed
            </p>
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Course Content</h2>
      <div className="space-y-4">
        {course.lessons.map((lesson) => (
          <div key={lesson.id} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">{lesson.title}</h3>
            <p className="text-gray-600 mb-2">{lesson.content}</p>
            {enrollment && (
              <button
                onClick={() => markLessonCompleted(lesson.id)}
                disabled={enrollment.completed_lessons.some(l => l.id === lesson.id)}
                className={`px-3 py-1 rounded text-sm ${
                  enrollment.completed_lessons.some(l => l.id === lesson.id)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                }`}
              >
                {enrollment.completed_lessons.some(l => l.id === lesson.id) ? 'Completed' : 'Mark as Completed'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}