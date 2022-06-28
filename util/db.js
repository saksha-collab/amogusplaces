const mongo = require('mongoose');

const url = 'mongodb+srv://saksham:vashishtha2@cluster0.umfpptz.mongodb.net/place?retryWrites=true&w=majority';

const data = async () => {
    console.log('connection succesfull');
    
};
const connectToMongo=async ()=>{(mongo.connect(url,data))};

module.exports = connectToMongo;
