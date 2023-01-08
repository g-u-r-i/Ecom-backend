const db = require('../db/conn')

const addCategory = async (req, res) => {
    console.log("object", req.body);
    await db.query("INSERT INTO category(category_name,category_slug,category_status) VALUES ('" + req.body.categoryName + "','" + req.body.categorySlug + "'," + req.body.categoryStatus + ")", (err, result) => {
        if (err) {
            res.send({ data: err })
        }
        else {
            res.send({ status: "Data saved Successsfully", data: result })
        }
    })
}

const getCategory = async (req, res) => {
    await db.query("SELECT * from category", (err, result) => {
        if (err) {
            res.send({ data: err })
        }
        else {
            res.send({ data: result })
        }
    })
}

const prefillCategoryInfo = async (req, res) => {
    await db.query("SELECT * FROM category where category_id=" + req.body.categoryId, (err, result) => {
        if (err) {
            res.send({ data: err })
        }
        else {
            if (result.length > 0) {
                res.send({ data: result })

            }
        }
    })}

        const updateCategoryInfo = async (req, res) => {

            await db.query("UPDATE `category` SET `category_name`='" + req.body.categoryName + "',`category_slug`='" + req.body.categorySlug + "',`category_status`=" + req.body.categoryStatus + " WHERE category_id=" + req.body.categoryId, (err, result) => {
                if (err) {
                    res.send({ data: err })
                }
                else {
                    res.send({ message: "Data Update Successfully", data: result })
                }
            })
        }


        const deleteCategory = async (req, res) => {
            await db.query("DELETE FROM `category` WHERE category_id=" + req.body.categoryId + "", (err, result) => {
                if (err) {
                    res.send({ data: err })
                }
                else {
                    res.send({ data: result , status:"success"})
                }
            })
        }
        module.exports = { addCategory, prefillCategoryInfo, getCategory, deleteCategory, updateCategoryInfo }