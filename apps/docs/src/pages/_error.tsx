// this is weird, but without this file build was failing. 
// TODO; it is so f weird because we are using app-router but adding this files resolves the issue xdddd
import React from 'react';
import { NextPage } from 'next';

interface ErrorProps {
    statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
    return (
        <p>
            {statusCode
                ? `An error ${statusCode} occurred on server`
                : 'An error occurred on client'}
        </p>
    );
};

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
