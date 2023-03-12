// import React, {useState, useEffect, useRef} from 'react';
// import * as d3 from 'd3';

// interface barChartProps{
//     data:any[];
//     isLoading:boolean;
//     isError:boolean;
// }

// const BarChart:React.FC<barChartProps> = ({data}):JSX.Element => {
//     const svgRef = useRef(null);
//     const margin = 10,paddingX = 60,paddingY = 25,
//           svgWidth = 370,svgHeight = 300,
//           height = svgHeight - margin,
//           width = svgWidth - margin;
          
    
//     const xScale = d3.scaleBand()
//         .domain(data.map(d => d.month))
//         .range([paddingY, width - paddingY]).padding(0.4)

//     const yScale = d3.scaleLinear()
//             .domain([0, d3.max(data, d => d.values.totalOrders)])
//             .range([height - paddingX , paddingX])
//             .clamp(true);

//     //defining the axes
//     const xAxis = d3.axisBottom(xScale);
//     const yAxis = d3.axisLeft(yScale);

//     useEffect(() => {
//         //defining the scales
//         console.log(data);

//         d3.select(svgRef.current)
//           .style("margin", margin)
//         //   .style("background-color", "#e1e9f4")
//           .style("border-radius", "10px")
//           .style("padding", "5px")

//         //adding scales
//         d3.select(svgRef.current)
//           .append("g")
//           .attr("transform", `translate(0, ${height - paddingX})`)
//           .call(xAxis)
//           .selectAll("text")  
//           .style("text-anchor", "end")
//           .attr("dx", "-.8em")
//           .attr("dy", ".20em")
//           .attr("transform", "rotate(-65)" );
        
//         d3.select(svgRef.current)
//           .append("g")
//           .attr("transform", `translate(${paddingY}, 0)`)
//           .call(yAxis.tickValues(d3.range(yScale.domain()[0], yScale.domain()[1] + 1, 1)));

//         //adding gridLines

//         //adding legends
//         d3.select(svgRef.current)
//           .append("rect")
//           .attr('x', width/2 - 90 - 21)
//           .attr('y', 15)
//           .attr('fill', 'rgb(0, 171, 0)')
//           .attr('width', 20)
//           .attr('height', 20)
//           .attr('ry', 2);

//         d3.select(svgRef.current)
//           .append("text")
//           .attr("x", width/2 - 88 )
//           .attr("y", 30)
//           .text("Successful orders")
        
//         d3.select(svgRef.current)
//           .append("text")
//           .attr("x",width/2 + 50 + 23)
//           .attr("y", 30)
//           .text("Total orders")

//         d3.select(svgRef.current)
//             .append("rect")
//             .attr('x', width/2 + 50)
//             .attr('y', 15)
//             .attr('fill', '#3c7aff')
//             .attr('width', 20)
//             .attr('height', 20)
//             .attr('ry', 2);

//         d3.selectAll(".domain")
//         .attr("stroke","gray");

//         d3.selectAll('.domain')
//         .selectAll('.tick')
//         .selectAll('line')
//         .attr('stroke', 'gray')

//     }, []);

//     return(
//         <>
//             <svg ref={svgRef} className='bar-chart-svg' width={svgWidth} height={svgHeight}>
//                 {/*Plotting the total number of orders */}
//                 {
//                     data.map((dataPoint,i) => (
//                         <rect
//                             key={i}
//                             x = {xScale(dataPoint.month)}
//                             y = {yScale(dataPoint.values.totalOrders)}
//                             width={xScale.bandwidth()}
//                             height={(height - paddingX) - yScale(dataPoint.values.totalOrders)}
//                             fill='#3c7aff'
//                         />
//                     ))
//                 }
//                 {/*Plotting the the completed orders */}
//                 {
//                     data.map((dataPoint,i) => (
//                         <rect
//                             key={i}
//                             x = {xScale(dataPoint.month)}
//                             y = {yScale(dataPoint.values.successfulOrders)}
//                             width={xScale.bandwidth() / 2}
//                             height={(height - paddingX) - yScale(dataPoint.values.successfulOrders)}
//                             fill='rgb(0, 171, 0)'
//                         />
//                     ))
//                 }

//             </svg>
//         </>
//     )
// }


// export default BarChart;
export {}