import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createOrganization,
    getUserOrganizations,
    getOrganizationById,
    addMemberToOrganization,
} from "../controllers/organization.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createOrganization).get(getUserOrganizations);
router.route("/:organizationId").get(getOrganizationById);
router.route("/:organizationId/members").post(addMemberToOrganization);

export default router;
