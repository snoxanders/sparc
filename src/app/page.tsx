import Head from 'next/head';
import { Box } from '@mui/material';
import type { NextPage } from 'next';
import ToDoContainer from '../../components/ToDoContainer';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>To-Do Sparc</title>
        <meta name="description" content="To-Do Sparc." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box
        sx={{
          backgroundColor: '#1e1e1e',
          minHeight: '100vh',
          color: '#fff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <ToDoContainer />
      </Box>
    </>
  );
};

export default Home;
