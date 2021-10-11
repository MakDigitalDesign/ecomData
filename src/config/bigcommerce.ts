const BigCommerce = require('node-bigcommerce');

const bigCommerce = new BigCommerce({
    logLevel: 'info',
    clientId: 'e64v4afmijd78bo8m5hfvh97mqroth4',
    secret: '6efd11a9dc78a23bf332e684bef6cc6c35f5b3c21f52ff738b4021cd8b667cb8',
    accessToken: "m2flni9ce0xnuyqc8iqyppkyj7ic2d3",
    responseType: 'json',
    storeHash: "f74ff",
    apiVersion: 'v3' // Default is v2
});

export default bigCommerce;