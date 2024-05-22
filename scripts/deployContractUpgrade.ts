import { toNano } from '@ton/core';
import { ContractUpgrade } from '../wrappers/ContractUpgrade';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const contractUpgrade = provider.open(await ContractUpgrade.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await contractUpgrade.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(contractUpgrade.address);

    console.log('ID', await contractUpgrade.getId());
}
