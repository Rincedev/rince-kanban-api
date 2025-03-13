import { Tag, Card } from "../models/associations.js";
import Joi from 'joi';

const tagController = {
    async index(req, res) {
        res.status(200).json(await Tag.findAll({
            include: { association: "cards", include: "list" },
            order: [["name", "ASC"]]
        }));
    },

    async show(req, res, next) {
        const result = await Tag.findByPk(req.params.id, { include: { association: "cards", include: "list" } });

        if (!result) {
            return next();
        }

        res.status(200).json(result);
    },

    async create(req, res, next) {
        const error = tagController.validate(req);
        if (error) {
            return next(error);
        }

        try {
            const result = await Tag.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            return next({ statusCode: 409, message: "Il existe déjà un tag avec ce nom" });
        }
    },

    async update(req, res, next) {
        const error = tagController.validate(req);
        if (error) {
            return next(error);
        }

        const tag = await Tag.findByPk(req.params.id);

        if (!tag) {
            return next();
        }

        for (const key in req.body) {
            if (tag[key] !== undefined) {
                tag[key] = req.body[key];
            }
        }

        await tag.save();

        res.status(200).json(tag);
    },

    async delete(req, res, next) {
        const tag = await Tag.findByPk(req.params.id);

        if (!tag) {
            return next();
        }

        await tag.destroy();

        res.sendStatus(204);
    },

    async attachToCard(req, res, next) {
        const card = await Card.findByPk(req.params.card_id);
        const tag = await Tag.findByPk(req.params.tag_id);

        if (!card || !tag) {
            return next();
        }

        await card.addTag(tag);

        res.status(200).json(await tag.reload({ include: { association: "cards", include: "list" } }));
    },

    async detachFromCard(req, res, next) {
        const card = await Card.findByPk(req.params.card_id);
        const tag = await Tag.findByPk(req.params.tag_id);

        if (!card || !tag) {
            return next();
        }

        await card.removeTag(tag);

        res.status(200).json(await tag.reload({ include: { association: "cards", include: "list" } }));
    },

    validate(req) {
        let schema = Joi.object({
            name: Joi.string().min(3).max(50).messages({
                "string.base": "Le nom doit être une chaîne de caractères",
                "string.min": "Le nom doit contenir au moins {#limit} caractères",
                "string.max": "Le nom doit contenir au plus {#limit} caractères",
            }),
            color: Joi.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).messages({
                "string.pattern.base": "La couleur doit être un code hexadécimal valide",
            }),
        });

        if (req.method === "POST") {
            schema = schema.fork(["name"], field => field.required().messages({
                "any.required": "Le champ {#label} est requis",
            }));
        }

        const error = schema.validate(req.body, { abortEarly: false }).error;

        return error ? { statusCode: 400, message: error.details.map(detail => detail.message) } : null;
    },
};

export { tagController };