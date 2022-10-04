import React, { FC, memo, useState, useCallback } from 'react';
import { debounce } from './utils';

type Props = {
  field: string;
  value: string;
  onChange: (key: string, nextVal: string) => void;
}

export const FilterInput: FC<Props> = memo(({ field, value, onChange }) => {
  const [internalValue, setInternalValue] = useState(value || '');

  const handleChange = useCallback(debounce((v: string) => {
    onChange(field, v)
  }, 1000), [onChange]);

  return (
    <div style={{ display: 'flex' }}>
      <input
        style={{ width: '100%' }}
        value={internalValue}
        onChange={({ target }) => {
          handleChange(target.value)
          setInternalValue(target.value)
        }}
      />
    </div>
  )
})