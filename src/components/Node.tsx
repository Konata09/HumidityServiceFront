import React, {useContext, useEffect, useState} from "react";
import {Button, Form, Input, InputNumber, Modal, Table} from "@arco-design/web-react";
import {PipeContext} from "../Context";
import {Api} from "../utils/api";
import dayjs from "dayjs";

export const NodePage = () => {
  const {pipeline, setPipeline} = useContext(PipeContext);
  const [nodes, setNodes] = useState<object[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editForm] = Form.useForm();

  useEffect(() => {
    if (pipeline.pipeId && loading) {
      Api.getNodes(pipeline.pipeId, true, true).then((r) => {
        setNodes(r.data.nodes)
        setLoading(false)
      })
    }
  }, [pipeline.pipeId, loading])

  const handleEdit = (record: any) => {
    editForm.setFieldsValue({tag: record.tag, bias: record.bias, id: record.id});
    setVisible(true);
  }

  const handleSubmit = () => {
    editForm.validate().then((res) => {
      setConfirmLoading(true);
      Api.postNode(res.id, res.tag, res.bias).then((r) => {
        setConfirmLoading(false);
        setVisible(false);
      })
      setLoading(true);
    });
  }

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
        if (m1[0] === m2[0]) {
          return m1[1] - m2[1];
        } else {
          return m1[0] - m2[0];
        }
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
      className: "col-center",
      render: (val: number, record: any) => val + record.bias
    }, {
      title: '最新数据时间',
      dataIndex: 'lastTime',
      className: "col-center",
      render: (t: string) => dayjs(t).format("YYYY-MM-DD HH:mm:ss")
    }, {
      title: '管道',
      dataIndex: 'pipeline',
      className: "col-id col-center"
    }, {
      title: '操作',
      className: "col-center",
      render: (val: undefined, record: any) => (<Button onClick={() => handleEdit(record)}>修改</Button>)
    }
  ];

  return (
    <div className="flex-col node-page flex-center">
      <div className="page-title">节点列表</div>
      <Table data={nodes} columns={cols} pagination={{sizeCanChange: true, defaultPageSize: 30}} loading={loading}/>
      <Modal
        title='修改节点'
        visible={visible}
        onOk={handleSubmit}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
      >
        <Form
          form={editForm}
          labelCol={{style: {flexBasis: 80}, span: 4}}
          wrapperCol={{style: {flexBasis: 'calc(100% - 80px)'}, span: 20}}
        >
          <Form.Item label='ID' field='id' disabled={true}>
            <Input/>
          </Form.Item>
          <Form.Item label='标签' field='tag' rules={[{required: true, message: "标签不能为空"}]} requiredSymbol={false}>
            <Input/>
          </Form.Item>
          <Form.Item label='偏移' field='bias' requiredSymbol={false}
                     rules={[{
                       required: true,
                       message: "范围: -100000 ~ 100000",
                       type: 'number',
                       min: -100000,
                       max: 100000
                     }]}>
            <InputNumber/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
