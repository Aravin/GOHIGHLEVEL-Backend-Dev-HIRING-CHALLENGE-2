import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import axois from 'axios';

type Inputs = {
  description: string,
  amount: number,
};

function TransactionPage() {

  let walletAccount: any;
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0.0000);
  const [wallet, setWallet] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const [error, setError] = useState('');
  const onSubmit: SubmitHandler<Inputs> = data => {
    if (data.description || data.amount) {
      setError('');

      if (router.query.type === 'debit') {
        data.amount = data.amount * -1;
      }

      axois.post(`${process.env.NEXT_PUBLIC_API}/transact/${wallet}`, data)
        .then((res: any) => {
          console.log(res);
          if (process.browser) {
            const existingInfo = JSON.parse(localStorage.getItem('walletAccount') + '');
            existingInfo.balance = res?.data?.balance;
            console.log(existingInfo);
            localStorage.setItem('walletAccount', JSON.stringify(existingInfo));
          }
          router?.push('/account');
        })
        .catch((err) => {
          setError(err.response?.data?.response);
        })
    } else {
      setError('Description or Amount is missing.')
    }
  }

  useEffect(() => {
    if (process.browser) {
      walletAccount = JSON.parse(localStorage?.getItem('walletAccount') + '');
      setName(walletAccount.name);
      setBalance(walletAccount.balance);
      setWallet(walletAccount.transactionId);
    }
  }, [])

  const router = useRouter();

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex-1 mt-20 max-w-md">
          <div className="card shadow bg-white text-gray-700">
            <div className="card-body">
              <h2 className="card-title">{router.query.type?.toString().toUpperCase()}</h2>
              <p><span>Account Name: </span><span className="text-xl text-black"> {name}</span></p>
              <p><span>Account Balance: </span><span className="text-xl text-black"> {balance} </span><span>₹</span></p>

              <div className="divider"></div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" {...register("description", { required: true })} className="block w-full px-4 py-3 mb-4 border border-2 border-transparent border-gray-200 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none text-gray-700" placeholder="Description" />
                {errors.description && <span className="text-red-500 pb-2">Description is required</span>}
                <input type="number" step=".0001" {...register("amount", { required: true })} className="block w-full px-4 py-3 mb-4 border border-2 border-transparent border-gray-200 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none input-primary text-gray-700" placeholder="Amount" />
                {errors.amount && <span className="text-red-500 pb-2">Transaction Amount is required</span>}
                <div className="block">
                  <input type="submit" className="w-full px-3 py-4 font-medium text-white bg-blue-600 rounded-lg cursor-pointer" value="Complete the Transaction" />
                </div>
              </form>
              <div className="mt-4">
                {error && <span className="text-red-500">{error}</span>}
              </div>
              <div className="divider"></div>

              <span className="btn btn-outline btn-primary m-2"><Link href={"/account?type=" + router.query.type} >Go Back to Account Page</Link> </span>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default TransactionPage