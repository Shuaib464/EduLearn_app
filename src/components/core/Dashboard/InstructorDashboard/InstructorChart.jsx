import React, { useState } from 'react'

import {Chart, registerables} from "chart.js"
import {Pie} from "react-chartjs-2"

Chart.register(...registerables);

const InstructorChart = ({courses}) => {

    const [currChart, setCurrChart] = useState("students");

    //functio to genertae random colors
    const getRandomColors = (numColors) => {
        const colors = [];
        for(let i=0; i<numColors; i++) {
            const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random()*256)},
            ${Math.floor(Math.random()*256)})`
            colors.push(color);
        }
        return colors;
    }

    //create data for chart displaying student info

    const chartDataForStudents = {
        labels: courses.map((course)=> course.courseName),
        datasets: [
            {
                data: courses.map((course)=> course.totalStudentsEnrolled),
                backgroundColor: getRandomColors(courses.length),
            }
        ]
    }


    //create data for chart displaying iincome info
    const chartDataForIncome = {
        labels:courses.map((course)=> course.courseName),
        datasets: [
            {
                data: courses.map((course)=> course.totalAmountGenerated),
                backgroundColor: getRandomColors(courses.length),
            }
        ]
    }


    //create options
    const options = {

    };


  return (
    <div className='flex flex-col'>
      <p className='font-mono text-2xl font-semibold py-2'>Visualise</p>
      <div className='flex gap-x-5'>
        <button
        onClick={() => setCurrChart("students")}
        className={`flex blackButton ${currChart === "students" ? "bg-richblack-25" : "bg-richblack-300"} font-bold text-1xl text-richblack-700`}
        >
            Student
        </button>

        <button
        onClick={() => setCurrChart("income")}
        className={`flex blackButton ${currChart === "income" ? "bg-richblack-25" : "bg-richblack-300"} font-bold text-1xl text-richblack-700`}
        >
            Income
        </button>
      </div>
      <div className='flex my-2 text-1xl'>
        <Pie 
            data={currChart === "students" ? chartDataForStudents : chartDataForIncome}
            options={options}
        />
      </div>
    </div>
  )
}

export default InstructorChart
