import {
  Form,
  Modal,
  Button,
  Spin,
  Card,
  Descriptions,
  Tag,
  List,
  Divider,
  Popconfirm,
  notification,
  Select,
  Empty
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React, { useState, useEffect } from 'react';
import { Dispatch } from 'redux';
import Zmage from 'react-zmage';
import styles from '../style.less';
import emptyPicture from '../../../../assets/empty.png'

interface EditorFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAduitCarModalVisible: () => void;
  dispatch: Dispatch;
  loading: boolean;
  currFormLabels: any;
}

const AduitCarForm: React.FunctionComponent<EditorFormProps> = props => {
  const BASICURL = 'https://duola.fantudl.com';
  // const BASICURL = 'http://172.16.9.62:8080';
  const { modalVisible, handleAduitCarModalVisible, currFormLabels, dispatch, loading } = props;

  // console.log('currFormLabels', currFormLabels);
  const { Option } = Select;
  const [Data, setData] = useState({ plateNum: '', truckModel: '', TruckHigh: '', selfWeight: '', truckWede: '' });
  const [PictureData, setPictureData] = useState<any[]>([]);
  const [AuditModalVisible, setAuditModalVisible] = useState(false);
  const [stateAudit, setStateAudit] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [auditStateText, setAuditStateText] = useState('');
  const [auditStatecolor, setAuditStatecolor] = useState('');
  const [userLoading, setUserLoading] = useState(true);
  const [children] = useState([
    <Option key="行驶证首页模糊不清，请重新拍照上传">行驶证首页模糊不清，请重新拍照上传</Option>,
    <Option key="行驶证副业模糊不清，请重新拍照上传">行驶证副业模糊不清，请重新拍照上传</Option>,
    <Option key="车辆45°C照片模糊不清，请重新拍照上传">车辆45°C照片模糊不清，请重新拍照上传</Option>,
  ]);
  useEffect(() => {
    if (modalVisible) {
      switch (currFormLabels.truckVerifyState) {
        case 0:
          setAuditStatecolor('#ccc');
          setAuditStateText('未验证');
          break;
        case 1:
          setAuditStatecolor('orange');
          setAuditStateText('验证中');
          break;
        case 2:
          setAuditStatecolor('green');
          setAuditStateText('验证成功');
          setStateAudit(true)
          break;
        case 3:
          setAuditStatecolor('red');
          setAuditStateText('验证失败');
          break;
        default:
          setAuditStatecolor('#ccc');
          setAuditStateText('未验证');
      }

      (dispatch as any)({
        type: 'Overall/fetchCar',
        payload: {
          id: currFormLabels.id,
        },
      }).then((data: any) => {
        // console.log('data', data);
        if (data) {
          setUserLoading(false)
          setData(data);
          const listData: any[] = [
            {
              avatar: `${BASICURL}${data.drivingpermitHome}`,
              title: '行驶证首页',
            },
            {
              avatar: `${BASICURL}${data.drivingpermitVice}`,
              title: '行驶证副页',
            },
            {
              avatar: `${BASICURL}${data.truckPhoto}`,
              title: '车辆45°C照片',
            },
          ];
          setPictureData(listData);
        }
      });
    } else {
      setData({ plateNum: '', truckModel: '', TruckHigh: '', selfWeight: '', truckWede: '' });
      setPictureData([]);
      setStateAudit(false);
      setUserLoading(true)
    }
  }, [modalVisible]);

  // 审核通过的函数
  const handleAuditOk = () => {
    // console.log('通过');
    setStateAudit(true);
    setUserLoading(true)
    dispatch({
      type: 'Overall/carAudit',
      payload: {
        id: currFormLabels.id,
        auditState: 2,
      },
      callback: async (response: any) => {
        // console.log('success', response);
        setStateAudit(false);
        if (!!response && response.success) {
          await setStateAudit(false);
          await notification.success({
            message: response.message,
            top: 0,
          });
          await handleAduitCarModalVisible();
          // 刷新表格
          await dispatch({
            type: 'globalCarTableList/fetch',
          });
        } else {
          await setStateAudit(false);
          notification.error({
            message: response.message,
            top: 0,
          });
        }
      },
    });
  };

  // 审核驳回确认的函数
  const handleNotAuditOk = () => {
    console.log('驳回确认');
    setStateAudit(true);
    setUserLoading(true)
    console.log(selectedItems);
    dispatch({
      type: 'Overall/carAudit',
      payload: {
        id: currFormLabels.id,
        auditState: 3,
        opinions: selectedItems,
      },
      callback: async (response: any) => {
        // console.log('success', response);
        if (!!response && response.success) {
          await setStateAudit(false);
          await notification.success({
            message: response.message,
            top: 0,
          });
          await setAuditModalVisible(false);
          await setSelectedItems([]);
          await handleAduitCarModalVisible();
          // 刷新表格
          await dispatch({
            type: 'globalCarTableList/fetch',
          });
        } else {
          await setStateAudit(false);
          notification.error({
            message: response.message,
            top: 0,
          });
        }
      },
    });
    setAuditModalVisible(false);
  };

  // 审核驳回选择原因函数
  const handleSelectChange = (selectedItems: any) => {
    setSelectedItems(selectedItems);
  };

  // 审核驳回返回的函数
  const handleNotAuditCancel = () => {
    // console.log('驳回返回');
    setAuditModalVisible(false);
  };

  return (
    <Modal
      destroyOnClose
      width="70%"
      style={{ top: 60 }}
      bodyStyle={{ height: '80vh', overflow: 'hidden', overflowY: 'auto', padding: 0 }}
      title="审核车辆"
      visible={modalVisible}
      onCancel={() => {
        handleAduitCarModalVisible();
      }}
      footer={[
        <>
          <Button
            key="submit"
            type="danger"
            size="small"
            onClick={() => {
              setAuditModalVisible(true);
            }}
            disabled={stateAudit}
          >
            审核驳回
          </Button>
          <Modal
            title="审核驳回"
            visible={AuditModalVisible}
            onOk={handleNotAuditOk}
            onCancel={handleNotAuditCancel}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              value={selectedItems}
              placeholder="请选择或者填写审核驳回原因"
              onChange={handleSelectChange}
            >
              {children}
            </Select>
          </Modal>
        </>,
        <Popconfirm
          title="此操作为不可撤销操作，您确认审核的所有信息都通过吗?"
          onConfirm={handleAuditOk}
          okText="确认"
          cancelText="返回"
        >
          <Button key="back" type="primary" size="small" disabled={stateAudit}>
            审核通过
          </Button>
        </Popconfirm>,
      ]}
    >
      <Card bordered={false} loading={userLoading} style={{ padding: '0 24px' }}>
        {/* 用户基本信息 */}
        <Spin spinning={loading}>
          <Descriptions title="车辆基本信息">
            <Descriptions.Item label="审核状态">
              <Tag color={auditStatecolor}>{auditStateText}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="车牌号">{Data.plateNum}</Descriptions.Item>
            <Descriptions.Item label="车型">{Data.truckModel}</Descriptions.Item>
            <Descriptions.Item label="车重">{Data.selfWeight}</Descriptions.Item>
            <Descriptions.Item label="车高">{Data.truckHigh}</Descriptions.Item>
            <Descriptions.Item label="车宽">{Data.truckWede}</Descriptions.Item>
          </Descriptions>
        </Spin>
        <Divider />

        {/* 用户基本信息 */}
        <Spin spinning={userLoading}>
          <Descriptions title="车辆审核照片信息"></Descriptions>
          <List<Partial<any>>
            loading={loading}
            rowKey="titie"
            grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
            dataSource={[...PictureData]}
            renderItem={item => {
              if (
                !!item &&
                item.avatar &&
                item.avatar !== `${BASICURL}null` &&
                item.avatar !== `${BASICURL}`
              ) {
                return (
                  <List.Item key={item.title}>
                    <Card
                      hoverable
                      className={styles.card}
                      cover={
                        <div className={styles.cardDiv}>
                          <Zmage alt={item.title} className={styles.cardAvatar} src={item.avatar} />{' '}
                        </div>
                      }
                    >
                      <Card.Meta title={item.title} />
                    </Card>
                  </List.Item>
                );
              }
              else if (
                !!item &&
                item.avatar &&
                (item.avatar === `${BASICURL}null` ||
                  item.avatar === `${BASICURL}`)
              ) {
                return (
                  <List.Item key={item.title}>
                    <Card
                      hoverable
                      className={styles.card}
                      cover={
                        <div className={styles.cardDiv}>
                          <Empty
                            image={emptyPicture}
                            imageStyle={{
                              width:'100%',
                              height: '10vh',
                            }}
                          >
                            <span style={{ marginTop: '5vh' }}>
                              【{item.title}】照片未上传
                              </span>
                          </Empty>
                        </div>
                      }
                    >
                      <Card.Meta title={item.title} />
                    </Card>
                  </List.Item>
                )
              }
              return <></>;
            }}
          />
        </Spin>
      </Card>
    </Modal>
  );
};

export default Form.create<EditorFormProps>()(AduitCarForm);
