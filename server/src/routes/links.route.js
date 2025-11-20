const {Router} = require('express');
const {createLinkController, redirectController, deleteLinkController, getAllLinksController, getLinkStatsController} = require('../controllers/links.controller');


router = Router();

// API Routes

router.get('/api/links', getAllLinksController);
router.post('/api/links', createLinkController);
router.get('/api/links/:code', getLinkStatsController);
router.delete('/api/links/:code', deleteLinkController);

// redirect route
router.get('/:code', redirectController);

module.exports = router;