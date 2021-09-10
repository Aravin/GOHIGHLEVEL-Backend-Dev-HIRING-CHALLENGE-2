import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axois from 'axios';

type Inputs = {
  name: string,
  balance: number,
};

const Home: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const [error, setError] = useState('');
  const onSubmit: SubmitHandler<Inputs> = data => {

    if (data.balance || data.name) {
      setError('');

      axois.post(`${process.env.NEXT_PUBLIC_API}/setup`, data)
        .then((res) => {
          if (process.browser) { 
            localStorage.setItem('walletAccount', JSON.stringify(res.data));
          }
          router?.push('/account');
        })
        .catch((err) => {
          setError(err.response?.data?.response);
        })
    } else {
      setError('Name or Balance is missing.')
    }
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex-1 mt-20 max-w-md">
          <div className="z-10 h-auto p-8 py-10 overflow-hidden bg-white border-b-2 border-gray-300 rounded-lg shadow-2xl px-7">
            <h3 className="mb-6 text-2xl font-medium text-center text-blue-600">Create your Wallet Account</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input type="text" {...register("name", { required: true })} className="block w-full px-4 py-3 mb-4 border border-2 border-transparent border-gray-200 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none text-gray-700" placeholder="Username" />
              {errors.name && <span className="text-red-500 pb-2">Wallet Name is required</span>}
              <input type="number" step=".0001" {...register("balance", { required: true })} className="block w-full px-4 py-3 mb-4 border border-2 border-transparent border-gray-200 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none input-primary text-gray-700" placeholder="Balance" />
              {errors.balance && <span className="text-red-500 pb-2">Wallet Balance is required</span>}
              <div className="block">
                <input type="submit" className="w-full px-3 py-4 font-medium text-white bg-blue-600 rounded-lg cursor-pointer" value="Log Me In" />
              </div>
            </form>
            <div className="mt-4">
              {error && <span className="text-red-500">{error}</span>}
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Home
