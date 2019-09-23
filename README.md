# ent-control-center-web

梵途中台管理系统文档说明

## 项目运行环境

### 安装node v10.+

window系统在cmd下查看是否有node和npm, 并保证node版本号 >= 10.+

mac系统在bash或者terminal下查看是否有node和npm环境, 并保证node版本号 >=10.+

```bash
node -v
```

### 安装yarn

全局安装yarn, 一个基于npm安全的拉取依赖工具

```bash
yarn -v
```

## 初始化安装依赖

在项目根目录下执行`npm install` 或者 `yarn install`

安装后目录下出现`node_modules`

## 运行项目

执行命令`npm run start-dev` 或者 `yarn start-dev`.

首次运行会生成dll文件,来加速开发环境的webpack打包速度,执行完成后浏览器会自动打开`localhost:8000`的本地url

## 打包项目

执行命令`npm run build-prod` 或者 `yarn build-prod`

打包后在根目录生成dist目录

## 代理地址

代理地址配置在`config.ts`中。
```json
  proxy: {
    '/v2/': {
      target: 'http://172.16.9.100:8084',
      changeOrigin: true,
      pathRewrite: {
        '^/v2': '',
      },
    },
  },
```

目标代理地址`target: 'http://172.16.9.100:8084'`

API配置路径`/v2/`

在根目录`src/utils/request.ts`配置`request prefix` 为目标API

## now

现在你可以进行开发了😆
...
