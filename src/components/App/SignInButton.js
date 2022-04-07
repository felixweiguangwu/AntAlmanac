import React, { useCallback, useEffect, useState } from 'react';
import { CloudDownload } from '@material-ui/icons';
import { Button, Dialog } from '@material-ui/core';

import { Amplify, Hub, Auth } from 'aws-amplify';

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../../aws-exports';

import { loadAuth, saveAuth, loadSchedule } from '../../actions/AppStoreActions';

Amplify.configure(awsExports);

const SignInButton = (props) => {
    const [user, setUser] = useState(null);
    const [isOpen, setOpen] = useState(false);
    const { signOut } = useAuthenticator((context) => [context.user]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        document.removeEventListener('keydown', enterEvent, false);
    };
    const enterEvent = (event) => {
        const charCode = event.which ? event.which : event.keyCode;

        if (charCode === 13 || charCode === 10) {
            event.preventDefault();
            handleClose(false);

            return false;
        }
    };
    const eventCall = useCallback(enterEvent, [handleClose]);
    useEffect(() => {
        if (isOpen) document.addEventListener('keydown', eventCall, false);
        else document.removeEventListener('keydown', eventCall, false);
        console.log('test');
    }, [isOpen, eventCall]);

    useEffect(() => {
        const unsubscribe = Hub.listen('auth', ({ payload: { event, data } }) => {
            switch (event) {
                case 'signIn':
                    setUser(data);
                    loadAuth(data);
                    console.log(data);
                    break;
                case 'signOut':
                    setUser(null);
                    break;
                case 'customOAuthState':
                    break;
                default:
                    break;
            }
        });
        Auth.currentAuthenticatedUser()
            .then((currentUser) => {
                setUser(currentUser);
                console.log(currentUser);
                loadAuth(currentUser);
            })
            .catch(() => {
                if (typeof Storage !== 'undefined') {
                    const savedUserID = window.localStorage.getItem('userID');

                    if (savedUserID != null) {
                        loadSchedule(savedUserID, true);
                    }
                }
            });

        return unsubscribe;
    }, []);

    return (
        <>
            {user ? (
                <>
                    <Button
                        onClick={() => {
                            saveAuth(user);
                        }}
                        color="inherit"
                        startIcon={<CloudDownload />}
                    >
                        Save User
                    </Button>
                    <Button onClick={signOut} color="inherit" startIcon={<CloudDownload />}>
                        Logout
                    </Button>
                </>
            ) : (
                <Button onClick={handleOpen} color="inherit" startIcon={<CloudDownload />}>
                    Login
                </Button>
            )}

            <Dialog open={isOpen}>
                <Authenticator socialProviders={['google']}>
                    {({ signOut, user }) => (
                        <main>
                            <h1>Hello {user.username}</h1>
                            <button
                                onClick={() => {
                                    saveAuth(user);
                                }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    signOut();
                                    handleClose();
                                }}
                            >
                                Sign out
                            </button>
                            <button onClick={handleClose}>Cancel</button>
                        </main>
                    )}
                </Authenticator>
            </Dialog>
        </>
    );
};

export default SignInButton;
