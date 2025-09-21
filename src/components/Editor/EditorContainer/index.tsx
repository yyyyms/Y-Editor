import YEditor from '@packages/core/editor';
import classNames from 'classnames';
import { useContext, useEffect, useRef, useState } from 'react';

import { EditorContext } from '@/components/Context';
import { Header } from '@/components/Header';

import styles from './index.module.less';

function EditorContainer() {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<YEditor | null>(null);
  useEffect(() => {
    const editor = new YEditor({
      editorContainer: editorContainerRef.current!,
      offsetY: 0,
      offsetX: 0,
    });
    setEditor(editor);
    editor.viewportManager.setViewportSize({
      width: editorContainerRef.current!.clientWidth,
      height: editorContainerRef.current!.clientHeight,
    });

    return () => {
      editor.destroy();
    };
  }, []);

  return (
    <EditorContext.Provider value={editor}>
      <Header />
      <div id="editor_container" className={classNames(styles['app-container'])}>
        <div className={classNames(styles['left-menu'])}>
        </div>
        <div ref={editorContainerRef} className={classNames(styles['view-content'])} id="view_content">
        </div>
        <div className={classNames(styles['right-panel'])}>
        </div>
      </div>
    </EditorContext.Provider>

  );
}
export default EditorContainer;
