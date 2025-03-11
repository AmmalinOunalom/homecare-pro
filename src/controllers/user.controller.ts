import { Request, Response } from 'express';
import { user_model } from '../model/user.model';

export const create_user = async (req: Request, res: Response)=> {
    const {
        username,
        first_name,
        last_name,
        email,
        tel,
        password,
        gender,
        status,
        create_at,
        update_at,
    } = req.body
    try {
        const user = await user_model.create(req.body);
        res.status(200).send("User created successfully");
    } catch (error) {
        res.status(500).send(error);
    }
}

export const show_all_user = async (req: Request, res: Response)=>{
    try {
        const user = await user_model.show_all();
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}