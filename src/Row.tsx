import React, { FC, memo, useCallback } from 'react';
import { Checkbox, TextInput, NumberInput, TextAreaInput, DateInput } from './DataComponents';
import { RowData } from './models';
import { validateEmail } from './utils';

type Props = {
  id: string;
  value: RowData;
  headerKeys: string[];
  onChange: (id: string, nextVal: Partial<RowData>) => void;
}

export const Row: FC<Props> = memo(({ id, value: data, headerKeys, onChange }) => {
  const handleChange = useCallback((key: string, nextValue: any) => {
    onChange(id, { [key]: nextValue });
  }, [id, onChange]);

  return (
    <>
      {headerKeys.map(key => {
        const value = data[key];

        if (key === 'id') {
          return <td key={key}>{value}</td>
        }

        if (typeof value === 'boolean') {
          return <td key={key}><Checkbox field={key} value={value} onChange={handleChange} /></td>
        }

        if (typeof value === 'number') {
          return <td key={key}><NumberInput field={key} value={value} onChange={handleChange} /></td>;
        }

        if (typeof value === 'string') {
          if (!isNaN(Date.parse(value))) {
            return <td key={key}><DateInput field={key} value={value} onChange={handleChange} /></td>
          }

          if (value.length > 40) {
            return <td key={key}><TextAreaInput field={key} value={value} onChange={handleChange} /></td>;
          }

          if (validateEmail(value)) {
            return <td key={key}><TextInput type='email' field={key} value={value} onChange={handleChange} /></td>;
          }

          return <td key={key}><TextInput field={key} value={value} onChange={handleChange} /></td>
        }

        return <td key={key}></td>
      })}
    </>
  )
})
