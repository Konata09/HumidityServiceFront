import React, {useContext, useEffect, useState} from "react";
import {Table} from "@arco-design/web-react";
import {PipeContext} from "../Context";
import {Api} from "../utils/api";
import dayjs from "dayjs";


export const NodePage = () => {
  const {pipeline, setPipeline} = useContext(PipeContext);
  const [nodes, setNodes] = useState<object[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (pipeline.pipeId) {
      Api.getNodes(pipeline.pipeId, true, true).then((r) => {
        setNodes(r.data.nodes)
        setLoading(false)
      })
    }
  }, [pipeline.pipeId])


  // useEffect(() => {
  //   console.log(pipeline)
  //   setTimeout(() => {
  //     setPipeline((pipeline: any) => ({...pipeline, pipeName: "32fff"}));
  //   }, 2000);
  // }, []);

  const cols = [
    {
      title: 'ID',
      dataIndex: 'id',
      className: "col-id col-center",
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
      },
      defaultSortOrder: 'ascend' as 'ascend',
    }, {
      title: '偏移',
      dataIndex: 'bias',
      className: "col-center"
    }, {
      title: '状态',
      dataIndex: 'status',
      render: (t: number) => t === 0 ? "正常" : "Failed",
      sorter: (a: any, b: any) => {
        return a.status - b.status;
      },
    }, {
      title: '最新数据',
      dataIndex: 'value',
      className: "col-center"
    }, {
      title: '最新数据时间',
      dataIndex: 'lastTime',
      className: "col-center",
      render: (t: string) => dayjs(t).format("YYYY-MM-DD HH:mm:ss")
    }, {
      title: '管道',
      dataIndex: 'pipeline',
      className: "col-id col-center"
    }
  ];

  return (
    <div className="flex-col node-page flex-center">
      <div className="page-title">节点列表</div>
      <Table data={nodes} columns={cols} pagination={{sizeCanChange: true, defaultPageSize: 30}} loading={loading}/>
    </div>
  )
}
