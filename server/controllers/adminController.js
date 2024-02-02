


const getDashboard = async (req,res) => {
    // console.log(req.body);
    const fetched = req.body;
    try {
       console.log(fetched);
        res.status(201).json({ message: "All good with payload." });

    } catch (error) {
        res.status(400).json({ error: error.message });
        
    }
}




//to export all functions to the router
module.exports = {
    getDashboard
};