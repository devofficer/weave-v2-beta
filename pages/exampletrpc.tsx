import type { NextPage } from 'next'
import { useCallback } from 'react'
// import { createStrategiesSchema } from 'schema/strategies.schema'
import { trpc } from 'utils/trpc'

const exampletrpc: NextPage = () => {

    const { data, error, isLoading, refetch } = trpc.useQuery(['strategies.getAll'])

    const saveStrategyMutation = trpc.useMutation(['strategies.save'], {
        onSuccess: () => refetch()
    })

    const updateStrategyMutation = trpc.useMutation(['strategies.update'])

    const getByIdQuery = trpc.useQuery(['strategies.getById', 1630])
    if (getByIdQuery.data) {

        console.log('strategies.getById', JSON.stringify(getByIdQuery.data))
    }

    const getByUserAddressQuery = trpc.useQuery(['strategies.getByUserAddress', '0x61B197757aAdA71cD0C07DdcE2d43dB5366496B5'])
    if (getByUserAddressQuery.data) {

        console.log('strategies.getByUserAddress', JSON.stringify(getByUserAddressQuery.data))
    }

    const payload: any = {
        name: 'trpcWorking',
        contractAddress: 'z.string()',
        chainId: 56,
        historicApy: 0,
        popularity: 0,
        risk: 0,
        label: 'label',
        status: 0,
        strategyData: 'z.string()',
        userAddress: 'z.string()',
        referrerAddress: 'z.string()',
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    // eslint-disable-next-line 
    const saveStrategy = useCallback(
        (/* item: createStrategiesSchema */) => {
            saveStrategyMutation.mutate(
                payload
            )
        },
        [saveStrategyMutation]
    )
    const updatePayload: any = {
        id: 1630,
        status: 1,
        updatedAt: new Date()
    }
    // eslint-disable-next-line 
    const updateStrategy = useCallback(
        () => {
            updateStrategyMutation.mutate(
                updatePayload
            )
        },
        [updateStrategyMutation]
    )

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <div>{JSON.stringify(error)}</div>
    }


    {
        return (
            <>
                <button onClick={saveStrategy}> Test save here !</button>
                <button onClick={updateStrategy}> Test update here !</button>
                <div>{JSON.stringify(data)}</div>
            </>
        )




    }


}

export default exampletrpc
