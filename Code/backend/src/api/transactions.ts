import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../helpers/db";

export async function getWalletTransaction(req: Request, res: Response) {

    const walletId = req.query.walletId;
    const skip = parseInt(req.query.skip + '', 10) || 0;
    const limit = parseInt(req.query.limit + '', 10) || 5;

    // basic data check
    if (!walletId) return res.status(400).send({response: 'Wallet ID is required'});

    // connect to DB
    db.connect(async (err) => {
        // connection error
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        // declare the collection
        const walletCollection = await db.db("wallet").collection("accounts");
        const transCollection = await db.db("wallet").collection("transactions");

        console.log(walletId);

        // check if wallet already exits
        const transactionList = await transCollection.find({walletId: walletId})
            .sort({createdDate: 'desc'})
            .skip(skip)
            .limit(limit)
            .toArray()
            ;

        console.log(transactionList);

        // return failure, if already exists
        if (!transactionList && transactionList !== []) return res.status(400).send({response: 'Transaction Not Found'}); 

        // return the response
        return res.send(transactionList);
    });
}
