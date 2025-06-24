import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [courseRes, modulesRes, enrollmentRes] = await Promise.all([
          axios.get(`https://lms-backend-xpwc.onrender.com/api/courses/${id}/`),
          axios.get(
            `https://lms-backend-xpwc.onrender.com/api/courses/${id}/modules/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(
            `https://lms-backend-xpwc.onrender.com/api/enrollments/${id}/check/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);
        setCourse(courseRes.data);
        setModules(modulesRes.data);
        setIsEnrolled(enrollmentRes.data.is_enrolled);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const enrollCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://lms-backend-xpwc.onrender.com/api/enrollments/`,
        { course_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEnrolled(true);
      toast.success("Successfully enrolled in course!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to enroll in course");
    }
  };

  const markAsCompleted = async (moduleId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://lms-backend-xpwc.onrender.com/api/modules/${moduleId}/complete/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh modules
      const res = await axios.get(
        `https://lms-backend-xpwc.onrender.com/api/courses/${id}/modules/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModules(res.data);
      toast.success("Marked as completed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update progress");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) return <div className="text-center py-8">Course not found</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>

        {!isEnrolled ? (
          <button
            onClick={enrollCourse}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Enroll in this course
          </button>
        ) : (
          <span className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            ✓ You are enrolled in this course
          </span>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Course Modules</h2>
        <div className="space-y-4">
          {modules.map((module) => (
            <div key={module.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{module.title}</h3>
                  <p className="text-gray-600 text-sm">{module.description}</p>
                </div>
                {module.completed ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                ) : isEnrolled ? (
                  <button
                    onClick={() => markAsCompleted(module.id)}
                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Mark Complete
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
