import { connect } from "mongoose";


export const DBconnect = async () => {
    try {
        await connect(process.env.MONGO_DB);
        console.log('Db connected!');
    } catch {
        console.log(`Error on connecting Db: ${error}`);
    }
}