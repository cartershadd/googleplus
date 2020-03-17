import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from "react-bootstrap/InputGroup";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import FormControl from "react-bootstrap/FormControl";
import {FilePond, registerPlugin} from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import {db, storage} from "../firebase";
import shortid from 'shortid';
import firebase from "firebase";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

class EditPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            isSignedIn: false,
            files: [],
            profile: [],
            photos: [],
            backgroundImg: '',
            photoArray: [],
            url: '',
        };
        this.textNameInput = React.createRef();
        this.textHomeInput = React.createRef();
        this.textAboutInput = React.createRef();
        this.textJobInput = React.createRef();
        this.textQuoteInput = React.createRef();
    }

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => {
                this.setState({isSignedIn: !!user})

                console.log(firebase.auth().currentUser.uid)
                db.collection('userData').doc(firebase.auth().currentUser.uid).get().then((doc) => {
                    if (doc.exists) {
                        let user = doc.data();
                        this.setState({user: user, photoArray: user.photos});
                    }
                })
            }
        );
    }

    onSubmit() {
        var userRef = db.collection("userData").doc(firebase.auth().currentUser.uid);
        return db.runTransaction(function(transaction) {

            return transaction.get(userRef).then(function(sfDoc) {
                if (!sfDoc.exists) {
                    throw "Document does not exist!";
                }
                const update = {};
                if (this.textNameInput.current.value !== '') {
                    update.name = this.textNameInput.current.value;
                }
                if (this.textAboutInput.current.value !== '') {
                    update.about = this.textAboutInput.current.value;
                }
                if (this.textJobInput.current.value !== '') {
                    update.job = this.textJobInput.current.value;
                }
                if (this.textHomeInput.current.value !== '') {
                    update.home = this.textHomeInput.current.value;
                }
                if (this.textQuoteInput.current.value !== '') {
                    update.quote = this.textQuoteInput.current.value;
                }
                if (this.state.url !== '') {
                    update.mainImg = this.state.url;
                }
                if (this.state.backgroundImg !== '') {
                    update.backgroundImg = this.state.backgroundImg;
                }
                if (this.state.photoArray !== '') {
                    update.photos = this.state.photoArray;
                }
                transaction.update(userRef, update);
            }.bind(this));
        }.bind(this)).then(function() {
            console.log("Transaction successfully committed!");
            alert("Your changes have been submitted!");
            this.props.history.push("/");
        }.bind(this)).catch(function(error) {
            console.log("Transaction failed: ", error);
            alert("There was an issue making changes to your profile. Please try again.");
        });
    }


    mainServer = {
        // this uploads the image using firebase
        process: (fieldName, file, metadata, load, error, progress, abort) => {
            // create a unique id for the file
            const id = shortid.generate();

            // upload the image to firebase
            const task = storage.child('images/' + id).put(file, {
                contentType: 'image/jpeg',
            });

            // monitor the task to provide updates to FilePond
            task.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                snap => {
                    // provide progress updates
                    progress(true, snap.bytesTransferred, snap.totalBytes)
                },
                err => {
                    // provide errors
                    error(err.message)
                },
                () => {
                    // the file has been uploaded
                    load(id);

                    let tempThis = this;

                    storage.child('images/' + id).getDownloadURL().then(function (url) {
                            console.log(url);
                            tempThis.setState({url: url});
                        }
                    );
                }
            )
        },

        // this loads an already uploaded image to firebase
        load: (source, load, error, progress, abort) => {
            // reset our progress
            progress(true, 0, 1024);

            // fetch the download URL from firebase
            storage
                .child('images/' + source)
                .getDownloadURL()
                .then(url => {


                    // fetch the actual image using the download URL
                    // and provide the blob to FilePond using the load callback
                    let xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = function (event) {
                        let blob = xhr.response;
                        load(blob)
                    };
                    xhr.open('GET', url);
                    xhr.send()
                })
                .catch(err => {
                    error(err.message);
                    abort()
                })
        },
    };

    backServer = {
        // this uploads the image using firebase
        process: (fieldName, file, metadata, load, error, progress, abort) => {
            // create a unique id for the file
            const id = shortid.generate();

            // upload the image to firebase
            const task = storage.child('images/' + id).put(file, {
                contentType: 'image/jpeg',
            });

            // monitor the task to provide updates to FilePond
            task.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                snap => {
                    // provide progress updates
                    progress(true, snap.bytesTransferred, snap.totalBytes)
                },
                err => {
                    // provide errors
                    error(err.message)
                },
                () => {
                    // the file has been uploaded
                    load(id);

                    let tempThis = this;

                    storage.child('images/' + id).getDownloadURL().then(function (url) {
                            console.log(url);
                            tempThis.setState({backgroundImg: url});
                        }
                    );
                }
            )
        },

        // this loads an already uploaded image to firebase
        load: (source, load, error, progress, abort) => {
            // reset our progress
            progress(true, 0, 1024);

            // fetch the download URL from firebase
            storage
                .child('images/' + source)
                .getDownloadURL()
                .then(url => {


                    // fetch the actual image using the download URL
                    // and provide the blob to FilePond using the load callback
                    let xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = function (event) {
                        let blob = xhr.response;
                        load(blob)
                    };
                    xhr.open('GET', url);
                    xhr.send()
                })
                .catch(err => {
                    error(err.message);
                    abort()
                })
        },
    };

    arrayServer = {
        // this uploads the image using firebase
        process: (fieldName, file, metadata, load, error, progress, abort) => {
            // create a unique id for the file
            const id = shortid.generate();

            // upload the image to firebase
            const task = storage.child('images/' + id).put(file, {
                contentType: 'image/jpeg',
            });

            // monitor the task to provide updates to FilePond
            task.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                snap => {
                    // provide progress updates
                    progress(true, snap.bytesTransferred, snap.totalBytes)
                },
                err => {
                    // provide errors
                    error(err.message)
                },
                () => {
                    // the file has been uploaded
                    load(id);

                    let tempThis = this;

                    storage.child('images/' + id).getDownloadURL().then(function (url) {
                            console.log(url);
                            let list = tempThis.state.photoArray;
                            list.push(url);
                            tempThis.setState({photoArray: list});
                        }
                    );
                }
            )
        },

        // this loads an already uploaded image to firebase
        load: (source, load, error, progress, abort) => {
            // reset our progress
            progress(true, 0, 1024);

            // fetch the download URL from firebase
            storage
                .child('images/' + source)
                .getDownloadURL()
                .then(url => {


                    // fetch the actual image using the download URL
                    // and provide the blob to FilePond using the load callback
                    let xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = function (event) {
                        let blob = xhr.response;
                        load(blob)
                    };
                    xhr.open('GET', url);
                    xhr.send()
                })
                .catch(err => {
                    error(err.message);
                    abort()
                })
        },
    };

    render() {
        return (
            <div className="edit-form-wrapper">
                <Form>
                    <Card.Title>Update Background Picture</Card.Title>
                    <img className="background-img" alt="bckgrnd-img" src={this.state.user.backgroundImg}/>
                    <FilePond
                        ref={ref => (this.pond = ref)}
                        files={this.state.files}
                        allowMultiple={false}
                        maxFiles={1}
                        server={this.backServer}
                        onupdatefiles={fileItems => {
                            // Set currently active file objects to this.state
                            this.setState({
                                files: fileItems.map(fileItem => fileItem.file)
                            });
                        }}
                    />

                    <Card.Title>Update Profile Picture</Card.Title>
                    <img className="profile-pic" alt="profile-img" src={this.state.user.mainImg}/>
                    <FilePond
                        ref={ref => (this.pond = ref)}
                        files={this.state.profile}
                        allowMultiple={false}
                        maxFiles={1}
                        server={this.mainServer}
                        onupdatefiles={fileItems => {
                            // Set currently active file objects to this.state
                            this.setState({
                                profile: fileItems.map(fileItem => fileItem.file)
                            });
                        }}
                    />

                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-default">Name</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            placeholder={this.state.user.name}
                            ref={this.textNameInput}
                        />
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-default">About</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            placeholder={this.state.user.about}
                            ref={this.textAboutInput}
                        />
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-default">Job</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            placeholder={this.state.user.job}
                            ref={this.textJobInput}
                        />
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-default">Location</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            placeholder={this.state.user.home}
                            ref={this.textHomeInput}
                        />
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-default">Quote</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            placeholder={this.state.user.quote}
                            ref={this.textQuoteInput}
                        />
                    </InputGroup>

                    <Card.Title>Upload Personal Photos</Card.Title>
                    <FilePond
                        ref={ref => (this.pond = ref)}
                        files={this.state.photos}
                        allowMultiple={true}
                        maxFiles={3}
                        server={this.arrayServer}
                        onupdatefiles={fileItems => {
                            // Set currently active file objects to this.state
                            this.setState({
                                photos: fileItems.map(fileItem => fileItem.file)
                            });
                        }}
                    />

                    <Button onClick={this.onSubmit.bind(this)} variant="success">Save Changes</Button>
                </Form>
            </div>

        );
    }
}

export default EditPage;
