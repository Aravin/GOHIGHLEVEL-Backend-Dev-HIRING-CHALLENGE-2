import { ObjectId } from "bson";
import { Request, Response } from "express";
import { db } from "../helpers/db";

export async function walletLookup(req: Request, res: Response) {

    const walletId = req.params.walletId;

    console.log(walletId);

    // basic data check
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

        // return the response
        return res.send({...existingWallet});
    });
}
