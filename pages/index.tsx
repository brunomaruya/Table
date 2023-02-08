import { Layout } from '@/components/Layout';
import { colRef, db } from '@/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Column, TableOptions, useTable } from 'react-table';

interface IAnimes {
  id: string;
  Author: string;
  AnimeName: string;
}

export default function Home() {
  const [animes, setAnimes] = useState<IAnimes[]>();
  // console.log(animes);

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

  const addData = async () => {
    try {
      const docRef = await addDoc(colRef, {
        AnimeName: 'Shingeki no Kyojin',
        Author: 'Hajime Isayama',
      });
      console.log('document written: ', docRef.id);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteData = (e) => {
    // console.log(e.currentTarget.parentElement.firstElementChild.innerText);

    const docRef = doc(
      db,
      'Animes',
      e.currentTarget.parentElement.firstElementChild.innerText
    );
    deleteDoc(docRef);

    // window.location.reload();

    // console.log('document deleted: ', docRef);
  };

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
  }, [animes]);

  return (
    <>
      <Layout>
        <h1>Animes Table</h1>
        <div className="container">
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                // eslint-disable-next-line react/jsx-key
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    // eslint-disable-next-line react/jsx-key
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  ))}
                  <th>Delete</th>
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  // eslint-disable-next-line react/jsx-key
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      // eslint-disable-next-line react/jsx-key
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                    <td onClick={deleteData}>X</td>
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
