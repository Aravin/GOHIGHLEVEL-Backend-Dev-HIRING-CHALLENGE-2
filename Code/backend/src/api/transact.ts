import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../helpers/db";

export async function walletTransact(req: Request, res: Response) {

    const body = req.body;
    const walletId = req.params.walletId;

    // basic data check
    if (!body.amount) return res.status(400).send({response: 'Amount is required for credit or debit transaction'});

    if (!walletId) return res.status(400).send({response: 'Wallet ID is required'});

    // connect to DB
    db.connect(async (err) => {
        // connection error
        if (err) return res.status(500).send('Internal Server Error');

        // declare the collection
        const walletCollection = await db.db("wallet").collection("accounts");
        const transCollection = await db.db("wallet").collection("transactions");

        // check if wallet already exits
        const existingWallet = await walletCollection.findOne({_id: new ObjectId(walletId)});

        // return failure, if already exists
        if (!existingWallet) return res.status(400).send({response: 'Wallet Not Found'}); 

        const updatedBalance = parseFloat(existingWallet.balance) + parseFloat(body.amount) || 0.0000;

        // if balance is lower, return failure
        if ((updatedBalance) <= 0) return res.status(400).send({response: 'Insufficient Balance'});

        // insert new wallet
        const walletResult = await walletCollection.updateOne(
            {_id: new ObjectId(walletId)},
                {
                    $set:
                    {
                        balance: updatedBalance.toFixed(4),
                        totalTransactions: (existingWallet.totalTransactions || 0) + 1,
                        modifiedDate: new Date().toISOString(),
                    }
                });

        // insert new transaction
        const transactionInfo = {
            amount: parseFloat(body.amount).toFixed(4),
            description: body.description,
            walletId: walletId,
            balance: updatedBalance.toFixed(4),
            createdDate: new Date().toISOString(),
        }
        const transactionResult = await transCollection.insertOne(transactionInfo);

        // return the response
        res.send({balance: updatedBalance.toFixed(4), transactionId: transactionResult.insertedId.toHexString()});
    });
}
