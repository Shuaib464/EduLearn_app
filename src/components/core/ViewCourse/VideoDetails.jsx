import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateUserReward } from '../../../services/operations/profileAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';
import {AiFillPlayCircle} from "react-icons/ai"

import IconBtn from "../../common/IconBtn";
import adVideo from "../../../assets/Images/Ad.mp4"
import { setUser } from '../../../slices/profileSlice';



const VideoDetails = (req) => {

  const {courseId, sectionId, subSectionId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const playerRef = useRef();
  const {token} = useSelector((state)=>state.auth);
  const {courseSectionData, courseEntireData, completedLectures} = useSelector((state)=>state.viewCourse);

  const [videoData, setVideoData] = useState([]);
  const [adEnded, setAdEnded] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [addSkip, setAddSkip] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {

    const setVideoSpecificDetails = async() => {
        if(!courseSectionData.length)
            return;
        if(!courseId && !sectionId && !subSectionId) {
            navigate("/dashboard/enrolled-courses");
        }
        else {
            //let's assume k all 3 fields are present

            const filteredData = courseSectionData.filter(
                (course) => course._id === sectionId
            )

            const filteredVideoData = filteredData?.[0].subSection.filter(
                (data) => data._id === subSectionId
            )

            setVideoData(filteredVideoData[0]);
            setVideoEnded(false);
            setAdEnded(false);
            setAddSkip(false);

        }
    }
    setVideoSpecificDetails();

  },[courseSectionData, courseEntireData, location.pathname])

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
    )

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
        (data) => data._id === subSectionId
    )
    if(currentSectionIndex === 0 && currentSubSectionIndex === 0) {
        return true;
    }
    else {
        return false;
    }
  } 

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
    )

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
        (data) => data._id === subSectionId
    )

    if(currentSectionIndex === courseSectionData.length - 1 &&
        currentSubSectionIndex === noOfSubSections - 1) {
            return true;
        }
    else {
        return false;
    }


  }

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
    )

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
        (data) => data._id === subSectionId
    )

    if(currentSubSectionIndex !== noOfSubSections - 1) {
        //same section ki next video me jao
        const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSectionIndex + 1]._id;
        //next video pr jao
        navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
    }
    else {
        //different section ki first video
        const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
        const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id;
        ///iss voide par jao 
        navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
    }
  }

  const goToPrevVideo = () => {

    const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
    )

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
        (data) => data._id === subSectionId
    )

    if(currentSubSectionIndex != 0 ) {
        //same section , prev video
        const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1];
        //iss video par chalge jao
        navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
    }
    else {
        //different section , last video
        const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
        const prevSubSectionLength = courseSectionData[currentSectionIndex - 1].subSection.length;
        const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[prevSubSectionLength - 1]._id;
        //iss video par chalge jao
        navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)

    }


  }

  const handleLectureCompletion = async() => {

    ///dummy code, baad me we will replace it witht the actual call
    setLoading(true);
    //PENDING - > Course Progress PENDING
    const res = await markLectureAsComplete({courseId: courseId, subSectionId: subSectionId}, token);
    //state update
    if(res) {
        dispatch(updateCompletedLectures(subSectionId)); 
    }
    setLoading(false);

  }

  const handleAdCompletion = async() => {

    setLoading(true);
    //PENDING - > Course Progress PENDING
    const res = await updateUserReward(token, 10, dispatch);

    // const {userId} = res.data;
    // const {userDeatils} = res.userDeatils;
    // console.log("user_id ", userDeatils);
    
    //state update
    // if(res) {
    //   dispatch(setUser({ ...res.data.userDetails }))
    // }
    handleLecturePlay();
    setLoading(false);

  }

  const handleSkipAdd = () => {
        setAddSkip(true);
        setAdEnded(true)
  }

  const handleLecturePlay = () => {
    setAdEnded(true);
    if(playerRef?.current) {
        playerRef.current?.seek(0);
        setVideoEnded(false);
    }

  }
  return (
    <div className="relative">
      {
        !videoData ? (<div>
                        No Data Found
                    </div>)
        : (
            <Player
                ref = {playerRef}
                aspectRatio="16:7"
                playsInline
                onEnded={addSkip || adEnded ? () => setVideoEnded(true) : () => handleAdCompletion()}
                src={addSkip || adEnded ? videoData?.videoUrl : adVideo}
                
                 >

                {/* <AiFillPlayCircle  className=''/> */}
            {
                !adEnded && (
                    <div className='py-3 mx-auto'>
                        <IconBtn 
                                        disabled={loading}
                                        onclick={() => handleSkipAdd()}
                                        text={!loading ? "Skip Add" : "Loading..."}
                                    /> 
                    </div>
                ) 
            }
                {
                    videoEnded && (
                        <div className='flex flex-row py-5 gap-4'>
                            {
                                !completedLectures.includes(subSectionId) && (
                                    <IconBtn 
                                        disabled={loading}
                                        onclick={() => handleLectureCompletion()}
                                        text={!loading ? "Mark As Completed" : "Loading..."}
                                        className="flex font-bold"
                                    />
                                )
                            }

                            <IconBtn 
                                disabled={loading}
                                onclick={() => {
                                    if(playerRef?.current) {
                                        playerRef.current?.seek(0);
                                        setVideoEnded(false);
                                    }
                                }}
                                text="Rewatch"
                                customClasses="text-xl"
                                className="flex"
                            />

                            <div className='flex gap-4'>
                                {!isFirstVideo() && (
                                    <button
                                    disabled={loading}
                                    onClick={goToPrevVideo}
                                    className='flex blackButton bg-richblack-600 font-extrabold text-2xl'
                                    >
                                        Prev
                                    </button>
                                )}
                                {!isLastVideo() && (
                                    <button
                                    disabled={loading}
                                    onClick={goToNextVideo}
                                    className='flex blackButton bg-richblack-600 font-extrabold text-2xl'>
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                }
            </Player>
        )
      }
      <div className='flex py-24 flex-col'>
            <h1 className='text-richblack-50 font-bold'>
                {videoData?.title}
            </h1>
            <p className='text-richblack-25 font-light'>
                {videoData?.description}
            </p>
      </div>
    </div>
  )
}

export default VideoDetails
