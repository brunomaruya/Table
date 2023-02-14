import { Layout } from '@/components/Layout';
import { colRef, db } from '@/firebase';
import { addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Column, useTable } from 'react-table';

interface IAnimes {
  id: string;
  AnimeName: string;
  Author: string;
}

export default function Home() {
  const [animes, setAnimes] = useState<IAnimes[]>();
  const [searchedAnimes, setSearchedAnimes] = useState<IAnimes[]>();
  const data = searchedAnimes
    ? searchedAnimes
    : animes
    ? animes
    : [
        {
          id: '',
          AnimeName: '',
          Author: '',
        },
      ];

  const columns: Column<IAnimes>[] = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Anime Name', accessor: 'AnimeName' },
      { Header: 'Author', accessor: 'Author' },
    ],
    []
  );

  const { getTableProps, headerGroups, getTableBodyProps, rows, prepareRow } =
    useTable({ columns, data });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      animeName: '',
      animeAuthor: '',
    },
  });

  const handleCreateNewData = <
    T extends { animeName: string; animeAuthor: string }
  >(
    data: T
  ) => {
    console.log(data);
    addData(data.animeName, data.animeAuthor);

    reset();
  };

  const addData = async (animeName: string, animeAuthor: string) => {
    try {
      const docRef = await addDoc(colRef, {
        AnimeName: animeName,
        Author: animeAuthor,
      });
      console.log('document written: ', docRef.id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteData = async (e: any) => {
    try {
      const docRef = doc(
        db,
        'Animes',
        e.currentTarget.parentElement.firstElementChild.innerText
      );
      deleteDoc(docRef);
      console.log('data deleted');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.log(err);
    }
  };

  const searchAnime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (animes) {
      let updatedList = [...animes];
      updatedList = updatedList.filter((anime) => {
        return (
          anime.AnimeName.toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
      });
      setSearchedAnimes(updatedList);
    }
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
  }, []);

  if (animes) {
    animes.sort((a, b) => {
      let fa = a.AnimeName.toLowerCase(),
        fb = b.AnimeName.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
  }

  return (
    <>
      <Layout>
        <div className="container">
          <h1>Animes Table</h1>

          <div className="header">
            <form action="" onSubmit={handleSubmit(handleCreateNewData)}>
              <div>
                <label htmlFor="animeName">Anime Name: </label>
                <input
                  type="text"
                  id="animeName"
                  placeholder="Enter anime name"
                  {...register('animeName')}
                />
              </div>
              <div>
                <label htmlFor="author">Anime Author: </label>
                <input
                  type="text"
                  id="author"
                  placeholder="Enter anime author"
                  {...register('animeAuthor')}
                />
              </div>
              <input type="submit" />
            </form>

            <div className="search">
              <input
                type="text"
                placeholder="Searh an anime"
                onChange={searchAnime}
              />
            </div>
          </div>

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
        </div>
      </Layout>
    </>
  );
}
