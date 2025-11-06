import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import MonacoEditor from 'react-monaco-editor';

function NoteEditor() {
  const [code, setCode] = useState('// type your code here');

  const editorDidMount = (editor) => {
    editor.focus();
  };

  const onChange = (newValue) => {
    setCode(newValue);
  };

  const options = {
    selectOnLineNumbers: true,
  };

  return (
    <div>
      <MonacoEditor
        width="100%"
        height="400"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={onChange}
        editorDidMount={editorDidMount}
      />
      <Box mt={2}>
        <Button variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </div>
  );
}

export default NoteEditor;
