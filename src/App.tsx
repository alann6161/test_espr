import React, { FC, useCallback, useState, useEffect, useMemo, useRef, CSSProperties } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { RowData } from './models';
import { FilterInput } from './FilterInput';
import './App.css';
import { Row } from './Row';
import { filterRowItem } from './utils';
import { FileSelect } from './FileSelect';

const itemHeight = 140;
const visibleRows = 5;

export const App: FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [editedRowData, setEditedRowData] = useState<Record<string, RowData>>({});
  const [rowData, setRowData] = useState<Record<string, RowData>>({});
  const [firstVisibleRow, setFirstVisibleRow] = useState(0);
  const [orderKey, setOrderKey] = useState<string | null>(null);
  const [orderDirection, setOrderDirection] = useState<'ASC' | 'DESC' | null>(null);
  const [rows, setRows] = useState<[string, RowData][]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [filter, setFilter] = useState<Record<string, string>>({})

  const containerRef = useRef<HTMLTableSectionElement | null>(null);

  const handleOrderChange = (nextOrderKey: string) => {
    if (nextOrderKey === orderKey) {
      setOrderDirection(prevOD => prevOD === null ? 'ASC' : prevOD === 'ASC' ? 'DESC' : null);
    } else {
      setOrderKey(nextOrderKey);
      setOrderDirection('ASC');
    }
  }

  const onChangeFilter = useCallback((key: string, filterText: string) => {
    setFilter(prev => ({ ...prev, [key]: filterText }));
  }, []);

  const onScroll = ({ target }: HTMLElementEventMap['scroll'] ) => {
    const nexFirstVisibleRow = Math.floor((target as any).scrollTop / itemHeight);
    setFirstVisibleRow(nexFirstVisibleRow);
  }

  useEffect(() => {
    const curr = containerRef.current;
    curr?.addEventListener('scroll', onScroll);

    return () => curr?.removeEventListener('scroll', onScroll);
  }, []);

  // calculating rows when data is changed
  useEffect(() => {
    const nextRowData = data.reduce((prev, curr) => {
      return ({
        ...prev,
        [curr.id || uuidv4()]: curr,
      });
    }, {})

    setRowData(nextRowData);
    setEditedRowData(nextRowData)

    setFilter({});
    containerRef.current?.scrollTo({ top: 0 });
    setFirstVisibleRow(0);
  }, [data]);

  // calculating rows when data is filtered or edited
  useEffect(() => {
    if (Object.keys(filter).length === 0) {
      setRowData(editedRowData);
      return;
    }

    setRowData(Object.entries(editedRowData).reduce((prev, [key, data]) => {
      const isFiltered = filterRowItem(filter, data);

      if (!isFiltered) return prev;

      return ({ ...prev, [key]: data });
    }, {}));

    containerRef.current?.scrollTo({ top: 0 });
    setFirstVisibleRow(0);
  }, [editedRowData, filter]);

  // calculating rows when order is changed 
  useEffect(() => {
    if (orderKey == null || orderDirection == null) {
      setRows(Object.entries(rowData));
      return;
    }

    setRows(
      Object.entries(rowData).sort(([k1, data1], [k2, data2]) => (
        orderDirection === 'ASC' 
          ? String(data2[orderKey]).localeCompare(String(data1[orderKey]))
          : String(data1[orderKey]).localeCompare(String(data2[orderKey]))
      ))
    );

    containerRef.current?.scrollTo({ top: 0 });
    setFirstVisibleRow(0);
  }, [orderKey, orderDirection, rowData]);

  const handleChangeRow = useCallback((id: string, nextVal: Partial<RowData>) => {
    setEditedRowData((prevData) => ({
      ...prevData,
      [id]: { ...prevData[id], ...nextVal },
    }));
  }, []);

  const handleFileLoaded = useCallback((json: any) => {
    setData(json);
    setIsDataLoaded(true);
  }, []);

  const headerKeys = useMemo(() => Object.keys(data[0] || {}), [data]);

  const getTopHeight = () => itemHeight * firstVisibleRow;

  const getBottomHeight = () => {
    var bottomHeight = itemHeight * ((rows.length - 1) - (firstVisibleRow + visibleRows));
    return bottomHeight < 0 ? 0 : bottomHeight
  }

  const containerStyle: CSSProperties = {
    display: 'block', 
    height: data.length === 0 ? 0 : itemHeight * visibleRows + 1, 
    overflow: 'auto'
  }

  const isLoading = rows.length === 0 && data.length > 0;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>
        Table view
      </h1>
      {!data.length && <FileSelect onChange={handleFileLoaded} />}
      <div>
        <table>
          <thead>
            <tr>
              {headerKeys.map((key) => (
                <th key={key}>
                  <span style={{ marginBottom: 4, display: 'block' }}>
                    {key}
                    <button onClick={() => handleOrderChange(key)}>
                      {orderKey === key 
                        ? orderDirection === 'ASC' 
                          ? 'v' 
                          : orderDirection === 'DESC' 
                            ? '^' 
                            : 'Ord'
                        : 'Ord'
                      }
                    </button>
                  </span>
                  <FilterInput
                    field={key}
                    value={filter[key]} 
                    onChange={onChangeFilter} 
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody ref={containerRef} style={containerStyle}>
            <tr style={{ height: getTopHeight() }}></tr>
            {isLoading && <tr><td>Loading...</td></tr>}
            {!isLoading && rows.length === 0 && isDataLoaded && <tr><td>No data</td></tr>}
            {rows
              .slice(firstVisibleRow, firstVisibleRow + visibleRows + 1)
              .map(([id, rowData]) => (
                <tr key={id} style={{ height: itemHeight, display: 'table' }}>
                  <Row
                    id={id}
                    headerKeys={headerKeys}
                    value={rowData}
                    onChange={handleChangeRow}
                  />
                </tr>
              ))}
            <tr style={{ height: getBottomHeight() }}></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
