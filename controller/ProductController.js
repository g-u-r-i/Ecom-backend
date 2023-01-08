const db = require('../db/conn')

const addProduct = (req, res) => {
    console.log(req.body,req.file)
    const productImg=req.file.filename
    // const {productName} = req.body.productName;
    console.log("first", req.body.createdDate)
    const d=Math.floor(Math.random()*90000) + 10000;
  const lowercase=req.body.productName.toLowerCase()
const productSlug=lowercase+"-"+d

    db.query("INSERT INTO `product`(`category_id`, `product_name`, `product_slug`, `product_image`, `product_price`, `product_status` ,`product_created`) VALUES (" + req.body.categoryId + ",'" + req.body.productName + "','" + productSlug + "','" + productImg + "'," + req.body.productPrice + "," + req.body.productStatus + " , '"+req.body.createdDate+"')", (err, result) => {
        if (err) {
            res.send({ data: err })
        }
        else {
            res.send({ data: result, message: "Data Inserted Successfully" })
        }
    })
}

const getProduct = async (req, res) => {
    db.query("SELECT * FROM product ", (err, result) => {
        if (err) {
            res.send({ data: err })
        }
        else {
            res.send({ data: result })
        }
    })
}

const prefillProductInfo = async (req, res) => {
    db.query("SELECT * FROM product WHERE product_id=" + req.body.productId, (err, result) => {
        if (err) {
            res.send({ data: err })
        }
        else {
            res.send({ data: result })
        }
    })
}

const updateProductInfo = async (req, res) => {
    const date = new Date()

    db.query("UPDATE `product` SET `category_id`=" + req.body.categoryId + ",`product_name`='" + req.body.productName + "',`product_slug`='" + req.body.productSlug + "',`product_image`='" + req.body.productImg + "',`product_price`=" + req.body.productPrice + ",`product_status`=" + req.body.productStatus + " WHERE product_id=" + req.body.productId, (err, result) => {
        if (err) {
            res.send({ data: err })
        }
        else {
            res.send({ message: "Data Update Successfully", data: result })
        }
    })
}

const deleteProduct = async (req, res) => {
    await db.query("DELETE FROM `product` WHERE product_id=" + req.body.productId , (err, result) => {
        if (err) {
            res.send({ data: err })
        }
        else {
            res.send({ data: result , status:"success"})
        }
    })
}





module.exports = { addProduct, getProduct, prefillProductInfo, updateProductInfo ,deleteProduct }