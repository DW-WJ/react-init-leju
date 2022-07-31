import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Input, Row, Table, Tooltip, Popconfirm, message } from 'antd';
import { pickBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { MStateType } from './model';
// import type { Loading,ConnectState} from '@/'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import AirticeEdit from './Components/AirticeEdit';
import styles from './index.less';

const naamespace = 'airtice';
type PropsType = {
  airticeList: [];
  totalCount: number;
  dispatch: Dispatch;
};

const ArticleList: React.FC<PropsType> = (props) => {
  const { airticeList, totalCount, dispatch } = props;
  // dispatch({
  //   type: `${naamespace}/findAirticlList`,
  //   payload: { start: 1, limit: 10 },
  // });
  const [size, setSize] = useState<SizeType>('large');
  const [pageStart, setpageStart] = useState<number>(1);
  const [pageSize, setpageSize] = useState<number>(10);
  const [params, setparams] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editId, setIeditId] = useState<string>('');
  useEffect(() => {
    dispatch({
      type: `${naamespace}/findAirticlList`,
      payload: { start: pageStart, limit: pageSize, params },
    });
  }, [pageStart, pageSize, params]);
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '封面图片',
      dataIndex: 'coverImg',
      key: 'coverImg',
      render: (text: string, record: any, index: number) => {
        return <img className={styles.coverImg} src={text} />;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },

    {
      title: '概要描述',
      dataIndex: 'summary',
      key: 'summary',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'setting',
      render: (text: string, record: any, index: number) => {
        return (
          <div>
            <Tooltip title="编辑">
              <Button
                className={styles.btn}
                title="编辑"
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => goEdit(record.id)}
              ></Button>
            </Tooltip>

            <Tooltip title="删除">
              <Popconfirm
                title="确定删除?"
                onConfirm={() => confirm(record.id)}
                onCancel={() => cancel(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  className={styles.btn}
                  title="删除"
                  danger
                  shape="circle"
                  icon={<DeleteOutlined />}
                ></Button>
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  const [form] = Form.useForm();
  const onChange = (pageNumber: number, pageSize: number) => {
    console.log('event', pageNumber, pageSize);
    setpageStart(pageNumber);
    setpageSize(pageSize);
  };
  const onSearch = (values: { title: string; author: string }) => {
    // let useParams = { ...values };
    let useParams = pickBy({ ...values }, (item) => item);
    setparams({
      ...useParams,
    });
    console.log(useParams);
  };
  const onReset = () => {
    form.resetFields();
    setparams({});
  };
  const goAdd = () => {
    setIeditId('');
    setIsModalVisible(true);
  };
  // 刷新列表
  const refrushList = () => {
    dispatch({
      type: `${naamespace}/findAirticlList`,
      payload: { start: pageStart, limit: pageSize, params },
    });
  };
  const goEdit = (id: string) => {
    console.log('id', id);
    setIeditId(id);
    setIsModalVisible(true);
  };
  const delAir = (id: string) => {
    console.log('del', id);
    dispatch({
      type: `${naamespace}/deteleAir`,
      payload: { id },
    });
  };
  const confirm = (id: string) => {
    console.log('id', id);
    dispatch({
      type: `${naamespace}/deteleAir`,
      payload: { id, refrushList },
    });

    // message.success('Click on Yes');
  };

  const cancel = (id: string) => {
    // console.log(e);
    message.error('取消删除！');
  };
  return (
    <PageContainer className={styles.main}>
      <Card title="条件查询" style={{ width: '100%', marginBottom: '30px' }}>
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onSearch} form={form}>
          <Row>
            <Col span={6}>
              <Form.Item label="标题" name="title">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="作者" name="author">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col span={6} offset={18} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: '30px' }} onClick={onReset}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card style={{ width: '100%', marginBottom: '30px' }}>
        <Row gutter={32}>
          <Col>
            <Button onClick={goAdd} type="primary">
              新增
            </Button>
          </Col>
        </Row>
      </Card>
      <Table
        pagination={{
          showQuickJumper: true,
          current: pageStart,
          pageSize: pageSize,
          total: totalCount,
          onChange,
        }}
        dataSource={airticeList}
        columns={columns}
        rowKey="id"
      />
      <AirticeEdit
        id={editId}
        refrushList={refrushList}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </PageContainer>
  );
};
const mapStateToProps = (state: MStateType) => ({
  airticeList: state[naamespace].airticeList,
  totalCount: state[naamespace].totalCount,
});
export default connect(mapStateToProps)(ArticleList);
