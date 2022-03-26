import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Api } from "../utils/api";
import dayjs from "dayjs";
import { PipeContext } from "../Context";
import { NodeT } from "../Types";
import LineChart from "./LineChart";
import { tagAndTimeSorter, tagSorter } from "../utils/util";
import { Message } from "@arco-design/web-react";

export const RealtimeHistory = (props: any) => {
  const { pipeline } = useContext(PipeContext);
  const [data, setData] = useState<object[]>([]);
  const [showUpdateIcon, setShowUpdateIcon] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);
  const setDataRef = useRef<Dispatch<SetStateAction<object[]>> | null>(null);
  const dataRef = useRef<object[] | null>(null);
  const updateIconTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getPipeHistory();
    if (
      !ws.current ||
      ws.current?.readyState === 3 ||
      ws.current?.readyState === 2
    ) {
      establishWebsocket();
    }
    return () => {
      ws.current?.close(1000, navigator.userAgent);
    };
  }, []);

  useEffect(() => {
    dataRef.current = data;
    setDataRef.current = setData;
  }, [data, setData]);

  const getNodeHistory = async (nodeId: string) => {
    const now = dayjs();
    const from = now.subtract(30, "m");
    return await Api.getNodeHistory(
      nodeId,
      from.toISOString(),
      now.toISOString()
    );
  };

  const getPipeHistory = async () => {
    const r = await Api.getNodes(pipeline.pipeId, false, false);
    // let nodeCount = r.data.count;
    const nodes: NodeT[] = r.data.nodes;
    const lData: object[] = [];
    await Promise.all(
      nodes.map(async (n) => {
        const r2 = await getNodeHistory(n.id);
        const points = r2.data.points;
        for (const point of points) {
          lData.push({
            tag: n.tag,
            time: point.pointTime,
            value: point.pointValue + n.bias,
          });
        }
      })
    );
    lData.sort((a: any, b: any) => tagSorter(a.tag, b.tag));
    setData(lData);
  };

  const mergeData = (d: Array<NodeT>) => {
    if (setDataRef.current && dataRef.current) {
      let latestData: Array<object> = [];
      d.forEach((n) => {
        latestData.push({
          tag: n.tag,
          time: n.lastTime,
          value: n.value,
        });
      });
      latestData = latestData.concat(dataRef.current);
      latestData.sort((a: any, b: any) => tagAndTimeSorter(a, b));
      setDataRef.current(latestData);
    }
  };

  const establishWebsocket = () => {
    // ws.current = new WebSocket(`ws://${window.location.hostname}/ws`);
    ws.current = new WebSocket(`ws://101.34.57.204/ws`);
    ws.current.addEventListener("message", (e) => {
      updateIconTimer.current && clearTimeout(updateIconTimer.current);
      setShowUpdateIcon(true);
      updateIconTimer.current = setTimeout(() => setShowUpdateIcon(false), 500);
      const r = JSON.parse(e.data);
      mergeData(r.nodes);
    });
    ws.current.addEventListener("close", (e) => {
      setShowUpdateIcon(false);
      updateIconTimer.current && clearTimeout(updateIconTimer.current);
      if (e.code !== 1000) {
        setTimeout(() => establishWebsocket(), 20000);
        Message.warning({
          content: "与服务器的连接中断, 20秒后重新连接",
          duration: 5000,
        });
      }
    });
  };

  return (
    <>
      <div className="card-label card-realtime">
        实时数据
        <span
          className="iconfont icon-a-Arrowsvertical1-outlined"
          style={{ opacity: showUpdateIcon ? 1 : 0 }}
        />
      </div>
      <div id="realtime-history-canvas">
        <LineChart data={data} />
      </div>
    </>
  );
};
