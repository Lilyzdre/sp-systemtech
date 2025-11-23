'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Check, Clock, Users, Star } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_weeks: number;
  category: string;
}

export default function CourseSelectionPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleEnroll = async () => {
    if (selectedCourses.length === 0) {
      alert('Please select at least one course');
      return;
    }

    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Create enrollments for selected courses
      const enrollments = selectedCourses.map(courseId => ({
        student_id: user.id,
        course_id: courseId,
        enrollment_date: new Date().toISOString(),
        status: 'active'
      }));

      const { error } = await supabase
        .from('enrollments')
        .insert(enrollments);

      if (error) throw error;

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (error) {
      console.error('Error enrolling in courses:', error);
      alert('Enrollment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Learning Path
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the courses you want to enroll in. You can choose multiple courses 
            and start your tech journey today!
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                selectedCourses.includes(course.id)
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
              onClick={() => toggleCourseSelection(course.id)}
            >
              <div className="p-6">
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
                  {selectedCourses.includes(course.id) && (
                    <div className="bg-orange-500 text-white p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {course.description}
                </p>

                {/* Course Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {course.duration_weeks} weeks
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {course.category}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">
                    ${course.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    one-time
                  </div>
                </div>
              </div>

              {/* Selection Indicator */}
              <div
                className={`border-t px-6 py-3 ${
                  selectedCourses.includes(course.id)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-50 text-gray-600'
                }`}
              >
                <div className="flex items-center justify-center text-sm font-medium">
                  {selectedCourses.includes(course.id) ? 'Selected' : 'Click to select'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Courses Summary */}
        {selectedCourses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Selected Courses ({selectedCourses.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {selectedCourses.map(courseId => {
                const course = courses.find(c => c.id === courseId);
                return course ? (
                  <div key={course.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium text-gray-900">{course.name}</span>
                    <span className="font-bold text-orange-600">${course.price}</span>
                  </div>
                ) : null;
              })}
            </div>
            
            {/* Total and Enroll Button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  Total: ${selectedCourses.reduce((total, courseId) => {
                    const course = courses.find(c => c.id === courseId);
                    return total + (course?.price || 0);
                  }, 0)}
                </div>
                <p className="text-sm text-gray-600">
                  {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''} selected
                </p>
              </div>
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </div>
          </div>
        )}

        {/* Continue Button (if no courses selected) */}
        {selectedCourses.length === 0 && (
          <div className="text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-600 transition-all duration-300"
            >
              Skip for Now
            </button>
            <p className="text-gray-600 mt-2 text-sm">
              You can always enroll in courses later from your dashboard
            </p>
          </div>
        )}
      </div>
    </div>
  );
}