import ReactECharts from "echarts-for-react";
import * as echarts from 'echarts';
import axios from "axios";
import { useEffect, useState } from "react";
import { Title } from "chart.js";
import "../styles/Line.css"
import BURL from "./URL";

const WEEK_URL = BURL+"turbine/week"


export default function BasicChart({ id }) {
  const [tdata, setTdata] = useState([]);

  useEffect(() => {
    if (!id) return;

    const getTurbineData = async () => {
      try {
        const res = await axios.get(WEEK_URL, {
        params:{
          machine_id: id,
          offset: 0,
          limit: 100,
        }
      });
        setTdata(res.data);
        console.log("Fetched:", res.data);
      } catch (e) {
        console.error(e);
      }
    };

    getTurbineData();
    const interval = setInterval(getTurbineData, 10000);

    return () => clearInterval(interval);
  }, [id]); // 🔑 dependency

  const option = {
    tooltip: {
    trigger: "axis",
    
    formatter: (params) => {
    const time = new Date(params[0].data[0]).toLocaleString();
    return `
      <b>${time}</b><br/>
      Wind: ${params[0].data[1]} m/s<br/>
      Power: ${params[1].data[1]} kW
    `;
    }
    },
    legend: { data: ["Wind", "Power"] },
    title:{
      left:"center",
      text:"Wind Vs Power Curve"
    },
    toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    }
  },

    xAxis: { type: "time",splitLine: {
    type: "dashed",
    show: false
  } },
  axisTick: { show: true },

    

    yAxis: [
      { type: "value", name: "Wind (m/s)",splitLine: {
    show: false
  } },
      { type: "value", name: "Power (kW)",splitLine: {
    show: false
  } }
    ],
    dataZoom: [
  { type: "inside",
    start:90,
    end:100
   },   // mouse / touch zoom
  { type: "slider",
    start:80,
    end:100 }    // bottom scrollbar
],
animation: false,
progressive: 500,
progressiveThreshold: 3000,


    series: [
      {
        name: "Wind",
        type: "line",
        smooth: "true",
        showSymbol: false,
        yAxisIndex: 0,
        data: tdata.map(d => [
          new Date(d.created_at),
          d.wind
        ])
      },
      {
        name: "Power",
        type: "line",
        smooth: "true",
        showSymbol: false,
        yAxisIndex: 1,
        data: tdata.map(d => [
          new Date(d.created_at),
          d.power
        ])
      }
    ]
  };

  return (
    <div >
      <ReactECharts option={option} className="wp-chart" />
      <PowerTimeChart data={tdata} />
    </div>
  );
}

export function PowerTimeChart({ data }) {
  const option = {
    tooltip: {
      trigger: "axis",
      formatter: params => {
        const p = params[0];
        return `
          <b>${new Date(p.data[0]).toLocaleString()}</b><br/>
          Power: ${p.data[1]} kW
        `;
      }
    },
    title:{
      left:"center",
      text:"Power Curve"
    },
    toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    }
  },
    dataZoom: [
  { type: "inside",
    start:90,
    end:100
   },   // mouse / touch zoom
  { type: "slider",
    start:90,
    end:100
   }    // bottom scrollbar
],

    xAxis: {
      type: "time",
      name: "Time",
      smooth: "true",
      splitLine: { show: false }
    },

    yAxis: {
      type: "value",
      name: "Power (kW)",
      splitLine: { show: false }
    },

    series: [
      {
        name: "Power",
        type: 'line',
      symbol: 'none',
      sampling: 'lttb',
      itemStyle: {
        color: 'rgb(255, 70, 131)'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 158, 68)'
          },
          {
            offset: 1,
            color: 'rgb(255, 70, 131)'
          }
        ])
      },
      smooth: "true",
        showSymbol: false,
        animation: false,
        toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    }
  },
        data: data.map(d => [
          new Date(d.created_at),
          d.power
        ])
      }
    ]
  };

  return <ReactECharts option={option} className="p-chart"   />;
}
 