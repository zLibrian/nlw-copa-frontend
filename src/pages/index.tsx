import { GetServerSideProps } from 'next';

interface IHomeProps {
  count: number;
}

export default function Home(props: IHomeProps) {
  return <h1>Contagem: {props.count}</h1>;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch('http://localhost:3333/pools/count');
  const { count } = await response.json();

  return {
    props: {
      count,
    },
  };
};
