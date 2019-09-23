import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Modal,
  Row,
  Select,
  Tag,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import {
  TableListItem,
  TableListPagination,
  PaginationCarAuditParams,
} from './data.d';
import { StateType } from './model';
import CarAduitModal from './components/CarAduitModal';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

type IScolorMapType = '#ccc' | 'orange' | 'green' | 'red';
const colorMap: IScolorMapType[] = ['#ccc', 'orange', 'green', 'red'];
const text = ['未验证', '验证中', '验证成功', '验证失败'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  loadingOpt: boolean;
  globalCarTableList: StateType;
}

interface TableListState {
  expandForm: boolean;
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  currFormLabels: any;
  AduitCarModalVisible: boolean;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    globalCarTableList,
    loading,
  }: {
    globalCarTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    globalCarTableList,
    loading: loading.models.globalCarTableList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    expandForm: false,
    formValues: {},
    stepFormValues: {},
    currFormLabels:{},
    AduitCarModalVisible:false,
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '审核状态',
      dataIndex: 'truckVerifyState',
      align: 'center',
      render(val: number) {
        if (val == null) {
          return <Tag color="lime">未验证</Tag>;
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
      title: '车牌号',
      dataIndex: 'plateNum',
      align: 'center',
    },
    {
      title: '车型',
      dataIndex: 'truckModel',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <>
          <Button type="primary" size='small' onClick={() => this.handleAduitCarModalVisible(true, record)}>车辆审核</Button>
        </>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'globalCarTableList/fetch',
      payload: {
        current: 1,
        size: 10,
      },
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'keepArgs/resetAll',
    });
    dispatch({
      type: 'globalCarTableList/fetch',
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch, form } = this.props;

    const params: Partial<PaginationCarAuditParams> = {
      plateNum: form.getFieldValue('plateNum'),
      truckVerifyState: form.getFieldValue('truckVerifyState'),
    };
    const pagenation: Partial<PaginationCarAuditParams> = {
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
      type: 'globalCarTableList/fetch',
    });
  };


  /**
   * 查询的逻辑
   */
  handleSelectQuery = async (fields: any) => {
    const { form, dispatch } = this.props;
    // console.log('payload', {
    //   plateNum: form.getFieldValue('plateNum'),
    //   truckVerifyState: form.getFieldValue('truckVerifyState'),
    // });
    dispatch({
      type: 'keepArgs/saveArgsParams',
      payload: {
        plateNum: form.getFieldValue('plateNum'),
        truckVerifyState: form.getFieldValue('truckVerifyState'),
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
      type: 'globalCarTableList/fetch',
    });
  };

  renderSimpleForm() {
    const { form } = this.props;

    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="车牌">
              {getFieldDecorator('plateNum')(<Input allowClear placeholder="请输入车牌" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('truckVerifyState')(
                <Select placeholder="审核状态" allowClear style={{ width: '100%' }}>
                  <Option value={null}>全部</Option>
                  {text.map((params, idx) => (
                    <Option key={params} value={idx}>
                      {params}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" onClick={this.handleSelectQuery}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                更多 <Icon type="down" />
              </a> */}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="真实姓名">
              {getFieldDecorator('realName')(<Input allowClear placeholder="请输入真实姓名" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="联系电话">
              {getFieldDecorator('phone')(
                <Input allowClear placeholder="请输入联系电话" style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择用户状态" allowClear style={{ width: '100%' }}>
                  <Option value={1}>正常</Option>
                  <Option value={2}>锁定</Option>
                  <Option value={3}>禁用</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户类型">
              {getFieldDecorator('userType')(
                <Select placeholder="请选择用户类型" allowClear style={{ width: '100%' }}>
                  <Option value={1}>普通用户</Option>
                  <Option value={2}>管理员</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit" onClick={this.handleSelectQuery}>
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  /**
   * 审核的弹窗
   */
  handleAduitCarModalVisible = (flag?: boolean, record?: any) => {
    // console.log('rocord', record);
    this.setState({
      AduitCarModalVisible: !!flag,
      currFormLabels: record,
    });
  };

  render() {
    const {
      globalCarTableList: { data },
      loading,
      dispatch,
    } = this.props;

    const {
      AduitCarModalVisible,
      currFormLabels
    } =this.state
    // console.log(data);

    const parentMethods = {
      handleAduitCarModalVisible: this.handleAduitCarModalVisible,
      dispatch,
      loading,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>

            <StandardTable
              rowKey={record => record.id as any}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        <CarAduitModal
          {...parentMethods}
          modalVisible={AduitCarModalVisible}
          currFormLabels={currFormLabels}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
