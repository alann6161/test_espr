import React, { FC } from 'react';

type Props = {
  onChange: (json: any) => void;
}

export const FileSelect: FC<Props> = ({ onChange }) => {
  const onFileSelect = (e: any) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (evt: any) => {
      let json;
      try {
        json = JSON.parse(evt.target.result)
      } catch (e) {
        alert('JSON is not valid')
      }

      onChange(json);
    };

    reader.readAsText(file);
  }

  return (
    <input
      type="file"
      accept=".json"
      onChange={onFileSelect}
    />
  )
}