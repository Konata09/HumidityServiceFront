import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Message,
  Select,
  Tag,
} from "@arco-design/web-react";
import dayjs from "dayjs";
import { Api } from "../utils/api";
import { PipeContext } from "../Context";
import { NodeT } from "../Types";
import LineChart from "./LineChart";
import { tagSorter } from "../utils/util";

export const QueryHistory = (props: any) => {
  const [selectedNode, setSelectedNode] = useState<NodeT[]>([]);
  const [startTime, setStartTime] = useState<dayjs.Dayjs>(
    dayjs().subtract(30, "m")
  );
  const [endTime, setEndTime] = useState<dayjs.Dayjs>(dayjs());
  const [data, setData] = useState<object[]>([]);
  const [nodes, setNodes] = useState<NodeT[]>([]);
  const { pipeline } = useContext(PipeContext);

  useEffect(() => {
    if (pipeline.pipeId) {
      const nodes_: NodeT[] = [];
      Api.getNodes(pipeline.pipeId, false, false).then((r) => {
        for (const node of r.data.nodes) {
          nodes_.push({ id: node.id, tag: node.tag, bias: node.bias });
        }
        nodes_.sort((a: any, b: any) => tagSorter(a.tag, b.tag));
        setNodes(nodes_);
        setSelectedNode(nodes_);
      });
    }
  }, [pipeline.pipeId]);

  const handleQuery = () => {
    if (selectedNode.length === 0) {
      Message.warning("请选择节点");
      return;
    }
    getSelectedHistory();
  };

  const getNodeHistory = async (
    nodeId: string,
    startTime: string,
    endTime: string,
    every: string
  ) => {
    return await Api.getNodeHistory(nodeId, startTime, endTime, every);
  };

  const getSelectedHistory = async () => {
    let every: string;
    const interval = endTime.diff(startTime, "h");
    if (interval < 1) {
      every = "";
    } else if (interval < 3) {
      every = "3m";
    } else if (interval < 6) {
      every = "6m";
    } else if (interval < 12) {
      every = "12m";
    } else if (interval < 24) {
      every = "30m";
    } else if (interval < 72) {
      every = "90m";
    } else if (interval < 168) {
      every = "2h";
    } else if (interval < 360) {
      every = "5h";
    } else if (interval < 720) {
      every = "10h";
    } else if (interval < 2160) {
      every = "1d";
    } else if (interval < 4320) {
      every = "2d";
    } else {
      every = "10d";
    }
    const lData: object[] = [];
    await Promise.all(
      selectedNode.map(async (n: NodeT) => {
        let bias = 0;
        for (const a of nodes) {
          if (a.id === n.id && a.bias) {
            bias = a.bias;
            break;
          }
        }
        const r = await getNodeHistory(
          n.id,
          startTime.toISOString(),
          endTime.toISOString(),
          every
        );
        const points = r.data.points;
        for (const point of points) {
          lData.push({
            tag: n.tag,
            time: point.pointTime,
            value: point.pointValue + bias,
          });
        }
      })
    );
    lData.sort((a: any, b: any) => tagSorter(a.tag, b.tag));
    setData(lData);
  };

  return (
    <>
      <div className="history-query-container flex-row">
        <div className="history-query-item">
          <span className="picker-label">开始时间</span>
          <DatePicker
            style={{ width: 180 }}
            className={"datetime-picker"}
            defaultValue={dayjs().subtract(30, "m").format("YYYY-MM-DD HH:mm")}
            showTime={true}
            format="YYYY-MM-DD HH:mm"
            onSelectShortcut={(s) => {
              const t = s.value.call(this);
              if (!Array.isArray(t)) {
                setStartTime(t);
              }
            }}
            onOk={(_, t) => setStartTime(t)}
            shortcutsPlacementLeft={true}
            shortcuts={[
              {
                text: "最近 1 小时",
                value: () => dayjs().subtract(1, "h"),
              },
              {
                text: "最近 3 小时",
                value: () => dayjs().subtract(3, "h"),
              },
              {
                text: "最近 6 小时",
                value: () => dayjs().subtract(6, "h"),
              },
              {
                text: "最近 12 小时",
                value: () => dayjs().subtract(12, "h"),
              },
              {
                text: "最近 1 天",
                value: () => dayjs().subtract(1, "d"),
              },
              {
                text: "最近 3 天",
                value: () => dayjs().subtract(3, "d"),
              },
              {
                text: "最近 7 天",
                value: () => dayjs().subtract(7, "d"),
              },
              {
                text: "最近 15 天",
                value: () => dayjs().subtract(15, "d"),
              },
              {
                text: "最近 1 个月",
                value: () => dayjs().subtract(1, "month"),
              },
              {
                text: "最近 3 个月",
                value: () => dayjs().subtract(3, "month"),
              },
              {
                text: "最近 6 个月",
                value: () => dayjs().subtract(6, "month"),
              },
            ]}
          />
        </div>
        <div className="history-query-item">
          <span className="picker-label">结束时间</span>
          <DatePicker
            style={{ width: 180 }}
            className={"datetime-picker"}
            defaultValue={dayjs()}
            showTime={true}
            onOk={(_, t) => setEndTime(t)}
            format="YYYY-MM-DD HH:mm"
          />
        </div>
        <div className="history-query-item">
          <span className="picker-label">节点</span>
          {nodes.length > 0 ? (
            <Select
              className="select-picker"
              mode="multiple"
              placeholder="请选择节点"
              style={{ width: 180 }}
              defaultValue={nodes.map((n) => n.id)}
              allowClear={true}
              labelInValue={true}
              onChange={(value, option) => {
                setSelectedNode(
                  value.map((n: any) => {
                    n.tag = n.label;
                    n.id = n.value;
                    return n;
                  })
                );
              }}
              filterOption={(inputValue, option) =>
                option.props.extra.indexOf(inputValue) >= 0
              }
              renderTag={(
                { label, value, closable, onClose },
                index,
                valueList
              ) => {
                const tagCount = valueList.length;
                if (tagCount > 1) {
                  return index === 0 ? (
                    <span
                      style={{ marginLeft: 8 }}
                    >{`已选择 ${tagCount} 个节点`}</span>
                  ) : null;
                }
                return (
                  <Tag
                    color="white"
                    closable={closable}
                    onClose={onClose}
                    style={{ margin: "2px 6px 2px 0", color: "#000" }}
                  >
                    {label}
                  </Tag>
                );
              }}
            >
              {nodes.map((node) => (
                <Select.Option key={node.id} value={node.id} extra={node.tag}>
                  {node.tag}
                </Select.Option>
              ))}
            </Select>
          ) : (
            ""
          )}
        </div>

        <div className="history-query-item">
          <Button
            type="primary"
            className="button-primary"
            onClick={handleQuery}
          >
            查询
          </Button>
        </div>
      </div>
      <div id="query-history-canvas">
        <LineChart data={data} />
      </div>
    </>
  );
};
