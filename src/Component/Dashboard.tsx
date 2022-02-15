import React, {useContext, useEffect, useState} from "react";
import {RealtimeHistory} from "./RealtimeHistory";
import {QueryHistory} from "./QueryHistory";
import {Button, DatePicker, Select, Tag} from "@arco-design/web-react";
import {PipeContext} from "../Context";
import {Api} from "../utils/api";
import {NodeT} from "../App";
import dayjs from "dayjs";

export const DashboardPage = () => {
  const Option = Select.Option;
  const [nodes, setNodes] = useState<NodeT[]>([]);
  const [selectedNode, setSelectedNode] = useState<object[]>([]);
  const [data, setData] = useState<object[]>([])
  const [startTime, setStartTime] = useState<dayjs.Dayjs>(dayjs().subtract(30, 'm'));
  const [endTime, setEndTime] = useState<dayjs.Dayjs>(dayjs());
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


  const getNodeHistory = async (nodeId: string, startTime: string, endTime: string, every: string) => {
    return await Api.getNodeHistory(nodeId, startTime, endTime, every);
  }


  const getSelectedHistory = async () => {
    let every: string;
    const interval = endTime.diff(startTime, 'h');
    if (interval < 1) {
      every = '';
    } else if (interval < 3) {
      every = '5m'
    } else if (interval < 6) {
      every = '10m'
    } else if (interval < 12) {
      every = '20m'
    } else if (interval < 24) {
      every = '40m'
    } else if (interval < 72) {
      every = '3h'
    } else if (interval < 168) {
      every = '7h'
    } else if (interval < 360) {
      every = '15h'
    } else if (interval < 720) {
      every = '1d'
    } else if (interval < 2160) {
      every = '3d'
    } else if (interval < 4320) {
      every = '6d'
    } else {
      every = '15d'
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

  const handleQuery = () => {
    getSelectedHistory()
  }

  return (
    <div className="flex-col dashboard flex-center">
      <div className="card">
        <div className="card-label">实时数据</div>
        <RealtimeHistory/>
      </div>
      <div className="card">
        <div className="card-label">数据查询</div>
        <div className="history-query-container flex-row">
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

          <span className="picker-label">结束时间</span>
          <DatePicker
            style={{width: 180}}
            className={"datetime-picker"}
            defaultValue={dayjs()}
            showTime={true}
            onOk={(_, t) => setEndTime(t)}
            format='YYYY-MM-DD HH:mm'
          />

          <span className="picker-label">节点</span>
          {nodes.length > 0 ? <Select
            className="select-picker"
            mode='multiple'
            placeholder='Please select'
            style={{width: 260}}
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
            // dropdownRender={(menu) => (
            //   <div>
            //     {menu}
            //     <Divider style={{margin: 0}}/>
            //     <div style={{display: 'flex', alignItems: 'center', padding: '8px 12px 4px 12px'}}>
            //       <Button
            //         style={{fontSize: 14, padding: '0 6px', boxShadow: "unset"}}
            //         type='text'
            //         size='mini'
            //         onClick={(e) => {
            //           console.log(menu)
            //         }}
            //       >
            //         全选
            //       </Button>
            //     </div>
            //   </div>
            // )}
            renderTag={({label, value, closable, onClose}, index, valueList) => {
              const tagCount = valueList.length;
              if (tagCount > 2) {
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

          <Button type='primary' className="button-primary" onClick={handleQuery}>
            查询
          </Button>

        </div>
        <QueryHistory data={data}/>
      </div>
    </div>
  )
}

