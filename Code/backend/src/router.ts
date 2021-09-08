import { Router, Request, Response} from 'express';

export const router = Router(); 

router.get('/health', (req: Request, res: Response) => {
    console.log('health');
    return res.send('Wallet Service is Running!');
});

router.post('/setup', (req: Request, res: Response) => {
    return res.send('TODO: Implement');
});

router.post('/transact/:walletId', (req: Request, res: Response) => {
    return res.send('TODO: Implement');
});

router.post('/transact/:walletId', (req: Request, res: Response) => {
    res.send('TODO: Implement');
});

router.get('/transactions', (req: Request, res: Response) => {
    return res.send('TODO: Implement');
});

router.get('/wallet/:walletId', (req: Request, res: Response) => {
    return res.send('TODO: Implement');
});

router.get('/*', (req: Request, res: Response) => {
    return res.status(404).send('Invalid Path');
});