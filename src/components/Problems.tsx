import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Spin, Table } from "@arco-design/web-react";
import { Api } from "../utils/api";
import { ProblemT } from "../Types";
import {
  IconCheckCircleFill,
  IconCloseCircleFill,
  IconExclamationCircleFill,
  IconInfoCircleFill,
  IconQuestionCircleFill,
} from "@arco-design/web-react/icon";
import dayjs from "dayjs";
import { GlobalContext } from "../Context";

export const ProblemsPage = () => {
  const [problems, setProblems] = useState<ProblemT[]>([]);
  const [problem, setProblem] = useState<ProblemT | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalLoading, setModalLoading] = useState<boolean>(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const { setProblemCount } = useContext(GlobalContext);

  useEffect(() => {
    if (loading) {
      Api.getProblems().then((r) => {
        if (r.data.count > 0) {
          const pros = r.data.problems;
          pros.sort((a: ProblemT, b: ProblemT) =>
            dayjs(a.startTime).isBefore(dayjs(b.startTime))
          );
          setProblems(pros);
          let count = 0;
          for (const pro of r.data.problems as Array<ProblemT>) {
            if (pro.acked === 0) {
              count++;
            }
          }
          setProblemCount(count);
        }
        setLoading(false);
      });
    }
  }, [loading]);

  const handleDetail = (record: any) => {
    setProblem(null);
    setModalLoading(true);
    setVisible(true);
    Api.getProblem(record.id).then((r) => {
      setProblem(r.data);
      setModalLoading(false);
    });
  };

  const handleAck = (id: string | null | undefined) => {
    if (id) {
      Api.setProblemAck(id).then(() => {
        setConfirmLoading(false);
        setVisible(false);
        setLoading(true);
      });
    }
  };

  const cols = [
    // {
    //   title: "问题等级",
    //   dataIndex: "severity",
    //   className: "col-center",
    // },
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   className: "col-id col-center",
    // },
    {
      title: "问题",
      dataIndex: "title",
      render: (name: string, r: ProblemT) => {
        let ico;
        switch (r.severity) {
          case 0:
            ico = (
              <IconCheckCircleFill className="icon-success problem-tbl-icon" />
            );
            break;
          case 1:
            ico = <IconInfoCircleFill className="icon-info problem-tbl-icon" />;
            break;
          case 2:
            ico = (
              <IconExclamationCircleFill className="icon-exclamation problem-tbl-icon" />
            );
            break;
          case 3:
          default:
            ico = (
              <IconCloseCircleFill className="icon-error problem-tbl-icon" />
            );
        }
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {ico}
            {name}
          </div>
        );
      },
    },
    // {
    //   title: "问题描述",
    //   dataIndex: "desc",
    // className: "col-center",
    // },
    // {
    //   title: "管道",
    //   dataIndex: "pipelineName",
    //   // className: "col-center",
    // },
    {
      title: "节点",
      dataIndex: "nodeTag",
      // className: "col-center",
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      // sorter: (a: any, b: any) => {
      //   return dayjs(a.startTime).isBefore(dayjs(b.startTime));
      // },
    },
    {
      title: "已确认",
      dataIndex: "acked",
      className: "col-center",
      render: (t: number) =>
        t === 1 ? (
          <IconCheckCircleFill className="icon-success problem-tbl-icon" />
        ) : undefined,
    },
    {
      title: "确认用户",
      dataIndex: "ackUser",
    },
    {
      title: "确认时间",
      dataIndex: "ackTime",
    },

    {
      title: "操作",
      className: "col-center",
      render: (val: undefined, record: any) => (
        <Button onClick={() => handleDetail(record)}>详细信息</Button>
      ),
    },
  ];

  let severity;
  switch (problem?.severity) {
    case 0:
      severity = (
        <>
          <IconCheckCircleFill className="icon-success problem-tbl-icon" />
          信息
        </>
      );
      break;
    case 1:
      severity = (
        <>
          <IconInfoCircleFill className="icon-info problem-tbl-icon" />
          信息
        </>
      );
      break;
    case 2:
      severity = (
        <>
          <IconExclamationCircleFill className="icon-exclamation problem-tbl-icon" />
          警告
        </>
      );
      break;
    case 3:
      severity = (
        <>
          <IconCloseCircleFill className="icon-error problem-tbl-icon" />
          错误
        </>
      );
      break;
    default:
      severity = (
        <>
          <IconQuestionCircleFill className="icon-unknown problem-tbl-icon" />
          未知
        </>
      );
  }

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
      <Modal
        closable={false}
        title="问题详情"
        visible={visible}
        footer={
          <>
            {problem?.acked === 0 ? (
              <Button
                status="warning"
                loading={confirmLoading}
                onClick={() => handleAck(problem?.id)}
              >
                确认问题
              </Button>
            ) : undefined}
            <Button type="secondary" onClick={() => setVisible(false)}>
              关闭
            </Button>
          </>
        }
      >
        <Spin loading={modalLoading} style={{ width: "100%" }}>
          <div className="flex-row">
            <table className="problem-detail-table">
              <tr>
                <td className="problem-detail-title">问题名称</td>
                <td>{problem?.title}</td>
              </tr>
              <tr>
                <td className="problem-detail-title">问题等级</td>
                <td style={{ display: "flex", alignItems: "center" }}>
                  {severity}
                </td>
              </tr>
              <tr>
                <td className="problem-detail-title">问题描述</td>
                <td>{problem?.desc}</td>
              </tr>
              <tr>
                <td className="problem-detail-title">开始时间</td>
                <td>{problem?.startTime}</td>
              </tr>
              <tr>
                <td className="problem-detail-title">已确认</td>
                <td style={{ display: "flex", alignItems: "center" }}>
                  {problem?.acked === 1 ? (
                    <>
                      <IconCheckCircleFill className="icon-success problem-tbl-icon" />
                      <span>&nbsp;</span>
                    </>
                  ) : (
                    <>
                      <IconQuestionCircleFill className="icon-unknown problem-tbl-icon" />
                      <span>未确认</span>
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="problem-detail-title">确认用户</td>
                <td>{problem?.ackUser}</td>
              </tr>
              <tr>
                <td className="problem-detail-title">确认时间</td>
                <td>{problem?.ackTime}</td>
              </tr>
              <tr>
                <td className="problem-detail-title">关联管道</td>
                <td>{problem?.pipelineName}</td>
              </tr>
              <tr>
                <td className="problem-detail-title">关联节点</td>
                <td>{problem?.nodeTag}</td>
              </tr>
            </table>
          </div>
        </Spin>
      </Modal>
    </div>
  );
};
