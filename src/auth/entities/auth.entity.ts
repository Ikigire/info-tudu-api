import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Usuario {
    _id?: string;
    
    @Prop( {
        unique: true,
        required: true 
    } )
    email: string;

    @Prop( {
        minlength: 6,
        required: true
    } )
    password:string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);