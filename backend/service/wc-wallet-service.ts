import { Wallet } from "../types/wc-wallet.type";
import { Db } from "../utils/db";

export async function fetchWalletWcData(wallet: Wallet) {
    const { address, worldCoinId } = wallet;
    const db = new Db();
    const wcWallet = await db.fetchData({
        TableName: 'wc-wallets', // draft db table name
        KeyConditionExpression: 'address = :address',
        ExpressionAttributeValues: {
            ':address': address
        }
    });
    if (wcWallet && wcWallet.worldCoinId === worldCoinId) {
        return true;
    }
    return false;
}

export async function saveWalletWcData(wallet: Wallet) {
    const { address, worldCoinId } = wallet;
    const db = new Db();
    const wcWallet = await db.writeData({
        TableName: 'wc-wallets', // draft db table name
        Item: {
            address, worldCoinId
        }
    });
}