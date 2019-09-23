import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Row,
  Select,
  Col,
  Form,
  Input,
  Tag,
  DatePicker,
  Tabs,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import moment from 'moment';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListItem, TableListPagination, PaginationUserAuditParams } from './data.d';
import { StateType } from './model';
import HistoryAduitModal from './components/HistoryAduitModal';
import styles from './style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select

type IScolorMapType = '#ccc' | 'orange' | 'green' | 'red';
const colorMap: IScolorMapType[] = ['#ccc', 'orange', 'green', 'red'];
const text = ['未验证', '验证中', '验证成功', '验证失败'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  loadingOpt: boolean;
  globalReaordTableList: StateType;
  global: any;
}

interface TableListState {
  expandForm: boolean;
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  AduitHistoryModalVisible: boolean;
  currFormLabels: any;
  State: 1 | 2 | null | undefined;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    globalReaordTableList,
    global,
    loading,
  }: {
    globalReaordTableList: StateType;
    global: any;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    globalReaordTableList,
    global,
    loading: loading.models.globalReaordTableList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    expandForm: false,
    formValues: {},
    stepFormValues: {},
    AduitHistoryModalVisible: false,
    currFormLabels: {},
    State: null,
  };

  columnsUser: StandardTableColumnProps[] = [
    {
      title: '审核状态',
      dataIndex: 'auditSate',
      align: 'center',
      render(val: number) {
        if (val == null) {
          return <Tag color="#ccc">未验证</Tag>;
        }
        return <Tag color={colorMap[val]}>{text[val]}</Tag>;
      },
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: '身份证号',
      dataIndex: 'idNumber',
      align: 'center',
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      align: 'center',
    },
    {
      title: '审核时间',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <>
          <Button
            type="primary"
            size="small"
            onClick={() => this.handleHistoryAduitModalVisible(true, record, 1)}
          >
            审核记录
          </Button>
        </>
      ),
    },
  ];

  columnsCar: StandardTableColumnProps[] = [
    {
      title: '审核状态',
      dataIndex: 'auditSate',
      align: 'center',
      render(val: number) {
        if (val == null) {
          return <Tag color="#ccc">未验证</Tag>;
        }
        return <Tag color={colorMap[val]}>{text[val]}</Tag>;
      },
    },
    {
      title: '车牌号',
      dataIndex: 'plateNum',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      align: 'center',
    },
    {
      title: '审核时间',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <>
          <Button
            type="primary"
            size="small"
            onClick={() => this.handleHistoryAduitModalVisible(true, record, 2)}
          >
            审核记录
          </Button>
        </>
      ),
    },
  ];

  componentDidMount() { }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'keepArgs/resetAll',
    });
  }

  handleFormResetUser = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'keepArgs/resetAll',
    });
    dispatch({
      type: 'globalReaordTableList/fetchUser',
    });
  };

  handleFormResetCar = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'keepArgs/resetAll',
    });
    dispatch({
      type: 'globalReaordTableList/fetchCar',
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  /**
   * 分页逻辑User
   */
  handleStandardTableChangeUser = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch, form } = this.props;
    const randerTimeObj = {
      startDate: '',
      endDate: '',
    };
    if (form.getFieldValue('rangeTimeUser') && form.getFieldValue('rangeTimeUser').length !== 0) {
      randerTimeObj.startDate = moment(form.getFieldValue('rangeTimeUser')[0]).format('YYYY-MM-DD');
      randerTimeObj.endDate = moment(form.getFieldValue('rangeTimeUser')[1]).format('YYYY-MM-DD');
    }
    const params: Partial<PaginationUserAuditParams> = {
      ...randerTimeObj,
      type: 1,
      keyWord1: form.getFieldValue('idNumber'),
      keyWord2: form.getFieldValue('phone'),
      keyWord3: form.getFieldValue('name'),
      keyWord4: form.getFieldValue('auditStateUser'),
    };
    const pagenation: Partial<PaginationUserAuditParams> = {
      current: pagination.current,
      size: pagination.pageSize,
    };
    // console.log(params, pagenation);
    dispatch({
      type: 'keepArgs/saveArgsParams',
      payload: params,
    });
    dispatch({
      type: 'keepArgs/savePagenation',
      payload: pagenation,
    });
    dispatch({
      type: 'globalReaordTableList/fetchUser',
    });
  };

  /**
   * 分页逻辑Car
   */
  handleStandardTableChangeCar = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch, form } = this.props;
    const randerTimeObj = {
      startDate: '',
      endDate: '',
    };
    if (form.getFieldValue('rangeTimeCar') && form.getFieldValue('rangeTimeCar').length !== 0) {
      randerTimeObj.startDate = moment(form.getFieldValue('rangeTimeCar')[0]).format('YYYY-MM-DD');
      randerTimeObj.endDate = moment(form.getFieldValue('rangeTimeCar')[1]).format('YYYY-MM-DD');
    }
    const params: Partial<PaginationUserAuditParams> = {
      ...randerTimeObj,
      type: 2,
      keyWord1: form.getFieldValue('plateNum'),
      keyWord2: form.getFieldValue('auditStateCar'),
    };
    const pagenation: Partial<PaginationUserAuditParams> = {
      current: pagination.current,
      size: pagination.pageSize,
    };
    dispatch({
      type: 'keepArgs/saveArgsParams',
      payload: params,
    });
    dispatch({
      type: 'keepArgs/savePagenation',
      payload: pagenation,
    });
    dispatch({
      type: 'globalReaordTableList/fetchCar',
    });
  };

  /**
   * 查询的逻辑user
   */
  handleSelectQueryUser = async (fields: any) => {
    const { form, dispatch } = this.props;
    const randerTimeObj = {
      startDate: '',
      endDate: '',
    };
    if (form.getFieldValue('rangeTimeUser') && form.getFieldValue('rangeTimeUser').length !== 0) {
      randerTimeObj.startDate = moment(form.getFieldValue('rangeTimeUser')[0]).format('YYYY-MM-DD');
      randerTimeObj.endDate = moment(form.getFieldValue('rangeTimeUser')[1]).format('YYYY-MM-DD');
    }
    // keyWord1 身份证号 keyWord2 手机号 keyWord3 用户名 keyWord4 审核状态
    dispatch({
      type: 'keepArgs/saveArgsParams',
      payload: {
        ...randerTimeObj,
        type: 1,
        keyWord1: form.getFieldValue('idNumber'),
        keyWord2: form.getFieldValue('phone'),
        keyWord3: form.getFieldValue('name'),
        keyWord4: form.getFieldValue('auditStateUser'),
      },
    });
    dispatch({
      type: 'keepArgs/savePagenation',
      payload: {
        current: 1,
        size: 10,
      },
    });
    await dispatch({
      type: 'globalReaordTableList/fetchUser',
    });
  };

  /**
   * 查询的逻辑car
   */
  handleSelectQueryCar = async (fields: any) => {
    const { form, dispatch } = this.props;
    const randerTimeObj = {
      startDate: '',
      endDate: '',
    };
    if (form.getFieldValue('rangeTimeCar') && form.getFieldValue('rangeTimeCar').length !== 0) {
      randerTimeObj.startDate = moment(form.getFieldValue('rangeTimeCar')[0]).format('YYYY-MM-DD');
      randerTimeObj.endDate = moment(form.getFieldValue('rangeTimeCar')[1]).format('YYYY-MM-DD');
    }
    // keyWord1 车牌  keyWord2 审核状态（0未验证，1验证中，2验证通过，3验证失败）
    dispatch({
      type: 'keepArgs/saveArgsParams',
      payload: {
        ...randerTimeObj,
        type: 2,
        keyWord1: form.getFieldValue('plateNum'),
        keyWord2: form.getFieldValue('auditStateCar'),
      },
    });
    dispatch({
      type: 'keepArgs/savePagenation',
      payload: {
        current: 1,
        size: 10,
      },
    });
    await dispatch({
      type: 'globalReaordTableList/fetchCar',
    });
  };

  /**
   * 审核的弹窗
   */
  handleHistoryAduitModalVisible = (
    flag?: boolean,
    record?: any,
    StateNumber?: 1 | 2 | null | undefined,
  ) => {
    // console.log('rocord', record);

    this.setState({
      AduitHistoryModalVisible: !!flag,
      currFormLabels: record,
      State: StateNumber,
    });
  };

  render() {
    const {
      loading,
      dispatch,
      form: { getFieldDecorator },
      globalReaordTableList: { dataUser },
      globalReaordTableList: { dataCar },
      global,
    } = this.props;
    // console.log('globalReaordTableList', this.props);
    const { AduitHistoryModalVisible, currFormLabels, State } = this.state;

    const parentMethods = {
      handleHistoryAduitModalVisible: this.handleHistoryAduitModalVisible,
      dispatch,
      loading,
      global,
      State,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Tabs defaultActiveKey="user" animated={false}>
                {/* 用户审核历史 */}
                <TabPane tab="用户审核历史" key="user">
                  <Form layout="inline" style={{ marginTop: 15 }}>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                      <Col md={8} sm={24}>
                        <FormItem label="身份证号">
                          {getFieldDecorator('idNumber')(
                            <Input
                              allowClear
                              placeholder="请输入身份证号"
                              style={{ width: '100%' }}
                            />,
                          )}
                        </FormItem>
                      </Col>

                      <Col md={8} sm={24}>
                        <FormItem label="用户名">
                          {getFieldDecorator('name')(<Input allowClear placeholder="请输入姓名" />)}
                        </FormItem>
                      </Col>

                      <Col md={8} sm={24}>
                        <FormItem label="日期范围">
                          {getFieldDecorator('rangeTimeUser')(
                            <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />,
                          )}
                        </FormItem>
                      </Col>

                      <Col md={8} sm={24}>
                        <FormItem label="审核状态">
                          {getFieldDecorator('auditStateUser')(
                            <Select placeholder="审核状态" allowClear style={{ width: '100%' }}>
                              <Option value={null}>全部</Option>
                              <Option value={2}>验证成功</Option>
                              <Option value={3}>验证失败</Option>
                            </Select>,
                          )}
                        </FormItem>
                      </Col>
                      <Col md={8} sm={24}>
                        <FormItem label="手机号">
                          {getFieldDecorator('phone')(
                            <Input
                              allowClear
                              placeholder="请输入手机号"
                              style={{ width: '100%' }}
                            />,
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ float: 'right', marginBottom: 24 }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          onClick={this.handleSelectQueryUser}
                        >
                          查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormResetUser}>
                          重置
                        </Button>
                      </div>
                    </div>
                  </Form>
                    {/* 表格USER */}
                  <StandardTable
                    rowKey={record => record.id as any}
                    loading={loading}
                    data={dataUser}
                    columns={this.columnsUser}
                    onChange={this.handleStandardTableChangeUser}
                  />
                </TabPane>
                {/* 车辆审核历史 */}
                <TabPane tab="车辆审核历史" key="car">
                  <Form layout="inline">
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                      <Col md={8} sm={24}>
                        <FormItem label="车牌号">
                          {getFieldDecorator('plateNum')(
                            <Input
                              allowClear
                              placeholder="请输入车牌号"
                              style={{ width: '100%' }}
                            />,
                          )}
                        </FormItem>
                      </Col>

                      <Col md={8} sm={24}>
                        <FormItem label="审核状态">
                          {getFieldDecorator('auditStateCar')(
                            <Select placeholder="审核状态" allowClear style={{ width: '100%' }}>
                              <Option value={null}>全部</Option>
                              <Option value={2}>验证成功</Option>
                              <Option value={3}>验证失败</Option>
                            </Select>,
                          )}
                        </FormItem>
                      </Col>

                      <Col md={8} sm={24}>
                        <FormItem label="日期范围">
                          {getFieldDecorator('rangeTimeCar')(
                            <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />,
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ float: 'right', marginBottom: 24 }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          onClick={this.handleSelectQueryCar}
                        >
                          查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormResetCar}>
                          重置
                        </Button>
                      </div>
                    </div>
                  </Form>

                  {/* 表格CAR */}
                  <StandardTable
                    rowKey={record => record.id as any}
                    loading={loading}
                    data={dataCar}
                    columns={this.columnsCar}
                    onChange={this.handleStandardTableChangeCar}
                  />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </Card>

        <HistoryAduitModal
          {...parentMethods}
          modalVisible={AduitHistoryModalVisible}
          currFormLabels={currFormLabels}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
