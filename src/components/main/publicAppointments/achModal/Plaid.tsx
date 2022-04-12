import { useCallback } from 'react'

import { PlaidLinkOnEvent, PlaidLinkStableEvent, PlaidLinkOnEventMetadata, usePlaidLink, PlaidLinkOnSuccess, PlaidLinkOnSuccessMetadata, PlaidLinkOnExit, PlaidLinkError, PlaidLinkOnExitMetadata } from 'react-plaid-link'

const Plaid = () => {

    const onSuccess = useCallback<PlaidLinkOnSuccess>(
        (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
            debugger
        }, [])

    const onExit = useCallback<PlaidLinkOnExit>((error: PlaidLinkError | null, metadata: PlaidLinkOnExitMetadata) => {
        // log and save error and metadata
        // handle invalid link token
        if (error != null && error.error_code === 'INVALID_LINK_TOKEN') {
            // generate new link token
        }
        // to handle other error codes, see https://plaid.com/docs/errors/
    },
        [],
    );

    const onEvent = useCallback<PlaidLinkOnEvent>(
        (
            eventName: PlaidLinkStableEvent | string,
            metadata: PlaidLinkOnEventMetadata,
        ) => {
            // log eventName and metadata
        },
        [],
    );

    const { ready, error, open, exit } = usePlaidLink({
        onSuccess: onSuccess,
        onExit: onExit,
        onEvent: onEvent,
        token: 'link-sandbox-46d32e5a-113b-46e1-907d-22fb4cc45928',
    })

    const palidOpenHandler = () => {
        if (ready) {
            open();
        }
    }

    return(
        <>{palidOpenHandler()}</>
    )

}

export default Plaid