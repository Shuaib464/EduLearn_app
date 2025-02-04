import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux'
import IconBtn from '../../common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailsAPI';
import ReactStars from "react-rating-stars-component";

const CourseReviewModal = ({setReviewModal}) => {
    const {user} = useSelector((state)=>state.profile);
    const {token} = useSelector((state) => state.auth);
    const {courseEntireData} = useSelector((state)=> state.viewCourse);

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm();

    useEffect(()=> {
        setValue("courseExperience", "");
        setValue("courseRating", 0);
    },[])

    const ratingChanged = (newRating) => {
        setValue("courseRating", newRating);
    }

    const onSubmit = async(data) => {
        await createRating(
            {
                courseId:courseEntireData._id,
                rating:data.courseRating,
                review:data.courseExperience,
            },
            token
        );
        setReviewModal(false);
    }

  return (
    <div>
        <div>
            {/* Modal header */}
            <div className='text-richblack-5 flex flex-row justify-between font-bold'>
                <p>Add Review</p>
                <button 
                onClick={() => setReviewModal(false)}
                className='text-brown-100'
                >
                    Close
                </button>
            </div>

            {/* Modal Body */}
            <div>

                <div className='flex flex-row gap-4'>
                    <img 
                        src={user?.image}
                        alt='user Image'
                        className='aspect-square  w-[50px] rounded-full object-cover'
                    />
                    <div className=''>
                        <p className='font-bold text-richblack-200 text-lg'>{user?.firstName} {user?.lastName}</p>
                        <p className='text-richblack-300'>Posting Publicly</p>
                    </div>
                </div>


                <form
                onSubmit={handleSubmit(onSubmit)}
                className='mt-6 flex flex-col items-center'>

                    <ReactStars 
                        count={5}
                        onChange={ratingChanged}
                        size={24}
                        activeColor="#ffd700"
                    />

                    <div>
                        <label htmlFor='courseExperience'>
                            Add Your Experience*
                        </label>
                        <textarea 
                            id='courseExperience'
                            placeholder='Add Your Experience here'
                            {...register("courseExperience", {required:true})}
                            className='form-style min-h-[130px] w-full'
                        />
                        {
                            errors.courseExperience && (
                                <span>
                                    Please add your experience
                                </span>
                            )
                        }
                    </div>
                    {/* Cancel and Save button */}
                    <div className='flex flex-row gap-4'>
                        <button
                        onClick={() => setReviewModal(false)}
                        className='text-richblack-25 bg-richblack-500 px-2 rounded-md'
                        >
                            Cancel
                        </button>
                        <IconBtn 
                            text="save"
                        />
                    </div>


                </form>

            </div>
        </div>
    </div>
  )
}

export default CourseReviewModal
