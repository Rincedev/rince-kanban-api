import { Router } from 'express';
import { listController } from './controllers/listController.js';
import { cardController } from './controllers/cardController.js';
import { tagController } from './controllers/tagController.js';

const router = Router();

// Les routes des API CRUD de gestion des listes
router.get("/lists", listController.index);                
router.get("/lists/:id(\\d+)", listController.show);       
router.post("/lists", listController.create);              
router.patch("/lists/:id(\\d+)", listController.update);   
router.delete("/lists/:id(\\d+)", listController.delete); 

// Les routes des API CRUD de gestion des cartes
router.get("/cards", cardController.index);
router.get("/cards/:id(\\d+)", cardController.show);
router.post("/cards", cardController.create);
router.patch("/cards/:id(\\d+)", cardController.update);
router.delete("/cards/:id(\\d+)", cardController.delete);
router.get("/lists/:id(\\d+)/cards", cardController.cardsByList);

// Les routes des API CRUD de gestion des tags
router.get("/tags", tagController.index);
router.get("/tags/:id(\\d+)", tagController.show);
router.post("/tags", tagController.create);
router.patch("/tags/:id(\\d+)", tagController.update);
router.delete("/tags/:id(\\d+)", tagController.delete);
router.put("/cards/:card_id(\\d+)/tags/:tag_id(\\d+)", tagController.attachToCard);
router.delete("/cards/:card_id(\\d+)/tags/:tag_id(\\d+)", tagController.detachFromCard);

export { router };
