import React, { useEffect, useState } from "react";
import Link from 'next/link';
import axios from 'axios'
import DataTable from "react-data-table-component";
import moment from "moment";

const columns = [
  {
    name: 'Description',
    selector: (row: any) => row.description,
  },
  {
    name: 'Amount',
    selector: (row: any) => row.amount,
    sortable: true,
  },
  {
    name: 'Date',
    selector: (row: any) => moment(row.createdDate).format('DD MMM YY, h:mm:ss a'),
    sortable: true,
  },
];

function HistoryPage() {

  let walletAccount;
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0.0000);
  const [wallet, setWallet] = useState('');
  const [transaction, setTransaction] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (process.browser) {
      walletAccount = JSON.parse(localStorage?.getItem('walletAccount') + '');
      setName(walletAccount.name);
      setBalance(walletAccount.balance);
      setWallet(walletAccount.transactionId);

      axios.get(`${process.env.NEXT_PUBLIC_API}/transactions?walletId=${walletAccount.transactionId}`)
        .then((res: any) => {
          console.log(res);
          setTransaction(res.data);
        })
        .catch((err) => {
          setError(err.response?.data?.response);
        });
    }
  }, []);

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex-1 mt-20 max-w-md">
          <div className="card shadow bg-white text-gray-700">
            <div className="card-body">
              <h2 className="card-title">Transaction History</h2>

              <div className="divider"></div>

              <p><span>Account Name: </span><span className="text-xl text-black"> {name}</span></p>
              <p><span>Account Balance: </span><span className="text-xl text-black"> {balance} </span><span>₹</span></p>

              <div className="divider"></div>

              <DataTable
                columns={columns}
                data={transaction}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="300px"
              />

              {/* <button className="btn btn-outline btn-secondary m-2" onClick={downloadAsCSV}>Export as CSV file</button> */}
              <span className="btn btn-outline btn-primary m-2"><Link href={"/account?type="} >Go Back to Account Page</Link> </span>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HistoryPage
