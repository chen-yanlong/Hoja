import { NextApiRequest, NextApiResponse } from 'next';
import { 
    getUserIdentifier, 
    SelfBackendVerifier,
} from '@selfxyz/core';
import { ethers } from 'ethers';
import { abi } from '../../app/content/abi';

// In-memory storage for birthday verification status
const birthdayStatus: Record<string, boolean> = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { proof, publicSignals } = req.body;

            if (!proof || !publicSignals) {
                return res.status(400).json({ message: 'Proof and publicSignals are required' });
            }

            console.log("Proof:", proof);
            console.log("Public signals:", publicSignals);

            // Contract details
            const contractAddress = "0x3c0EB6B70214447DC9Da98166caDb067Eb185a7d";

            const address = await getUserIdentifier(publicSignals, "hex");
            console.log("Extracted address from verification result:", address);

            // Connect to Celo network
            const provider = new ethers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org/");
            const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
            const contract = new ethers.Contract(contractAddress, abi, signer);

            try {
                const tx = await contract.verifySelfProof({
                    a: proof.a,
                    b: [
                      [proof.b[0][1], proof.b[0][0]],
                      [proof.b[1][1], proof.b[1][0]],
                    ],
                    c: proof.c,
                    pubSignals: publicSignals,
                });
                await tx.wait();
                console.log("Successfully called verifySelfProof function");

                // Save birthday status in memory
                birthdayStatus[address.toLowerCase()] = true;

                res.status(200).json({
                    status: 'success',
                    result: true,
                    credentialSubject: {},
                    address,
                });
            } catch (error) {
                console.error("Error calling verifySelfProof function:", error);
                birthdayStatus[address.toLowerCase()] = false;
                res.status(400).json({
                    status: 'error',
                    result: false,
                    message: 'Verification failed or date of birth not disclosed',
                    details: {},
                });
            }
        } catch (error) {
            console.error('Error verifying proof:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error verifying proof',
                result: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    } else if (req.method === 'GET') {
        const address = req.query.user?.toString().toLowerCase();
        if (!address) return res.status(400).json({ message: 'Missing user address' });

        const verified = birthdayStatus[address] || false;
        res.status(200).json({ verified });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
