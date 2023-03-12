import React, {useState} from 'react';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ChartData
} from 'chart.js';

import {Bar, Chart} from 'react-chartjs-2';
import "./orders_bar_chart.scss";

interface OrdersBarCharProps{
    data:any[]
}

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
)

const OrdersBarChart:React.FC<OrdersBarCharProps> = ({data}):JSX.Element => {
    const dataSet:any = {
        labels:[...data.map((dataPoint) => dataPoint.month)],
        datasets:[
            {
                id:'1',
                label:'Total Orders',
                data:[...data.map((dataPoint) => dataPoint.values.totalOrders)],
                backgroundColor:"#3c7aff",
                borderWidth:1
            },
            {
                id:'2',
                label:'Completed Orders',
                data:[...data.map((dataPoint) => dataPoint.values.successfulOrders)],
                backgroundColor:"rgb(0, 171, 0)",
                borderWidth:1
            }
        ]
    }

    const options = {}

    return(
        <div className='orders-bar-chart'>
            <h3>Orders stats</h3>
            <Bar 
                data={dataSet}
                options = {options}
            />
        </div>
    )
}

export default OrdersBarChart;