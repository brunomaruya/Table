import { Layout } from '@/components/Layout';
import { colRef } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Column, TableOptions, useTable } from 'react-table';

interface IAnimes {
  id: string;
  Author: string;
  AnimeName: string;
}

export default function Home() {
  const [animes, setAnimes] = useState<IAnimes[]>();
  console.log(animes);

  const columns: Column<IAnimes>[] = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Anime Name', accessor: 'AnimeName' },
      { Header: 'Author', accessor: 'Author' },
    ],
    []
  );
  const data = animes
    ? animes
    : [
        {
          AnimeName: '',
          Author: '',
          id: '',
        },
      ];

  const { getTableProps, headerGroups, getTableBodyProps, rows, prepareRow } =
    useTable({ columns, data });

  useEffect(() => {
    const fetchAnimes = async () => {
      await getDocs(colRef).then((snapshot) => {
        const newData: any = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAnimes(newData);
      });
    };

    fetchAnimes();
  }, []);

  return (
    <>
      <Layout>
        <h1>Home</h1>
        <div>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup, index) => (
                // eslint-disable-next-line react/jsx-key
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {rows.map((row, index) => {
                prepareRow(row);
                return (
                  // eslint-disable-next-line react/jsx-key
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell, index) => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Layout>
    </>
  );
}
