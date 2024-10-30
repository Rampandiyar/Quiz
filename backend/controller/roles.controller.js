import Roles from "../models/Role.js";
import { CreateSuccess } from "../utilities/success.js";
import { CreateError } from "../utilities/error.js";

export const createRole = async (req, res, next) => {
    try {
        if(req.body.role && req.body.role !== ''){
            const newRole= new Roles(req.body);
            await newRole.save();
            return next(CreateSuccess(200,'Role created successfully'));
        }
        else{
            return next(CreateError(400,'Role name is required'));
        }
    } catch (error) {
        return next(CreateError(500,'Error in Code'));
    }
}

export const updateRole = async (req, res, next) => {
    try {
        const role = await Roles.findById(req.params.id);
        if (role) {
            await Role.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            return next(CreateSuccess(200,'Role Updated'));
        } else {
            return next(CreateError(400,'Role not Found'));
        }
    } catch (error) {
        return next(CreateError(500,'Internal error'));
    }
}

export const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Roles.find({});
        return res.status(200).json(roles);
    } catch (error) {
        return next(CreateError(500,'Internal error'));;
    }
}

export const deleteRole = async (req, res, next) => {
    try {
        const role = await Roles.findByIdAndDelete(req.params.id);
        if (role) {
            return next(CreateSuccess(200,'Role Deleted'));
        } else {
            return next(CreateError(400,'Bad request'));
        }
    } catch (error) {
        return next(CreateError(500,'Internal error'));
    }
}