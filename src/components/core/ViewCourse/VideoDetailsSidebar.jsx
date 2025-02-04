import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import { IoIosArrowBack } from "react-icons/io";
import { IoCaretBackCircleOutline } from "react-icons/io5";
const VideoDetailsSidebar = ({setReviewModal}) => {

    const [activeStatus, setActiveStatus] = useState("");
    const [videoBarActive, setVideoBarActive] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const {sectionId, subSectionId} = useParams();
    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures,
    } = useSelector((state)=>state.viewCourse);

    useEffect(()=> {
        const setActiveFlags = () => {
            if(!courseSectionData.length)
                return;
            const currentSectionIndex = courseSectionData.findIndex(
                (data) => data._id === sectionId
            )
            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
                (data) => data._id === subSectionId
            )
            const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id;
            //set current section here
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
            //set current sub-section here
            setVideoBarActive(activeSubSectionId);
        }
        setActiveFlags();
    },[courseSectionData, courseEntireData, location.pathname])

    const handleAddReview = () => {
        console.log("I am inside Add handleAddReview")
        setReviewModal(true);
    }

  return (
    <>
        <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">
            {/* for buttons and headings */}
            <div className="">
                {/* for buttons */}
                <div className="flex flex-row justify-between relative px-4 py-2 text-sm font-medium text-richblack-5 ">
                    <div 
                    onClick={()=> {
                        navigate("/dashboard/enrolled-courses")
                    }}
                    className="text-lg font-semibold text-richblack-400 py-2"
                    >
                        <IoIosArrowBack className='bg-richblack-5 rounded-lg w-6 h-6 cursor-pointer'/> 
                    </div>

                    <div>
                        <IconBtn 
                            text="Add Review"
                            onclick={() => handleAddReview()}
                        />
                    </div>

                </div>
                {/* for heading or title */}
                <div className='px-2 py-2'>
                    <p className='text-lg font-semibold text-richblack-5 py-2'>{courseEntireData?.courseName}</p>
                    <p className='text-sm text-richblack-200'>{completedLectures?.length} / {totalNoOfLectures}</p>
                </div>
            </div>

            {/* for sections and subSections */}
            <div>
                {
                    courseSectionData.map((course, index)=> (
                        <div
                        onClick={() => setActiveStatus(course?._id)}
                        key={index}
                        >

                            {/* section */}

                            <div className='bg-richblack-500 text-richblack-200'>
                                <div className=" text-richblack-25 font-bold py-2">
                                    {course?.sectionName}
                                </div>
                                {/* HW- add icon here and handle rotate 180 logic */}
                            </div>

                            {/* subSections */}
                            <div>
                                {
                                    activeStatus === course?._id && (
                                        <div>
                                            {
                                                course.subSection.map((topic, index) => (
                                                    <div
                                                    className={`flex gap-5 p-5 ${
                                                        videoBarActive === topic._id
                                                        ? "bg-yellow-200 text-richblack-900"
                                                        : "bg-richblack-900 text-white"
                                                    }`}
                                                    key={index}
                                                    onClick={() => {
                                                        navigate(
                                                            `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                                                        )
                                                        setVideoBarActive(topic?._id);
                                                    }}
                                                    >
                                                        <input
                                                        type='checkbox'
                                                        checked= {completedLectures.includes(topic?._id)}
                                                        onChange={() => {}}
                                                        />
                                                        <span>
                                                            {topic.title}
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </>
  )
}

export default VideoDetailsSidebar
