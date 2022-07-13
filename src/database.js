const mongose =require('mongoose');
mongose.connect('mongodb://localhost/BDpruebaHospital')
    .then(db=> console.log('DB is conected'))  
    .catch(err=>console.error(err));