import React, { useState, useEffect } from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { Button, Icon, Input } from 'antd';
import styles from './style.less';

interface EditorParams {
  handleClose: ()=>void,
  handlePublish: (editorState: any)=>void,
}

const Editor:React.FC<EditorParams> = props => {
  const { handleClose, handlePublish } = props
  const [editorState, setEditorState] = useState(BraftEditor.createEditorState(null))
  const [title, setTitle] = useState()

  useEffect(() =>
    // 假设此处从服务端获取html格式的编辑器内容
    // const htmlContent = await fetchEditorContent();
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorState数据
    // this.setState({
    //   editorState: BraftEditor.createEditorState(htmlContent),
    // });
     () => {
    }
  )

  const submitContent = () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = editorState.toHTML();
    // const result = await saveEditorContent(htmlContent);
    return {
      title,
      htmlContent,
    }
  };

  const handleEditorChange = (editorState: any) => setEditorState(editorState);

    return (
      <div className="my-component" style={{ backgroundColor: '#fff' }}>
        <div className={styles.btnWrapper}>
        <Input placeholder="请输入标题" onChange={e => setTitle(e.target.value)} style={{ width: 450, marginTop: 15, marginLeft: 10 }}/>
        <div className={styles.manualBtn}>
          <Button onClick={handleClose}>关闭 </Button>
          <Button type="primary" style={{ marginLeft: 15 }} onClick={() => {
            handlePublish(submitContent());
            }}>
            发布
          </Button>
        </div>
        </div>
        <BraftEditor
          value={editorState}
          onChange={handleEditorChange}
          onSave={submitContent}
        />
      </div>
    );
}

export default Editor;
