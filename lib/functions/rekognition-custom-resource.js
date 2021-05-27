const AWS = require("aws-sdk");
const rekognition = new AWS.Rekognition({region: 'eu-west-1'});

const COLLECTION_ID = process.env.COLLECTION_ID;

exports.handler = async function (event) {
    console.log('start the custom resource')
    console.log(event);
    console.log(COLLECTION_ID);

    const params = {
        CollectionId: COLLECTION_ID
    };

    if (event.RequestType === 'Create') {
      return rekognition.createCollection(params).promise().then(data => {
        console.log(data);
        return;
        })
    } else if (event.RequestType === 'Delete') {
        return rekognition.deleteCollection(params).promise().then(data => {
            console.log(data);
        return;
        })
    } else {
        console.log('nothing to do');
        return;
    }
    
};