import * as echarts from 'echarts';
import {useEffect, useRef} from "react";
import {Api} from "../utils/api";
import dayjs from "dayjs";

type EChartsOption = echarts.EChartsOption;

interface DataItem {
  name: string;
  value: [string, number];
}

interface PointData {
  pointValue: number;
  pointTime: string;
}

export const RealtimeHistory = (props: any) => {
  const canvasRef = useRef<HTMLElement>(null);
  let series: any[] = [];
  let legendData: string[] = [];
  // const [seriesData, setSeriesData] = useState<DataItem[]>([]);
  // const [legendData, setLegendData] = useState<string[]>([]);
  let chartInstance: echarts.ECharts | null = null;
  let pipeId: string;

  const getNodeHistory = async (nodeId: string) => {
    let now = dayjs();
    let from = now.subtract(1, 'hour');
    return await Api.getNodeHistory(nodeId, from.toISOString(), now.toISOString());
  }

  const updateData = () => {
    // @ts-ignore
    const renderInstance = echarts.getInstanceByDom(canvasRef.current);
    renderInstance?.setOption({
      series: series,
      legend: {data: legendData}
    });
    // console.log(series)
  }

  const getPipeHistory = async () => {
    let r = await Api.getPipelines();
    pipeId = r.data.pipelines[0].id;
    r = await Api.getNodes(pipeId);
    let nodeCount = r.data.count;
    let nodes = r.data.nodes;
    let lData: string [] = [];
    const c: string[] = [];
    for (let i = 1; i <= 30; i++) {
      c.push("node" + i);
    }
    await Promise.all(nodes.map(async (n: any) => {
      if (c.indexOf(n.tag) < 0) {
        return
      }
      legendData.push(n.tag);
      let r2 = await getNodeHistory(n.id);
      let points = r2.data.points;
      let seriesData: DataItem[] = [];
      for (const point of points) {
        let time = new Date(point.pointTime);
        time.setUTCMilliseconds(0);
        seriesData.push({
          name: n.tag,
          value: [time.toISOString(), point.pointValue]
        })
      }
      series.push({
        // showSymbol: false,
        name: n.tag,
        type: 'line',
        smooth: true,
        sampling: 'max',
        itemStyle: {
          opacity: 0
        },
        large: true,
        data: seriesData
      })
    }))
    updateData();
  }

  function renderChart() {
    // @ts-ignore
    const renderInstance = echarts.getInstanceByDom(canvasRef.current);
    if (renderInstance) {
      chartInstance = renderInstance;
    } else {
      // @ts-ignore
      chartInstance = echarts.init(canvasRef.current, null, {
        renderer: 'canvas',
        devicePixelRatio: window.devicePixelRatio
      });
    }
    let option: EChartsOption;
    option = {
      title: {
        show: false
      },
      legend: {
        data: [],
      },
      tooltip: {
        trigger: 'axis',
        renderMode: 'richText',
        confine: true,
        appendToBody: true,
        // position: function (pos, params, el, elRect, size) {

        // var obj = {};
        // // @ts-ignore
        // obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 50;
        // // @ts-ignore
        // obj[['top', 'bottom'][+(pos[1] < size.viewSize[1] / 2)]] = 50;
        // console.log(obj)
        // return pos;
        // },
        order: 'seriesDesc',
        // formatter: function (params: any) {
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
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        min: v => v.min - 50 >= 0 ? Math.round(v.min - 50) : 0,
        max: v => v.max + 50,
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      dataZoom: [
        // {
        //   id: 'dataZoomX',
        //   type: 'slider',
        //   filterMode: 'empty'
        // }
      ],
      series: []
    };
    chartInstance.setOption(option);
    chartInstance.resize();
    console.log(chartInstance.getOption());
  }

  useEffect(() => {
    renderChart();
    getPipeHistory();
  }, []);
  useEffect(() => {
    return () => {
      chartInstance && chartInstance.dispose();
    };
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

  const resize = () => {
    // canvasEl.height = canvasEl.clientHeight;
    // canvasEl.width = canvasEl.clientWidth;
  }
  return <canvas id="realtime-history-canvas" ref={canvasRef} {...props}/>
}

const ser = [
  {
    name: "tag1",
    value: [
      "time", "value"
    ]
  }, {
    name: "tag1",
    value: [
      "time", "value"
    ]
  }, {
    name: "tag2",
    value: [
      "time", "value"
    ]
  },
]
