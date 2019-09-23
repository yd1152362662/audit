import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Icon, Input, Modal, Row, Select, Tag, DatePicker } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import UserAduitModal from './components/UserAduitModal';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListItem, TableListPagination, PaginationUserAuditParams } from './data.d';
import { StateType } from './model';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
import moment from 'moment';

type IScolorMapType = '#ccc' | 'orange' | 'green' | 'red';
const colorMap: IScolorMapType[] = ['#ccc', 'orange', 'green', 'red'];
const text = ['未验证', '验证中', '验证成功', '验证失败'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  loadingOpt: boolean;
  globalUserTableList: StateType;
}

interface TableListState {
  expandForm: boolean;
  formValues: { [key: string]: string };
  stepFormValues: any;
  currFormLabels: any;
  AduitUserModalVisible: boolean;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    globalUserTableList,
    loading,
  }: {
    globalUserTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    globalUserTableList,
    loading: loading.models.globalUserTableList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    expandForm: true,
    formValues: {},
    stepFormValues: {},
    currFormLabels: {},
    AduitUserModalVisible: false
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '审核状态',
      dataIndex: 'auditState',
      align: 'center',
      render(val: number) {
        if (val == null) {
          return <Tag color='#ccc'>未验证</Tag>;
        } else {
          return <Tag color={colorMap[val]}>{text[val]}</Tag>;
        }
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      align: 'center',
    },
    {
      title: '电话',
      dataIndex: 'phoneNum',
      align: 'center',
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      align: 'center',
    },
    {
      title: '注册时间',
      dataIndex: 'registryTime',
      align: 'center',
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      align: 'center',
      render(val: number) {
        if (val === 2) {
          return <Tag color='red'>司机</Tag>;
        } else if (val === 1) {
          return <Tag color='green'>经销商</Tag>;
        }
        else {
          return <></>
        }
      },

    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
      render(val: number) {
        if (val === 0) {
          return <Tag color='geekblue'>男</Tag>;
        } else {
          return <Tag color='magenta'>女</Tag>;
        }
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <>
          <Button type="primary" size='small' onClick={() => this.handleAduitUserModalVisible(true, record)}>用户审核</Button>
        </>
      ),
    },


  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'globalUserTableList/fetch'
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'keepArgs/resetAll',
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
      type: 'globalUserTableList/fetch',
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  /**
   * 分页逻辑
   */
  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch, form } = this.props;
    const randerTimeObj = {
      startDate: '',
      endDate: '',
    };
    if (form.getFieldValue('rangeTimeUserAduit') && form.getFieldValue('rangeTimeUserAduit').length !== 0) {
      randerTimeObj.startDate = moment(form.getFieldValue('rangeTimeUserAduit')[0]).format('YYYY-MM-DD');
      randerTimeObj.endDate = moment(form.getFieldValue('rangeTimeUserAduit')[1]).format('YYYY-MM-DD');
    }

    const params: Partial<PaginationUserAuditParams> = {
      ...randerTimeObj,
      name: form.getFieldValue('name'),
      phone: form.getFieldValue('phone'),
      idNumber: form.getFieldValue('idNumber'),
      auditState: form.getFieldValue('auditState'),
      userType:form.getFieldValue('userType'),
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
      type: 'globalUserTableList/fetch',
    });
  };


  /**
 * 查询的逻辑
 */
  handleSelectQuery = async (fields: any) => {
    const { form, dispatch } = this.props;
    const randerTimeObj = {
      startDate: '',
      endDate: '',
    };
    if (form.getFieldValue('rangeTimeUserAduit') && form.getFieldValue('rangeTimeUserAduit').length !== 0) {
      randerTimeObj.startDate = moment(form.getFieldValue('rangeTimeUserAduit')[0]).format('YYYY-MM-DD');
      randerTimeObj.endDate = moment(form.getFieldValue('rangeTimeUserAduit')[1]).format('YYYY-MM-DD');
    }

    dispatch({
      type: 'keepArgs/saveArgsParams',
      payload: {
        ...randerTimeObj,
        name: form.getFieldValue('name'),
        phone: form.getFieldValue('phone'),
        idNumber: form.getFieldValue('idNumber'),
        auditState: form.getFieldValue('auditState'),
        userType:form.getFieldValue('userType'),
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
      type: 'globalUserTableList/fetch',
    });

  };

  /**
   * 审核的弹窗
   */
  handleAduitUserModalVisible = (flag?: boolean, record?: any) => {
    // console.log('rocord', record);
    this.setState({
      AduitUserModalVisible: !!flag,
      currFormLabels: record,
    });
  };

  renderSimpleForm() {
    const { form } = this.props;

    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input allowClear placeholder="请输入姓名" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone')(
                <Input allowClear placeholder="请输入手机号" style={{ width: '100%' }} />,
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                更多 <Icon type="down" />
              </a>
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
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input allowClear placeholder="请输入姓名" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone')(
                <Input allowClear placeholder="请输入手机号" style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="身份证号">
              {getFieldDecorator('idNumber')(
                <Input allowClear placeholder="请输入身份证号" style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('auditState')(
                <Select placeholder="审核状态" allowClear style={{ width: '100%' }}>
                  <Option value={null}>全部</Option>
                  {
                    text.map((params, idx) => <Option key={params} value={idx}>{params}</Option>)
                  }
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="用户类型">
              {getFieldDecorator('userType')(
                <Select placeholder="用户类型" allowClear style={{ width: '100%' }}>
                  <Option value={null}>全部</Option>
                  <Option value={1}>经销商</Option>
                  <Option value={2}>司机</Option>
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="日期范围">
              {getFieldDecorator('rangeTimeUserAduit')(
                <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />,
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

  render() {
    const {
      loading,
      globalUserTableList: { data },
      dispatch
    } = this.props;

    const {
      AduitUserModalVisible,
      currFormLabels
    } = this.state
    // console.log(this.props)

    const parentMethods = {
      handleAduitUserModalVisible: this.handleAduitUserModalVisible,
      dispatch,
      loading,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              rowKey={record => record.id as any}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <UserAduitModal
          {...parentMethods}
          modalVisible={AduitUserModalVisible}
          currFormLabels={currFormLabels}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
