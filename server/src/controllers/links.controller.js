const {
    createLink,
    deleteLink,
    getLinkStats,
    getAllLinks,
    handleRedirect
} = require('../services/links.service');

const { isValidCode, isValidUrl } = require("../utils/validate");


// ------------------------------
// CREATE A LINK
// ------------------------------
const createLinkController = async (req, res)=>{

    const {code, target} = req.body || {};

    if (!target) return res.status(400).json({error:"Target URL required"});
    
    if (code && !isValidCode(code)) return res.status(400).json({error:"Invalid code"});
    
    if (!isValidUrl(target)) return res.status(400).json({error:"Invalid URL"});


    const result = await createLink(code, target);

    if (!result.success  && result.conflict) return res.status(409).json({ error: "Code already exists" });


    return res.status(201).json({
        code: result.data.code,
        target: result.data.target_url,
    });
}

// ------------------------------
// GET STATS
// ------------------------------
const getLinkStatsController = async (req, res)=>{
    const {code} = req.params;
    try {
        if (code && !isValidCode(code)) return res.status(400).json({error:"Invalid code"});
        
        const data = await getLinkStats(code);
        if(!data) return res.status(404).json({error:"Not Found"});

        return res.status(200).json(data);

    } catch (err) {
        console.error("Error deleting link:", err);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

// ------------------------------
// DELETE A LINK
// ------------------------------
const deleteLinkController = async (req, res)=>{
    const {code} = req.params;
    try {
        if (code && !isValidCode(code)) return res.status(400).json({error:"Invalid code"});
        
        const deleted = await deleteLink(code);
        if(!deleted) return res.status(404).json({error:"Not Found"});

        return res.status(204).send();

    } catch (err) {
        console.error("Error deleting link:", err);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

// ------------------------------
// LIST ALL LINKS
// ------------------------------
const getAllLinksController = async (req, res)=>{
    try {
        const rows = await getAllLinks();
        res.json(rows);
    } catch (err) {
        console.error("Error listing links:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


// ------------------------------
// REDIRECT TO ORIGINAL URL
// ------------------------------
const redirectController = async(req, res)=>{
    const {code} = req.params;

    if (!isValidCode(code)) return res.status(404).send("Not Found");
    
    try {
        const target =  await handleRedirect(code);
        if(!target) return res.status(404).send("Not Found");
        return res.redirect(302, target);
        
    } catch (err) {
        console.error("Redirect error:", err);
        return res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    createLinkController,
    getLinkStatsController,
    deleteLinkController,
    redirectController,
    getAllLinksController,
}