import React, {Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {Api} from "../utils/api";
import dayjs from "dayjs";
import {PipeContext} from "../Context";
import {NodeT} from "../Types";
import LineChart from "./LineChart";
import {tagSorter} from "../utils/util";

export const RealtimeHistory = (props: any) => {
  const {pipeline} = useContext(PipeContext);
  const [data, setData] = useState<object[]>([]);
  const [showUpdateIcon, setShowUpdateIcon] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);
  const setDataRef = useRef<Dispatch<SetStateAction<object[]>> | null>(null);
  const dataRef = useRef<object[] | null>(null);
  const updateIconTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    getPipeHistory();
    if (!ws.current || ws.current?.readyState === 3 || ws.current?.readyState === 2) {
      establishWebsocket();
    }
    return () => {
      ws.current?.close(1000, navigator.userAgent)
    }
  }, []);

  useEffect(() => {
    dataRef.current = data;
    setDataRef.current = setData
  }, [data, setData])

  const getNodeHistory = async (nodeId: string) => {
    let now = dayjs();
    let from = now.subtract(30, 'm');
    return await Api.getNodeHistory(nodeId, from.toISOString(), now.toISOString());
  }

  const getPipeHistory = async () => {
    const r = await Api.getNodes(pipeline.pipeId, false, false);
    // let nodeCount = r.data.count;
    const nodes: NodeT[] = r.data.nodes;
    let lData: object[] = [];
    await Promise.all(nodes.map(async (n) => {
      let r2 = await getNodeHistory(n.id);
      let points = r2.data.points;
      for (const point of points) {
        lData.push({
          tag: n.tag,
          time: point.pointTime,
          value: point.pointValue + n.bias
        })
      }
    }))
    lData = lData.sort((a: any, b: any) => tagSorter(a.tag, b.tag))
    setData(lData)
  }

  const mergeData = (d: Array<NodeT>) => {
    if (setDataRef.current && dataRef.current) {
      let latestData: Array<object> = [];
      d.forEach((n) => {
        latestData.push({
          tag: n.tag,
          time: n.lastTime,
          value: n.value
        })
      })
      latestData = latestData.sort((a: any, b: any) => tagSorter(a.tag, b.tag))
      setDataRef.current(latestData.concat(dataRef.current))
    }
  }

  const establishWebsocket = () => {
    // ws.current = new WebSocket(`ws://${window.location.hostname}/ws`);
    ws.current = new WebSocket(`ws://101.34.57.204/ws`);
    ws.current.addEventListener('message', (e) => {
      if (updateIconTimer.current) {
        clearTimeout(updateIconTimer.current);
      }
      setShowUpdateIcon(true)
      updateIconTimer.current = setTimeout(() => setShowUpdateIcon(false), 450)
      const r = JSON.parse(e.data)
      mergeData(r.nodes)
    });
  }

  return (
    <>
      <div className="card-label card-realtime">实时数据
        <span className="iconfont icon-a-Arrowsvertical1-outlined"
              style={{opacity: showUpdateIcon ? 1 : 0}}/>
      </div>
      <div id="realtime-history-canvas">
        <LineChart data={data}/>
      </div>
    </>
  )
}
