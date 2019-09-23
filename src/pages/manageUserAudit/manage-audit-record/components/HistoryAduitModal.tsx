import { Form, Modal, Spin, Card, Descriptions, Tag, List, Divider } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React, { useState, useEffect } from 'react';
import { Dispatch } from 'redux';
import Zmage from 'react-zmage';
import { FromEditorParams } from '../data';
import styles from '../style.less';

interface EditorFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleHistoryAduitModalVisible: () => void;
  dispatch: Dispatch;
  loading: boolean;
  currFormLabels: any;
  global: any;
  State: any;
}

const AduitCarForm: React.FunctionComponent<EditorFormProps> = props => {
  const {
    modalVisible,
    handleHistoryAduitModalVisible,
    currFormLabels,
    dispatch,
    loading,
    global,
    State,
  } = props;
  // console.log('currFormLabels', currFormLabels);
  const [Data, setData] = useState({ basicMessage: [] });
  const [PictureData, setPictureData] = useState([]);
  const [auditStateText, setAuditStateText] = useState('');
  const [auditStatecolor, setAuditStatecolor] = useState('');
  const [auditResult, setauditResult] = useState<any[]>([]);
  const [HistoryLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    if (modalVisible) {
      switch (currFormLabels.auditSate) {
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
          break;
        case 3:
          setAuditStatecolor('red');
          setAuditStateText('验证失败');
          break;
        default:
          setAuditStatecolor('#ccc');
          setAuditStateText('未验证');
      }

      if (State) {
        (dispatch as any)({
          type: 'Overall/fetchHistory',
          payload: {
            id: currFormLabels.id,
            type: State,
          },
        }).then((data: any) => {
          // console.log('data', data);
          if (!!data) {
            setHistoryLoading(false)
            setData(data);
            const pictures = data.pictures
              ? data.pictures.map((item: any) => ({
                title: item.title,
                avatar: `${global.url}/api/file/img/IoReadImage?path=${item.avatar}`,
              }))
              : [];
            const auditResultArray = data.auditResult ? data.auditResult : []
            setPictureData(pictures);
            setauditResult(auditResultArray)
          }
        });
      }
    } else {
      setData({ basicMessage: [] });
      setPictureData([]);
      setHistoryLoading(true)
    }
  }, [modalVisible]);

  return (
    <Modal
      destroyOnClose
      width="70%"
      style={{ top: 60 }}
      bodyStyle={{ height: '80vh', overflow: 'hidden', overflowY: 'auto', padding: 0 }}
      title="审核历史"
      visible={modalVisible}
      onCancel={() => {
        handleHistoryAduitModalVisible();
      }}
      footer={[<></>]}
    >
      <Card bordered={false} loading={HistoryLoading} style={{ padding: '0 24px' }}>
        {/* 用户基本信息 */}
        <Descriptions title="用户基本信息">
          <Descriptions.Item label="审核状态">
            <Tag color={auditStatecolor}>{auditStateText}</Tag>
          </Descriptions.Item>
          {!!Data.basicMessage && Data.basicMessage.length > 0 ? (
            Data.basicMessage.map(item => (
              <Descriptions.Item key={item.key} label={item.key}>
                {item.value}
              </Descriptions.Item>
            ))
          ) : (
              <></>
            )}
        </Descriptions>
        <Divider />

        {/* 审核意见 */}
        <Descriptions title="审核意见"></Descriptions>
        <div style={{ height: 250, overflowY: 'auto' }} className={styles.scrollBox}>
          <List<Partial<any>>
            rowKey="title"
            header={
              <div className={styles.detailAudit}>
                <p> 审核人:{auditResult.user} </p>
                <p className={styles.detailAuditP}> 审核时间：{auditResult.date} </p>
              </div>
            }
            dataSource={auditResult.message}
            renderItem={item => {
              if (item) {
                return <List.Item key={item}>{item}</List.Item>;
              }
              return <>{auditResult.message}</>;
            }}
          />
        </div>
        <Divider />


        {/* 用户基本信息 */}

        <Descriptions title="用户审核照片信息"></Descriptions>
        <List<Partial<any>>
          loading={HistoryLoading}
          rowKey="titie"
          grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
          dataSource={[...PictureData]}
          renderItem={item => {
            if (
              !!item &&
              item.avatar
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
            return <></>;
          }}
        />
      </Card>
    </Modal>
  );
};

export default Form.create<EditorFormProps>()(AduitCarForm);
