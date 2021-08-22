import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface MetaAttrs {
    userId: string,
    url: string,
    title: string,
    alt: string,
    lowsrc: string
}

export interface MetaDoc extends mongoose.Document {
    userId: string,
    url: string,
    title: string,
    alt: string,
    lowsrc: string
}

interface MetaModel extends mongoose.Model<MetaDoc> {
    build(attrs: MetaAttrs): MetaDoc;
    findByEvent(event: { id: string, version: number }): Promise<MetaDoc | null>;
}

const metaSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            required: true
        },
        lowsrc: {
            type: String,
            required: false
        }
    }, {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
);

metaSchema.set('versionKey', 'version');
// this will automatically increment doc version on every update
metaSchema.plugin(updateIfCurrentPlugin);

// in statics we add methods to Model itself
metaSchema.statics.build = (attrs: MetaAttrs) => {
    return new Meta(attrs);
};

// find by id and previous version
metaSchema.statics.findByEvent = (event: { id:string, version: number }) => {
    return Meta.findOne({
        _id: event.id,
        version: event.version - 1
    });
};

const Meta = mongoose.model<MetaDoc, MetaModel>('Meta', metaSchema);

export { Meta };
