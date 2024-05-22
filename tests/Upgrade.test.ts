import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { TactV0 } from '../wrappers/TactV0';
import '@ton/test-utils';
import * as TactV1 from '../build/TactV1/tact_TactV0';
import * as TactV2 from '../build/TactV2/tact_TactV0';
import * as TactV3 from '../build/TactV3/tact_TactV0';
import { compile } from '@ton/blueprint';

describe('TactV0', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let tactV0: SandboxContract<TactV0>;
    let tactV1: SandboxContract<TactV1.TactV0>;
    let tactV2: SandboxContract<TactV2.TactV0>;
    let tactV3: SandboxContract<TactV3.TactV0>;

    beforeAll(async () => {
        await compile('TactV0');
        await compile('TactV1');
        await compile('TactV2');

        blockchain = await Blockchain.create();

        tactV0 = blockchain.openContract(await TactV0.fromInit(0n));

        tactV1 = blockchain.openContract(await TactV1.TactV0.fromAddress(tactV0.address));

        tactV2 = blockchain.openContract(await TactV2.TactV0.fromAddress(tactV0.address));

        tactV2 = blockchain.openContract(await TactV3.TactV0.fromAddress(tactV0.address));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await tactV0.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tactV0.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tactV0 are ready to use
    });

    it('should increase counter', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await tactV0.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = BigInt(Math.floor(Math.random() * 100));

            console.log('increasing by', increaseBy);

            const increaseResult = await tactV0.send(
                increaser.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'Add',
                    queryId: 0n,
                    amount: increaseBy,
                }
            );

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: tactV0.address,
                success: true,
            });

            const counterAfter = await tactV0.getCounter();

            console.log('counter after increasing', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });

    it('should upgrade to TactV1', async () => {
        const newContract = await TactV1.TactV0.fromInit(0n);
        const result = await tactV0.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'UpgradeCode',
                newCode: newContract.init!.code,
            }
        );
        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: tactV0.address,
            success: true,
        });
    });

    it('should get id and counter', async () => {
        const data = await tactV1.getData();
        console.log("counter", data.counter);
        console.log("id", data.id);
        expect(data.id).toBe(0n);
    });

    it('should increase counter v1', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await tactV1.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = BigInt(Math.floor(Math.random() * 100));

            console.log('increasing by', increaseBy);

            const increaseResult = await tactV1.send(
                increaser.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'Add',
                    queryId: 0n,
                    amount: increaseBy,
                }
            );

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: tactV0.address,
                success: true,
            });

            const counterAfter = await tactV0.getCounter();

            console.log('counter after increasing', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });

    it('should subtract counter v1', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await tactV1.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = BigInt(Math.floor(Math.random() * 100));

            console.log('increasing by', increaseBy);

            const increaseResult = await tactV1.send(
                increaser.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'Subtract',
                    queryId: 0n,
                    amount: increaseBy,
                }
            );

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: tactV0.address,
                success: true,
            });

            const counterAfter = await tactV0.getCounter();

            console.log('counter after subtracting', counterAfter);

            expect(counterAfter).toBe(counterBefore - increaseBy);
        }
    });

    it('should upgrade to TactV2', async () => {
        const newContract = await TactV2.TactV0.fromInit(0n);
        const result = await tactV1.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'UpgradeData',
                newData: newContract.init!.data,
            }
        );
        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: tactV0.address,
            success: true,
        });        
    });
    
    it('basic getter v2', async () => {
        const id = await tactV2.getId();
        console.log("id", id);
        const counter = await tactV2.getCounter();
        console.log("counter", counter);
        // const version = await tactV2.getVersion();
        // console.log("version", version);
        // expect(version).toBe(2n);
        expect(id).toBe(0n);
    });

    it('should increase counter v2', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await tactV2.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = BigInt(Math.floor(Math.random() * 100));

            console.log('increasing by', increaseBy);

            const increaseResult = await tactV2.send(
                increaser.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'Add',
                    queryId: 0n,
                    amount: increaseBy,
                }
            );

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: tactV2.address,
                success: true,
            });

            const counterAfter = await tactV2.getCounter();

            console.log('counter after increasing', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });

    it('should upgrade v3', async () => {
        const newContract = await TactV3.TactV0.fromInit(0n);
        const result = await tactV2.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'UpgradeCode',
                newCode: newContract.init!.code,
            }
        );
        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: tactV0.address,
            success: true,
        });
    });

    it('basic getter v3', async () => {
        const id = await tactV2.getId();
        console.log("id", id);
        const counter = await tactV2.getCounter();
        console.log("counter", counter);
        const version = await tactV3.getVersion();
        console.log("version", version);
        expect(version).toBe(2n);
        expect(id).toBe(0n);
    });

    it('should increase counter v3', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await tactV2.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = BigInt(Math.floor(Math.random() * 100));

            console.log('increasing by', increaseBy);

            const increaseResult = await tactV3.send(
                increaser.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'Add',
                    queryId: 0n,
                    amount: increaseBy,
                }
            );

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: tactV3.address,
                success: true,
            });

            const counterAfter = await tactV3.getCounter();

            console.log('counter after increasing', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });
});
