import React, { useEffect, useState } from 'react'

import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay,FreeMode,Navigation, Pagination}  from 'swiper'
import ReactStars from "react-rating-stars-component"
import { apiConnector } from '../../services/apiconnector'
import { ratingsEndpoints } from '../../services/apis'
import { FaStar } from 'react-icons/fa'


const ReviewSlider = () => {

    const [reviews, setReviews] = useState([]);
    const truncateWords = 15;


    useEffect(() => {
        const fetchAllReviews = async() => {
            const {data} = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
            console.log("LOgging response in rating", data);

            if(data?.success) {
                setReviews(data?.data);
            }

            console.log("Printing Reviews", reviews);

        }
        fetchAllReviews();
    }, []);


  return (
    <div className='text-white'>
        <div className=''>
            <Swiper
            slidesPerView={4}
            spaceBetween={24}
            loop={true}
            freeMode={true}
            autoplay={{
                delay: 2500,
            }}
            modules={[FreeMode, Pagination, Autoplay]}
            className='w-full py-3'
            >

                {
                    reviews.map((review, index) => (
                        <SwiperSlide key={index}>
                            <div className='bg-richblack-600  flex flex-col py-2 px-4 rounded-lg items-start'>
                                <div className='flex flex-row gap-3 items-center'>
                                    <img
                                        src={review?.user?.image
                                        ? review?.user?.image
                                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`}
                                        alt='Profile Pic'
                                        className='h-9 w-9 object-cover rounded-full'
                                        />
                                    <p className='font-semibold'>{review?.user?.firstName} {review?.user?.lastName}</p>
                                </div>
                                <div className='flex flex-col text-richblack-300 py-1'>
                                    <p>{review?.course?.courseName}</p>
                                    <p>
                                        {review?.review}
                                    </p>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <p>{review?.rating.toFixed(1)}</p>
                                    <ReactStars 
                                        count={5}
                                        value={review.rating}
                                        size={20}
                                        edit={false}
                                        activeColor="#ffd700"
                                        emptyIcon={<FaStar />}
                                        fullIcon={<FaStar />}
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                }

            </Swiper>
        </div>
    </div>
  )
}

export default ReviewSlider
