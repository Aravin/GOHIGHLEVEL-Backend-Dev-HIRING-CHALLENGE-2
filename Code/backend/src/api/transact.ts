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
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        // declare the collection
        const collection = await db.db("wallet").collection("accounts");

        // check if wallet already exits
        const existingWallet = await collection.findOne({_id: new ObjectId(walletId)});

        // return failure, if already exists
        if (!existingWallet) return res.status(400).send({response: 'Wallet Not Found'}); 

        console.log(existingWallet.balance, body.amount);

        const updatedBalance = parseInt(existingWallet.balance, 10) + parseInt(body.amount, 10) || 0;

        // if balance is lower, return failure
        if ((updatedBalance) <= 0) return res.status(400).send({response: 'Insufficient Balance'});

        // insert new wallet
        const walletResult = await collection.updateOne(
            {_id: new ObjectId(walletId)},
                {
                    $set:
                    {
                        balance: updatedBalance.toFixed(4),
                        modifiedDate: new Date().toISOString(),
                    }
                });

        // insert new transaction
        const transactionInfo = {
            amount: body.amount.toFixed(4),
            reason: body.reason,
            walletId: walletId,
        }
        const transactionResult = await collection.insertOne(transactionInfo);

        // return the response
        res.send({balance: updatedBalance, transactionId: transactionResult.insertedId.toHexString()});
    });
}
