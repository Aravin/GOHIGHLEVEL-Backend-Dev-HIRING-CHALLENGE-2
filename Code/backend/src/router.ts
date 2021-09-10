import { Router, Request, Response} from 'express';
import { walletLookup } from './api/lookup';
import { setupWallet } from './api/setup';
import { walletTransact } from './api/transact';
import { getWalletTransaction } from './api/transactions';

export const router = Router(); 

router.get('/health', (req: Request, res: Response) => {
    return res.send('Wallet Service is Running!');
});

router.post('/setup', async (req: Request, res: Response) => {
    return await setupWallet(req, res);
});

router.post('/transact/:walletId', async (req: Request, res: Response) => {
    return await walletTransact(req, res);
});

router.get('/transactions', async (req: Request, res: Response) => {
    return await getWalletTransaction(req, res);
});

router.get('/wallet/:walletId', async (req: Request, res: Response) => {
    return await walletLookup(req, res);
});

router.get('/*', (req: Request, res: Response) => {
    return res.status(404).send('Invalid Path');
});
