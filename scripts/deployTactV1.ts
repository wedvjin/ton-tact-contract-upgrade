import { toNano } from '@ton/core';
import { TactV1 } from '../wrappers/TactV1';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const tactV1 = provider.open(await TactV1.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await tactV1.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(tactV1.address);

    console.log('ID', await tactV1.getId());
}
