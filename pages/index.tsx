import { Layout } from '@/components/Layout';
import { colRef } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface IAnimes {
  id: string;
  Author: string;
  AnimeName: string;
}

export default function Home() {
  const [animes, setAnimes] = useState<IAnimes[]>();

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

  useEffect(() => {
    const fetchAnimes2 = async () => {
      const querySnapshot = await getDocs(colRef);
      querySnapshot.docs.map((doc) => {
        console.log(doc.data());
      });
    };
    fetchAnimes2();
  }, []);

  return (
    <>
      <Layout>
        <h1>Home</h1>
        <div>
          {animes
            ? animes.map((anime) => (
                <div key={anime.id}>
                  {anime.AnimeName}, {anime.Author}
                </div>
              ))
            : ''}
        </div>
      </Layout>
    </>
  );
}
