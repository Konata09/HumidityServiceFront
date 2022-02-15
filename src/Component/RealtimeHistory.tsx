import React, {useEffect, useState} from "react";
import {Api} from "../utils/api";
import dayjs from "dayjs";
import {Chart, Line, Tooltip} from "bizcharts";

interface PointData {
  pointValue: number;
  pointTime: string;
}

export const RealtimeHistory = (props: any) => {
  let pipeId: string;

  const getNodeHistory = async (nodeId: string) => {
    let now = dayjs();
    let from = now.subtract(30, 'm');
    return await Api.getNodeHistory(nodeId, from.toISOString(), now.toISOString());
  }

  const [data, setData] = useState<object[]>([])

  const getPipeHistory = async () => {
    let r = await Api.getPipelines();
    pipeId = r.data.pipelines[0].id;
    r = await Api.getNodes(pipeId, true, true);
    let nodeCount = r.data.count;
    let nodes = r.data.nodes;
    let lData: object[] = [];
    const c: string[] = [];
    for (let i = 1; i <= 30; i++) {
      c.push("node" + i);
    }
    await Promise.all(nodes.map(async (n: any) => {
      if (c.indexOf(n.tag) < 0) {
        return
      }
      let r2 = await getNodeHistory(n.id);
      let points = r2.data.points;
      for (const point of points) {
        let time = new Date(point.pointTime);
        time.setUTCMilliseconds(0);
        lData.push({
          tag: n.tag, time: time.toISOString(), value: point.pointValue
        })
      }
    }))
    setData(lData)
    // updateData();
  }

  function renderChart() {
    // @ts-ignore
    option = {
      title: {
        show: false
      }, legend: {
        data: [],
      }, tooltip: {
        trigger: 'axis',
        renderMode: 'richText',
        confine: true,
        appendToBody: true, // position: function (pos, params, el, elRect, size) {

        // var obj = {};
        // // @ts-ignore
        // obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 50;
        // // @ts-ignore
        // obj[['top', 'bottom'][+(pos[1] < size.viewSize[1] / 2)]] = 50;
        // console.log(obj)
        // return pos;
        // },
        order: 'seriesDesc', // formatter: function (params: any) {
        //   params = params[0];
        //   // var date = new Date(params.name);
        //   return (
        //     `${dayjsToString(params.value[0])}\n${params.value[1]}`
        //   );
        // },
        // textStyle: {
        //   fontWeight: 'bold',
        // },
        // axisPointer: {
        //   snap: true,
        //   type: 'cross',
        //   label: {
        //     precision: 0
        //   }
        // },
      }, xAxis: {
        type: 'time', splitLine: {
          show: false
        }
      }, yAxis: {
        type: 'value',
        min: (v: { min: number; }) => v.min - 50 >= 0 ? Math.round(v.min - 50) : 0,
        max: (v: { max: number; }) => v.max + 50,
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      }, dataZoom: [// {
        //   id: 'dataZoomX',
        //   type: 'slider',
        //   filterMode: 'empty'
        // }
      ], series: []
    };
  }

  useEffect(() => {
    getPipeHistory();
  }, []);
  // useEffect(() => {
  //   getPipeHistory().then((r) => {
  //     let data: DataItem[] = [];
  //     for (const nodePoint of nodePoints) {
  //       let time = new Date(nodePoint.pointTime);
  //       data.push({
  //         name: "nodePoint.pointTime",
  //         value: [
  //           time.toISOString(),
  //           nodePoint.pointValue
  //         ]
  //       })
  //     }
  //     // console.log(data)
  //     setSeriesData(data);
  //   })
  // }, [])

  const scale = {
    time: {
      type: "time", mask: "YYYY-MM-DD HH:mm:ss"
    },
  }
  return (<div id="realtime-history-canvas">
    <Chart autoFit data={data} scale={scale} appendPadding={20} theme={'my-theme'}>
      <Tooltip shared={true} showCrosshairs={true} showMarkers={true} offset={50} marker={{
        shadowColor: 'rgba(0,0,0,0.15)',
        shadowBlur: 2
      }}
               domStyles={{
                 "g2-tooltip": {
                   "border-radius": "0.5rem",
                   "box-shadow": "0 4px 15px rgba(0, 2, 4, .1), 0 0 3px rgba(0, 2, 4, .18)",
                   opacity: 1
                 },
                 "g2-tooltip-list": {fontSize: "1rem"},
                 "g2-tooltip-title": {fontSize: "1rem"},
                 "g2-tooltip-value": {fontWeight: 'bold'}
               }}/>
      <Line position="time*value" color="tag" shape="smooth"
            style={{opacity: 1, shadowColor: 'rgba(255,255,255,0)', shadowBlur: 0}}/>
    </Chart>
  </div>)
}
