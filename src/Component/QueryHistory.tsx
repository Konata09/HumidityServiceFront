import React, {useContext, useEffect, useState} from "react";
import {Line} from "@ant-design/charts";
import {Button, DatePicker, Select, Tag} from "@arco-design/web-react";
import dayjs from "dayjs";
import {Api} from "../utils/api";
import {PipeContext} from "../Context";
import {NodeT} from "../App";

export const QueryHistory = (props: any) => {
  const Option = Select.Option;

  const [selectedNode, setSelectedNode] = useState<object[]>([]);
  const [startTime, setStartTime] = useState<dayjs.Dayjs>(dayjs().subtract(30, 'm'));
  const [endTime, setEndTime] = useState<dayjs.Dayjs>(dayjs());
  const [data, setData] = useState<object[]>([])
  const [nodes, setNodes] = useState<NodeT[]>([]);
  const {pipeline, setPipeline} = useContext(PipeContext);
  useEffect(() => {
    if (pipeline.pipeId) {
      let nodes_: NodeT[] = [];
      Api.getNodes(pipeline.pipeId, false, false).then((r) => {
        for (const node of r.data.nodes) {
          nodes_.push({id: node.id, tag: node.tag})
        }
        setNodes(nodes_)
        setSelectedNode(nodes_)
      })
    }
  }, [pipeline.pipeId])


  const scale = {
    time: {
      type: "time", mask: "YYYY-MM-DD HH:mm:ss",
    },
  }

  const handleQuery = () => {
    getSelectedHistory()
  }

  const getNodeHistory = async (nodeId: string, startTime: string, endTime: string, every: string) => {
    return await Api.getNodeHistory(nodeId, startTime, endTime, every);
  }

  const getSelectedHistory = async () => {
    let every: string;
    const interval = endTime.diff(startTime, 'h');
    if (interval < 1) {
      every = '';
    } else if (interval < 3) {
      every = '3m'
    } else if (interval < 6) {
      every = '6m'
    } else if (interval < 12) {
      every = '12m'
    } else if (interval < 24) {
      every = '30m'
    } else if (interval < 72) {
      every = '90m'
    } else if (interval < 168) {
      every = '2h'
    } else if (interval < 360) {
      every = '5h'
    } else if (interval < 720) {
      every = '10h'
    } else if (interval < 2160) {
      every = '1d'
    } else if (interval < 4320) {
      every = '2d'
    } else {
      every = '10d'
    }
    let lData: object[] = [];
    const c: string[] = [];
    for (let i = 1; i <= 30; i++) {
      c.push("node" + i);
    }
    await Promise.all(selectedNode.map(async (n: any) => {
      if (c.indexOf(n.tag) < 0) {
        return
      }
      let r2 = await getNodeHistory(n.id, startTime.toISOString(), endTime.toISOString(), every);
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

  return (
    <>
      <div className="history-query-container flex-row">
        <div className="history-query-item">
          <span className="picker-label">开始时间</span>
          <DatePicker
            style={{width: 180}}
            className={"datetime-picker"}
            defaultValue={dayjs().subtract(30, "m").format("YYYY-MM-DD HH:mm")}
            showTime={true}
            format='YYYY-MM-DD HH:mm'
            onSelectShortcut={(s) => {
              const t = s.value.call(this)
              if (!Array.isArray(t)) {
                setStartTime(t)
              }
            }}
            onOk={(_, t) => setStartTime(t)}
            shortcutsPlacementLeft={true}
            shortcuts={[
              {
                text: '最近 1 小时',
                value: () => dayjs().subtract(1, 'h'),
              }, {
                text: '最近 3 小时',
                value: () => dayjs().subtract(3, 'h'),
              }, {
                text: '最近 6 小时',
                value: () => dayjs().subtract(6, 'h'),
              }, {
                text: '最近 12 小时',
                value: () => dayjs().subtract(12, 'h'),
              }, {
                text: '最近 1 天',
                value: () => dayjs().subtract(1, 'd'),
              }, {
                text: '最近 3 天',
                value: () => dayjs().subtract(3, 'd'),
              }, {
                text: '最近 7 天',
                value: () => dayjs().subtract(7, 'd'),
              }, {
                text: '最近 15 天',
                value: () => dayjs().subtract(15, 'd'),
              }, {
                text: '最近 1 个月',
                value: () => dayjs().subtract(1, 'month'),
              }, {
                text: '最近 3 个月',
                value: () => dayjs().subtract(3, 'month'),
              }, {
                text: '最近 6 个月',
                value: () => dayjs().subtract(6, 'month'),
              },
            ]}
          />
        </div>

        <div className="history-query-item">
          <span className="picker-label">结束时间</span>
          <DatePicker
            style={{width: 180}}
            className={"datetime-picker"}
            defaultValue={dayjs()}
            showTime={true}
            onOk={(_, t) => setEndTime(t)}
            format='YYYY-MM-DD HH:mm'
          />
        </div>

        <div className="history-query-item">
          <span className="picker-label">节点</span>
          {nodes.length > 0 ? <Select
            className="select-picker"
            mode='multiple'
            placeholder='Please select'
            style={{width: 180}}
            defaultValue={nodes.map(n => n.id)}
            allowClear={true}
            labelInValue={true}
            onChange={(v => {
              setSelectedNode(v.map((n: any) => {
                n.tag = n.label
                n.id = n.value
                return n
              }))
            })}
            renderTag={({label, value, closable, onClose}, index, valueList) => {
              const tagCount = valueList.length;
              if (tagCount > 1) {
                return index === 0 ? (
                  <span style={{marginLeft: 8}}>{`已选择 ${tagCount} 个节点`}</span>
                ) : null;
              }
              return (
                <Tag
                  color="white"
                  closable={closable}
                  onClose={onClose}
                  style={{margin: '2px 6px 2px 0', color: "#000"}}
                >
                  {label}
                </Tag>
              );
            }}
          >
            {nodes.map((node) => (
              <Option key={node.id} value={node.id}>
                {node.tag}
              </Option>
            ))}
          </Select> : ""}
        </div>

        <div className="history-query-item">
          <Button type='primary' className="button-primary" onClick={handleQuery}>
            查询
          </Button>
        </div>

      </div>
      <div id="query-history-canvas">
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
    </>
  )
}
