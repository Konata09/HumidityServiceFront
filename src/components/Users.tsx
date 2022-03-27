import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
} from "@arco-design/web-react";
import { Api } from "../utils/api";
import { UserT } from "../Types";
import { UserContext } from "../Context";

export const UsersPage = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState<UserT[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [add, SetAdd] = useState(false);

  const [editForm] = Form.useForm();

  const roles = ["系统管理员", "操作员", "普通用户"];

  useEffect(() => {
    if (loading) {
      Api.adminGetUsers().then((r) => {
        if (r.data.count > 0) {
          setUsers(r.data.users);
        }
        setLoading(false);
      });
    }
  }, [loading]);

  const handleEdit = (record: any) => {
    SetAdd(false);
    editForm.clearFields();
    editForm.setFieldsValue({
      uid: record.uid,
      username: record.username,
    });
    setVisible(true);
  };

  const handleAdd = () => {
    SetAdd(true);
    editForm.clearFields();
    setVisible(true);
  };

  const handleDel = () => {
    const uid = editForm.getFieldValue("uid");
    uid &&
      Api.adminDeleteUser(uid).then(() => {
        setVisible(false);
      });
    setLoading(true);
  };

  const handleSubmit = () => {
    editForm.validate().then((res) => {
      setConfirmLoading(true);
      !add &&
        Api.adminPostUser(res.uid, res.newPassword).then(() => {
          setConfirmLoading(false);
          setVisible(false);
        });
      add &&
        Api.adminPutUser(res.username, res.newPassword, res.roleName).then(
          () => {
            setConfirmLoading(false);
            setVisible(false);
          }
        );
      setLoading(true);
    });
  };

  const cols = [
    {
      title: "UID",
      dataIndex: "uid",
      className: "col-id col-center",
    },
    {
      title: "用户名",
      dataIndex: "username",
      // sorter: (a: any, b: any) => tagSorter(a.tag, b.tag),
      // defaultSortOrder: "ascend" as const,
    },
    {
      title: "用户组",
      dataIndex: "roleName",
      // className: "col-center",
    },
    {
      title: "管理员权限",
      dataIndex: "isAdmin",
      className: "col-center",
      render: (t: boolean) => (t ? "是" : "否"),
    },
    {
      title: "操作员权限",
      dataIndex: "isStaff",
      className: "col-center",
      render: (t: boolean) => (t ? "是" : "否"),
    },
    {
      title: "操作",
      className: "col-center",
      render: (val: undefined, record: any) => (
        <Button onClick={() => handleEdit(record)}>修改</Button>
      ),
    },
  ];

  return (
    <div className="scroll-bfc white-background">
      <div className="flex-col node-page flex-center">
        <div className="page-title">用户列表</div>
        <Button
          className="upper-btn"
          type="primary"
          onClick={() => handleAdd()}
        >
          新增用户
        </Button>
        <Table
          data={users}
          columns={cols}
          pagination={{ sizeCanChange: true }}
          loading={loading}
        />
        <Modal
          title={add ? "新增用户" : "修改用户"}
          visible={visible}
          footer={
            <>
              {!add &&
              editForm.getFieldValue("username") !== "admin" &&
              editForm.getFieldValue("uid") !== user.uid ? (
                <Popconfirm
                  position="bottom"
                  title="确定要删除该用户吗?"
                  onOk={() => handleDel()}
                >
                  <Button status="danger">删除</Button>
                </Popconfirm>
              ) : (
                ""
              )}
              <Button onClick={() => setVisible(false)}>取消</Button>
              <Button
                loading={confirmLoading}
                onClick={() => handleSubmit()}
                type="primary"
              >
                确定
              </Button>
            </>
          }
        >
          <Form
            form={editForm}
            labelCol={{ style: { flexBasis: 100 }, span: 4 }}
            wrapperCol={{
              style: { flexBasis: "calc(100% - 100px)" },
              span: 20,
            }}
          >
            <Form.Item
              hidden={add}
              label="UID"
              field="uid"
              disabled={true}
              rules={[{ required: !add, message: "UID不能为空" }]}
              requiredSymbol={false}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="用户名"
              field="username"
              rules={[{ required: true, message: "用户名不能为空" }]}
              requiredSymbol={add}
              disabled={!add}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新密码"
              field="newPassword"
              requiredSymbol={true}
              rules={[{ required: true, message: "新密码不能为空" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              hidden={!add}
              label="用户组"
              field="roleName"
              requiredSymbol={true}
              rules={[{ required: add }]}
            >
              <Select defaultValue={roles[0]} options={roles} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};
