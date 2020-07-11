import mongoose from 'mongoose';

export async function get_connection() {
    mongoose.connect("mongodb+srv://test:kuzmin@cluster0-djdw5.mongodb.net/websci_project?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
       .catch(error => console.log(error));
//      mongoose.connect("mongodb://localhost", {useNewUrlParser: true, useUnifiedTopology: true})
//          .catch(error => console.log(error));
}
