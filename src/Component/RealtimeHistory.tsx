import React, {useEffect, useState} from "react";
import {Api} from "../utils/api";
import dayjs from "dayjs";
import {Line} from "@ant-design/charts";

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
  }

  useEffect(() => {
    getPipeHistory();
  }, []);

  return (
    <div id="realtime-history-canvas">
      <Line data={data} smooth={true} theme="my-theme"
            padding="auto" appendPadding={20} xField="time" yField="value" seriesField="tag"
            lineStyle={{opacity: 1, shadowColor: 'rgba(255,255,255,0)', shadowBlur: 0}} autoFit={true}
            legend={{position: "bottom"}}
            meta={{
              time: {
                type: "time",
                mask: "YYYY-MM-DD HH:mm:ss",
                nice: true,
                maxTickCount: 30,
                tickMethod: ({min, max, tickCount}) => {
                  const avg = (max - min) / tickCount;
                  const ticks = [];
                  for (let i = min; i <= max; i += avg) {
                    ticks.push(i);
                  }
                  return ticks;
                }
              }
            }}
            tooltip={{
              shared: true, showCrosshairs: true, showMarkers: true, offset: 50, showNil: true,
              marker: {
                shadowColor: 'rgba(0,0,0,0.15)',
                shadowBlur: 2
              },
              domStyles: {
                "g2-tooltip": {
                  "border-radius": "0.5rem",
                  "box-shadow": "0 4px 15px rgba(0, 2, 4, .1), 0 0 3px rgba(0, 2, 4, .18)",
                  opacity: 1
                },
                "g2-tooltip-list": {fontSize: "1rem"},
                "g2-tooltip-title": {fontSize: "1rem"},
                "g2-tooltip-value": {fontWeight: 'bold'}
              }
            }}
            xAxis={{
              label: {
                formatter(text) {
                  return text.slice(0, 16)
                }
              }
            }}
      />
    </div>
  )
}
