import React, {useContext, useEffect} from "react";
import {Table} from "@arco-design/web-react";
import {PipeContext} from "../Context";
import {Api} from "../utils/api";


export const NodePage = () => {
  const {pipeline, setPipeline} = useContext(PipeContext);

  useEffect(() => {
    console.log(pipeline.pipeId)
    Api.getNodes(pipeline.pipeId, true, true).then((r) => {
      console.log(r)
    })
  }, [pipeline.pipeId])


  useEffect(() => {
    console.log(pipeline)
    setTimeout(() => {
      setPipeline((pipeline: any) => ({...pipeline, pipeName: "32fff"}));
    }, 2000);
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Jane Doe',
      salary: 23000,
      address: '32 Park Road, London',
      email: 'jane.doe@example.com',
    },
    {
      key: '2',
      name: 'Alisa Ross',
      salary: 25000,
      address: '35 Park Road, London',
      email: 'alisa.ross@example.com',
    },
    {
      key: '3',
      name: 'Kevin Sandra',
      salary: 22000,
      address: '31 Park Road, London',
      email: 'kevin.sandra@example.com',
    },
    {
      key: '4',
      name: 'Ed Hellen',
      salary: 17000,
      address: '42 Park Road, London',
      email: 'ed.hellen@example.com',
    },
    {
      key: '5',
      name: 'William Smith',
      salary: 27000,
      address: '62 Park Road, London',
      email: 'william.smith@example.com',
    },
  ];
  return (
    <div className="flex-col node-page flex-center">
      <Table columns={columns} data={data}/>
      <div>{pipeline.pipeName}</div>
      <div>{pipeline.pipeId}</div>
    </div>
  )
}
