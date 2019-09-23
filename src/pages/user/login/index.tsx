import { Alert } from 'antd';
import React, { Component } from 'react';

import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { UserStateType } from './model';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Submit } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<any>;
  userLogin: UserStateType;
  global: UserStateType;
  submitting: boolean;
}
interface LoginState {
  type: string;
  autoLogin: boolean;
  imgCode: string;
}
export interface FromDataType {
  username: string;
  password: string;
  code:string;
}

@connect(
  ({
    userLogin,
    global,
    loading,
  }: {
    userLogin: UserStateType;
    global: UserStateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userLogin,
    global,
    submitting: loading.effects['userLogin/login'],
  }),
)
class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
    autoLogin: true,
    imgCode:`${this.props.global.url}/api/getCaptcha`,
  };

  componentDidMount() {}

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  // * 登录处理逻辑
  handleSubmit = async (err: any, values: FromDataType) => {
    const { type } = this.state;
    // console.log('err:', err, type, '\nvalues:', values)
    // console.log(this.state)
    if (!err) {
      const { dispatch } = this.props;
      // console.log(values)
      await dispatch({
        type: 'userLogin/login',
        payload:
        {
          username:values.username,
          password:values.password,
          code:values.code
        }
      });
    }
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { userLogin, submitting } = this.props;
    const { status, type: loginType } = userLogin;
    const { type, imgCode } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
          ref={(form: any) => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="账户密码登录">
            {status === 'error' &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage(
                '账户或密码错误'
              )}
            <UserName
              name="username"
              placeholder="请输入用户名!"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <Password
              name="password"
              placeholder="请输入密码!"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
            <div style={{display:'flex',width:"100%"}}>
              <UserName
                name="code"
                placeholder="请输入验证码!"
                style={{width:'100%'}}
                rules={[
                  {
                    required: true,
                    message: '请输入验证码!',
                  },
                ]}
              />
              <img style={{width:"48%",height:40,marginLeft:'1%',cursor:'pointer'}} src={imgCode} onClick={()=>{
                this.setState({
                  imgCode:`${this.props.global.url}/api/getCaptcha?time=`+ Math.random()
                })
              }}/>
            </div>
          </Tab>
          <Submit loading={submitting}>
            登录
          </Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
