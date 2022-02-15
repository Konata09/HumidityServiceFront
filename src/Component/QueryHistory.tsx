import React from "react";
import {Axis, Chart, Line, Tooltip} from "bizcharts";

export const QueryHistory = (props: any) => {
  console.log(props)

  const scale = {
    time: {
      type: "time", mask: "YYYY-MM-DD HH:mm:ss",
    },
  }
  return (
    <div id="realtime-history-canvas">
      <Chart autoFit data={props.data} scale={scale} appendPadding={20} theme={'my-theme'}
             notCompareData={true}>
        <Tooltip shared={true} showCrosshairs={true} showMarkers={true} offset={50}
                 marker={{
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
        <Axis name="time" label={{
          formatter(text) {
            return text.slice(0, 16)
          }
        }}/>
      </Chart>
    </div>
  )
}
