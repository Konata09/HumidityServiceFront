import React, {useContext, useEffect, useState} from "react";
import {Table} from "@arco-design/web-react";
import {PipeContext} from "../Context";
import {Api} from "../utils/api";
import dayjs from "dayjs";


export const NodePage = () => {
  const {pipeline, setPipeline} = useContext(PipeContext);
  const [nodes, setNodes] = useState<object[]>([]);

  useEffect(() => {
    if (pipeline.pipeId) {
      Api.getNodes(pipeline.pipeId, true, true).then((r) => {
        setNodes(r.data.nodes)
      })
    }
  }, [pipeline.pipeId])


  useEffect(() => {
    console.log(pipeline)
    setTimeout(() => {
      setPipeline((pipeline: any) => ({...pipeline, pipeName: "32fff"}));
    }, 2000);
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    }, {
      title: '标签',
      dataIndex: 'tag',
      sorter: (a: any, b: any) => {
        const numReg = /[\d]+|\D+/g;
        const t1 = a.tag;
        const t2 = b.tag;
        const m1 = t1.match(numReg);
        const m2 = t2.match(numReg);
        return m1[1] - m2[1];
      }
    }, {
      title: '偏移',
      dataIndex: 'bias',
    }, {
      title: '状态',
      dataIndex: 'status',
    }, {
      title: '最新数据',
      dataIndex: 'value',
    }, {
      title: '最新数据时间',
      dataIndex: 'lastTime',
      render: (t: string) => dayjs(t).format("YYYY-MM-DD HH:mm:ss")
    }, {
      title: '管道',
      dataIndex: 'pipeline'
    }
  ];

  return (
    <div className="flex-col node-page flex-center">
      <div className="page-title">节点列表</div>
      <Table columns={columns} data={nodes} pagination={{sizeCanChange: true}}/>
      <div>{pipeline.pipeName}</div>
      <div>{pipeline.pipeId}</div>
    </div>
  )
}
