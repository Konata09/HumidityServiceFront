// import {line, Line} from "@antv/g2plot";
// import React, {useEffect, useLayoutEffect, useRef} from "react";

import {Line} from "@ant-design/plots";
import {memo} from "react";

const LineChart = (props: any) => {
  return (
    <Line data={props.data} smooth={true} theme="my-theme" autoFit={true}
          padding="auto" appendPadding={20} xField="time" yField="value" seriesField="tag"
          lineStyle={{opacity: 1, shadowColor: 'rgba(255,255,255,0)', shadowBlur: 0}}
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
  )
}

function areEqual(prevProps: any, nextProps: any): boolean {
  return prevProps.data === nextProps.data
}

export default memo(LineChart, areEqual);
