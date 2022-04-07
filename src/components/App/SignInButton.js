import React, { useCallback, useEffect, useState } from 'react';
import { SaveAlt, AssignmentReturned, AssignmentReturn } from '@material-ui/icons';
import { Button, Dialog } from '@material-ui/core';

import { Amplify, Auth } from 'aws-amplify';

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
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
    }, [isOpen, eventCall]);

    useEffect(() => {
        Auth.currentAuthenticatedUser()
            .then((currentUser) => {
                setUser(currentUser);
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
                        startIcon={<SaveAlt />}
                    >
                        Save User
                    </Button>
                    <Button onClick={signOut} color="inherit" startIcon={<AssignmentReturn />}>
                        Logout
                    </Button>
                </>
            ) : (
                <Button onClick={handleOpen} color="inherit" startIcon={<AssignmentReturned />}>
                    Login
                </Button>
            )}

            <Dialog open={isOpen} onClose={handleClose}>
                <Authenticator socialProviders={['google']}></Authenticator>
            </Dialog>
        </>
    );
};

export default SignInButton;
