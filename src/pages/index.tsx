import Image from 'next/image';
import { FormEvent, useState } from 'react';
import appImagePreview from '../assets/app-nlw-copa-preview.png';
import iconCheck from '../assets/icon-check.svg';
import logoImage from '../assets/logo.svg';
import usersAvatarExample from '../assets/users-avatar-example.png';
import { api } from '../lib/axios';

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');
  const { guessCount, poolCount, userCount } = props;

  const createPool = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const reponse = await api.post('/pools', { title: poolTitle });
      const { code: poolId } = reponse.data;

      await navigator.clipboard.writeText(poolId);
      alert(`Bolão copiado para a área de transferência: ${poolId}`);
      setPoolTitle('');
    } catch (error) {
      console.error(error);
      alert('Erro ao criar bolão, tente novamente.');
    }
  };

  return (
    <div className="max-w-[1124px] mx-auto grid grid-cols-2 gap-28 h-screen items-center py-14">
      <main>
        <Image src={logoImage} alt="Logo NLW Copa" />

        <h1 className="mt-14 text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="flex items-center gap-2 mt-10">
          <Image src={usersAvatarExample} alt="exemplos de usuário" />

          <strong className="text-gray-100 font-bold text-xl">
            <span className="text-nlw-green-500">+{userCount}</span> pessoas já
            estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 py-4 px-6 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
            onChange={(e) => setPoolTitle(e.target.value)}
            value={poolTitle}
          />
          <button
            type="submit"
            className="bg-nlw-yellow-500 py-4 px-6 rounded text-gray-900 font-bold text-sm uppercase hover:bg-nlw-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>
        <p className="text-gray-300 mt-4 text-sm leading-relaxed ">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100 pb-4">
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appImagePreview}
        alt="Dois celulares mostrando uma preview do App mobile NLW Copa"
      />
    </div>
  );
}

export async function getStaticProps() {
  const [poolCountReponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get('/pools/count'),
      api.get('/guesses/count'),
      api.get('/users/count'),
    ]);

  return {
    props: {
      poolCount: poolCountReponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 600, // 10 minutes
  };
}
