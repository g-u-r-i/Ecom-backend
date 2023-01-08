// import {Buffer} from 'buffer';
var Buffer = require('buffer/').Buffer

 const encrpyt = (data) =>{
   const encrpytedData= Buffer.from(`${data}`).toString('base64')
   return encrpytedData
 }
 const decrypt = (data) =>{
    const decrpytedData= Buffer.from(`${data}`,'base64').toString('ascii')
    return decrpytedData
  }

  module.exports={encrpyt, decrypt }
