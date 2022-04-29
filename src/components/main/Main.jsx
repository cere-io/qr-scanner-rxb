import React, {useEffect, useState} from 'react'
import './main.css'
import {initSdkQr, SDK} from "../../service/cere-integration-service";
import {QrReader} from 'react-qr-reader';
import {
    clearStorage,
    getEventId,
    getLocationId,
    getUserId,
    setEventId,
    setLocationId,
    setUserId
} from "../../service/local-storage-service";

const Main = () => {

    const [show, setShow] = useState(false)
    const [showUserCreds, setShowUserCreds] = useState(true)
    const [showQr, setShowQr] = useState(true);
    const [userData, setUserData] = useState('');
    const [event, setEvent] = useState('SPRING_AWAKENING');
    const [location, setLocation] = useState('STAGE_1');

    /**
     * Action to be triggered after engagement received.
     */
    function onEngagementAction(template) {
        setShow(true)
        setTimeout(() => {
            console.log('Engagement received')
            console.log(template)


            let doc = document.getElementById('contentIFrame').contentWindow.document;
            doc.open();
            doc.write(template);
            doc.addEventListener('ITEM_CLAIMED', (e) =>
                    console.log(e.detail) // outputs: {foo: 'bar'}
                , false);
            doc.close();
        }, 100);
    }


    /**
     * Action to be triggered after engagement received.
     */
    function onUserKeyPair(keyPair) {
        console.log(keyPair);
        setUserId(keyPair["publicKey"]);
    }

    useEffect(() => {
        let applicantId = getUserId();
        if (applicantId) {
            /**
             * Init Cere sdk if there is off in request.
             * Just a marker flag not to initialise it all the time.
             */
            initSdkQr(applicantId, '1234567890', onEngagementAction, onUserKeyPair)

        }
        window.addEventListener("message", function (event) {
            console.log(event);
            if (event.data) {
                // @ts-ignore
                const eventName = event.data['templateEvent'];
                if (eventName === 'ITEM_CLAIMED') {
                    let targetObject =  event.data['templatePayload'];
                    let payload = {
                        eventId: targetObject['eventId'],
                        locationId: targetObject['locationId'],
                        userId: targetObject['userId'],
                        title: targetObject['title'],
                    };
                    console.log('About to send event: ', {eventName, payload});
                    console.log('Payload ', JSON.stringify(payload))
                    // @ts-ignore
                    SDK.it?.sendEvent(eventName, payload);
                    setTimeout(() => hide(), 400);
                }
            }
        }, false);

        if (getLocationId()) {
            setShowUserCreds(false);
        }
    }, []);

    function hide() {
        setShow(false);
        setShowQr(true);
    }

    function sendEvent(sdk, data) {
        let parse = JSON.parse(data);
        let request = {
            eventId: getEventId(),
            locationId: getLocationId(),
            userId: parse.userId,
            qrDataJSON: data,
        };

        console.log('About to send event: ', {event, request});

        // @ts-ignore
        sdk?.sendEvent('QR_CODE_VALIDATOR_ENTERED', request);
    }

    function applyUserData() {
        setEventId(event);
        setLocationId(location);
        setUserId(userData);
        setShowUserCreds(false);
        setShowQr(true);

        initSdkQr(getUserId(), '1234567890', onEngagementAction, onUserKeyPair);

    }

    function logout() {
        clearStorage();
        setShowUserCreds(true);
    }

    return (
        <div className='header section__padding'>
            {showQr && !showUserCreds && <div className="modal">
                <div className="modal-content1">
                    <span className="close-button" onClick={() => setShowQr(false)}>&times;</span>
                    <h2>QR Scanner</h2>
                    <QrReader
                        onResult={(result, error) => {
                            if (!!result) {
                                setShowQr(false);
                                console.log(result?.text)
                                sendEvent(SDK.it, result?.text);
                            }

                            if (!!error) {
                                console.info(error);
                            }
                        }}
                        style={{width: '100%'}}/>
                </div>
            </div>}

            {show && !showQr && (
                <div className="modal">
                    <div className="modal-content1">
                        <span className="close-button" onClick={hide}>&times;</span>
                        <h1>Engagement response</h1>
                        <iframe id="contentIFrame" width={330} height={500} frameBorder={0} title="Iframe title">
                        </iframe>
                    </div>
                </div>
            )}

            {showUserCreds && (
                <div className="modal">
                    <div className="modal-content1">
                        <h2>Login </h2>
                        <div className="loginInputElement">

                            <label htmlFor="event">Event</label>
                            <select id="event" value={event} onChange={e => setEvent(e.target.value)}>
                                <option value="SPRING_AWAKENING">Spring Awakening</option>
                            </select>

                            <label htmlFor="location">Location</label>
                            <select id="location" value={location} onChange={e => setLocation(e.target.value)}>
                                <option value="STAGE_1">Stage 1</option>
                                <option value="STAGE_2">Stage 2</option>
                            </select>

                            <label htmlFor="userId">User Id</label>
                            <input type="text" id="userId" value={userData}
                                   onChange={e => setUserData(e.target.value)} placeholder="Optional"/>
                        </div>
                        <div align={"center"} color={"black"}>
                            <button type="button" onClick={applyUserData}>Apply</button>
                        </div>
                    </div>
                </div>)}

            {getUserId() &&
                <div className="navbar-sign" style={{paddingBottom: 50}}>
                    <button onClick={hide}>Show QR Scanner</button>
                    <button onClick={logout}>Log out {userData}/{location}/{event}</button>
                </div>}
        </div>
    )
}

export default Main
