import React, { useEffect, useState } from "react";
import Link from 'next/link';

function AccountPage() {

  let walletAccount;
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0.0000);

  useEffect(() => {
    if (process.browser) {
      walletAccount = JSON.parse(localStorage?.getItem('walletAccount') + '');
      setName(walletAccount.name);
      setBalance(walletAccount.balance);
    }
  }, [])

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex-1 mt-20 max-w-md">
          <div className="card shadow bg-white text-gray-700">
            <div className="card-body">
              <h2 className="card-title">Welcome to Wallet Dashboard</h2>

              <div className="divider"></div>

              <p><span>Account Name: </span><span className="text-xl text-black"> {name}</span></p>
              <p><span>Account Balance: </span><span className="text-xl text-black"> {balance} </span><span>₹</span></p>

              <div className="divider"></div>

              <span className="btn btn-outline btn-accent m-2"><Link href="/transaction?type=credit">Add Money To Wallet (Credit)</Link></span>
              <span className="btn btn-outline btn-secondary m-2"><Link href="/transaction?type=debit">Perform Transaction (Debit)</Link></span>
              <span className="btn btn-outline btn-primary m-2"><Link href="/history" >View Transaction History</Link> </span>

            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default AccountPage