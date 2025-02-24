import express from 'express';
import multer from 'multer';
import hasAuthorization from 'middlewares/hasAuthorization';
import { isSeller } from 'middlewares/isSeller';
import { AuctionController } from 'controllers/AuctionController';
import { AuctionService } from 'controllers/AuctionService';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const auctionService = new AuctionService();
const auctionController = new AuctionController(auctionService);

router.post(
  '/create/by/:userId',
  upload.single('image'),
  hasAuthorization,
  isSeller,
  auctionController.createAuction.bind(auctionController),
);

router.get(
  '/list/by/:userId',
  hasAuthorization,
  auctionController.getAuctionsBySeller.bind(auctionController),
);

router.get(
  '/open-auctions',
  hasAuthorization,
  auctionController.getOpenAuctions.bind(auctionController),
);

router.get(
  '/bidder/:userId',
  hasAuthorization,
  auctionController.getAuctionsByBidder.bind(auctionController),
);

router.get('/', auctionController.getAllAuctions.bind(auctionController));

router.get(
  '/:auctionId',
  hasAuthorization,
  auctionController.getAuctionById.bind(auctionController),
);

router.put(
  '/update/:auctionId',
  upload.single('image'),
  hasAuthorization,
  isSeller,
  auctionController.updateAuctionById.bind(auctionController),
);

router.delete(
  '/delete/:auctionId',
  hasAuthorization,
  isSeller,
  auctionController.deleteAuctionById.bind(auctionController),
);

router.get(
  '/img/:auctionId',
  hasAuthorization,
  auctionController.getAuctionPhoto.bind(auctionController),
);

export default router;
