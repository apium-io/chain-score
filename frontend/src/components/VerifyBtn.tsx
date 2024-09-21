// components/VerifyBtn.tsx

import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { IDKitWidget, ISuccessResult, IVerifyResponse, VerificationLevel } from '@worldcoin/idkit'

async function verify(proof: ISuccessResult, app_id: `app_${string}`, action: string, signal: string) {
    const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            proof,
            app_id,
            action,
            signal,
        }),
    });

    const result = (await response.json()) as IVerifyResponse;
    console.log(result);

    if (response.ok) {
        console.log('handleVerify Success!');
    } else {
        throw new Error('handleVerify Error: ' + result.detail);
    }
}

const VerifyBtn = ({ app_id, action, signal }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
    <IDKitWidget
        action={action}
        signal={signal}
        onError={error => console.log('onError: ', error)}
        onSuccess={response => console.log('onSuccess: ', response)}
        handleVerify={proof => verify(proof, app_id, action, signal)}
        app_id={app_id}
        verification_level={VerificationLevel.Device}
    >
        {({ open }) => <button onClick={open} className="text-white bg-indigo-600 px-5 py-2 rounded-lg font-medium shadow-sm transition-colors">Verify with Worldcoin</button>}
    </IDKitWidget>
);

export default VerifyBtn;

// Server-side props for getting the app_id, action, and signal if needed
export const getServerSideProps = async (context) => {
    return {
        props: {
            app_id: (context.query.app_id?.toString() as `app_${string}`) || 'app_staging_627c1f36530d1f0fac88c5bb1618bbfe',
            action: (context.query.action?.toString() as string) || 'sign_in',
            signal: context.query.signal || null,
        },
    };
};
