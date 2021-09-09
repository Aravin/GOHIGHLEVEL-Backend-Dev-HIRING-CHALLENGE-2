import { Request, Response } from "express";
import { db } from "../helpers/db";

export async function setupWallet(req: Request, res: Response) {

    const body = req.body;

    // basic data check
    if (!body.name) return res.status(400).send({response: 'Name is required to create wallet'});

    const newWallet = {
        balance: (body.balance || 0).toFixed(4),
        name: body.name,
        date: new Date().toISOString(),
    }

    // connect to DB
    db.connect(async (err) => {
        // connection error
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        // declare the collection
        const collection = await db.db("wallet").collection("accounts");

        // check if wallet already exits
        const existingWallet = await collection.findOne({name: newWallet.name});

        // return failure, if already exists
        if (existingWallet) return res.status(400).send({response: 'Wallet Already Exists'}); 

        // insert new wallet
        const result = await collection.insertOne(newWallet);

        // return the response
        res.send({...newWallet, transactionId: result.insertedId.toHexString()});
    });
}
