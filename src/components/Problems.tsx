import React, { useEffect, useState } from "react";
import { Button, Table } from "@arco-design/web-react";
import { Api } from "../utils/api";
import { ProblemT } from "../Types";

export const ProblemsPage = () => {
  const [problems, setProblems] = useState<ProblemT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) {
      Api.getProblems().then((r) => {
        if (r.data.count > 0) {
          setProblems(r.data.problems);
        }
        setLoading(false);
      });
    }
  }, [loading]);

  const cols = [
    {
      title: "ID",
      dataIndex: "id",
      // className: "col-id col-center",
    },
    {
      title: "问题名称",
      dataIndex: "title",
      // sorter: (a: any, b: any) => tagSorter(a.tag, b.tag),
      // defaultSortOrder: "ascend" as const,
    },
    {
      title: "问题描述",
      dataIndex: "desc",
      // className: "col-center",
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      // render: (t: number) => (t === 0 ? "正常" : "Failed"),
      // sorter: (a: any, b: any) => {
      //   return a.status - b.status;
      // },
    },
    {
      title: "已确认",
      dataIndex: "acked",
      className: "col-center",
      // render: (val: number, record: any) => val + record.bias,
    },
    {
      title: "确认时间",
      dataIndex: "ackTime",
    },
    {
      title: "确认用户",
      dataIndex: "ackUser",
    },
    {
      title: "问题等级",
      dataIndex: "severity",
      className: "col-center",
      // render: (t: string) => dayjs(t).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "管道",
      dataIndex: "pipelineName",
      // className: "col-center",
    },
    {
      title: "节点",
      dataIndex: "nodeTag",
      // className: "col-center",
    },
    {
      title: "操作",
      className: "col-center",
      render: (val: undefined, record: any) => (
        <Button onClick={() => console.log(record)}>确认</Button>
      ),
    },
  ];

  return (
    <div className="scroll-bfc white-background">
      <div className="flex-col node-page flex-center">
        <div className="page-title">问题列表</div>
        <Table
          data={problems}
          columns={cols}
          pagination={{ sizeCanChange: true, defaultPageSize: 30 }}
          loading={loading}
        />
      </div>
    </div>
  );
};
