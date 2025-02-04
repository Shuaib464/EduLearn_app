import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { getInstructorData } from '../../../../services/operations/profileAPI';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';

const Instructor = () => {
    const {token} = useSelector((state)=> state.auth);
    const {user} = useSelector((state)=>state.profile);
    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(()=> {
        const getCourseDataWithStats = async() => {
            setLoading(true);
            
            const instructorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);

            console.log(instructorApiData);

            if(instructorApiData.length)
                setInstructorData(instructorApiData);

            if(result) {
                setCourses(result);
            }
            setLoading(false);
        }
        getCourseDataWithStats();
    },[])

    const totalAmount = instructorData?.reduce((acc,curr)=> acc + curr.totalAmountGenerated, 0);
    const totalStudents = instructorData?.reduce((acc,curr)=>acc + curr.totalStudentsEnrolled, 0);

  return (
    <div className='text-white'>
      <div className="mb-14  font-medium text-richblack-5">
        <h1 className='text-3xl font-bold'>Hi {user?.firstName}</h1>
        <p className='text-2xl my-2'>Let's start something new</p>
      </div>

      {loading ? (<div className='spinner'></div>)
      :courses.length > 0 
        ? (<div>
            <div>
            <div>
                <InstructorChart  courses={instructorData} className="flex" />
                <div className='flex flex-col py-3'>
                    <p className='font-bold text-3xl text-richblack-5'>Statistics</p>
                    <div className='flex justify-between  text-richblack-50 py-2'>
                        <p className='text-1xl'>Total Courses</p>
                        <p>{courses.length}</p>
                    </div>

                    <div className='flex justify-between  text-richblack-50 py-2'>
                        <p>Total Students</p>
                        <p>{totalStudents}</p>
                    </div>

                    <div className='flex justify-between  text-richblack-50 py-2'>
                        <p>Total Income</p>
                        <p>{totalAmount}</p>
                    </div>
                </div>
            </div>
        </div>
        <div>
            {/* Render 3 courses */}
            <div className='flex justify-between py-3'>
                <p className='font-bold text-2xl'>Your Courses</p>
                <Link to="/dashboard/my-courses">
                    <p className='font-edu-sa'>View all</p>
                </Link>
            </div>
            <div>
                {
                    courses.slice(0,3).map((course)=> (
                        <div className='flex my-5 flex-col'>
                            <img 
                                src={course.thumbnail}
                            />
                            <div className='flex flex-col my-2'>
                                <p className='font-bold'>{course.courseName}</p>
                                <div className='flex font-mono text-richblack-100 gap-3'>
                                    <p>{course.studentsEnrolled.length} students</p>
                                    <p> | </p>
                                    <p> Rs {course.price}</p>
                                </div>

                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
        </div>
        
        )
        :(<div>
            <p>You have not created any courses yet</p>
            <Link to={"/dashboard/add-course"}>
                Create a Course
            </Link>
        </div>)}
    </div>
  )
}

export default Instructor
