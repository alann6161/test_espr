import React, { FC, memo, useCallback, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import Modal from 'react-modal';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { genericMemo } from './utils';

type BaseProps<T> = {
  field: string;
  value: T;
  renderValue?: (value: T) => string;
  onChange: (field: string, nextVal: T) => void;
  children: (value: T, onChange: (val: T) => void) => React.ReactNode;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function DataComponentBase<T>({ value, onChange, field, children, renderValue }: BaseProps<T>) {
  const [editedValue, setEditedValue] = useState(value);
  const [isModalShown, setIsModalShown] = useState(false);

  useEffect(() => {
    setEditedValue(value);
  }, [value])

  const handleSaveBtnClick = () => {
    onChange(field, editedValue)
    setIsModalShown(false);
  }

  const handleCloseBtnClick = () => {
    setEditedValue(value);
    setIsModalShown(false);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ maxHeight: 100, overflow: 'auto' }}>
        {!!renderValue ? renderValue(value) : String(value)}
      </div>
      <button style={{ marginLeft: 5 }} onClick={() => setIsModalShown(true)}>Edit</button>
      <Modal
        isOpen={isModalShown}
        onRequestClose={() => setIsModalShown(false)}
        contentLabel="Edit"
        ariaHideApp={false}
        style={customStyles}
      >
        {children(editedValue, setEditedValue)}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button style={{ marginRight: 4 }} type="button" onClick={handleSaveBtnClick}>Save</button>
          <button type="button" onClick={handleCloseBtnClick}>Close</button>
        </div>
      </Modal>
    </div>
  )
}

const DataComponent = genericMemo(DataComponentBase);
type DataComponentProps<T> = Omit<BaseProps<T>, 'children'>;

export const Checkbox: FC<DataComponentProps<boolean>> = memo((props) => {
  return (
    <DataComponent {...props}>
      {(value, onChange) => (
        <input
          type="checkbox"
          checked={value}
          onChange={() => { onChange(!value) }}
        />
      )}
    </DataComponent>
  )
})

type TextInputProps = DataComponentProps<string> & { type?: 'text' | 'email' };
export const TextInput: FC<TextInputProps> = memo(({ type, ...props }) => (
  <DataComponent {...props}>
    {(value, onChange) => (
      <input
        type={type || 'text'}
        value={value}
        onChange={({ target }) => { onChange(target.value) }}
      />
    )}
  </DataComponent>
))

export const DateInput: FC<DataComponentProps<string>> = memo((props) => {
  const renderValue = useCallback((value: string) => new Date(value).toLocaleString(), [])

  return (
    <DataComponent {...props} renderValue={renderValue}>
      {(value, onChange) => (
        <DateTimePicker
          onChange={(value) => onChange(dayjs(value).format())}
          value={new Date(value)}
        />
      )}
    </DataComponent>
  )
})

export const TextAreaInput: FC<DataComponentProps<string>> = memo((props) => (
  <DataComponent {...props}>
    {(value, onChange) => (
      <textarea
        value={value}
        onChange={({ target }) => { onChange(target.value) }}
      />
    )}
  </DataComponent>
))

export const NumberInput: FC<DataComponentProps<number>> = memo((props) => (
  <DataComponent {...props}>
    {(value, onChange) => (
      <input
        type="number"
        value={value}
        onChange={({ target }) => onChange(+target.value)}
      />
    )}
  </DataComponent>
))
