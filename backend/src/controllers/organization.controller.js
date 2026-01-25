import mongoose from "mongoose";
import { Organization } from "../models/organization.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

/**
 * CREATE ORGANIZATION
 */
const createOrganization = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
        throw new ApiError(400, "Organization name is required");
    }

    const existingOrg = await Organization.findOne({
        name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existingOrg) {
        throw new ApiError(409, "Organization with this name already exists");
    }

    const organization = await Organization.create({
        name: name.trim(),
        description,
        owner: req.user._id,
        members: [{ user: req.user._id, role: "admin" }],
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, organization, "Organization created successfully")
        );
});

/**
 * GET USER ORGANIZATIONS
 */
const getUserOrganizations = asyncHandler(async (req, res) => {
    const organizations = await Organization.find({
        "members.user": req.user._id,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, organizations, "Organizations fetched successfully")
        );
});

/**
 * GET ORGANIZATION BY ID
 */
const getOrganizationById = asyncHandler(async (req, res) => {
    const { organizationId } = req.params;

    const organization = await Organization.findById(organizationId).populate(
        "members.user",
        "fullName email avatar"
    );

    if (!organization) {
        throw new ApiError(404, "Organization not found");
    }

    // Check if requesting user is a member
    const isMember = organization.members.some(
        (member) => member.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
        throw new ApiError(403, "You are not a member of this organization");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, organization, "Organization fetched successfully")
        );
});

/**
 * ADD MEMBER TO ORGANIZATION
 */
const addMemberToOrganization = asyncHandler(async (req, res) => {
    const { organizationId } = req.params;
    const { email, role } = req.body;

    const organization = await Organization.findById(organizationId);

    if (!organization) {
        throw new ApiError(404, "Organization not found");
    }

    // Verify requester is admin
    const requesterMember = organization.members.find(
        (m) => m.user.toString() === req.user._id.toString()
    );

    if (!requesterMember || requesterMember.role !== "admin") {
        throw new ApiError(403, "Only admins can add members");
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
        throw new ApiError(404, "User not found");
    }

    if (
        organization.members.some(
            (m) => m.user.toString() === userToAdd._id.toString()
        )
    ) {
        throw new ApiError(409, "User is already a member");
    }

    organization.members.push({
        user: userToAdd._id,
        role: role || "member",
    });

    await organization.save();

    return res
        .status(200)
        .json(new ApiResponse(200, organization, "Member added successfully"));
});

export {
    createOrganization,
    getUserOrganizations,
    getOrganizationById,
    addMemberToOrganization,
};
